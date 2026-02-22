from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Any
import json


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./webtech.db"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production-use-env-variable"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS – akzeptiert JSON-Array ("["a","b"]") oder komma-separiert ("a,b")
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> list[str]:
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("["):
                return json.loads(v)
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        raise ValueError(f"Ungültiges Format für CORS_ORIGINS: {v!r}")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
