import os
from langchain.embeddings import OpenAIEmbeddings

class Embedder:
    def __init__(self):
        self.embedding_model = OpenAIEmbeddings()

    def embed_texts(self, texts):
        return self.embedding_model.embed_documents(texts)
    
    def embed_query(self, query):
        return self.embedding_model.embed_query(query)