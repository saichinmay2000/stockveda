from vector_store.faiss_store import VectorStore
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

class RAGAgent:
    def __init__(self):
        self.vector_store = VectorStore()
        self.vector_store.load_store()
        self.llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")  # or gpt-4 if available
        
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )

        self.qa_chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.vector_store.vector_store.as_retriever(),
            memory=self.memory,
            return_source_documents=True,
            output_key="answer"
        )

    def ask(self, question):
        # result = self.qa_chain(question)
        result = self.qa_chain.invoke({"question": question})
        return result["answer"], result["source_documents"]
