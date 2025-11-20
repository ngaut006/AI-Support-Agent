from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.chat import chat_service

router = APIRouter()

class ChatRequest(BaseModel):
    agent_id: str
    message: str
    history: List[Dict[str, str]] = []

class ChatResponse(BaseModel):
    response: str
    citations: List[str]
    tool_calls: List[Any]

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        result = await chat_service.chat(
            agent_id=request.agent_id,
            message=request.message,
            history=request.history
        )
        return ChatResponse(
            response=result["response"],
            citations=result["citations"],
            tool_calls=result["tool_calls"]
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
