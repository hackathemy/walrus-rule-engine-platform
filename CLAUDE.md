# Walrus Insight Engine (@snorlax00x)

**Sui Walrus Hackathon Project**: Two-Sided AI Analytics Marketplace

## 🎯 Project Vision

**The first decentralized marketplace for AI analytics templates**, where:
- 🛠️ **Ruleset Creators** configure & sell analytics templates (configs on Walrus)
- 📊 **Ruleset Users** execute analytics on their data (multi-provider AI: Anthropic / Bedrock / Mock)
- ✅ All configurations are verifiable and immutable on Walrus (secured by Sui + Walrus)

### Why This Matters
- **For Creators**: Monetize expertise by configuring pre-built templates → Earn SUI per execution
- **For Users**: Access professional analytics without building in-house teams → Pay per use
- **For Everyone**: Transparent, verifiable results through blockchain + decentralized storage

## 🏗️ Platform Architecture

### Hybrid Two-Sided Marketplace

**Design Philosophy**: Template-based approach for security and cost efficiency

```
┌──────────────────────────────────────────────────────────────┐
│                  TEMPLATE CREATOR WORKFLOW                    │
├──────────────────────────────────────────────────────────────┤
│  1. Select pre-built template (e.g., Game Abuse Detection)  │
│  2. Configure parameters (thresholds, indicators)            │
│  3. Upload config to Walrus → Get blob_id                   │
│  4. Save to localStorage → Instant marketplace listing      │
│  5. Earn SUI when users execute                             │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                  RULESET USER WORKFLOW                        │
├──────────────────────────────────────────────────────────────┤
│  1. Browse marketplace (Gaming, DeFi, Social, IoT)          │
│  2. Upload data (CSV/JSON) → Walrus                         │
│  3. Select ruleset + Pay (creator fee + platform fee)       │
│  4. Backend executes → Real-time AI analysis                │
│  5. Receive analysis results → Display immediately          │
│  6. Execution history saved in localStorage                 │
└──────────────────────────────────────────────────────────────┘
```

### Realistic Technical Flow

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (Next.js)                                         │
│  - Browse marketplace (loads from localStorage + defaults) │
│  - Upload data to Walrus via backend                        │
│  - Create templates → localStorage → immediate listing     │
│  - Execute analysis via direct API call                     │
└────────────────────┬────────────────────────────────────────┘
                     │ Direct API call
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND SERVICE (Python Flask)                             │
│  http://localhost:8000                                      │
│                                                             │
│  POST /api/upload:                                          │
│  1. Receive multipart/form-data                            │
│  2. Upload to Walrus Publisher via HTTP PUT                │
│  3. Return actual blob_id + aggregator_url                 │
│                                                             │
│  POST /api/execute:                                         │
│  1. Receive: config_blob_id, data_blob_id, template_id    │
│  2. Download config from Walrus Aggregator                 │
│  3. Download data from Walrus Aggregator                   │
│  4. Create AI analysis prompt with template params         │
│  5. Call AI (auto-detect: Anthropic → Bedrock → Mock)     │
│     - Claude 3 Haiku (Anthropic API)                       │
│     - Claude 3.5 Sonnet (AWS Bedrock)                      │
│     - Mock AI (instant demo)                               │
│  6. Parse JSON response (summary, findings, etc.)          │
│  7. Return analysis results immediately                    │
│                                                             │
│  GET /api/blob/<blob_id>:                                  │
│  - Proxy read from Walrus Aggregator                       │
│  - Supports JSON, CSV, text formats                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  WALRUS STORAGE (Decentralized - Testnet)                  │
│  - Ruleset configs (actually uploaded, verifiable)          │
│  - User data (actually uploaded, retrievable)               │
│  - Aggregator URL: https://aggregator.walrus-testnet...    │
│  - Publisher URL: https://publisher.walrus-testnet...      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  CLIENT-SIDE STORAGE (localStorage)                         │
│  - custom_rulesets: Created templates with config_blob_id  │
│  - execution_history: Analysis results and metadata        │
│  - uploaded_datasets: Data files with blob_id references   │
└─────────────────────────────────────────────────────────────┘
```

### Security Model

**🛡️ No Arbitrary Code Execution**:
- ❌ Users CANNOT upload raw Python code
- ✅ Only pre-built, audited templates
- ✅ Users upload configuration JSON only
- ✅ Backend executes in isolated environment

**Pre-Built Templates**:
```python
# Example: Game Abuse Detection Template (backend-only)
class GameAbuseTemplate:
    def execute(self, config, data):
        # config: User-defined thresholds
        # data: Game telemetry from Walrus

        multi_account_threshold = config['multi_account_threshold']
        refund_limit = config['refund_velocity_limit']

        # Safe, sandboxed analysis
        results = analyze_abuse_patterns(
            data,
            multi_account_threshold,
            refund_limit
        )

        # Call AI for insights (Claude 3 Haiku or Mock AI)
        ai_prompt = generate_prompt(results)
        ai_analysis = ai_client.generate_text(ai_prompt)

        return {
            'flagged_users': results.suspicious_accounts,
            'confidence_scores': results.scores,
            'ai_insights': ai_analysis,
            'timestamp': datetime.now()
        }
