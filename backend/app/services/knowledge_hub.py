import aiomysql
from app.config import Settings


async def get_agent_file(file_unique_id: str, cfg: Settings) -> dict:
    """Query knowledge-hub MySQL for agent_files by id (= file_unique_id)."""
    conn = await aiomysql.connect(
        host=cfg.MYSQL_HOST,
        port=cfg.MYSQL_PORT,
        user=cfg.MYSQL_USER,
        password=cfg.MYSQL_PASSWORD,
        db=cfg.KH_MYSQL_DATABASE,
        charset="utf8mb4",
    )
    try:
        async with conn.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(
                """
                SELECT id, filename, content_type, size, s3_key, workspace_id,
                       processing_status, processing_status_code, processing_message,
                       processing_updated_at, user_email, user_name, upload_mode,
                       visibility, is_deleted, created_at, updated_at
                FROM agent_files
                WHERE id = %s
                """,
                (file_unique_id,),
            )
            row = await cur.fetchone()
    finally:
        conn.close()

    if not row:
        return {"status": "not_found", "data": None}

    # Convert datetime objects to ISO strings
    for key in ("processing_updated_at", "created_at", "updated_at"):
        if row.get(key):
            row[key] = row[key].isoformat()

    return {"status": "found", "data": row}
