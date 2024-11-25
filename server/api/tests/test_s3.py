import boto3
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")
AWS_S3_REGION = os.getenv("AWS_S3_REGION")

def test_s3_connection():
    try:
        # Initialize S3 client
        s3_client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_S3_REGION
        )

        # Upload the test file
        file_name = "/Users/redap/Documents/Kettering/Fall24/CS351/CarYak/server/api/tests/test-folder/test.txt"  # Correct relative path
        object_name = "test-folder/test.txt"  # File path in the S3 bucket
        s3_client.upload_file(file_name, AWS_S3_BUCKET_NAME, object_name)
        print(f"File '{file_name}' uploaded to '{AWS_S3_BUCKET_NAME}/{object_name}'.")

        # List bucket contents
        response = s3_client.list_objects_v2(Bucket=AWS_S3_BUCKET_NAME)
        if 'Contents' in response:
            print("Bucket contents:")
            for obj in response['Contents']:
                print(f" - {obj['Key']}")
        else:
            print("Bucket is empty.")
    except Exception as e:
        print(f"Error: {e}")

# Run the test
test_s3_connection()