```

## 🎨 Walrus + Sui Integration

### Why Walrus Storage?
| Feature | Benefit | Use Case |
|---------|---------|----------|
| **Content-Addressed** | SHA-256 verification | Prove ruleset code hasn't changed |
| **Decentralized** | No single point of failure | Game studios trust data permanence |
| **Cost-Efficient** | Pay once, store forever (epochs) | Rulesets live indefinitely |
| **Sui-Native** | Seamless Move contract integration | NFT metadata → Walrus blob_id |

### Why Sui Blockchain?
| Feature | Benefit | Use Case |
|---------|---------|----------|
| **Programmable NFTs** | Mutable metadata | Update ruleset pricing dynamically |
| **Low Fees** | Affordable for frequent analytics | Studios run daily reports |
| **Fast Finality** | <1s confirmation | Real-time fraud alerts |
| **Object Model** | Rich data structures | Complex marketplace logic |

## 💡 Core Features (MVP)

### 1. Template Library (Pre-Built, Audited)
**Platform provides secure, pre-built analytics templates**:

| Template ID | Category | Description | Configurable Parameters |
|-------------|----------|-------------|-------------------------|
| **game_abuse_detection** | Gaming | Multi-accounting, bot farms, refund fraud | `multi_account_threshold`, `refund_velocity_limit` |
| **defi_risk_analyzer** | DeFi | Lending risk, liquidity pool health | `collateral_ratio_min`, `liquidity_threshold` |
| **token_holder_segmentation** | DeFi | HODLers vs traders, wash trading | `holding_period_days`, `trade_frequency_threshold` |
| **social_sentiment_tracker** | Social | Real-time sentiment, trending topics | `sentiment_window_hours`, `min_mentions` |
| **iot_device_health** | IoT | Predictive maintenance, anomalies | `uptime_threshold`, `anomaly_sensitivity` |
| **game_anti_cheat** | Gaming | Speed hacks, aim bots, impossible scores | `kd_ratio_max`, `score_velocity_limit` |

**Security Model**:
- ✅ Templates are backend-only (no user code upload)
- ✅ Users only upload **configuration JSON** to Walrus
- ✅ Backend executes in isolated, sandboxed environment
- ✅ All configs and results publicly verifiable

### 2. Creator Workflow (Template Configuration)
**Creators earn by configuring templates**:

```json
// Example: Configure "game_abuse_detection" template
{
  "template_id": "game_abuse_detection",
  "name": "FPS Anti-Cheat for Battle Royale",
  "description": "Optimized for fast-paced FPS games",
  "config": {
    "multi_account_threshold": 3,        // Flag if >3 accounts from same IP
    "refund_velocity_limit": 5,          // Flag if >5 refunds in 24h
    "velocity_window_hours": 24,
    "min_playtime_before_refund": 2      // Hours
  },
  "price_per_execution": 2.5,            // SUI
  "creator": "0x..."
}

// Upload to Walrus → blob_id
// Mint RulesetNFT on Sui → Marketplace listing
```

### 3. User Workflow (Data + Execute)
**Users pay to execute templates on their data**:

```bash
# Step 1: Upload data to Walrus
user_data.csv → Walrus → data_blob_id

# Step 2: Select configured ruleset from marketplace
Browse → "FPS Anti-Cheat for Battle Royale" (2.5 SUI)

# Step 3: Execute via Sui transaction
Pay 2.5 SUI → Sui emits ExecutionRequest event
→ Backend listens → Downloads config + data
→ Executes template → Bedrock AI analysis
→ Uploads results → Walrus → result_blob_id
→ Mints Result NFT → User receives

