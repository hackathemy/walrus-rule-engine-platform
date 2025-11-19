"""
AWS Bedrock AI Analyzer for Game Settlement Data
Analyzes player behavior patterns using Claude 3.5 Sonnet
"""

import json
import os
import boto3
from typing import Dict, List, Any
from datetime import datetime
import hashlib


class BedrockAnalyzer:
    """Analyze game settlement data using AWS Bedrock AI"""

    def __init__(self):
        self.bedrock = boto3.client(
            service_name='bedrock-runtime',
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )
        self.model_id = os.getenv(
            'BEDROCK_MODEL_ID',
            'anthropic.claude-3-5-sonnet-20241022-v2:0'
        )

    def analyze_player(self, player_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze a single player's settlement data

        Args:
            player_data: {
                'player_id': str,
                'transactions': List[Dict],
                'period_days': int
            }

        Returns:
            {
                'player_id': str,
                'analysis_date': str,
                'total_spend': float,
                'tier': str,  # casual/regular/whale
                'patterns': Dict,
                'fraud_score': float,
                'recommendations': List[str]
            }
        """
        # Calculate aggregate metrics
        transactions = player_data.get('transactions', [])
        total_spend = sum(t.get('amount', 0) for t in transactions)
        avg_transaction = total_spend / len(transactions) if transactions else 0

        # Build AI prompt
        prompt = self._build_analysis_prompt(player_data, total_spend, avg_transaction)

        # Call Bedrock
        response = self._invoke_bedrock(prompt)

        # Parse AI response
        analysis = self._parse_ai_response(response, player_data, total_spend)

        return analysis

    def _build_analysis_prompt(
        self,
        player_data: Dict[str, Any],
        total_spend: float,
        avg_transaction: float
    ) -> str:
        """Build structured prompt for Bedrock AI"""

        transactions = player_data.get('transactions', [])
        period_days = player_data.get('period_days', 30)

        return f"""Analyze this game player's spending behavior and provide insights in JSON format.

Player Data:
- Player ID: {player_data.get('player_id')}
- Analysis Period: {period_days} days
- Total Transactions: {len(transactions)}
- Total Spend: ${total_spend:.2f}
- Average Transaction: ${avg_transaction:.2f}

Transaction History (recent 10):
{json.dumps(transactions[:10], indent=2)}

Provide analysis in this exact JSON structure:
{{
  "tier": "casual|regular|whale",
  "tier_reasoning": "explain classification",
  "spending_pattern": {{
    "frequency": "daily|weekly|monthly|sporadic",
    "consistency": "high|medium|low",
    "peak_hours": [list of hours 0-23]
  }},
  "fraud_indicators": {{
    "score": 0.0-1.0,
    "flags": ["list any suspicious patterns"],
    "confidence": "high|medium|low"
  }},
  "recommendations": [
    "actionable recommendation 1",
    "actionable recommendation 2"
  ],
  "player_value": {{
    "ltv_estimate": estimated_lifetime_value_usd,
    "retention_risk": "low|medium|high",
    "vip_eligible": true|false
  }}
}}

Classification Rules:
- **Whale**: >$500/month OR avg_transaction >$100
- **Regular**: $100-500/month OR 10+ transactions/month
- **Casual**: <$100/month OR <10 transactions/month

Fraud Indicators:
- Chargebacks
- Rapid transaction velocity (>5 in 1 hour)
- Unusual amounts (e.g., $999.99 repeatedly)
- Geographic inconsistencies

Return ONLY valid JSON, no markdown formatting."""

    def _invoke_bedrock(self, prompt: str) -> str:
        """Call AWS Bedrock API with Claude 3.5 Sonnet"""

        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 2000,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.3,  # Lower for more consistent analysis
            "top_p": 0.9
        })

        try:
            response = self.bedrock.invoke_model(
                modelId=self.model_id,
                body=body,
                contentType='application/json',
                accept='application/json'
            )

            response_body = json.loads(response['body'].read())
            ai_response = response_body['content'][0]['text']

            return ai_response

        except Exception as e:
            print(f"Bedrock API error: {str(e)}")
            raise

    def _parse_ai_response(
        self,
        ai_response: str,
        player_data: Dict[str, Any],
        total_spend: float
    ) -> Dict[str, Any]:
        """Parse AI JSON response and add metadata"""

        try:
            # Extract JSON from response (handle markdown code blocks)
            if '```json' in ai_response:
                ai_response = ai_response.split('```json')[1].split('```')[0]
            elif '```' in ai_response:
                ai_response = ai_response.split('```')[1].split('```')[0]

            analysis = json.loads(ai_response.strip())

            # Add metadata
            result = {
                'player_id': player_data.get('player_id'),
                'analysis_date': datetime.utcnow().isoformat(),
                'total_spend_30d': total_spend,
                'tier': analysis.get('tier', 'casual'),
                'tier_reasoning': analysis.get('tier_reasoning', ''),
                'patterns': analysis.get('spending_pattern', {}),
                'fraud_score': analysis.get('fraud_indicators', {}).get('score', 0.0),
                'fraud_flags': analysis.get('fraud_indicators', {}).get('flags', []),
                'recommendations': analysis.get('recommendations', []),
                'player_value': analysis.get('player_value', {}),
                'metadata': {
                    'model': self.model_id,
                    'analyzed_at': datetime.utcnow().isoformat(),
                    'transaction_count': len(player_data.get('transactions', []))
                }
            }

            # Add content hash for verification
            content_str = json.dumps(result, sort_keys=True)
            result['content_hash'] = hashlib.sha256(content_str.encode()).hexdigest()

            return result

        except json.JSONDecodeError as e:
            print(f"Failed to parse AI response: {str(e)}")
            print(f"Response: {ai_response}")
            raise


def lambda_handler(event, context):
    """
    AWS Lambda handler

    Event format:
    {
        "player_id": "0x1234...",
        "transactions": [...],
        "period_days": 30
    }

    Returns:
    {
        "statusCode": 200,
        "body": JSON string of analysis
    }
    """

    try:
        # Parse input
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event

        # Validate input
        required_fields = ['player_id', 'transactions']
        for field in required_fields:
            if field not in body:
                return {
                    'statusCode': 400,
                    'body': json.dumps({
                        'error': f'Missing required field: {field}'
                    })
                }

        # Analyze
        analyzer = BedrockAnalyzer()
        analysis = analyzer.analyze_player(body)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(analysis)
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
    # Sample test data
    test_event = {
        'player_id': '0x1234567890abcdef',
        'transactions': [
            {'amount': 49.99, 'timestamp': '2025-11-01T10:00:00Z', 'item': 'Premium Pack'},
            {'amount': 99.99, 'timestamp': '2025-11-05T14:30:00Z', 'item': 'Legendary Weapon'},
            {'amount': 19.99, 'timestamp': '2025-11-08T09:15:00Z', 'item': 'Energy Boost'},
            {'amount': 149.99, 'timestamp': '2025-11-12T20:45:00Z', 'item': 'Ultimate Bundle'},
            {'amount': 9.99, 'timestamp': '2025-11-15T11:20:00Z', 'item': 'Daily Gems'},
        ],
        'period_days': 30
    }

    result = lambda_handler(test_event, None)
    print(json.dumps(json.loads(result['body']), indent=2))
