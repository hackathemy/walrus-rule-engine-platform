"""
AWS Bedrock Client
Enterprise-grade alternative with AWS integration
"""
import os
import json
import boto3
from typing import Dict, Any

class BedrockClient:
    """AWS Bedrock API client for Claude 3.5"""

    def __init__(self):
        """Initialize Bedrock client with AWS credentials from environment"""
        access_key = os.getenv('AWS_ACCESS_KEY_ID')
        secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
        region = os.getenv('AWS_REGION', 'us-east-1')

        if not access_key or not secret_key:
            raise ValueError("AWS credentials not set (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)")

        self.client = boto3.client(
            service_name='bedrock-runtime',
            region_name=region,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key
        )

        self.model_id = os.getenv('BEDROCK_MODEL_ID', 'us.anthropic.claude-3-5-sonnet-20241022-v2:0')

    def analyze(
        self,
        prompt: str,
        max_tokens: int = 2000,
        temperature: float = 1.0
    ) -> Dict[str, Any]:
        """
        Call Claude 3.5 via AWS Bedrock

        Args:
            prompt: Analysis prompt
            max_tokens: Max response length
            temperature: Sampling temperature (0.0-1.0)

        Returns:
            {
                'text': str,
                'usage': {'input_tokens': int, 'output_tokens': int},
                'cost': float
            }
        """
        try:
            # Prepare request body
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": [{"role": "user", "content": prompt}]
            })

            # Call Bedrock
            response = self.client.invoke_model(
                modelId=self.model_id,
                body=body
            )

            # Parse response
            result = json.loads(response['body'].read())

            # Calculate cost (same as Anthropic API)
            # Claude 3.5 Sonnet pricing: $3/MTok input, $15/MTok output
            input_cost = result['usage']['input_tokens'] * 0.003 / 1000
            output_cost = result['usage']['output_tokens'] * 0.015 / 1000

            return {
                'text': result['content'][0]['text'],
                'usage': result['usage'],
                'cost': input_cost + output_cost
            }

        except Exception as e:
            raise Exception(f"AWS Bedrock error: {str(e)}")