# Step 4: View verifiable results
Download from Walrus → Verify SHA-256 hash on-chain
```

### 4. Verifiable Result NFTs
**Sui NFTs with Walrus-backed data**:
```move
struct RulesetNFT has key {
    id: UID,
    template_id: String,             // "game_abuse_detection"
    config_blob_id: String,          // Configuration on Walrus
    price: u64,                      // SUI per execution
    creator: address,
    total_executions: u64
}

struct ResultNFT has key {
    id: UID,
    user: address,
    ruleset_id: ID,                  // RulesetNFT used
    data_blob_id: String,            // User data on Walrus
    result_blob_id: String,          // Analysis results on Walrus
    executed_at: u64,
    payment_amount: u64              // SUI paid to creator
}
```

## 💰 Cost Structure & Economics

### Realistic Pricing Model
**Template-based approach enables predictable costs**:

| Template | AI Tokens | Cost (Anthropic) | Cost (Bedrock) | Creator Price | Platform Fee | Total User Cost |
|----------|-----------|------------------|----------------|---------------|--------------|-----------------|
| game_abuse_detection | ~10K tokens | $0.003 | $0.02 | 2.5 SUI | 0.5 SUI | 3 SUI |
| defi_risk_analyzer | ~8K tokens | $0.002 | $0.015 | 3 SUI | 0.5 SUI | 3.5 SUI |
| iot_device_health | ~5K tokens | $0.0015 | $0.01 | 1.8 SUI | 0.2 SUI | 2 SUI |

**AI Provider Pricing**:
- **Claude 3 Haiku (Anthropic)**: $0.25/$1.25 per MTok (input/output)
- **Claude 3.5 Sonnet (Bedrock)**: $3/$15 per MTok (input/output)
- **Mock AI**: $0/run (free demo/testing)

**Infrastructure**:
- Walrus storage: ~$0.01 per blob (negligible)
- Sui transaction fees: ~$0.001 (negligible)
- SUI price: ~$3 USD (testnet/demo purposes)

### Revenue Distribution
```
User pays 3 SUI to execute "game_abuse_detection"
├─ Creator receives: 2.5 SUI (83%)
├─ Platform fee: 0.5 SUI (17%)
│  ├─ AI cost: ~$0.003 (<1%)
│  └─ Platform profit: ~$1.50 (nearly all fee)
└─ Gas fees: <0.01 SUI (<1%)
```

### Scalability Economics
**Why template approach is sustainable**:
- ✅ **Predictable costs**: Pre-built templates have known token usage
- ✅ **No security overhead**: No need for sandboxing arbitrary code
- ✅ **Flexible pricing**: Choose Haiku (cheap) or Sonnet (powerful) based on needs
- ✅ **Enterprise ready**: AWS Bedrock for production deployments with compliance
- ✅ **Mock AI fallback**: Zero-cost demo mode for testing
- ✅ **Creator incentives**: Earn passive income without operational costs

**Alternative (arbitrary code) problems**:
- ❌ **Unpredictable costs**: User code could generate millions of tokens
- ❌ **Security costs**: Need expensive sandboxing infrastructure
- ❌ **Support burden**: Debug user-submitted code issues
- ❌ **Liability risks**: Malicious code, data breaches

## 🚀 Hackathon Tracks Alignment

### Primary Track: **AI × Data**
- ✅ **AI**: Multi-provider AI analysis (Anthropic API / AWS Bedrock / Mock AI)
- ✅ **Data**: Walrus stores configs + data (immutable, verifiable)
- ✅ **Marketplace**: Two-sided platform for template configurations
- ✅ **Real-Time Results**: Immediate AI analysis without blockchain delays
- ✅ **Enterprise Ready**: AWS Bedrock support for production deployments

### Why This Wins
- **Novel Use Case**: First template-based AI analytics marketplace
- **Technical Depth**: Hybrid architecture (on-chain + off-chain + storage)
- **Real-World Viability**: Sustainable economics, secure execution model
- **Scalability**: Domain-agnostic (Gaming, DeFi, Social, IoT)

## 📦 Tech Stack

### Backend
- **Python 3.11** (Flask server)
- **Multi-Provider AI**:
  - **Anthropic SDK** (Claude 3 Haiku - fast & cheap)
  - **AWS Bedrock SDK** (boto3 - Claude 3.5 Sonnet - enterprise)
  - **Mock AI Client** (Demo/testing fallback)
  - **Auto-detection**: Anthropic → Bedrock → Mock
- **Walrus HTTP API** (Publisher + Aggregator)

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
- **Flask** (Backend API server)
- **Sui CLI** (Contract deployment)
- **PM2** (Process management)
- **Vercel** (Frontend deployment)

## 🛠️ Implementation Roadmap

### Day 1: Backend Service + Templates (8h)
- [x] Set up Flask API server with CORS
- [x] Create template library (6 templates):
  - [x] `game_abuse_detection.py` (Gaming)
  - [x] `defi_risk_analyzer.py` (DeFi)
  - [x] `iot_device_health.py` (IoT)
  - [x] `game_anti_cheat.py` (Gaming)
  - [x] `token_holder_segmentation.py` (DeFi)
  - [x] `social_sentiment_tracker.py` (Social)
- [x] Implement AI integration (Claude 3 Haiku + Mock AI)
- [x] Implement Walrus HTTP API service (Publisher + Aggregator)
- [x] Create `/api/upload` and `/api/execute` endpoints

### Day 2: Blockchain Layer (8h)
- [ ] Write Move contracts:
  - [ ] `RulesetNFT` (template configs, marketplace listing)
  - [ ] `ResultNFT` (execution results, user-owned)
  - [ ] `Marketplace` (browse, execute, payment distribution)
  - [ ] `ExecutionRequest` event emitter
- [ ] Deploy to Sui Testnet
- [ ] Test event listener → backend execution flow
- [ ] Test payment distribution (creator + platform fee)

### Day 3: Frontend + Demo (8h)
- [ ] Build React dApp:
  - [ ] `/marketplace` - Browse configured rulesets
  - [ ] `/create` - Template configuration UI
  - [ ] `/execute` - Upload data + select ruleset
  - [ ] `/results/[id]` - View verifiable results
- [ ] Record demo video:
  - Part 1: Creator configures template → Lists on marketplace
  - Part 2: User uploads data → Executes → Receives results
  - Part 3: Verification → Download from Walrus → Verify hash

## 🎯 Success Metrics

### Technical Achievements
- ✅ **Marketplace Flow**: AI dev uploads ruleset → Studio executes → Payment sent
- ✅ **Verifiable Storage**: Rulesets + results on Walrus (SHA-256 verified)
- ✅ **Multi-Ruleset Execution**: Run 3+ rulesets in parallel on Bedrock
- ✅ **NFT Ownership**: Studios own analysis reports, AI devs own rulesets

### Hackathon Impact
- 🏆 **Novel Platform**: First AI analytics marketplace on Walrus/Sui
- 🏆 **Real Revenue Model**: AI devs earn SUI per execution (not just hackathon demo)
- 🏆 **Scalable Architecture**: Any game, any ruleset (not single-purpose tool)
- 🏆 **Community Value**: Open SDK for game studios & AI developers

## 📂 Repository Structure

```
ailrus/
├── backend/
│   ├── lambda/
│   │   ├── event_listener.py           # Listen to Sui ExecutionRequest events
│   │   ├── template_executor.py        # Load & execute templates securely
│   │   ├── walrus_client.py            # Upload/download blobs
│   │   ├── bedrock_client.py           # Call Claude 3.5 Sonnet
│   │   └── requirements.txt
│   ├── templates/                      # Pre-built analytics templates
│   │   ├── game_abuse_detection.py     # Gaming: Multi-account, refund fraud
│   │   ├── defi_risk_analyzer.py       # DeFi: Lending risk, liquidity
│   │   ├── iot_device_health.py        # IoT: Predictive maintenance
│   │   ├── social_sentiment.py         # Social: Real-time sentiment
│   │   ├── token_segmentation.py       # DeFi: Holder behavior analysis
│   │   └── game_anti_cheat.py          # Gaming: Speed hacks, aim bots
│   ├── configs/                        # Sample configurations
│   │   ├── fps_anti_cheat.json         # Example: FPS game tuning
│   │   ├── defi_lending_risk.json      # Example: Lending protocol
│   │   └── iot_factory_floor.json      # Example: Manufacturing IoT
│   ├── data/
│   │   └── sample_data.csv             # Test data
│   └── sam-template.yaml
├── contracts/
│   ├── sources/
│   │   ├── ruleset_nft.move            # Template configs (marketplace)
│   │   ├── result_nft.move             # Execution results (user-owned)
│   │   └── marketplace.move            # Execute, payment, events
│   └── Move.toml
├── frontend/
│   ├── app/
│   │   ├── page.tsx                    # Homepage (two-sided platform)
│   │   ├── marketplace/                # Browse configured rulesets
│   │   ├── create/                     # Configure templates (creators)
│   │   ├── execute/                    # Upload data + run (users)
│   │   └── results/[id]/               # View verifiable results
│   ├── components/
│   │   ├── TemplateSelector.tsx        # Choose template to configure
│   │   ├── ConfigEditor.tsx            # JSON config editor
│   │   ├── DataUploader.tsx            # Upload CSV/JSON to Walrus
│   │   └── ResultViewer.tsx            # Download & verify results
│   └── package.json
├── scripts/
│   ├── create-config.py                # Creator: Generate config JSON
│   ├── deploy-contracts.sh             # Deploy Move contracts
│   └── test-e2e.py                     # Full flow: config → execute → verify
├── CLAUDE.md                            # This file
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

