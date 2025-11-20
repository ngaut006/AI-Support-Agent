from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.chat import chat_service
from app.services.chat_storage import chat_storage

router = APIRouter()

class ChatRequest(BaseModel):
    agent_id: str
    message: str
    history: List[Dict[str, str]] = []
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    citations: List[str]
    tool_calls: List[Any]
    session_id: str

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        result = await chat_service.chat(
            agent_id=request.agent_id,
            message=request.message,
            history=request.history,
            session_id=request.session_id
        )
        return ChatResponse(
            response=result["response"],
            citations=result["citations"],
            tool_calls=result["tool_calls"],
            session_id=result["session_id"]
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    return chat_storage.get_session_history(session_id)

@router.get("/sessions/{agent_id}")
async def get_agent_sessions(agent_id: str):
    return chat_storage.get_agent_sessions(agent_id)
