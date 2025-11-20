import chromadb
from chromadb.config import Settings
from app.core.config import settings
from typing import List, Dict, Any

class VectorStoreService:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=settings.CHROMA_DB_DIR)
        self.collection = self.client.get_or_create_collection(name="knowledge_base")

    def add_documents(self, documents: List[str], metadatas: List[Dict[str, Any]], ids: List[str]):
        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )

    def query(self, query_text: str, n_results: int = 5) -> Dict[str, Any]:
        return self.collection.query(
            query_texts=[query_text],
            n_results=n_results
        )

    def delete_document(self, doc_id: str):
        # This is a simplification. In reality, we might need to find all chunks for a doc_id.
        # For now, assuming we store doc_id in metadata
        self.collection.delete(
            where={"doc_id": doc_id}
        )

vector_store = VectorStoreService()