### Part 1: Creator Configures Template (1 min)
```json
// Alice configures "game_abuse_detection" template for FPS games
{
  "template_id": "game_abuse_detection",
  "name": "FPS Anti-Cheat for Battle Royale",
  "description": "Optimized multi-account and refund fraud detection for fast-paced FPS",
  "config": {
    "multi_account_threshold": 3,      // Flag if >3 accounts from same IP
    "refund_velocity_limit": 5,        // Flag if >5 refunds in 24h
    "velocity_window_hours": 24,
    "min_playtime_before_refund": 2    // Hours
  },
  "price_per_execution": 2.5,          // SUI
  "creator": "0xAlice..."
}
```

```bash
# Upload config to Walrus
python scripts/create-config.py fps_anti_cheat.json
# Output: ✅ Uploaded to Walrus: config_blob_id = 0xCONF...

# Mint RulesetNFT on Sui (via frontend)
1. Connect wallet
2. Submit config_blob_id + price
3. ✅ Minted RulesetNFT: ruleset_id = 0xRULE...
4. 💰 Listed on marketplace at 2.5 SUI/execution
```

### Part 2: User Executes Ruleset (2 min)
```bash
# User (game studio) uploads data
1. Connect Sui wallet
2. Upload game_data.csv → Walrus
   ✅ Uploaded: data_blob_id = 0xDATA...

# Browse marketplace & select
3. Browse /marketplace → Find "FPS Anti-Cheat for Battle Royale"
4. Review config parameters (visible on Walrus)
5. Click "Execute" → Pay 2.5 SUI

# Backend execution (automatic)
6. Sui emits ExecutionRequest event
7. Lambda listener picks up event
8. Downloads config (0xCONF...) + data (0xDATA...) from Walrus
9. Loads template: game_abuse_detection.py
10. Executes with config parameters
11. Calls Bedrock AI for analysis
12. Uploads results to Walrus → result_blob_id = 0xRESULT...
13. Calls Sui: recordResult() → Mints ResultNFT to user
14. Transfers 2.5 SUI to Alice (creator)

# User receives ResultNFT (10s later)
✅ ResultNFT minted: result_id = 0xRES...
✅ View results: /results/0xRES...
```

