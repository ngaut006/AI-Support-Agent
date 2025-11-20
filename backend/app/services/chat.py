from typing import List, Dict, Any
from app.services.agent import agent_service
from app.services.vector_store import vector_store
from app.core.tools import AVAILABLE_TOOLS
from openai import OpenAI
import json
import os
from app.core.config import settings

class ChatService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    async def chat(self, agent_id: str, message: str, history: List[Dict[str, str]]) -> Dict[str, Any]:
        agent = agent_service.get_agent(agent_id)
        if not agent:
            raise ValueError("Agent not found")

        # 1. Retrieve context
        try:
            search_results = vector_store.query(message, n_results=3)
            documents = search_results.get("documents", [[]])[0]
            context = "\n\n".join(documents)
        except Exception as e:
            print(f"Vector store query failed: {e}")
            documents = []
            context = ""

        # 2. Construct Prompt
        system_prompt = f"{agent.system_prompt}\n\nContext:\n{context}"
        
        messages = [{"role": "system", "content": system_prompt}]
        # Add history
        for msg in history:
            messages.append(msg)
        messages.append({"role": "user", "content": message})

        # 3. Call LLM
        if not settings.OPENAI_API_KEY:
            # Fallback for demo if no key
            print("WARNING: No OpenAI API Key found. Returning mock response.")
            return {
                "response": "I'm sorry, but I can't process your request right now because the OpenAI API key is missing. Please configure it in the backend .env file.",
                "citations": [],
                "tool_calls": []
            }

        try:
            response = self.client.chat.completions.create(
                model=agent.model,
                messages=messages,
                temperature=0.7
            )
            answer = response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI API call failed: {e}")
            # Return a friendly error to the user instead of crashing
            return {
                "response": f"I encountered an error communicating with the AI provider: {str(e)}",
                "citations": [],
                "tool_calls": []
            }
        
        # Log for fine-tuning
        try:
            log_entry = {
                "messages": [
                    {"role": "system", "content": agent.system_prompt},
                    {"role": "user", "content": message},
                    {"role": "assistant", "content": answer}
                ]
            }
            
            # Ensure directory exists
            log_dir = os.path.join(os.getcwd(), "..", "ml", "data", "raw")
            os.makedirs(log_dir, exist_ok=True)
            
            with open(os.path.join(log_dir, "chat_logs.jsonl"), "a", encoding="utf-8") as f:
                f.write(json.dumps(log_entry) + "\n")
        except Exception as e:
            print(f"Failed to log chat: {e}")
        
        return {
            "response": answer,
            "citations": documents,
            "tool_calls": []
        }

chat_service = ChatService()
