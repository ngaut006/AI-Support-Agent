from fastapi import APIRouter
from app.api.v1.endpoints import documents, agents, chat, ml

api_router = APIRouter()

api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(ml.router, prefix="/ml", tags=["ml"])

