"""
Ruleset Execution Engine
Executes AI/SQL/Python rulesets on data from Walrus
"""

import json
import os
import time
import hashlib
import pandas as pd
from typing import Dict, Any, List
from io import StringIO
from bedrock_analyzer import BedrockAnalyzer
from walrus_uploader import WalrusUploader


class RulesetExecutor:
    """Execute different types of rulesets on data"""

    RULE_TYPE_AI = 1
    RULE_TYPE_SQL = 2
    RULE_TYPE_PYTHON = 3

    def __init__(self):
        self.bedrock = BedrockAnalyzer()
        self.walrus = WalrusUploader()

    def execute(
        self,
        data_blob_id: str,
        ruleset_blob_id: str,
        rule_type: int
    ) -> Dict[str, Any]:
        """
        Execute a ruleset on data

        Args:
            data_blob_id: Walrus blob ID of the data (CSV/JSON)
            ruleset_blob_id: Walrus blob ID of the ruleset
            rule_type: 1=AI, 2=SQL, 3=Python

        Returns:
            {
                'result_blob_id': str,
                'verification_hash': str,
                'execution_time_ms': int,
                'row_count': int,
                'summary': Dict
            }
        """

        start_time = time.time()

        try:
            # 1. Download data from Walrus
            print(f"Downloading data from Walrus: {data_blob_id}")
            data = self.walrus.download_blob(data_blob_id)

            # 2. Download ruleset from Walrus
            print(f"Downloading ruleset from Walrus: {ruleset_blob_id}")
            ruleset = self.walrus.download_blob(ruleset_blob_id)

            # 3. Parse data
            df = self._parse_data(data)
            print(f"Parsed {len(df)} rows")

            # 4. Execute based on rule type
            if rule_type == self.RULE_TYPE_AI:
                result = self._execute_ai_rule(df, ruleset)
            elif rule_type == self.RULE_TYPE_SQL:
                result = self._execute_sql_rule(df, ruleset)
            elif rule_type == self.RULE_TYPE_PYTHON:
                result = self._execute_python_rule(df, ruleset)
            else:
                raise ValueError(f"Invalid rule type: {rule_type}")

            # 5. Upload result to Walrus
            print("Uploading result to Walrus")
            upload_result = self.walrus.upload_blob(result)

            # 6. Calculate execution time
            execution_time_ms = int((time.time() - start_time) * 1000)

            return {
                'result_blob_id': upload_result['blob_id'],
                'verification_hash': upload_result['content_hash'],
                'execution_time_ms': execution_time_ms,
                'row_count': len(df),
                'summary': self._generate_summary(result),
                'aggregator_url': upload_result['aggregator_url']
            }

        except Exception as e:
            print(f"Execution error: {str(e)}")
            raise

    def _parse_data(self, data: Dict[str, Any]) -> pd.DataFrame:
        """Parse data blob into DataFrame"""

        if isinstance(data, list):
            # JSON array format
            return pd.DataFrame(data)
        elif isinstance(data, dict):
            if 'data' in data:
                # Wrapped format
                return pd.DataFrame(data['data'])
            else:
                # Single row
                return pd.DataFrame([data])
        elif isinstance(data, str):
            # CSV string
            return pd.read_csv(StringIO(data))
        else:
            raise ValueError(f"Unsupported data format: {type(data)}")

    def _execute_ai_rule(
        self,
        df: pd.DataFrame,
        ruleset: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute AI-based ruleset using Bedrock"""

        prompt_template = ruleset.get('prompt', '')
        model_params = ruleset.get('model_params', {})

        # Build context from data
        data_summary = {
            'row_count': len(df),
            'columns': list(df.columns),
            'sample': df.head(10).to_dict('records')
        }

        # Build full prompt
        full_prompt = f"""{prompt_template}

Data Summary:
- Rows: {data_summary['row_count']}
- Columns: {', '.join(data_summary['columns'])}

Sample Data (first 10 rows):
{json.dumps(data_summary['sample'], indent=2)}

Provide analysis in JSON format."""

        # Call Bedrock
        response = self.bedrock._invoke_bedrock(full_prompt)

        # Parse AI response
        try:
            if '```json' in response:
                response = response.split('```json')[1].split('```')[0]
            elif '```' in response:
                response = response.split('```')[1].split('```')[0]

            analysis = json.loads(response.strip())

        except json.JSONDecodeError:
            # If AI didn't return valid JSON, wrap it
            analysis = {
                'raw_response': response,
                'format': 'text'
            }

        # Combine with data stats
        result = {
            'analysis': analysis,
            'data_stats': {
                'total_rows': len(df),
                'columns': list(df.columns),
                'numeric_summary': df.describe().to_dict() if len(df.select_dtypes(include='number').columns) > 0 else {}
            },
            'ruleset_name': ruleset.get('name', 'Unnamed'),
            'rule_type': 'AI',
            'executed_at': time.time()
        }

        return result

    def _execute_sql_rule(
        self,
        df: pd.DataFrame,
        ruleset: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute SQL query on DataFrame using DuckDB (future)"""

        # For MVP, use pandas filtering as SQL-like operations
        sql_query = ruleset.get('query', '')

        # Simple keyword-based filtering
        # TODO: Integrate DuckDB for real SQL execution

        result = {
            'message': 'SQL execution not yet implemented',
            'query': sql_query,
            'data_preview': df.head(5).to_dict('records'),
            'rule_type': 'SQL',
            'executed_at': time.time()
        }

        return result

    def _execute_python_rule(
        self,
        df: pd.DataFrame,
        ruleset: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute sandboxed Python code (future)"""

        # For MVP, return placeholder
        # TODO: Implement sandboxed Python execution with RestrictedPython

        python_code = ruleset.get('code', '')

        result = {
            'message': 'Python execution not yet implemented',
            'code_preview': python_code[:200],
            'data_preview': df.head(5).to_dict('records'),
            'rule_type': 'Python',
            'executed_at': time.time()
        }

        return result

    def _generate_summary(self, result: Dict[str, Any]) -> Dict[str, str]:
        """Generate human-readable summary"""

        if result.get('rule_type') == 'AI':
            analysis = result.get('analysis', {})
            return {
                'type': 'AI Analysis',
                'status': 'completed',
                'insights_count': len(analysis.keys()),
                'preview': str(analysis)[:200] + '...'
            }
        else:
            return {
                'type': result.get('rule_type', 'Unknown'),
                'status': 'pending_implementation'
            }


def lambda_handler(event, context):
    """
    AWS Lambda handler for ruleset execution

    Event format:
    {
        "action": "execute",
        "data_blob_id": "...",
        "ruleset_blob_id": "...",
        "rule_type": 1
    }
    """

    try:
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event

        action = body.get('action')

        if action == 'execute':
            executor = RulesetExecutor()

            result = executor.execute(
                data_blob_id=body['data_blob_id'],
                ruleset_blob_id=body['ruleset_blob_id'],
                rule_type=body['rule_type']
            )

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
    # Test with sample data
    executor = RulesetExecutor()

    # Create sample data
    sample_data = {
        'players': [
            {'id': 1, 'spend': 100, 'sessions': 50},
            {'id': 2, 'spend': 500, 'sessions': 100},
            {'id': 3, 'spend': 1000, 'sessions': 200},
        ]
    }

    # Create sample AI ruleset
    sample_ruleset = {
        'name': 'Whale Detector',
        'prompt': 'Analyze this player spending data and identify whales (high spenders). Return JSON with whale_count and whale_ids.',
        'model_params': {
            'temperature': 0.3
        }
    }

    # Upload to Walrus (mocked)
    print("This would execute:")
    print(f"Data: {json.dumps(sample_data, indent=2)}")
    print(f"Ruleset: {json.dumps(sample_ruleset, indent=2)}")
