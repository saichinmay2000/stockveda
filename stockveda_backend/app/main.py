from fastapi import FastAPI, Request
from pydantic import BaseModel
from rag_pipeline.rag_agent import RAGAgent
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

# Init app
app = FastAPI()
rag = RAGAgent()

# CORS for mobile frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class QueryRequest(BaseModel):
    question: str

# Response model
class QueryResponse(BaseModel):
    answer: str
    sources: list[str]

@app.post("/ask", response_model=QueryResponse)
def ask_question(request: QueryRequest):
    answer, source_docs = rag.ask(request.question)
    sources = [doc.metadata.get("url", "") for doc in source_docs]
    return QueryResponse(answer=answer, sources=sources)

@app.get("/")
def greet():
    return {"message": "Welcome to StockVeda RAG API!"}
