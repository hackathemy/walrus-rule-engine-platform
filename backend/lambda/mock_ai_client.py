"""
Mock AI Client for Demo/Testing
Use this when AI credentials are not available
"""
import time
from typing import Dict, Any

class MockAIClient:
    """Mock AI client that returns realistic responses without API calls"""

    def __init__(self):
        """Initialize mock client"""
        self.model = "mock-claude-3.5"

    def analyze(
        self,
        prompt: str,
        max_tokens: int = 2000,
        temperature: float = 1.0
    ) -> Dict[str, Any]:
        """
        Return a mock AI response (no actual API call)

        Args:
            prompt: Analysis prompt
            max_tokens: Max response length (ignored)
            temperature: Sampling temperature (ignored)

        Returns:
            {
                'text': str,
                'usage': {'input_tokens': int, 'output_tokens': int},
                'cost': float
            }
        """
        # Simulate API delay
        time.sleep(0.5)

        # Generate realistic mock response based on prompt keywords
        if "abuse" in prompt.lower() or "cheat" in prompt.lower():
            response_text = """
**Risk Assessment**: HIGH

Based on the analysis of player behavior patterns, we've identified several concerning indicators:

**Key Findings**:
1. **Multi-Account Pattern**: 12 accounts showing coordinated activity from shared IP ranges
2. **Refund Velocity**: 7 accounts with suspicious refund patterns (>5 refunds in 24h)
3. **Bot Indicators**: Impossible K/D ratios (>8.0) and movement patterns

**Recommended Actions**:
- Immediate suspension of high-confidence accounts (confidence >0.85)
- Enhanced monitoring for moderate-risk accounts
- Review refund policies for playtime <2 hours

**Prevention Strategies**:
- Implement device fingerprinting
- Add CAPTCHA for account creation
- Monitor IP-sharing patterns more aggressively
"""
        elif "defi" in prompt.lower() or "risk" in prompt.lower():
            response_text = """
**DeFi Risk Analysis**

**Overall Risk Score**: MEDIUM (6.5/10)

**Key Findings**:
1. **Collateral Ratios**: 3 positions below safe threshold (<150%)
2. **Liquidity Health**: Pool depth sufficient for current volume
3. **Smart Contract Risk**: No critical vulnerabilities detected

**Recommendations**:
- Alert users with <140% collateral ratio
- Increase liquidation incentives
- Monitor whale movements (>$1M positions)

**Market Conditions**:
- Volatility: Elevated (±15% in 24h)
- Volume: Above average (+25% vs 7d MA)
"""
        else:
            response_text = """
**Analysis Complete**

**Summary**: The data shows normal patterns with no significant anomalies detected.

**Insights**:
- Metrics are within expected ranges
- No immediate action required
- Continue monitoring for changes

**Recommendations**:
- Maintain current settings
- Schedule next review in 7 days
"""

        # Calculate mock usage
        input_tokens = len(prompt.split()) * 2  # Rough estimate
        output_tokens = len(response_text.split()) * 2
        cost = (input_tokens * 0.003 + output_tokens * 0.015) / 1000

        return {
            'text': response_text.strip(),
            'usage': {
                'input_tokens': input_tokens,
                'output_tokens': output_tokens
            },
            'cost': cost
        }
