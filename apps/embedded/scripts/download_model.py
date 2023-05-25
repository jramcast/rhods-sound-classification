#!/usr/bin/env python3

import os
import boto3

key_id = os.getenv("AWS_ACCESS_KEY_ID")
secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
region = os.getenv("AWS_DEFAULT_REGION")
endpoint = os.getenv("AWS_S3_ENDPOINT")
bucket_name = os.getenv("AWS_S3_BUCKET")
onnx_filename = os.getenv("MODEL_FILENAME")

s3_client = boto3.client(
    "s3",
    region,
    aws_access_key_id=key_id,
    aws_secret_access_key=secret_key,
    endpoint_url=endpoint,
    use_ssl=True
)

s3_client.download_file(bucket_name, onnx_filename, onnx_filename)

print(f"File {onnx_filename} downloaded from S3")