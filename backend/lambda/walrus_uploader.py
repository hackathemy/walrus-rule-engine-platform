"""
Walrus Storage Integration
Upload AI analysis results to Walrus as verifiable blobs
"""

import json
import os
import hashlib
import requests
from typing import Dict, Any, Optional
from datetime import datetime


class WalrusUploader:
    """Upload and retrieve data from Walrus Storage"""

    def __init__(self):
        self.publisher_url = os.getenv(
            'WALRUS_PUBLISHER_URL',
            'https://publisher.walrus-testnet.mystenlabs.com'
        )
        self.aggregator_url = os.getenv(
            'WALRUS_AGGREGATOR_URL',
            'https://aggregator.walrus-testnet.mystenlabs.com'
        )
        self.epochs = int(os.getenv('WALRUS_EPOCHS', '1'))  # Storage duration

    def upload_blob(self, data: Dict[str, Any]) -> Dict[str, str]:
        """
        Upload data to Walrus Storage

        Args:
            data: Dictionary to store (will be JSON serialized)

        Returns:
            {
                'blob_id': str,
                'content_hash': str,
                'size_bytes': int,
                'uploaded_at': str,
                'aggregator_url': str
            }
        """

        # Serialize data
        json_data = json.dumps(data, indent=2, sort_keys=True)
        data_bytes = json_data.encode('utf-8')

        # Calculate content hash
        content_hash = hashlib.sha256(data_bytes).hexdigest()

        # Upload to Walrus
        upload_url = f"{self.publisher_url}/v1/store"

        try:
            print(f"Uploading {len(data_bytes)} bytes to Walrus...")

            response = requests.put(
                upload_url,
                data=data_bytes,
                headers={
                    'Content-Type': 'application/json'
                },
                params={
                    'epochs': self.epochs
                },
                timeout=30
            )

            response.raise_for_status()
            result = response.json()

            # Extract blob ID from response
            # Walrus response format: {"newlyCreated": {"blobObject": {"id": "...", ...}}}
            # or {"alreadyCertified": {"blobId": "...", ...}}
            blob_id = None

            if 'newlyCreated' in result:
                blob_id = result['newlyCreated']['blobObject']['id']
                status = 'newly_created'
            elif 'alreadyCertified' in result:
                blob_id = result['alreadyCertified']['blobId']
                status = 'already_exists'
            else:
                raise ValueError(f"Unexpected Walrus response: {result}")

            # Build aggregator URL
            blob_url = f"{self.aggregator_url}/v1/{blob_id}"

            upload_result = {
                'blob_id': blob_id,
                'content_hash': content_hash,
                'size_bytes': len(data_bytes),
                'uploaded_at': datetime.utcnow().isoformat(),
                'aggregator_url': blob_url,
                'status': status,
                'epochs': self.epochs
            }

            print(f"✅ Upload successful: {blob_id}")
            return upload_result

        except requests.exceptions.RequestException as e:
            print(f"Walrus upload error: {str(e)}")
            if hasattr(e.response, 'text'):
                print(f"Response: {e.response.text}")
            raise

    def download_blob(self, blob_id: str) -> Dict[str, Any]:
        """
        Download blob from Walrus Storage

        Args:
            blob_id: Walrus blob identifier

        Returns:
            Parsed JSON data from blob
        """

        download_url = f"{self.aggregator_url}/v1/{blob_id}"

        try:
            print(f"Downloading blob {blob_id}...")

            response = requests.get(download_url, timeout=30)
            response.raise_for_status()

            # Parse JSON
            data = response.json()

            print(f"✅ Download successful: {len(response.content)} bytes")
            return data

        except requests.exceptions.RequestException as e:
            print(f"Walrus download error: {str(e)}")
            raise
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {str(e)}")
            raise

    def verify_blob(self, blob_id: str, expected_hash: str) -> bool:
        """
        Verify blob integrity by comparing content hash

        Args:
            blob_id: Walrus blob identifier
            expected_hash: Expected SHA-256 hash

        Returns:
            True if hash matches, False otherwise
        """

        try:
            # Download blob
            data = self.download_blob(blob_id)

            # Recalculate hash
            json_data = json.dumps(data, indent=2, sort_keys=True)
            actual_hash = hashlib.sha256(json_data.encode()).hexdigest()

            # Compare
            is_valid = actual_hash == expected_hash

            if is_valid:
                print(f"✅ Blob verification passed")
            else:
                print(f"❌ Blob verification failed")
                print(f"Expected: {expected_hash}")
                print(f"Actual: {actual_hash}")

            return is_valid

        except Exception as e:
            print(f"Verification error: {str(e)}")
            return False


def lambda_handler(event, context):
    """
    AWS Lambda handler for Walrus operations

    Event format (upload):
    {
        "action": "upload",
        "data": { ... }
    }

    Event format (download):
    {
        "action": "download",
        "blob_id": "..."
    }

    Event format (verify):
    {
        "action": "verify",
        "blob_id": "...",
        "expected_hash": "..."
    }
    """

    try:
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event

        action = body.get('action')
        uploader = WalrusUploader()

        if action == 'upload':
            data = body.get('data')
            if not data:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'Missing data field'})
                }

            result = uploader.upload_blob(data)

            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result)
            }

        elif action == 'download':
            blob_id = body.get('blob_id')
            if not blob_id:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'Missing blob_id field'})
                }

            data = uploader.download_blob(blob_id)

            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(data)
            }

        elif action == 'verify':
            blob_id = body.get('blob_id')
            expected_hash = body.get('expected_hash')

            if not blob_id or not expected_hash:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'Missing blob_id or expected_hash'})
                }

            is_valid = uploader.verify_blob(blob_id, expected_hash)

            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'valid': is_valid})
            }

        else:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': f'Invalid action: {action}. Must be upload/download/verify'
                })
            }

    except Exception as e:
        print(f"Lambda error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


# For local testing
if __name__ == '__main__':
    # Test upload
    test_data = {
        'player_id': '0x1234567890abcdef',
        'tier': 'whale',
        'total_spend': 329.95,
        'analysis_date': datetime.utcnow().isoformat()
    }

    uploader = WalrusUploader()

    print("=== Testing Upload ===")
    upload_result = uploader.upload_blob(test_data)
    print(json.dumps(upload_result, indent=2))

    blob_id = upload_result['blob_id']
    expected_hash = upload_result['content_hash']

    print("\n=== Testing Download ===")
    downloaded_data = uploader.download_blob(blob_id)
    print(json.dumps(downloaded_data, indent=2))

    print("\n=== Testing Verification ===")
    is_valid = uploader.verify_blob(blob_id, expected_hash)
    print(f"Verification result: {is_valid}")
