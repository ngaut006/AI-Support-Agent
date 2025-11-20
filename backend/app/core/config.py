import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Support Agent"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]

    # OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # Vector DB
    CHROMA_DB_DIR: str = os.path.join(os.getcwd(), "chroma_db")
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
