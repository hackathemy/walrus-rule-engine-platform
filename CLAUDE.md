# Walrus Insight Engine (@soaryong)

**Sui Walrus Hackathon Project**: AI-Powered Game Economy Analytics Platform

## 🎯 Project Vision

Transform game settlement data into verifiable on-chain insights using:
- **AWS Bedrock AI** for intelligent pattern analysis
- **Walrus Storage** for decentralized, verifiable data storage
- **Sui Blockchain** for NFT-based insight distribution

## 🏗️ Architecture Overview

```
┌─────────────────┐
│  DynamoDB       │  Game Settlement Data
│  (PostgreSQL)   │  (payments, transactions, user behavior)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AWS Lambda     │  1. Fetch & aggregate data
│  + Bedrock AI   │  2. Apply AI ruleset analysis
└────────┬────────┘  3. Generate insights JSON
         │
         ▼
┌─────────────────┐
│  Walrus         │  Store verified insights as blobs
│  Storage        │  → Immutable, content-addressed
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sui Move       │  NFT minting with blob reference
│  Contract       │  → Player-owned insight badges
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React dApp     │  User interface
│                 │  → Wallet connection
└─────────────────┘  → View insights & mint NFTs
```

## 🎨 Inspired By Real Walrus Use Cases

| Use Case | Our Implementation | Hackathon Value |
|----------|-------------------|-----------------|
| **Decrypt** (Media) | Game economy reports as verifiable publications | "Decrypt for gaming data" |
| **TradePort** (NFT) | Insight NFTs (Whale Badge, Fraud Alert) | Tradeable player reputation |
| **ElizaOS** (AI Memory) | Settlement data → AI training datasets | Monetizable data marketplace |
| **Humanity Protocol** | On-chain player verification badges | "Verified High-Value Player" |
| **Talus** (Game Logs) | Transparent, verifiable leaderboards | Community trust builder |

## 💡 Core Features (MVP)

### 1. AI Ruleset Engine
**Bedrock AI analyzes patterns**:
- **Whale Detection**: Users spending >$500/month
- **Fraud Alerts**: Abnormal payment patterns (chargebacks, velocity)
- **Behavior Clusters**: Casual/Regular/Power player segmentation

### 2. Walrus Storage Integration
**Why Walrus?**
- ✅ Verifiable: Content-addressed storage (SHA-256)
- ✅ Decentralized: No single point of failure
- ✅ Cost-efficient: Pay-once, store forever (epochs)
- ✅ Sui-native: Perfect for Move contract integration

### 3. Dynamic Insight NFTs
**Mutable NFTs with daily updates**:
```move
struct PlayerInsight has key {
    id: UID,
    player: address,
    walrus_blob_id: String,  // Latest insight data
    tier: u8,                 // 1=Casual, 2=Regular, 3=Whale
    last_updated: u64
}
```

## 🚀 Hackathon Tracks Alignment

### Primary Track: **AI × Data**
- Bedrock AI for pattern recognition
- Walrus for verifiable data provenance
- Real-world game economy use case

### Secondary Tracks
- **Gaming**: Player behavior analytics
- **DePIN**: Decentralized data infrastructure
- **DeFi**: Financial pattern analysis (fraud detection)

## 📦 Tech Stack

### Backend
- **Python 3.11** (AWS Lambda runtime)
- **boto3** (AWS SDK)
- **Bedrock Runtime API** (Claude 3.5 Sonnet)
- **Walrus SDK** (`@mysten/walrus`)

### Blockchain
- **Sui Move** (Smart contracts)
- **Sui TypeScript SDK** (`@mysten/sui.js`)
- **Walrus Storage API**

### Frontend
- **Next.js 14** (React framework)
- **TypeScript**
- **@mysten/dapp-kit** (Wallet integration)
- **TailwindCSS** (UI styling)

### DevOps
- **AWS SAM** (Serverless deployment)
- **Sui CLI** (Contract deployment)
- **GitHub Actions** (CI/CD)

## 🛠️ Implementation Roadmap

### Day 1: Backend Foundation (8h)
- [ ] Set up AWS Lambda with Bedrock
- [ ] Create sample settlement data (CSV → DynamoDB)
- [ ] Implement 3 AI rulesets (whale, fraud, behavior)
- [ ] Test Walrus blob upload

### Day 2: Blockchain Layer (8h)
- [ ] Write Move contract for NFT minting
- [ ] Deploy to Sui Testnet
- [ ] Integrate Walrus blob ID storage
- [ ] Test minting flow

### Day 3: Frontend + Demo (8h)
- [ ] Build React dApp with wallet connection
- [ ] Display insights from Walrus blobs
- [ ] Implement NFT minting UI
- [ ] Record 1-minute demo video

## 🎯 Success Metrics

### Technical Achievements
- ✅ End-to-end data flow (AWS → Walrus → Sui)
- ✅ Verifiable blob integrity (SHA-256 hash matching)
- ✅ Functional NFT minting with dynamic metadata
- ✅ Sub-5s query response time

### Hackathon Impact
- 🏆 Novel use case: "First game analytics on Walrus"
- 🏆 Real-world applicability: Fraud detection + player insights
- 🏆 Technical depth: AI + Storage + Smart Contracts
- 🏆 Community value: Open-source toolkit for game devs

## 📂 Repository Structure

