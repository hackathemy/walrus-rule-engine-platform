#!/usr/bin/env python3
"""
Test script for Walrus Storage integration
Uploads sample data and verifies integrity
"""

import sys
import os
import json
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'lambda'))

from walrus_uploader import WalrusUploader


def main():
    print("=== Walrus Storage Test ===\n")

    # Sample insight data
    test_data = {
        "player_id": "0x1234567890abcdef",
        "analysis_date": datetime.utcnow().isoformat(),
        "total_spend_30d": 329.95,
        "tier": "whale",
        "tier_reasoning": "High spending with consistent large transactions",
        "patterns": {
            "frequency": "daily",
            "consistency": "high",
            "peak_hours": [20, 21, 22]
        },
        "fraud_score": 0.02,
        "fraud_flags": [],
        "recommendations": [
            "VIP program eligibility",
            "Early access to new content"
        ],
        "player_value": {
            "ltv_estimate": 3000,
            "retention_risk": "low",
            "vip_eligible": True
        }
    }

    uploader = WalrusUploader()

    # Test 1: Upload
    print("Test 1: Upload blob to Walrus")
    print("-" * 50)
    try:
        upload_result = uploader.upload_blob(test_data)
        print("✅ Upload successful!")
        print(json.dumps(upload_result, indent=2))
        print()

        blob_id = upload_result['blob_id']
        expected_hash = upload_result['content_hash']

    except Exception as e:
        print(f"❌ Upload failed: {e}")
        return 1

    # Test 2: Download
    print("\nTest 2: Download blob from Walrus")
    print("-" * 50)
    try:
        downloaded_data = uploader.download_blob(blob_id)
        print("✅ Download successful!")
        print(json.dumps(downloaded_data, indent=2))
        print()

    except Exception as e:
        print(f"❌ Download failed: {e}")
        return 1

    # Test 3: Verify
    print("\nTest 3: Verify blob integrity")
    print("-" * 50)
    try:
        is_valid = uploader.verify_blob(blob_id, expected_hash)

        if is_valid:
            print("✅ Verification PASSED - blob is authentic!")
        else:
            print("❌ Verification FAILED - blob may be corrupted!")
            return 1

    except Exception as e:
        print(f"❌ Verification error: {e}")
        return 1

    # Summary
    print("\n" + "=" * 50)
    print("All tests passed! ✅")
    print("=" * 50)
    print(f"\n📦 Blob ID: {blob_id}")
    print(f"🔗 Aggregator URL: {upload_result['aggregator_url']}")
    print(f"🔐 Content Hash: {expected_hash}")
    print()

    return 0


if __name__ == '__main__':
    sys.exit(main())
