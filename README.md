# 📊 StockVeda: Intelligent Indian Market Research System

StockVeda is a 3-part project to scrape, embed, and answer questions on Indian financial news using a Retrieval-Augmented Generation (RAG) system.

---

## 📁 Project Structure

### 1. `lambda_scraper/` – AWS Lambda to DynamoDB
Scrapes financial news from **SEBI** and **Moneycontrol**, and stores structured data into **DynamoDB**.

### 2. `stockveda_core/` – Vector Embedding Engine
Fetches unembedded articles from DynamoDB, generates **FAISS vector index**, and stores it locally & on **S3**. Also includes the **RAG pipeline logic**.

### 3. `stockveda_backend/` – FastAPI Server for Mobile App
Provides a `/ask` endpoint that loads the FAISS index from **S3**, runs the **RAG system**, and returns answers and source links to your mobile frontend.

---

## 🚀 Getting Started

### Clone the Repository
```bash
git clone https://github.com/saichinmay2000/stockveda.git
cd stockveda
