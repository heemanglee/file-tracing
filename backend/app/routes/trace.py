import asyncio
from fastapi import APIRouter, HTTPException

from app.config import get_settings, get_available_envs
from app.services.knowledge_hub import get_agent_file
from app.services.file_ingress import get_ingress_file
from app.services.opensearch import get_opensearch_chunks
from app.services.s3 import generate_presigned_url, read_extracted_text

router = APIRouter()


def _error_result(e: Exception) -> dict:
    return {"status": "error", "error": str(e)}


@router.get("/envs")
async def list_envs():
    """Return available environments."""
    return {"envs": get_available_envs()}


@router.get("/trace/{file_unique_id}")
async def trace_file(file_unique_id: str, env: str = "dev"):
    """Trace a file through the entire pipeline: knowledge-hub -> file-ingress -> OpenSearch."""

    try:
        cfg = get_settings(env)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Query all 3 data sources in parallel, catch individual failures
    kh_result, fi_result, os_result = await asyncio.gather(
        get_agent_file(file_unique_id, cfg),
        get_ingress_file(file_unique_id, cfg),
        get_opensearch_chunks(file_unique_id, cfg),
        return_exceptions=True,
    )

    # Convert exceptions to error dicts
    if isinstance(kh_result, Exception):
        kh_result = _error_result(kh_result)
    if isinstance(fi_result, Exception):
        fi_result = _error_result(fi_result)
    if isinstance(os_result, Exception):
        os_result = {"status": "error", "error": str(os_result), "total_chunks": 0, "chunks": []}

    # Enrich knowledge-hub result with presigned URL
    if kh_result.get("status") == "found" and kh_result.get("data", {}).get("s3_key"):
        try:
            kh_result["data"]["presigned_url"] = generate_presigned_url(
                kh_result["data"]["s3_key"], cfg
            )
        except Exception:
            kh_result["data"]["presigned_url"] = None

    # Enrich file-ingress result with extracted text content
    if fi_result.get("status") == "found" and fi_result.get("data", {}).get("extracted_text_s3_uri"):
        try:
            fi_result["data"]["extracted_text_content"] = read_extracted_text(
                fi_result["data"]["extracted_text_s3_uri"], cfg
            )
        except Exception:
            fi_result["data"]["extracted_text_content"] = None

    return {
        "file_unique_id": file_unique_id,
        "env": env,
        "stages": {
            "knowledge_hub": kh_result,
            "file_ingress": fi_result,
            "opensearch": os_result,
        },
    }