### Part 3: View & Verify Results (30s)
```json
// Result JSON on Walrus (result_blob_id = 0xRESULT...)
{
  "ruleset_used": {
    "ruleset_id": "0xRULE...",
    "template_id": "game_abuse_detection",
    "config_blob_id": "0xCONF..."
  },
  "data_blob_id": "0xDATA...",
  "executed_at": "2025-11-20T15:45:30Z",
  "results": {
    "flagged_accounts": [
      {
        "user_id": "player_1234",
        "reason": "multi_account_detected",
        "confidence": 0.95,
        "details": "3 accounts from IP 192.168.1.1 within 24h"
      },
      {
        "user_id": "player_5678",
        "reason": "refund_velocity_exceeded",
        "confidence": 0.87,
        "details": "7 refunds in 24h, avg playtime <2h"
      }
    ],
    "total_flagged": 12,
    "bedrock_insights": "Analysis suggests coordinated abuse pattern...",
    "recommendations": [
      "Ban accounts from IP 192.168.1.1",
      "Review refund policy for <2h playtime"
    ]
  },
  "verification": {
    "sha256_hash": "0x7a8f3d2e...",
    "walrus_blob_id": "0xRESULT...",
    "sui_nft_id": "0xRES..."
  }
}
```

```bash
# Verification flow
1. Download results from Walrus (public aggregator)
2. Calculate SHA-256 hash locally
3. Compare with hash in ResultNFT on Sui
4. ✅ Verified: Results match on-chain record
5. Trust: "12 accounts flagged by verifiable AI analysis"
```

