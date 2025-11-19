"""
Data Upload API
Validates and uploads CSV/JSON data to Walrus
"""

import json
import csv
import hashlib
import pandas as pd
from typing import Dict, Any, List
from io import StringIO
from walrus_uploader import WalrusUploader


class DataUploader:
    """Validate and upload data to Walrus"""

    def __init__(self):
        self.walrus = WalrusUploader()

    def upload_data(
        self,
        data: Any,
        metadata: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Upload data to Walrus with validation

        Args:
            data: CSV string, JSON array, or dict
            metadata: Optional metadata (name, description, schema)

        Returns:
            {
                'blob_id': str,
                'content_hash': str,
                'row_count': int,
                'schema': Dict,
                'validation': Dict
            }
        """

        try:
            # 1. Parse and validate data
            df, validation = self._validate_data(data)

            if not validation['is_valid']:
                return {
                    'error': 'Validation failed',
                    'validation': validation
                }

            # 2. Generate schema
            schema = self._generate_schema(df)

            # 3. Prepare for upload
            upload_data = {
                'data': df.to_dict('records'),
                'metadata': metadata or {},
                'schema': schema,
                'row_count': len(df),
                'validation': validation
            }

            # 4. Upload to Walrus
            upload_result = self.walrus.upload_blob(upload_data)

            return {
                'blob_id': upload_result['blob_id'],
                'content_hash': upload_result['content_hash'],
                'aggregator_url': upload_result['aggregator_url'],
                'row_count': len(df),
                'column_count': len(df.columns),
                'schema': schema,
                'validation': validation,
                'size_bytes': upload_result['size_bytes']
            }

        except Exception as e:
            print(f"Upload error: {str(e)}")
            raise

    def _validate_data(self, data: Any) -> tuple:
        """Validate data and return DataFrame + validation report"""

        validation = {
            'is_valid': True,
            'errors': [],
            'warnings': [],
            'checks': {}
        }

        try:
            # Parse into DataFrame
            if isinstance(data, str):
                # CSV string
                if data.strip().startswith('[') or data.strip().startswith('{'):
                    # JSON string
                    data = json.loads(data)
                    df = pd.DataFrame(data if isinstance(data, list) else [data])
                else:
                    # CSV
                    df = pd.read_csv(StringIO(data))

            elif isinstance(data, list):
                df = pd.DataFrame(data)

            elif isinstance(data, dict):
                if 'data' in data:
                    df = pd.DataFrame(data['data'])
                else:
                    df = pd.DataFrame([data])

            else:
                validation['is_valid'] = False
                validation['errors'].append('Unsupported data format')
                return None, validation

            # Check 1: Not empty
            if len(df) == 0:
                validation['is_valid'] = False
                validation['errors'].append('Data is empty')
            else:
                validation['checks']['not_empty'] = True

            # Check 2: Has columns
            if len(df.columns) == 0:
                validation['is_valid'] = False
                validation['errors'].append('No columns found')
            else:
                validation['checks']['has_columns'] = True

            # Check 3: Row limit (prevent abuse)
            MAX_ROWS = 100000
            if len(df) > MAX_ROWS:
                validation['is_valid'] = False
                validation['errors'].append(f'Too many rows (max {MAX_ROWS})')
            else:
                validation['checks']['within_row_limit'] = True

            # Check 4: PII detection (basic)
            pii_warnings = self._detect_pii(df)
            if pii_warnings:
                validation['warnings'].extend(pii_warnings)

            # Check 5: Data quality
            quality_report = self._check_data_quality(df)
            validation['quality'] = quality_report

            return df, validation

        except Exception as e:
            validation['is_valid'] = False
            validation['errors'].append(f'Parsing error: {str(e)}')
            return None, validation

    def _generate_schema(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Generate schema from DataFrame"""

        schema = {
            'columns': {},
            'row_count': len(df),
            'column_count': len(df.columns)
        }

        for col in df.columns:
            dtype = str(df[col].dtype)
            schema['columns'][col] = {
                'type': dtype,
                'null_count': int(df[col].isnull().sum()),
                'unique_count': int(df[col].nunique()),
            }

            # Add stats for numeric columns
            if df[col].dtype in ['int64', 'float64']:
                schema['columns'][col]['min'] = float(df[col].min())
                schema['columns'][col]['max'] = float(df[col].max())
                schema['columns'][col]['mean'] = float(df[col].mean())

        return schema

    def _detect_pii(self, df: pd.DataFrame) -> List[str]:
        """Detect potential PII in column names"""

        warnings = []
        pii_keywords = [
            'email', 'phone', 'ssn', 'social_security',
            'credit_card', 'password', 'address', 'name',
            'birth', 'dob', 'ip_address'
        ]

        for col in df.columns:
            col_lower = col.lower()
            for keyword in pii_keywords:
                if keyword in col_lower:
                    warnings.append(
                        f'Column "{col}" may contain PII ({keyword})'
                    )
                    break

        return warnings

    def _check_data_quality(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Check data quality metrics"""

        total_cells = len(df) * len(df.columns)
        null_cells = df.isnull().sum().sum()

        return {
            'completeness': 1.0 - (null_cells / total_cells) if total_cells > 0 else 0,
            'null_percentage': (null_cells / total_cells * 100) if total_cells > 0 else 0,
            'duplicate_rows': int(df.duplicated().sum()),
        }


def lambda_handler(event, context):
    """
    AWS Lambda handler for data upload

    Event format:
    {
        "action": "upload",
        "data": <CSV string or JSON>,
        "metadata": {
            "name": "My Dataset",
            "description": "...",
            "category": "gaming"
        }
    }
    """

    try:
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event

        action = body.get('action')

        if action == 'upload':
            uploader = DataUploader()

            result = uploader.upload_data(
                data=body['data'],
                metadata=body.get('metadata', {})
            )

            if 'error' in result:
                return {
                    'statusCode': 400,
                    'body': json.dumps(result)
                }

            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result)
            }

        else:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': f'Invalid action: {action}'
                })
            }

    except Exception as e:
        print(f"Lambda error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }


# For local testing
if __name__ == '__main__':
    uploader = DataUploader()

    # Test CSV
    csv_data = """player_id,spend,sessions
1,100,50
2,500,100
3,1000,200"""

    print("Testing CSV upload...")
    result = uploader.upload_data(csv_data, {
        'name': 'Test Game Data',
        'category': 'gaming'
    })

    print(json.dumps(result, indent=2))
