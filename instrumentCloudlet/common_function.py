import boto3
from decouple import config
from datetime import date
import os
today = date.today()

# Create an S3 client with your access keys.
s3 = boto3.client('s3', aws_access_key_id=config('ACCESS_KEY_ID'), aws_secret_access_key=config('SECRET_ACCESS_KEY'))

# Download the image from S3.
def downloadS3Image(bucket_name, image_key):
    try:
        local_file_path = 'images/'+str(today)+image_key
        if os.path.exists(local_file_path):
            os.remove(local_file_path)
        s3.download_file(bucket_name, image_key, local_file_path)
        print(f"Image '{image_key}' downloaded successfully to '{local_file_path}'.")
        status = 1
    except Exception as e:
        print(f"Error: {e}")
        status = 0
    return status

def upload_image_to_s3(image_path, bucket_name, object_name):
    try:
        s3.upload_file(image_path, bucket_name, object_name,  ExtraArgs={'ContentType': 'image/tiff'})
        print(f'Successfully uploaded {image_path} to {bucket_name}/{object_name}')
        return 1
    except Exception as e:
        print(f'Error: {e}')
        return 0
    
# upload_image_to_s3(image_path, bucket_name, object_name)
# downloadS3Image(bucket_name, image_key, local_file_path)