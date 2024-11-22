import boto3
from botocore.exceptions import NoCredentialsError
from fastapi import HTTPException
from uuid import uuid4
from config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME, AWS_S3_REGION

def upload_image_to_s3(file, folder="posts"):
    try:
        # Create S3 client
        s3_client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_S3_REGION
        )

        # Generate unique filename
        filename = f"{folder}/{uuid4()}.{file.filename.split('.')[-1]}"

        # Upload file to S3
        s3_client.upload_fileobj(
            file.file,  # File object from FastAPI UploadFile
            AWS_S3_BUCKET_NAME,  # Bucket name
            filename,  # Key (filename in S3)
            ExtraArgs={"ACL": "public-read", "ContentType": file.content_type}
        )

        # Return public URL
        return f"https://{AWS_S3_BUCKET_NAME}.s3.{AWS_S3_REGION}.amazonaws.com/{filename}"

    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="AWS credentials not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
