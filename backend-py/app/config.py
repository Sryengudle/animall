"""App configuration — reads .env via pydantic-settings."""
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = Field(...)
    jwt_secret: str = Field(..., min_length=32)
    jwt_alg: str = "HS256"
    jwt_ttl_days: int = 30
    client_url: str = "http://localhost:5173"
    sms_provider: str = "demo"
    port: int = 5000

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.client_url.split(",") if o.strip()]


settings = Settings()
