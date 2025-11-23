"""
Anthropic API Direct Client
Simpler and faster alternative to AWS Bedrock
"""
import os
from anthropic import Anthropic
from typing import Dict, Any

class AnthropicClient:
    """Anthropic API client for Claude 3.5"""

    def __init__(self):
        """Initialize Anthropic client with API key from environment"""
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set")

        self.client = Anthropic(api_key=api_key)
        self.model = os.getenv('ANTHROPIC_MODEL', 'claude-3-haiku-20240307')

    def analyze(
        self,
        prompt: str,
        max_tokens: int = 2000,
        temperature: float = 1.0
    ) -> Dict[str, Any]:
        """
        Call Claude 3.5 for analysis

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
            # Call Anthropic API
            message = self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=[{"role": "user", "content": prompt}]
            )

            # Calculate cost
            # Claude 3 Haiku pricing: $0.25/MTok input, $1.25/MTok output
            input_cost = message.usage.input_tokens * 0.00025 / 1000
            output_cost = message.usage.output_tokens * 0.00125 / 1000

            return {
                'text': message.content[0].text,
                'usage': {
                    'input_tokens': message.usage.input_tokens,
                    'output_tokens': message.usage.output_tokens
                },
                'cost': input_cost + output_cost
            }

        except Exception as e:
            raise Exception(f"Anthropic API error: {str(e)}")
