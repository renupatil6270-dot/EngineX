from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    service_name: str = Field(default="enginex-ai-engine", alias="AI_ENGINE_SERVICE_NAME")
    api_key: str | None = Field(default=None, alias="AI_ENGINE_API_KEY")
    max_timeline_months: int = Field(default=60, alias="AI_ENGINE_MAX_TIMELINE_MONTHS")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
