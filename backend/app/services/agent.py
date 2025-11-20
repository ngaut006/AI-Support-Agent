from typing import List, Dict, Optional
from pydantic import BaseModel
import uuid

class AgentConfig(BaseModel):
    id: str
    name: str
    model: str
    system_prompt: str
    tools: List[str]
    document_ids: List[str]

class AgentService:
    def __init__(self):
        self.agents: Dict[str, AgentConfig] = {}

    def create_agent(self, name: str, model: str, system_prompt: str, tools: List[str], document_ids: List[str]) -> AgentConfig:
        agent_id = str(uuid.uuid4())
        agent = AgentConfig(
            id=agent_id,
            name=name,
            model=model,
            system_prompt=system_prompt,
            tools=tools,
            document_ids=document_ids
        )
        self.agents[agent_id] = agent
        return agent

    def get_agent(self, agent_id: str) -> Optional[AgentConfig]:
        return self.agents.get(agent_id)

    def list_agents(self) -> List[AgentConfig]:
        return list(self.agents.values())

agent_service = AgentService()
