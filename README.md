# 🐋 Walrus Insight Engine

**Decentralized AI Analytics Marketplace on Sui + Walrus**

> Template-based AI analytics for gaming, DeFi, social, and IoT data

[![Sui](https://img.shields.io/badge/Sui-Testnet-blue)](https://sui.io)
[![Walrus](https://img.shields.io/badge/Walrus-Storage-green)](https://walrus.storage)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 What is Walrus Insight Engine?

**First two-sided marketplace for AI analytics templates on Walrus/Sui** 🚀

A decentralized platform where:

### For Template Creators:

1. 🛠️ **Configure Templates** → Select pre-built analytics (e.g., Gaming Abuse Detection)
2. ⚙️ **Set Parameters** → Customize thresholds and indicators
3. 💾 **Upload to Walrus** → Store configuration as immutable blob
4. 💰 **Earn SUI** → Get paid every time someone uses your configuration

### For Template Users:

1. 📊 **Upload Data** → Store CSV/JSON on Walrus (decentralized, verifiable)
2. 🛍️ **Browse Marketplace** → Find configured templates (Gaming, DeFi, Social, IoT)
3. ⚡ **Execute Analysis** → Run AI analysis on your data (powered by Claude 3)
4. 💎 **Get Results** → Receive verifiable results as NFTs on Sui

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│  TEMPLATE CREATOR WORKFLOW                                │
├──────────────────────────────────────────────────────────┤
│  1. Configure pre-built template (secure, audited)       │
│  2. Upload config to Walrus → blob_id                    │
│  3. Mint Ruleset NFT on Sui                              │
│  4. Earn 83% revenue per execution                       │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│  TEMPLATE USER WORKFLOW                                   │
├──────────────────────────────────────────────────────────┤
│  1. Upload data → Walrus                                 │
│  2. Select configured template from marketplace          │
│  3. Pay SUI (creator fee + platform fee)                │
│  4. Backend executes → Claude 3 Haiku analysis          │
│  5. Receive Result NFT → Verifiable on Walrus           │
└──────────────────────────────────────────────────────────┘
```

### Why Template-Based?

- ✅ **Secure**: No arbitrary code execution
- ✅ **Cost-Predictable**: Fixed token usage per template
- ✅ **Quality**: Pre-built, audited templates only
- ✅ **User-Friendly**: Configure JSON, not write code

---

## 📂 Documentation

| File                                         | Purpose                                                          |
| -------------------------------------------- | ---------------------------------------------------------------- |
| **[CLAUDE.md](CLAUDE.md)**                   | Complete project specification (architecture, features, roadmap) |
| **[DEPLOYMENT.md](DEPLOYMENT.md)**           | Deployment info (contract addresses, endpoints, config)          |
| **[DEMO_SCENARIO.md](DEMO_SCENARIO.md)**     | 5-minute demo script for presentation                            |
| **[AI_CLIENT_GUIDE.md](AI_CLIENT_GUIDE.md)** | AI integration guide (Anthropic API + AWS Bedrock)               |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Sui Wallet (Chrome extension)
- Anthropic API Key (https://console.anthropic.com)

### Installation

```bash
# Clone repository
git clone https://github.com/snorlax00x/walrus-insight-engine.git
cd walrus-insight-engine

# Backend setup
cd backend
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install

# Environment variables
cp .env.example .env
# Edit .env with your keys
```

### Environment Setup

**Root `.env`**:

```env
# Sui & Walrus
SUI_PRIVATE_KEY=suiprivkey...
WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space

# AI Provider (choose one)
ANTHROPIC_API_KEY=sk-ant-...                    # Option 1: Direct API (recommended)
ANTHROPIC_MODEL=claude-3-haiku-20240307         # Fast + cheap

# OR
AWS_ACCESS_KEY_ID=AKIA...                       # Option 2: AWS Bedrock
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=us.anthropic.claude-3-5-sonnet-20241022-v2:0

# Deployed Contracts (Sui Testnet)
SUI_PACKAGE_ID=0x5c34fe6013030c9b4214aa7753e95c153b0f51cd23691368fbd2254cb1a0f98f
SUI_PLATFORM_TREASURY=0x5ef1f3696cb275ddf50859c200a86e8a991978104933366c25b96c97951ae3c6
```

**Choosing Your AI Provider**:

1. **For Development/Testing**: No configuration needed! Mock AI auto-activates
2. **For Quick Production**: Add `ANTHROPIC_API_KEY` (easiest setup)
3. **For Enterprise**: Use AWS Bedrock with full AWS credentials

**Auto-Detection**: The backend automatically detects which credentials are available and uses the highest-priority provider: Anthropic API → AWS Bedrock → Mock AI

**Note**: If no AI provider keys are set, the platform automatically uses **Mock AI** for demo purposes. This allows you to test the full workflow without API costs. Mock AI generates realistic sample analysis results instantly.

### Run Locally

```bash
# Terminal 1: Backend
cd backend
. venv/bin/activate
python3 api_server.py
# → http://localhost:8000

# Terminal 2: Frontend
cd frontend
npm run dev
# → http://localhost:3001
```

---

## 💡 Pre-Built Templates

| Template                      | Category | Description                                   | Configurable Parameters                            |
| ----------------------------- | -------- | --------------------------------------------- | -------------------------------------------------- |
| **game_abuse_detection**      | Gaming   | Multi-accounting, refund fraud, bot detection | `multi_account_threshold`, `refund_velocity_limit` |
| **defi_risk_analyzer**        | DeFi     | Lending risk, liquidity pool health           | `collateral_ratio_min`, `liquidity_threshold`      |
| **token_holder_segmentation** | DeFi     | HODLers vs traders, wash trading              | `holding_period_days`, `trade_frequency_threshold` |
| **social_sentiment_tracker**  | Social   | Real-time sentiment, trending topics          | `sentiment_window_hours`, `min_mentions`           |
| **iot_device_health**         | IoT      | Predictive maintenance, anomaly detection     | `uptime_threshold`, `anomaly_sensitivity`          |
| **game_anti_cheat**           | Gaming   | Speed hacks, aim bots, impossible scores      | `kd_ratio_max`, `score_velocity_limit`             |

---

## 🎨 Key Features

### 1. Hybrid Two-Sided Marketplace

- **Creator Economy**: Earn 83% of execution fees
- **User Flexibility**: Browse 50+ configured templates
- **Quality Assurance**: Only audited templates allowed
- **Revenue Split**: 83% creator / 17% platform

### 2. Secure Template Execution

- **No Arbitrary Code**: Users upload config JSON only
- **Sandboxed Backend**: Isolated execution environment
- **Verifiable Results**: SHA-256 hashing on Walrus
- **Transparent Costs**: Fixed pricing per template

### 3. AI-Powered Analysis (Multi-Provider Support)

The platform supports **three AI providers** with automatic detection:

**Option 1: Anthropic API (Recommended for Quick Start)**
- **Claude 3 Haiku**: Fast, cost-effective ($0.25/$1.25 per MTok)
- **Setup**: Just add `ANTHROPIC_API_KEY` to `.env`
- **Best for**: Development, testing, simple deployments
- **Cost per execution**: ~$0.0004

**Option 2: AWS Bedrock (Enterprise-Grade)**
- **Claude 3.5 Sonnet**: More powerful model ($3/$15 per MTok)
- **Setup**: Add AWS credentials to `.env`
- **Best for**: Production, enterprise deployments, AWS integration
- **Benefits**: Enterprise security, AWS ecosystem integration, compliance
- **Cost per execution**: ~$0.02

**Option 3: Mock AI (Demo/Testing)**
- **Instant results**: No API calls, zero cost
- **Auto-activates**: When no API keys are configured
- **Best for**: Development, demos, testing workflows
- **Output**: Realistic structured JSON responses

**Auto-Detection Priority**: Anthropic API → AWS Bedrock → Mock AI

### 4. Blockchain Integration

- **Sui Smart Contracts**: Ruleset NFT + Result NFT
- **Walrus Storage**: Configs + data + results
- **Programmable NFTs**: Mutable metadata, dynamic pricing
- **Instant Settlement**: <1s transaction finality

---

## 📦 Project Structure

```
walrus-insight-engine/
├── CLAUDE.md                  # Complete project spec
├── DEPLOYMENT.md              # Deployment info
├── DEMO_SCENARIO.md           # Demo script
├── AI_CLIENT_GUIDE.md         # AI integration guide
├── README.md                  # This file
├── backend/
│   ├── lambda/
│   │   ├── ai_client.py              # Unified AI client (auto-detect)
│   │   ├── anthropic_client.py       # Anthropic API
│   │   ├── bedrock_client.py         # AWS Bedrock
│   │   ├── mock_ai_client.py         # Demo fallback
│   │   └── walrus_client.py          # Walrus upload/download
│   ├── templates/                    # Pre-built templates
│   │   ├── game_abuse_detection.py
│   │   ├── defi_risk_analyzer.py
│   │   ├── iot_device_health.py
│   │   └── ...
│   ├── api_server.py                 # Flask API server
│   └── test_ai_unified.py            # Test script
├── contracts/
│   └── sources/
│       ├── ruleset_nft.move          # Template configs
│       ├── result_nft.move           # Analysis results
│       └── marketplace.move          # Execute + payment
└── frontend/
    ├── app/
    │   ├── page.tsx                  # Homepage (two-sided)
    │   ├── marketplace/              # Browse templates
    │   ├── create/                   # Configure templates
    │   ├── upload/                   # Upload data
    │   └── execute/                  # Run analysis
    └── components/
```

---

## 🏆 Hackathon Demo

**5-Minute Flow** (Fully Working!):

### Part 1: Creator Side (90 sec)

```
1. Open http://localhost:3001/create
2. Connect Sui Wallet
3. Select "Gaming Abuse Detection" template
4. Configure parameters:
   - Multi-Account Threshold: 3
   - Refund Velocity Limit: 5
   - (Or use default values)
5. Set price: 2.5 SUI
6. Click "Upload Config to Walrus"
   ✅ Real Walrus upload (5-10 seconds)
   ✅ Returns actual config_blob_id
   ✅ Saves to localStorage for marketplace
7. Success! Template appears in Marketplace
```

### Part 2: User Side (2 min)

```
1. Open http://localhost:3001/upload
2. Upload game data CSV/JSON
   ✅ Real Walrus upload
   ✅ Returns actual data_blob_id
3. Go to http://localhost:3001/marketplace
4. Select your created template (or any template)
5. Click "Execute"
6. Select uploaded dataset
7. Click "Pay 2.5 SUI & Execute"
   ⏳ Real AI analysis (5-15 seconds)
   🤖 Calls AI API (Claude 3 Haiku or Claude 3.5 Sonnet via Bedrock)
   📊 Generates actual insights
8. View results:
   ✅ Summary
   ✅ Key Findings (with confidence scores)
   ✅ Recommendations
   ✅ Metadata (analyzed records, flagged items)
```

### Part 3: Verification (30 sec)

```
1. Check browser DevTools Console:
   - Walrus upload logs
   - AI analysis logs
2. Open localStorage:
   - custom_rulesets: Your created templates
   - execution_history: All analysis results
3. Visit Walrus Aggregator:
   https://aggregator.walrus-testnet.walrus.space/v1/{blob_id}
   ✅ Download config JSON
   ✅ Download data files
```

**Wow Moments**:

- ✅ **Real Walrus Integration**: Actual config & data uploads (not mock!)
- ✅ **Multi-Provider AI**: Supports Anthropic API, AWS Bedrock, and Mock AI with auto-detection
- ✅ **Actual AI Analysis**: Real insights from Claude 3 Haiku or Claude 3.5 Sonnet
- ✅ **Instant Results**: 5-15 second end-to-end execution
- ✅ **Verifiable Storage**: All configs & data on Walrus Testnet
- ✅ **Full Marketplace**: Create → List → Execute → Results flow works!
- ✅ **Enterprise Ready**: AWS Bedrock support for production deployments

---

## 💰 Economics

### Cost Structure

| Item               | Cost (Anthropic) | Cost (Bedrock) | Split                    |
| ------------------ | ---------------- | -------------- | ------------------------ |
| Template Execution | 2.5 SUI          | 2.5 SUI        | Creator: 2.08 SUI (83%)  |
|                    |                  |                | Platform: 0.42 SUI (17%) |
| AI Analysis        | ~$0.0004         | ~$0.02         | Included in platform fee |
| Walrus Storage     | ~$0.01           | ~$0.01         | One-time (epochs)        |
| Gas Fees           | <0.01 SUI        | <0.01 SUI      | User pays                |

**AI Provider Costs**:
- **Anthropic API**: Claude 3 Haiku ($0.25/$1.25 per MTok) → ~$0.0004 per execution
- **AWS Bedrock**: Claude 3.5 Sonnet ($3/$15 per MTok) → ~$0.02 per execution
- **Mock AI**: Free (demo/testing only)

### Revenue Potential

- **Creator**: Configure 10 templates → $500/month (100 uses each @ 2.5 SUI)
- **Platform**: 1000 executions/day → $30K/month (sustainable!)
- **Users**: Professional analytics at $7.50/run (vs $100+ consultants)

---

## 🎯 Hackathon Tracks

### Primary: **AI × Data**

- ✅ **AI**: Claude 3 Haiku template execution
- ✅ **Data**: Walrus stores configs + results (immutable, verifiable)
- ✅ **Marketplace**: Two-sided platform for template configurations

### Why This Wins

- 🏆 **Novel**: First template-based AI marketplace on Walrus/Sui
- 🏆 **Technical Depth**: Hybrid architecture (on-chain + off-chain + storage)
- 🏆 **Real Viability**: Sustainable economics, secure execution model
- 🏆 **Scalable**: Domain-agnostic (Gaming, DeFi, Social, IoT)
