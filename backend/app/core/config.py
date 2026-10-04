import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List, Union
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "ContextLens"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    PORT: int = 8000
    
    # API Keys
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    GEMMA_MODEL: str = "llama-3.3-70b-versatile"
    
    # Database
    DATABASE_URL: str = "sqlite:///./contextlens.db"
    
    # Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 25
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:8001",
        "http://localhost:8080",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

# Ensure upload dir exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
