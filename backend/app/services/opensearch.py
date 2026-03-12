from urllib.parse import urlparse
from opensearchpy import OpenSearch, RequestsHttpConnection
from app.config import settings


def _build_client() -> OpenSearch:
    """Build an OpenSearch client. Uses AWS SigV4 for HTTPS endpoints, plain auth for local."""
    parsed = urlparse(settings.OPENSEARCH_URL)
    host = parsed.hostname or "localhost"
    port = parsed.port or (443 if parsed.scheme == "https" else 9200)
    use_ssl = parsed.scheme == "https"

    if (use_ssl or settings.OPENSEARCH_USE_AWS_AUTH) and settings.AWS_ACCESS_KEY_ID:
        # AWS OpenSearch Serverless
        from requests_aws4auth import AWS4Auth
        import boto3

        credentials = boto3.Session(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        ).get_credentials()

        awsauth = AWS4Auth(
            credentials.access_key,
            credentials.secret_key,
            settings.AWS_REGION,
            settings.OPENSEARCH_AWS_SERVICE,
            session_token=credentials.token,
        )

        # SSH tunnel: use SSL (remote expects HTTPS) but skip cert verify (cert is for real hostname, not localhost)
        force_ssl = use_ssl or settings.OPENSEARCH_USE_AWS_AUTH
        return OpenSearch(
            hosts=[{"host": host, "port": port}],
            http_auth=awsauth,
            use_ssl=force_ssl,
            verify_certs=False if settings.OPENSEARCH_USE_AWS_AUTH else use_ssl,
            connection_class=RequestsHttpConnection,
        )
    else:
        # Local OpenSearch (no auth, no SSL)
        return OpenSearch(
            hosts=[{"host": host, "port": port}],
            use_ssl=False,
            verify_certs=False,
            connection_class=RequestsHttpConnection,
        )


async def get_opensearch_chunks(file_unique_id: str) -> dict:
    """Query OpenSearch for all chunks matching file_unique_id (no ACL filter)."""
    try:
        client = _build_client()

        query = {
            "query": {"term": {"file_unique_id": file_unique_id}},
            "sort": [{"chunk_index": {"order": "asc"}}],
            "size": 200,
            "_source": [
                "file_unique_id", "file_name", "content", "chunk_index",
                "file_directory", "type", "time", "status", "acl_emails",
            ],
        }

        response = client.search(index=settings.FILE_INDEX_NAME, body=query)
        hits = response.get("hits", {}).get("hits", [])

        chunks = [hit["_source"] for hit in hits]
        return {
            "status": "found" if chunks else "not_found",
            "total_chunks": len(chunks),
            "chunks": chunks,
        }
    except Exception as e:
        return {"status": "error", "error": str(e), "total_chunks": 0, "chunks": []}
