import aiomysql
from app.config import settings


async def get_ingress_file(file_unique_id: str) -> dict:
    """Query file-ingress MySQL for ingress_files by file_unique_id."""
    conn = await aiomysql.connect(
        host=settings.MYSQL_HOST,
        port=settings.MYSQL_PORT,
        user=settings.MYSQL_USER,
        password=settings.MYSQL_PASSWORD,
        db=settings.FI_MYSQL_DATABASE,
        charset="utf8mb4",
    )
    try:
        async with conn.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(
                """
                SELECT id, job_id, file_unique_id, etag, s3_uri,
                       file_name, file_size, mime_type, status,
                       text_length, processing_time_ms, extracted_text_s3_uri,
                       error_type, error_service, error_message,
                       user_email, correlation_id, created_at, updated_at
                FROM ingress_files
                WHERE file_unique_id = %s
                """,
                (file_unique_id,),
            )
            row = await cur.fetchone()
    finally:
        conn.close()

    if not row:
        return {"status": "not_found", "data": None}

    for key in ("created_at", "updated_at"):
        if row.get(key):
            row[key] = row[key].isoformat()

    return {"status": "found", "data": row}