## 🎨 Frontend User Interface

### Page 1: Marketplace (`/marketplace`)
**Browse & discover analytics rulesets**

```
┌─────────────────────────────────────────────────────┐
│  🔍 Search Rulesets    [Anti-Cheat] [Balance] [All]│
├─────────────────────────────────────────────────────┤
│                                                     │
│  🛡️ Anti-Cheat Pro          by @alice    2 SUI     │
│  ⭐⭐⭐⭐⭐ (47 reviews)                               │
│  Detects speed hacks, aim bots, impossible scores  │
│  [View Details] [Add to Cart]                      │
│                                                     │
│  ⚖️ Balance Analyzer         by @bob      1.5 SUI   │
│  ⭐⭐⭐⭐☆ (23 reviews)                               │
│  Win rates, nerf/buff recommendations              │
│  [View Details] [Add to Cart]                      │
│                                                     │
│  📉 Churn Predictor          by @carol    3 SUI     │
│  ⭐⭐⭐⭐⭐ (89 reviews)                               │
│  ML-powered player retention risk scoring          │
│  [View Details] [Add to Cart]                      │
└─────────────────────────────────────────────────────┘
```

### Page 2: Creator Dashboard (`/create`)
**Configure templates & earn**

```
┌─────────────────────────────────────────────────────┐
│  🛠️ Configure Analytics Template                    │
├─────────────────────────────────────────────────────┤
│  Step 1: Select Template                           │
│  ○ game_abuse_detection (Gaming)                   │
│  ● game_anti_cheat (Gaming)                        │
│  ○ defi_risk_analyzer (DeFi)                       │
│  ○ iot_device_health (IoT)                         │
│                                                     │
│  Step 2: Configure Parameters                      │
│  Ruleset Name: [FPS Anti-Cheat for Battle Royale] │
│  Description:  [Speed hack & aim bot detection...] │
│                                                     │
│  📝 Template Parameters (JSON)                      │
│  {                                                  │
│    "kd_ratio_max": 5.0,                            │
│    "score_velocity_limit": 1000,                   │
│    "impossible_movement_threshold": 0.95           │
│  }                                                  │
│  [View Template Documentation]                     │
│                                                     │
│  Step 3: Set Price                                 │
│  Price per Execution: [2.5] SUI                    │
│                                                     │
│  [Upload Config to Walrus] → [Mint NFT on Sui]    │
│                                                     │
│  💰 Your Earnings                                   │
│  Total Executions: 47 | Revenue: 117.5 SUI        │
│  Top Config: FPS Anti-Cheat (23 runs)              │
└─────────────────────────────────────────────────────┘
```

### Page 3: Execute Dashboard (`/execute`)
**Upload data & run analytics**

```
┌─────────────────────────────────────────────────────┐
│  📊 Execute Analytics                               │
├─────────────────────────────────────────────────────┤
│  Step 1: Upload Your Data                          │
│  [📁 Drop CSV/JSON file or click to browse]        │
│  ✅ player_data.csv uploaded (2.3 MB)               │
│  Walrus blob_id: 0xDATA...                         │
│                                                     │
│  Step 2: Select Configured Rulesets                │
│  ☑️ FPS Anti-Cheat for Battle Royale (2.5 SUI)     │
│     Creator: @alice | 23 uses | ⭐4.9              │
│     [View Config] [View Template Docs]             │
│                                                     │
│  ☑️ DeFi Lending Risk Analyzer (3 SUI)             │
│     Creator: @bob | 156 uses | ⭐4.8               │
│     [View Config] [View Template Docs]             │
│                                                     │
│  Total Cost: 5.5 SUI                               │
│  [Connect Wallet] → [Pay & Execute]                │
│                                                     │
│  📋 Recent Results                                  │
│  Nov 20 | FPS Anti-Cheat        | [View Results]  │
│  Nov 19 | DeFi Risk + IoT       | [View Results]  │
└─────────────────────────────────────────────────────┘
```

### Page 4: Report Viewer (`/reports/[id]`)
**View & verify analysis results**

