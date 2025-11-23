"""
AI Client - Unified interface for Anthropic API or AWS Bedrock
Automatically detects which credentials are available and uses the appropriate client.
"""
import os
from typing import Dict, Any, Optional

class AIClient:
    """
    Unified AI Client that auto-detects and uses either:
    - Anthropic API (if ANTHROPIC_API_KEY is set)
    - AWS Bedrock (if AWS credentials are set)

    Priority: Anthropic API > AWS Bedrock (simpler setup)
    """

    def __init__(self):
        """Initialize the appropriate AI client based on available credentials"""
        self.client = None
        self.client_type = None

        # Try Anthropic API first (simpler, faster setup)
        if os.getenv('ANTHROPIC_API_KEY'):
            try:
                from .anthropic_client import AnthropicClient
                self.client = AnthropicClient()
                self.client_type = 'anthropic'
                print("✅ Using Anthropic API")
            except Exception as e:
                print(f"⚠️ Anthropic API initialization failed: {e}")

        # Fallback to AWS Bedrock
        if not self.client and os.getenv('AWS_ACCESS_KEY_ID'):
            try:
                from .bedrock_client import BedrockClient
                self.client = BedrockClient()
                self.client_type = 'bedrock'
                print("✅ Using AWS Bedrock")
            except Exception as e:
                print(f"⚠️ AWS Bedrock initialization failed: {e}")

        # Fallback to Mock AI (for demo/testing)
        if not self.client:
            try:
                from .mock_ai_client import MockAIClient
                self.client = MockAIClient()
                self.client_type = 'mock'
                print("⚠️  Using Mock AI (no real API calls)")
                print("   Set ANTHROPIC_API_KEY or AWS credentials for real AI")
            except Exception as e:
                raise ValueError(
                    "No AI credentials configured and Mock AI failed. Please set:\n"
                    "  - ANTHROPIC_API_KEY for Anthropic API (recommended)\n"
                    "  - AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY for AWS Bedrock"
                )

    def analyze(
        self,
        prompt: str,
        max_tokens: int = 2000,
        temperature: float = 1.0
    ) -> Dict[str, Any]:
        """
        Run AI analysis using the configured client

        Args:
            prompt: Analysis prompt
            max_tokens: Maximum response length
            temperature: Sampling temperature (0.0-1.0)

        Returns:
            {
                'text': str,              # AI response text
                'usage': {                # Token usage
                    'input_tokens': int,
                    'output_tokens': int
                },
                'cost': float,            # Estimated cost in USD
                'provider': str           # 'anthropic' or 'bedrock'
            }
        """
        if not self.client:
            raise RuntimeError("AI client not initialized")

        result = self.client.analyze(prompt, max_tokens, temperature)
        result['provider'] = self.client_type

        return result

    def get_provider(self) -> str:
        """Get the current AI provider name"""
        return self.client_type

    def is_available(self) -> bool:
        """Check if AI client is available and working"""
        return self.client is not None


# Convenience function for quick usage
def get_ai_client() -> AIClient:
    """Get a configured AI client instance"""
    return AIClient()
