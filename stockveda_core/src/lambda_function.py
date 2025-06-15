import json
import os
from db.dynamo_client import DynamoDBClient
from vector_store.faiss_store import VectorStore
from dotenv import load_dotenv

load_dotenv()  # Keep only for local testing

def lambda_handler(event, context):
    try:
        print("🔄 Lambda triggered: Building FAISS index from new articles")

        db = DynamoDBClient()
        docs = db.fetch_unembedded_articles()

        if not docs:
            return {
                "statusCode": 200,
                "body": json.dumps("No new articles found.")
            }

        vs = VectorStore()
        vs.build_store(docs)

        return {
            "statusCode": 200,
            "body": json.dumps(f"Embedded and indexed {len(docs)} articles.")
        }

    except Exception as e:
        print("❌ Error in Lambda:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps(f"Error: {str(e)}")
        }

if __name__ == "__main__":
    lambda_handler(None, None)  # For local testing