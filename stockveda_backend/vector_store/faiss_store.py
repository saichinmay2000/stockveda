import os
from langchain.vectorstores import FAISS
from langchain.docstore.document import Document
from embeddings.embedder import Embedder
import boto3
import time
# from db.dynamo_client import DynamoDBClient

class VectorStore:
    def __init__(self, persist_path="faiss_index"):
        self.persist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'faiss_index'))
        self.embedder = Embedder()
        self.vector_store = None
        self.s3_bucket = os.getenv("S3_BUCKET")
        self.s3_key = os.getenv("S3_KEY")
        # self.db = DynamoDBClient()
        
    def load_store(self):
        index_path = os.path.join(self.persist_path, "index.faiss")
        pkl_path = os.path.join(self.persist_path, "index.pkl")
        max_age_seconds = 3600
        
        def is_expired(file_path):
            if not os.path.exists(file_path):
                return True
            return time.time() - os.path.getmtime(file_path) > max_age_seconds

        # If files don't exist locally, try to download from S3
        if is_expired(index_path) or is_expired(pkl_path):
            print("📦 FAISS index not found locally. Downloading from S3...")
            s3 = boto3.client("s3", region_name="ap-south-2")
            os.makedirs(self.persist_path, exist_ok=True)
            try:
                s3.download_file(self.s3_bucket, "faiss_index/index.faiss", index_path)
                s3.download_file(self.s3_bucket, "faiss_index/index.pkl", pkl_path)
                print("✅ Downloaded FAISS index from S3.")
            except Exception as e:
                raise FileNotFoundError(
                    f"❌ Failed to download FAISS index from S3: {str(e)}"
                )

        # Load FAISS index from local path
        self.vector_store = FAISS.load_local(
            self.persist_path,
            self.embedder.embedding_model,
            allow_dangerous_deserialization=True
        )
        print("🧠 FAISS index loaded into memory.")
