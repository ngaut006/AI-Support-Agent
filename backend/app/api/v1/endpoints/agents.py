from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from app.services.agent import agent_service, AgentConfig

router = APIRouter()

class CreateAgentRequest(BaseModel):
    name: str
    model: str
    system_prompt: str
    tools: List[str] = []
    document_ids: List[str] = []

@router.post("/", response_model=AgentConfig)
async def create_agent(request: CreateAgentRequest):
    agent = agent_service.create_agent(
        name=request.name,
        model=request.model,
        system_prompt=request.system_prompt,
        tools=request.tools,
        document_ids=request.document_ids
    )
    return agent

@router.get("/", response_model=List[AgentConfig])
async def list_agents():
    return agent_service.list_agents()

@router.get("/{agent_id}", response_model=AgentConfig)
async def get_agent(agent_id: str):
    agent = agent_service.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent
