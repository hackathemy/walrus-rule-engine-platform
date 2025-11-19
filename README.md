# 🐋 Walrus RuleEngine Platform

**The Decentralized Data Analysis Marketplace on Sui + Walrus**

> Upload data → Buy AI rulesets → Get verifiable insights → Trade as NFTs

[![Sui](https://img.shields.io/badge/Sui-Testnet-blue)](https://sui.io)
[![Walrus](https://img.shields.io/badge/Walrus-Storage-green)](https://walrus.storage)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 What is Walrus RuleEngine?

A **decentralized marketplace** where anyone can:

1. **📊 Upload Data** → Store CSV/JSON datasets on Walrus (verifiable, immutable)
2. **🤖 Buy Rulesets** → Purchase AI/SQL/Python analysis tools as NFTs
3. **⚡ Run Analysis** → Execute rulesets on your data (sandboxed, trustless)
4. **💎 Mint Results** → Get analysis outputs as tradeable NFT badges
5. **💰 Earn Revenue** → Creators earn 80% on every ruleset use

**First marketplace for AI analysis rulesets on Walrus/Sui** 🚀

---

## 🏗️ Architecture

```
┌─────────────┐
│ 1. DATA     │ User uploads CSV/JSON → Walrus Storage
└──────┬──────┘ Returns blob_id + content_hash
       │
       ▼
┌─────────────┐
│ 2. RULESET  │ Ruleset NFT (AI/SQL/Python)
│  MARKETPLACE│ Buy/Sell on Sui blockchain
└──────┬──────┘ Revenue split: 80% creator, 10% platform, 10% stakers
       │
       ▼
┌─────────────┐
│ 3. EXECUTE  │ AWS Lambda runs sandboxed analysis
│   ENGINE    │ Fetches data + ruleset from Walrus
└──────┬──────┘ Stores result → Walrus
       │
       ▼
┌─────────────┐
│ 4. OUTPUT   │ AnalysisResult NFT (verifiable, tradeable)
│     NFT     │ Proves analysis was executed correctly
└─────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Sui CLI
- AWS Account (Bedrock access)

### Installation

```bash
# Clone repository
git clone https://github.com/soaryong/walrus-ruleengine.git
cd walrus-ruleengine

# Backend setup
cd backend/lambda
pip install -r requirements.txt

# Frontend setup
cd ../../frontend
npm install

# Deploy Sui contracts
cd ../contracts
sui move build
sui client publish --gas-budget 100000000
```

### Environment Variables

**backend/lambda/.env**:
```env
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.mystenlabs.com
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.mystenlabs.com
```

**frontend/.env.local**:
```env
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.mystenlabs.com
NEXT_PUBLIC_RULESET_PACKAGE_ID=0x...
NEXT_PUBLIC_INSIGHT_PACKAGE_ID=0x...
```

---

## 📦 Project Structure

```
ailrus/
├── PLATFORM.md          # Detailed platform vision
├── CLAUDE.md            # Original project spec
├── backend/
│   └── lambda/
│       ├── bedrock_analyzer.py    # AI ruleset execution
│       ├── ruleset_executor.py    # Main execution engine
│       ├── data_uploader.py       # Data validation & upload
│       └── walrus_uploader.py     # Walrus storage client
├── contracts/
│   └── sources/
│       ├── ruleset_nft.move       # Ruleset NFT + marketplace
│       ├── analysis_result.move   # Result NFT + datasets
│       └── insight_nft.move       # Original insight NFT
└── frontend/
    ├── app/
    │   ├── page.tsx               # Landing page
    │   ├── marketplace/           # Ruleset marketplace
    │   ├── upload/                # Data upload (coming soon)
    │   └── analytics/             # Run analysis (coming soon)
    └── components/
        ├── InsightCard.tsx
        └── MintButton.tsx
```

---

## 💡 Key Features

### 1. Ruleset Marketplace
- **Buy & Sell**: Trade analysis rulesets as NFTs
- **Categories**: Gaming, DeFi, IoT, Social Media
- **Types**: AI Prompts, SQL Queries, Python Scripts (sandboxed)
- **Versioning**: Upgrade rulesets, early buyers get discounts

### 2. Verifiable Data Storage
- **Walrus-Powered**: Decentralized, content-addressed storage
- **Immutable**: SHA-256 hashing for tamper-proof data
- **Provenance**: Track data lineage from source to result
- **Access Control**: Public, Private, or Paid datasets

### 3. AI Analysis Engine
- **AWS Bedrock**: Claude 3.5 Sonnet for AI rulesets
- **Sandboxed Execution**: Secure Python/SQL runners
- **Real-time**: Sub-5s analysis for most datasets
- **Scalable**: Auto-scaling Lambda infrastructure

### 4. Revenue Sharing
- **80%** to ruleset creator
- **10%** to platform
- **10%** to $RULE stakers (future)
- **Automatic**: Smart contract-enforced splits

---

## 🎨 Use Cases

### Gaming Studios
```
Problem: Need to identify whales and prevent churn
Solution:
1. Upload player data → Walrus
2. Buy "Whale Detector Pro" (50 SUI)
3. Run analysis → Get insights NFT
4. Use insights to improve retention
```

### DeFi Protocols
```
Problem: Assess lending risk for new users
Solution:
1. Upload on-chain activity data
2. Buy "DeFi Risk Scorer" (150 SUI)
3. Get risk scores for each address
4. Auto-adjust lending limits
```

### Data Scientists
```
Problem: Want to monetize analysis expertise
Solution:
1. Create "Churn Prediction" ruleset
2. Mint as NFT, list for 75 SUI
3. Earn 60 SUI per sale (80%)
4. Passive income from every use
```

---

## 🏆 Hackathon Demo

**Story**: "Decrypt for Data Analytics"

1. **Upload**: Game studio uploads player spending data
2. **Browse**: Find "Whale Detector Pro" in marketplace
3. **Purchase**: Buy ruleset for 50 SUI
4. **Execute**: Run AI analysis (live on testnet)
5. **Mint**: Get AnalysisResult NFT
6. **Verify**: Anyone can verify result on Walrus
7. **Revenue**: Creator earns 40 SUI (80% of 50 SUI)

**Wow Moments**:
- Live Sui transaction during demo
- Real Walrus blob upload/download
- Instant NFT minting
- Revenue split in real-time
- Public verification of results

---

## 📊 Roadmap

### Phase 1: MVP (3 Weeks) ✅
- [x] Data upload to Walrus
- [x] Ruleset NFT smart contract
- [x] Marketplace frontend
- [x] AI ruleset execution
- [ ] SQL/Python sandboxing
- [ ] Revenue distribution

### Phase 2: Growth (3 Months)
- [ ] $RULE token launch
- [ ] Governance DAO
- [ ] Advanced analytics dashboard
- [ ] Multi-chain data support
- [ ] API for developers

### Phase 3: Scale (6 Months)
- [ ] Enterprise partnerships
- [ ] White-label solutions
- [ ] Real-time streaming data
- [ ] ML model fine-tuning
- [ ] Mobile apps

---

## 🤝 Contributing

This is a hackathon project, but PRs welcome for:
- New ruleset templates
- Frontend improvements
- Security audits
- Documentation

---

## 📄 License

MIT License - Built with 💙 by [@soaryong](https://twitter.com/soaryong)

---

## 🔗 Links

- **Demo**: [ruleengine.walrus.site](https://ruleengine.walrus.site)
- **Docs**: [PLATFORM.md](PLATFORM.md)
- **Twitter**: [@soaryong](https://twitter.com/soaryong)
- **Hackathon**: Sui Walrus Haulout / Sui Overflow 2025

---

**⭐ Star this repo if you find it useful!**

---

## 📞 Contact

Questions? Reach out:
- Twitter: [@soaryong](https://twitter.com/soaryong)
- Email: soaryong@example.com
- Discord: Sui Dev Community

**Built for Sui Walrus Hackathon 2025** 🐋⚡
