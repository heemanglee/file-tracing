import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import Optional

# Look for .env files in project root (file-tracer/)
_backend_dir = Path(__file__).resolve().parent.parent
_project_root = _backend_dir.parent

# Environment-specific .env file mapping
ENV_FILES = {
    "local": _project_root / ".env.local",
    "dev": _project_root / ".env.dev",
    "prod": _project_root / ".env.prod",
}


class Settings(BaseSettings):
    # MySQL (same server, different databases)
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = ""
    KH_MYSQL_DATABASE: str = "knowledge_hub"
    FI_MYSQL_DATABASE: str = "file_ingress"

    # OpenSearch
    OPENSEARCH_URL: str = "https://localhost:9200"
    FILE_INDEX_NAME: str = "file_index"
    OPENSEARCH_USE_AWS_AUTH: bool = False  # Force AWS SigV4 auth (for SSH tunnel to AWS OpenSearch)
    OPENSEARCH_AWS_SERVICE: str = "es"  # "es" for managed OpenSearch, "aoss" for Serverless

    # AWS
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "ap-northeast-2"
    AWS_S3_BUCKET: str = "dev-knowledge-hub"

    model_config = {"env_file": "", "extra": "ignore"}


# Load settings for each available environment
env_settings: dict[str, Settings] = {}
for _env_name, _env_file in ENV_FILES.items():
    if _env_file.exists():
        env_settings[_env_name] = Settings(_env_file=str(_env_file))

# Default settings (backward compatibility)
settings = env_settings.get("dev", Settings())


def get_settings(env: str = "dev") -> Settings:
    """Get settings for the specified environment."""
    if env not in env_settings:
        available = list(env_settings.keys())
        raise ValueError(f"Environment '{env}' not available. Available: {available}")
    return env_settings[env]


def get_available_envs() -> list[str]:
    """Return list of available environments."""
    return list(env_settings.keys())
