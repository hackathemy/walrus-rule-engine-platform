"""
Walrus Storage Service
Pure business logic for uploading and reading blobs (environment-independent)
"""

import os
import json
import tempfile
import subprocess
import re
import requests
from typing import Dict, Any, Optional


class WalrusService:
    """Walrus storage operations (Flask & Lambda compatible)"""

    def __init__(
        self,
        publisher_url: str,
        aggregator_url: str,
        walrus_cli_path: str = "/Users/noname/.local/bin/walrus"
    ):
        self.publisher_url = publisher_url
        self.aggregator_url = aggregator_url
        self.walrus_cli_path = walrus_cli_path

    def upload_blob(
        self,
        file_content: bytes,
        filename: str,
        sui_private_key: str,
        epochs: int = 5
    ) -> Dict[str, Any]:
        """
        Upload file to Walrus storage using HTTP API

        Args:
            file_content: File content as bytes
            filename: Original filename
            sui_private_key: Sui private key for payment (not used in HTTP API)
            epochs: Storage duration in epochs

        Returns:
            {
                'blob_id': str,
                'size_bytes': int,
                'epochs': int,
                'aggregator_url': str
            }
        """
        try:
            # Upload via Walrus Publisher HTTP API (PUT request)
            url = f"{self.publisher_url}/v1/store?epochs={epochs}"

            response = requests.put(
                url,
                data=file_content,
                headers={'Content-Type': 'application/octet-stream'},
                timeout=120
            )

            if response.status_code not in [200, 201]:
                raise Exception(f"Walrus upload failed: HTTP {response.status_code} - {response.text}")

            # Parse response JSON
            result = response.json()

            # Extract blob ID from response
            # Walrus API returns different formats, try both
            if 'newlyCreated' in result:
                blob_info = result['newlyCreated']['blobObject']
                blob_id = blob_info['blobId']
            elif 'alreadyCertified' in result:
                blob_info = result['alreadyCertified']['blobObject']
                blob_id = blob_info['blobId']
            else:
                # Fallback: try to extract from any field containing 'blobId'
                blob_id = result.get('blobId') or result.get('blob_id')
                if not blob_id:
                    raise Exception(f"Could not extract blob_id from response: {result}")

            return {
                'blob_id': blob_id,
                'size_bytes': len(file_content),
                'epochs': epochs,
                'aggregator_url': f"{self.aggregator_url}/v1/{blob_id}"
            }

        except requests.RequestException as e:
            raise Exception(f"Walrus upload failed: {str(e)}")

    def read_blob(
        self,
        blob_id: str,
        format_type: str = 'text'
    ) -> Dict[str, Any]:
        """
        Read blob from Walrus storage

        Args:
            blob_id: Walrus blob ID
            format_type: 'json' | 'text' | 'binary'

        Returns:
            {
                'success': bool,
                'blob_id': str,
                'format': str,
                'size_bytes': int,
                'content': Any,
                'metadata': dict
            }
        """
        # Get metadata (optional, not critical)
        metadata = {}

        # Read blob content via HTTP
        try:
            response = requests.get(f"{self.aggregator_url}/v1/{blob_id}")
            response.raise_for_status()
            content = response.content
        except requests.RequestException as e:
            raise Exception(f"Failed to read blob from Walrus: {str(e)}")

        # Parse based on format
        if format_type == 'json':
            try:
                parsed_content = json.loads(content.decode('utf-8'))
                return {
                    'success': True,
                    'blob_id': blob_id,
                    'format': 'json',
                    'size_bytes': len(content),
                    'content': parsed_content,
                    'metadata': metadata
                }
            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid JSON: {str(e)}")

        elif format_type == 'binary':
            return {
                'success': True,
                'blob_id': blob_id,
                'format': 'binary',
                'size_bytes': len(content),
                'content_base64': content.hex(),
                'metadata': metadata
            }

        else:  # text format
            try:
                text_content = content.decode('utf-8')

                # Try to parse CSV structure
                lines = text_content.strip().split('\n')
                is_csv = len(lines) > 0 and ',' in lines[0]

                response_data = {
                    'success': True,
                    'blob_id': blob_id,
                    'format': 'text',
                    'size_bytes': len(content),
                    'content': text_content,
                    'metadata': metadata,
                    'content_type': 'csv' if is_csv else 'text'
                }

                # Add CSV parsing info
                if is_csv and len(lines) > 1:
                    headers = lines[0].split(',')
                    response_data['csv_info'] = {
                        'headers': headers,
                        'row_count': len(lines) - 1,
                        'column_count': len(headers)
                    }

                return response_data

            except UnicodeDecodeError:
                raise ValueError("Content is not valid UTF-8 text. Try format=binary")

    def read_blob_as_csv(self, blob_id: str) -> Dict[str, Any]:
        """
        Read blob and parse as CSV

        Args:
            blob_id: Walrus blob ID

        Returns:
            {
                'success': bool,
                'blob_id': str,
                'format': 'csv',
                'headers': list,
                'row_count': int,
                'column_count': int,
                'data': list[dict]
            }
        """
        # Read blob content via HTTP
        try:
            response = requests.get(f"{self.aggregator_url}/v1/{blob_id}")
            response.raise_for_status()
            content = response.content
        except requests.RequestException as e:
            raise Exception(f"Failed to read blob from Walrus: {str(e)}")

        text_content = content.decode('utf-8')

        # Parse CSV
        lines = text_content.strip().split('\n')
        if len(lines) < 2:
            raise ValueError("CSV must have at least header + 1 data row")

        headers = [h.strip() for h in lines[0].split(',')]

        rows = []
        for line in lines[1:]:
            if line.strip():
                values = [v.strip() for v in line.split(',')]
                row = dict(zip(headers, values))
                rows.append(row)

        return {
            'success': True,
            'blob_id': blob_id,
            'format': 'csv',
            'headers': headers,
            'row_count': len(rows),
            'column_count': len(headers),
            'data': rows
        }

    def get_blob_metadata(self, blob_id: str) -> Dict[str, Any]:
        """
        Get blob metadata only (no content download)

        Args:
            blob_id: Walrus blob ID

        Returns:
            {
                'success': bool,
                'blob_id': str,
                'metadata': dict
            }
        """
        # For now, return basic metadata
        # Walrus HTTP API doesn't expose metadata endpoint yet
        return {
            'success': True,
            'blob_id': blob_id,
            'metadata': {
                'aggregator_url': f"{self.aggregator_url}/v1/{blob_id}"
            }
        }

    def _parse_blob_id(self, output: str) -> Optional[str]:
        """Parse blob ID from Walrus CLI output"""
        for line in output.strip().split('\n'):
            if 'Blob ID:' in line or 'blob_id' in line.lower():
                parts = line.split()
                for i, part in enumerate(parts):
                    if part.lower() in ['id:', 'blob_id:']:
                        if i + 1 < len(parts):
                            return parts[i + 1].strip()

        # Fallback: regex search for blob ID pattern
        blob_id_match = re.search(r'[A-Za-z0-9_-]{43,}', output)
        if blob_id_match:
            return blob_id_match.group(0)

        return None