```
ailrus/
├── backend/
│   ├── lambda/
│   │   ├── bedrock_analyzer.py    # AI ruleset engine
│   │   ├── walrus_uploader.py     # Blob storage handler
│   │   └── requirements.txt
│   ├── data/
│   │   └── sample_settlement.csv  # Test dataset
│   └── sam-template.yaml          # AWS SAM config
├── contracts/
│   ├── sources/
│   │   └── insight_nft.move       # Sui Move contract
│   └── Move.toml
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Main dashboard
│   │   └── layout.tsx
│   ├── components/
│   │   ├── WalletConnect.tsx
│   │   ├── InsightCard.tsx
│   │   └── MintButton.tsx
│   └── package.json
├── scripts/
│   ├── deploy-contract.sh         # Sui deployment
│   ├── test-walrus.py             # Storage testing
│   └── generate-sample-data.py    # Data synthesis
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEMO.md
├── CLAUDE.md                      # This file
└── README.md
```

## 🔑 Environment Variables

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_LAMBDA_ROLE_ARN=arn:aws:iam::...

# Bedrock
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

# Walrus
WALRUS_RPC_URL=https://walrus-testnet.mystenlabs.com
WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.mystenlabs.com
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.mystenlabs.com

# Sui
SUI_NETWORK=testnet
SUI_PACKAGE_ID=0x...
SUI_PRIVATE_KEY=suiprivkey...

# Frontend
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.mystenlabs.com
```

## 🎬 Demo Scenario

### User Journey
1. **Connect Wallet** → Sui wallet authentication
2. **View Insights** → AI-analyzed spending patterns from Walrus
3. **Mint NFT** → Claim "Whale Badge" (stored on Sui, data on Walrus)
4. **Verify Data** → Download blob from Walrus, check SHA-256 hash

### Sample Insight JSON (Walrus Blob)
```json
{
  "player_id": "0x1234...5678",
  "analysis_date": "2025-11-16",
  "total_spend_30d": 1250.00,
  "tier": "whale",
  "patterns": {
    "avg_transaction": 125.00,
    "frequency": "daily",
    "peak_hours": [20, 21, 22],
    "fraud_score": 0.02
  },
  "recommendations": [
    "VIP program eligibility",
    "Exclusive in-game items access"
  ],
  "walrus_blob_id": "ABC123...",
  "signature": "0x..."
}
```

## 🏆 Hackathon Submission Checklist

### Required Deliverables
- [ ] **GitHub Repository**: Public, with detailed README
- [ ] **Demo Video**: 1-3 minutes (Loom/YouTube)
- [ ] **Live Demo**: Deployed on Vercel/Netlify
- [ ] **Pitch Deck**: 5-10 slides (Canva/Figma)

### Bonus Points
- [ ] **Walrus Blob Explorer**: Public dashboard to view all insights
- [ ] **AI Dataset Marketplace**: Sell anonymized data as NFTs
- [ ] **Multi-game Support**: Generic SDK for any game

## 📣 Social Media Strategy (@soaryong)

### Launch Tweet
```
🎮 Building the future of game analytics at #SuiOverflow!

Walrus Insight Engine:
✅ AI analyzes player behavior (AWS Bedrock)
✅ Stores insights on @WalrusStorage
✅ Mints verifiable NFT badges on @SuiNetwork

Imagine "Decrypt for gaming" - transparent, on-chain, player-owned 📊

#WalrusHaulout #BuildOnSui
```

### Development Updates (Daily)
- Day 1: "Just uploaded first game data blob to Walrus! 🎯"
- Day 2: "Whale Badge NFT minted on Sui Testnet! 🐋"
- Day 3: "Live demo is up! Check your spending tier 📈"

## 🔬 Advanced Features (Post-Hackathon)

### 1. AI Training Data Marketplace
**Inspired by ElizaOS**:
- Anonymize settlement data → Walrus
- Sell as "Game Economy Dataset NFTs"
- Buyers use for ML model training

### 2. Fraud Alert System
**Real-time monitoring**:
- Bedrock detects anomalies → Lambda alert
- Auto-mint "Fraud Alert NFT" to admin
- Walrus stores evidence trail

### 3. Cross-Game Leaderboard
**Unified player reputation**:
- Aggregate data from multiple games
- Walrus stores global profile
- Sui NFT as universal player ID

## 📚 Learning Resources

### Walrus Documentation
- [Official Docs](https://docs.walrus.storage)
- [TypeScript SDK](https://www.npmjs.com/package/@mysten/walrus)
- [Testnet Guide](https://docs.walrus.storage/testnet)

### Sui Move
- [Move Book](https://move-book.com)
- [Sui Examples](https://github.com/MystenLabs/sui/tree/main/examples)
- [dApp Kit](https://sdk.mystenlabs.com/dapp-kit)

### AWS Bedrock
- [Bedrock Docs](https://docs.aws.amazon.com/bedrock)
- [Claude 3.5 Guide](https://docs.anthropic.com/claude/docs)

## 🤝 Contributing

This is a hackathon project, but PRs welcome for:
- Additional AI rulesets
- Frontend improvements
- Multi-chain support (e.g., Ethereum bridge)

## 📄 License

MIT License - Built with 💙 by @soaryong for Sui Walrus Hackathon 2025

---

**Next Steps**: Run `npm install` in `/frontend` and `pip install -r requirements.txt` in `/backend/lambda`
