import os
from langchain.vectorstores import FAISS
from langchain.docstore.document import Document
from embeddings.embedder import Embedder
import boto3
from db.dynamo_client import DynamoDBClient

class VectorStore:
    def __init__(self, persist_path="faiss_index"):
        self.persist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'faiss_index'))
        self.embedder = Embedder()
        self.vector_store = None
        self.s3_bucket = os.getenv('S3_BUCKET_NAME')
        self.s3_key = os.getenv("S3_KEY")
        self.db = DynamoDBClient()
    
    def save_faiss_index_to_s3(self, bucket, key):
        s3 = boto3.client("s3", region_name="ap-south-2")
        s3.upload_file(self.persist_path+"\index.faiss", bucket, "faiss_index/index.faiss")
        s3.upload_file(self.persist_path+"\index.pkl", bucket, "faiss_index/index.pkl")
        print(f"FAISS index uploaded to s3://{bucket}/{key}")
    
    def build_store(self, docs):
        if not docs:
            print("No documents to embed. Exiting...")
            return
        text_docs = [
            Document(page_content=doc["title"] + "\n" + doc["summary"], metadata=doc)
            for doc in docs
        ]
        self.vector_store = FAISS.from_documents(text_docs, self.embedder.embedding_model)
        for doc in docs:
            self.db.mark_article_embedded(doc["url"])

        self.vector_store.save_local(self.persist_path)
        if self.s3_bucket and self.s3_key:
            self.save_faiss_index_to_s3(self.s3_bucket, self.s3_key)
