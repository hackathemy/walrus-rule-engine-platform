"""
Walrus Storage Service
Pure business logic for uploading and reading blobs (environment-independent)
"""

import os
import json
import tempfile
import subprocess
import re
from typing import Dict, Any, Optional
from walrus import WalrusClient


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
        self.client = WalrusClient(
            publisher_base_url=publisher_url,
            aggregator_base_url=aggregator_url
        )

    def upload_blob(
        self,
        file_content: bytes,
        filename: str,
        sui_private_key: str,
        epochs: int = 5
    ) -> Dict[str, Any]:
        """
        Upload file to Walrus storage

        Args:
            file_content: File content as bytes
            filename: Original filename
            sui_private_key: Sui private key for payment
            epochs: Storage duration in epochs

        Returns:
            {
                'blob_id': str,
                'size_bytes': int,
                'epochs': int,
                'aggregator_url': str
            }
        """
        # Save file temporarily
        tmp_path = None
        keystore_dir = None
        keystore_file = None

        try:
            # Create temp file
            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=f"_{filename}",
                dir="/tmp" if os.path.exists("/tmp") else None
            ) as tmp:
                tmp.write(file_content)
                tmp_path = tmp.name

            # Create temporary keystore
            keystore_dir = tempfile.mkdtemp(
                dir="/tmp" if os.path.exists("/tmp") else None
            )
            keystore_file = os.path.join(keystore_dir, "sui.keystore")

            with open(keystore_file, 'w') as f:
                json.dump([sui_private_key], f)

            # Set environment
            env = os.environ.copy()
            env['SUI_KEYSTORE'] = keystore_file

            # Upload using Walrus CLI
            result = subprocess.run(
                [self.walrus_cli_path, 'store', '--epochs', str(epochs), tmp_path],
                capture_output=True,
                text=True,
                timeout=120,
                env=env
            )

            if result.returncode != 0:
                raise Exception(f"Walrus upload failed: {result.stderr}")

            # Parse blob ID
            blob_id = self._parse_blob_id(result.stdout)
            if not blob_id:
                raise Exception(f"Could not parse blob ID from output:\n{result.stdout}")

            return {
                'blob_id': blob_id,
                'size_bytes': len(file_content),
                'epochs': epochs,
                'aggregator_url': f"{self.aggregator_url}/v1/{blob_id}"
            }

        finally:
            # Cleanup temp files
            if tmp_path and os.path.exists(tmp_path):
                os.unlink(tmp_path)
            if keystore_file and os.path.exists(keystore_file):
                os.unlink(keystore_file)
            if keystore_dir and os.path.exists(keystore_dir):
                os.rmdir(keystore_dir)

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
        # Get metadata
        try:
            metadata = self.client.get_blob_metadata(blob_id)
        except Exception:
            metadata = {}

        # Read blob content
        content = self.client.get_blob(blob_id)

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
        content = self.client.get_blob(blob_id)
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
        metadata = self.client.get_blob_metadata(blob_id)
        return {
            'success': True,
            'blob_id': blob_id,
            'metadata': metadata
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
