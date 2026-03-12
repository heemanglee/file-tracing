import boto3
from app.config import settings


def _get_s3_client():
    return boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )


def generate_presigned_url(s3_key: str, expires_in: int = 3600) -> str:
    """Generate a presigned URL for downloading the original file from S3."""
    client = _get_s3_client()
    return client.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.AWS_S3_BUCKET, "Key": s3_key},
        ExpiresIn=expires_in,
    )


def read_extracted_text(s3_uri: str) -> str | None:
    """Read extracted text content from S3 URI (s3://bucket/key)."""
    if not s3_uri or not s3_uri.startswith("s3://"):
        return None

    try:
        parts = s3_uri.replace("s3://", "").split("/", 1)
        if len(parts) != 2:
            return None
        bucket, key = parts

        client = _get_s3_client()
        response = client.get_object(Bucket=bucket, Key=key)
        return response["Body"].read().decode("utf-8")
    except Exception:
        return None
