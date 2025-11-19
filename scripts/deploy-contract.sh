#!/bin/bash
# Deploy Sui Move contract to testnet

set -e

echo "=== Deploying Walrus Insight Engine Contract ==="
echo

# Check if Sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "❌ Error: Sui CLI not found"
    echo "Install: https://docs.sui.io/build/install"
    exit 1
fi

# Check active environment
echo "📍 Active Sui environment:"
sui client active-env
echo

# Confirm network
read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Build contract
echo "🔨 Building Move contract..."
cd contracts
sui move build
echo "✅ Build successful!"
echo

# Deploy
echo "🚀 Deploying to Sui..."
DEPLOY_OUTPUT=$(sui client publish --gas-budget 100000000 --json)

# Extract package ID
PACKAGE_ID=$(echo $DEPLOY_OUTPUT | jq -r '.objectChanges[] | select(.type == "published") | .packageId')

if [ -z "$PACKAGE_ID" ]; then
    echo "❌ Deployment failed - could not extract package ID"
    exit 1
fi

echo "✅ Deployment successful!"
echo
echo "📦 Package ID: $PACKAGE_ID"
echo

# Save to .env file
cd ../frontend
if [ -f .env.local ]; then
    # Update existing
    sed -i.bak "s/NEXT_PUBLIC_CONTRACT_ID=.*/NEXT_PUBLIC_CONTRACT_ID=$PACKAGE_ID/" .env.local
    rm .env.local.bak
    echo "✅ Updated .env.local with package ID"
else
    # Create new
    echo "NEXT_PUBLIC_SUI_NETWORK=testnet" > .env.local
    echo "NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.mystenlabs.com" >> .env.local
    echo "NEXT_PUBLIC_CONTRACT_ID=$PACKAGE_ID" >> .env.local
    echo "✅ Created .env.local with package ID"
fi

echo
echo "=== Deployment Complete ==="
echo "🔗 View on Suiscan: https://suiscan.xyz/testnet/object/$PACKAGE_ID"
echo