```
┌─────────────────────────────────────────────────────┐
│  📄 Analysis Report #0x123...                       │
├─────────────────────────────────────────────────────┤
│  Game: Battle Royale X                             │
│  Executed: Nov 16, 2025 10:30 AM                   │
│  Rulesets: Anti-Cheat Pro, Balance Analyzer        │
│                                                     │
│  🛡️ Anti-Cheat Results                              │
│  ⚠️ 12 flagged players (confidence >0.85)           │
│  Patterns: speed_hack (7), impossible_kd (5)       │
│  [Download Player List] [Export CSV]              │
│                                                     │
│  ⚖️ Balance Results                                 │
│  Overpowered: Sniper X (67% win rate)              │
│  Recommendation: Reduce damage by 15%              │
│  [View Full Report] [Download JSON]               │
│                                                     │
│  🔐 Verification                                    │
│  Walrus blob_id: 0xABC... ✅ Hash verified         │
│  Sui NFT: 0x123... ✅ On-chain ownership           │
│  [Download from Walrus] [Verify SHA-256]          │
└─────────────────────────────────────────────────────┘
```

### Page 5: Public Transparency (`/games/[game_id]`)
**Players view studio's published reports**

```
┌─────────────────────────────────────────────────────┐
│  🎮 Battle Royale X - Public Analytics              │
├─────────────────────────────────────────────────────┤
│  This Week's Reports (Published by Studio)         │
│                                                     │
│  Nov 16 | Anti-Cheat: 12 banned                    │
│  Nov 15 | Balance: Sniper nerfed 15%               │
│  Nov 14 | Churn: 8% at-risk players contacted      │
│                                                     │
│  🛡️ Anti-Cheat Transparency                         │
│  Total bans this month: 47                         │
│  All reports verifiable on Walrus + Sui            │
│  [Download Raw Data] [Verify Independently]        │
│                                                     │
│  💬 Player Trust Score: 9.2/10                      │
│  Based on: Active moderation, transparent data     │
└─────────────────────────────────────────────────────┘
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

## 📣 Social Media Strategy (@snorlax00x)

### Launch Tweet
```
🚀 Building the first AI analytics marketplace at #SuiOverflow!

Walrus Insight Engine = 3-sided platform:
🤖 AI devs: Create & sell rulesets (anti-cheat, balance, etc.)
🎮 Studios: Run analytics without data science teams
🔍 Players: Verify game fairness on-chain

Powered by @WalrusStorage + @SuiNetwork + AWS Bedrock

#WalrusHaulout #BuildOnSui
```

### Development Updates (Daily)
- Day 1: "Just uploaded first anti-cheat ruleset to Walrus! 🛡️"
- Day 2: "Marketplace smart contracts deployed to Sui Testnet! 💰"
- Day 3: "Live demo: Detected 12 cheaters in Battle Royale X 📊"

## 🔬 Advanced Features (Post-Hackathon)

### 1. Ruleset Staking & Governance
**Community-curated marketplace**:
- Studios stake SUI to "upvote" quality rulesets
- Top-rated rulesets get featured placement
- AI devs earn bonus rewards for high-quality work

### 2. Real-Time Analytics Webhooks
**Live game monitoring**:
- Lambda subscribes to game event streams
- Run rulesets on-demand (e.g., cheat detected mid-match)
- Auto-ban flagged players via webhook

### 3. Cross-Game Benchmarking
**Industry-wide insights**:
- Aggregate anonymized data across multiple games
- "Your churn rate: 15% (industry avg: 22%)"
- Walrus stores aggregated datasets (privacy-preserving)

### 4. AI-Generated Rulesets (Meta-AI)
**Bedrock creates new rulesets**:
- Studio describes problem: "Detect matchmaking exploitation"
- Bedrock generates custom Python ruleset + prompt
- Auto-upload to Walrus, mint NFT, list on marketplace

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
- **New Rulesets**: Create anti-cheat, balance, churn, economy, or custom analytics
- **Platform Features**: Marketplace UI, search/filtering, reputation systems
- **Integrations**: Unity SDK, Unreal Engine SDK, game engine plugins
- **Multi-Chain**: Ethereum L2s, other storage layers (IPFS, Arweave)

## 📄 License

MIT License - Built with 💙 by @snorlax00x for Sui Walrus Hackathon 2025

---

**Next Steps**: Run `npm install` in `/frontend` and `pip install -r requirements.txt` in `/backend/lambda`
