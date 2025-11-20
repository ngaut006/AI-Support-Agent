from typing import List
from openai import OpenAI
from app.core.config import settings

class EmbeddingService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        # Mock embedding for now if no key, or use real one
        if not settings.OPENAI_API_KEY:
            # Return dummy embeddings of size 1536 (OpenAI standard)
            return [[0.1] * 1536 for _ in texts]
            
        response = self.client.embeddings.create(
            input=texts,
            model="text-embedding-ada-002"
        )
        return [data.embedding for data in response.data]

embedding_service = EmbeddingService()
