import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import Optional

# Look for .env in backend/ first, then project root (file-tracer/)
_backend_dir = Path(__file__).resolve().parent.parent
_env_file = _backend_dir / ".env"
if not _env_file.exists():
    _env_file = _backend_dir.parent / ".env"


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

    model_config = {"env_file": str(_env_file), "extra": "ignore"}


settings = Settings()
