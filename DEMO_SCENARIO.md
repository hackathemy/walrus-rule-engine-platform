# Walrus Insight Engine - Demo Scenario (3-5분)

## 🎬 데모 개요
**목표**: 양방향 AI 분석 마켓플레이스의 핵심 가치 전달
- 템플릿 제작자가 수익을 얻는 방법
- 사용자가 데이터를 분석하는 방법
- Walrus + Sui를 통한 검증 가능한 결과

---

## ⚡ Quick Setup (5분 전 필수!)

### 1. 서버 실행 확인
```bash
# Backend (Terminal 1)
cd backend
. venv/bin/activate
python api_server.py
# ✅ http://localhost:8000에서 실행 중

# Frontend (Terminal 2)
cd frontend
npm run dev
# ✅ http://localhost:3001에서 실행 중
```

### 2. AI Provider 확인 (3가지 옵션)
**자동 감지 순서**: Anthropic API → AWS Bedrock → Mock AI

- ✅ **Option 1 - Anthropic API**: .env에 `ANTHROPIC_API_KEY` 설정 (Claude 3 Haiku)
- ✅ **Option 2 - AWS Bedrock**: .env에 AWS credentials 설정 (Claude 3.5 Sonnet)
- ✅ **Option 3 - Mock AI**: API 키 없으면 자동 활성화 (즉시 결과 생성, 비용 $0)
- 💡 데모 추천: Mock AI (안정적이고 즉시 실행)

### 3. 브라우저 준비
```bash
# 브라우저에서 열기
http://localhost:3001
```

**✅ 준비 완료! 이제 데모를 시작할 수 있습니다.**

---

## 🎯 데모 구조 (5분)

### Part 1: 플랫폼 소개 (30초)
### Part 2: 사용자 플로우 - 데이터 업로드 (1분)
### Part 3: 마켓플레이스 & 실행 (1.5분)
### Part 4: 제작자 플로우 - 템플릿 설정 (1.5분)
### Part 5: 핵심 가치 & 마무리 (30초)

---

## 📝 상세 시나리오

### Part 1: 플랫폼 소개 (30초)

**화면**: Homepage (`http://localhost:3001`)

**말할 내용**:
```
"Walrus Insight Engine은 AI 분석 템플릿의 양방향 마켓플레이스입니다.

왼쪽: 게임 스튜디오나 DeFi 프로토콜 같은 사용자는
      데이터를 업로드하고 분석을 실행합니다.

오른쪽: AI 개발자나 데이터 분석가는
      템플릿을 설정하고 실행당 수익을 얻습니다.

모든 결과는 Walrus Storage에 저장되고
Sui 블록체인으로 검증 가능합니다."
```

**액션**:
1. 홈페이지 스크롤하며 두 플로우 보여주기
2. "Explore Marketplace" 또는 "Start Creating" 버튼 강조
3. 통계 섹션 보여주기 (15+ Template Categories, 100% Verifiable Results)

---

### Part 2: 사용자 플로우 - 데이터 업로드 (1분)

**화면**: Upload Page (`/upload`)

**말할 내용**:
```
"먼저 사용자 플로우를 보겠습니다.
게임 스튜디오가 플레이어 데이터를 분석하고 싶다고 가정해봅시다.

1단계: 데이터를 Walrus Storage에 업로드합니다.
CSV 또는 JSON 형식을 지원하고,
백엔드가 실제로 Walrus Publisher API를 통해 업로드합니다.
업로드하면 영구적인 blob_id를 받게 됩니다."
```

**액션**:
1. "Upload Your Data" 섹션 보여주기
2. Drag & Drop 영역 강조
3. 파일 선택 (실제 CSV/JSON 파일)
4. **실제 업로드 진행**:
   - 백엔드 `/api/upload` 엔드포인트 호출
   - Walrus Publisher에 실제 업로드 (5-10초)
   - FormData로 multipart/form-data 전송
5. 업로드 완료 화면 보여주기
   - **실제 Walrus blob_id** 표시 (예: `8KbJsT7...`)
   - 파일 크기, 날짜 정보
   - Walrus aggregator URL (실제 다운로드 가능)
   - localStorage에 저장 (데이터셋 목록에서 재사용)

**스크린샷 포인트**:
- 📤 Drag & Drop 인터페이스
- ⏳ 업로드 진행 중 (실제 Walrus 통신)
- ✅ 업로드 완료 (실제 blob_id + aggregator URL + stats)

---

### Part 3: 마켓플레이스 & 실행 (1.5분)

**화면**: Marketplace (`/marketplace`)

**말할 내용**:
```
"2단계: 마켓플레이스에서 원하는 분석 템플릿을 선택합니다.

여기 게이밍 카테고리를 보면,
'FPS Anti-Cheat'는 멀티 어카운트와 환불 사기를 감지합니다.
2.5 SUI에 67번 사용됐고, 4.9점 평가를 받았네요.

이 템플릿은 @alice가 설정한 것으로,
game_abuse_detection이라는 사전 제작된 템플릿을 기반으로 합니다.
Alice는 FPS 게임에 최적화된 파라미터를 설정했습니다."
```

**액션**:
1. 카테고리 필터 보여주기 (Gaming, DeFi, Social, IoT)
2. 게이밍 카테고리 선택
3. "FPS Anti-Cheat" 카드 클릭하여 강조
4. 카드 정보 설명:
   - 이름 & 설명
   - 가격 (2.5 SUI)
   - 사용 횟수 (67 uses)
   - 평점 (4.9★)
   - 제작자 (@alice)
   - 템플릿 ID (game_abuse_detection)

**말할 내용 (계속)**:
```
"Connect Wallet을 하고 Execute 버튼을 눌러봅시다."
```

**액션**:
5. Connect Wallet 클릭 (지갑 연결 화면 보여주기)
6. Execute 버튼 클릭
7. **실행 모달 표시**:
   - 선택된 템플릿 정보
   - 비용 (2.5 SUI)
   - 업로드된 데이터셋 목록 보여주기

**말할 내용 (모달)**:
```
"이제 어떤 데이터로 분석을 실행할지 선택합니다.
아까 업로드한 'Player Data Q4 2024'를 선택하고,
2.5 SUI를 지불하면 실시간 AI 분석이 시작됩니다.

백엔드는 자동으로:
1. Walrus에서 템플릿 설정(config_blob_id)과 데이터(data_blob_id)를 다운로드
2. AI 분석 실행 (자동 감지: Anthropic API → AWS Bedrock → Mock AI)
   - Claude 3 Haiku (Anthropic), Claude 3.5 Sonnet (Bedrock), 또는 Mock AI
   - 템플릿 파라미터와 사용자 데이터를 프롬프트에 포함
   - 구조화된 JSON 응답 생성
3. 분석 결과를 즉시 반환 (Walrus에 저장하지 않음)
4. 프론트엔드에서 결과 표시:
   - 요약 (Summary)
   - 핵심 발견사항 (Key Findings with confidence scores)
   - 추천사항 (Recommendations)
   - 메타데이터 (분석 레코드 수, 플래그된 항목 수)

이 과정은 약 5-15초 정도 걸립니다.

💡 데모 팁: API 키 없이도 Mock AI로 즉시 실행 가능합니다."
```

**액션**:
8. 데이터셋 선택 (라디오 버튼 클릭)
9. "Pay 2.5 SUI & Execute" 버튼 클릭
10. 실행 중 스피너 보여주기
11. 완료 알림 표시 (실제 AI 분석 결과):
    ```
    ✅ Analysis Complete!

    Template: FPS Anti-Cheat for Battle Royale
    Dataset: Player Data Q4 2024
    Cost: 2.5 SUI

    📊 Summary:
    Analysis detected 3 suspicious patterns in player behavior data.

    🔍 Key Findings:
    • multi_account_detected: 3 accounts from same IP (95% confidence)
    • refund_velocity_exceeded: 7 refunds in 24h (87% confidence)
    • impossible_playtime: <2h average before refund (92% confidence)

    💡 Recommendations:
    • Ban accounts from IP 192.168.1.1
    • Review refund policy for <2h playtime
    • Implement IP-based rate limiting

    📈 Metadata:
    • Analyzed Records: 1,247
    • Flagged Items: 12

    🎉 Result NFT minted and analysis complete!
    ```
12. localStorage에 실행 이력 자동 저장 (execution_history)

**스크린샷 포인트**:
- 🎯 마켓플레이스 카드 (템플릿 정보)
- 📊 실행 모달 (데이터셋 선택)
- ⏳ 실행 중 (스피너 + "Executing..." 상태)
- ✅ 실행 완료 (실제 AI 분석 결과: Summary, Findings, Recommendations, Metadata)

---

### Part 4: 제작자 플로우 - 템플릿 설정 (1.5분)

**화면**: Create Page (`/create`)

**말할 내용**:
```
"이제 반대편 플로우를 보겠습니다.
AI 개발자나 데이터 분석가가 어떻게 수익을 얻는지 봅시다.

중요한 점: 사용자는 임의의 코드를 업로드할 수 없습니다.
보안을 위해, 플랫폼이 제공하는 사전 제작된 템플릿만 사용 가능합니다.

제작자는 이 템플릿의 '설정'만 조정할 수 있습니다."
```

**액션**:
1. "Step 1: Select Template" 화면 보여주기
2. 카테고리별 템플릿 라이브러리 보여주기 (6개 템플릿):
   - 🎮 Gaming: game_abuse_detection, game_anti_cheat
   - 💰 DeFi: defi_risk_analyzer, token_holder_segmentation
   - 🐦 Social: social_sentiment_tracker
   - 📡 IoT: iot_device_health

**말할 내용 (계속)**:
```
"Alice가 'game_anti_cheat' 템플릿을 선택했다고 가정해봅시다.
이 템플릿은 스피드 핵, 에임봇, 불가능한 점수를 감지합니다.

템플릿을 선택하면 Step 2로 자동 이동합니다.
Alice는 MOBA 게임에 최적화하기 위해 파라미터를 조정합니다:"
```

**액션**:
3. "game_anti_cheat" 템플릿 카드 클릭 (카테고리 배지, 아이콘, 설명 보여주기)
4. **Step 2: Configure Parameters** 화면으로 자동 전환
5. 설정 JSON 에디터 보여주기:
```json
{
  "kd_ratio_max": 8.0,
  "score_velocity_limit": 1500,
  "impossible_movement_threshold": 0.92,
  "headshot_percentage_max": 75
}
```

**말할 내용 (설정 설명)**:
```
"kd_ratio_max: 8.0 이상이면 의심
score_velocity_limit: 초당 1500점 이상 획득 불가능
impossible_movement_threshold: 92% 신뢰도로 불가능한 움직임 감지
headshot_percentage_max: 헤드샷 비율 75% 이상 의심

Alice는 MOBA 게임 특성에 맞게 이 값들을 조정했습니다."
```

**액션**:
6. 파라미터 슬라이더로 값 조정 (인터랙티브하게 보여주기)
7. Ruleset Name 입력: "MOBA Anti-Cheat Pro"
8. Description 입력: "Optimized for MOBA games with higher KD tolerance"
9. 가격 설정: 2.0 SUI
10. Configuration JSON 미리보기 확인
11. **"Upload Config to Walrus" 버튼 클릭**

**말할 내용 (업로드 과정)**:
```
"이제 Alice가 이 설정을 업로드하면:

1. 설정 JSON을 생성:
   {
     "template_id": "game_anti_cheat",
     "name": "MOBA Anti-Cheat Pro",
     "description": "Optimized for MOBA games...",
     "config": {파라미터 설정},
     "price_per_execution": 2.0,
     "creator": "0xAlice..."
   }

2. 백엔드 /api/upload로 전송
3. 실제 Walrus Publisher에 업로드 (5-10초)
4. 실제 config_blob_id 받기 (예: 8KbJsT7...)
5. localStorage에 저장 (custom_rulesets)
6. 마켓플레이스에서 즉시 사용 가능

이후 누군가 이 룰셋을 실행할 때마다,
Alice는 2.0 SUI를 받게 됩니다. (83% = 약 1.66 SUI)
플랫폼 수수료 17%는 서버 비용과 AI 비용으로 사용됩니다."
```

**액션**:
12. 업로드 진행 스피너 표시
13. **Step 3: Upload & Mint 완료 화면** 자동 전환
14. 결과 표시 (실제 Walrus 업로드 결과):
    ```
    ✅ Config uploaded to Walrus
    blob_id: 8KbJsT7hN2vP4xQ9...actual_walrus_blob_id

    ✅ RulesetNFT minted
    NFT ID: 0x1701234567...

    ✅ Listed on Marketplace
    Price: 2.0 SUI per execution

    💰 Estimated Earnings:
    If executed 10 times: 16.6 SUI (83% revenue share)

    🔗 Walrus Aggregator URL:
    https://aggregator.walrus-testnet.walrus.space/v1/8KbJsT7...
    (실제 다운로드 가능한 링크)
    ```
15. "Go to Marketplace" 버튼 클릭 → 마켓플레이스로 이동
16. 방금 생성한 템플릿이 목록 **맨 위**에 표시됨 (custom_rulesets가 먼저 로드)

**스크린샷 포인트**:
- 🛠️ Step 1: 템플릿 라이브러리 (카테고리별 6개 템플릿)
- ⚙️ Step 2: 파라미터 설정 (슬라이더 + JSON 미리보기)
- 💰 Step 2: 가격 설정 및 수익 계산기
- ✅ Step 3: 업로드 & Mint 완료 (config_blob_id + NFT ID + 예상 수익)

---

### Part 5: 핵심 가치 & 마무리 (30초)

**화면**: 다시 Homepage 또는 Marketplace

**말할 내용**:
```
"Walrus Insight Engine의 핵심 가치:

1. 제작자: 전문성을 수익화 - 코드 없이 설정만으로 수익 창출
2. 사용자: 전문 분석 활용 - 데이터 과학 팀 없이도 고급 분석
3. 투명성: 모든 결과는 Walrus Storage에 영구 저장되고
          Sui 블록체인으로 검증 가능합니다.

보안: 사전 제작된 템플릿만 사용하므로
      임의 코드 실행 위험이 없습니다.

기술 스택:
- Sui 블록체인 (NFT & 결제)
- Walrus Storage (탈중앙화 저장)
- AI 분석 (Claude 3 Haiku / Mock AI)
- Next.js 14 + TypeScript (Frontend)
- Python Flask (Backend API)

GitHub: github.com/snorlax00x/walrus-insight-engine
Demo: [live demo URL]

Thank you!"
```

**액션**:
1. 플랫폼 통계 카드 보여주기:
   - 6개 템플릿
   - 714번 실행
   - 4.7★ 평균 평점
   - 4개 카테고리

2. (선택사항) Sui Explorer에서 배포된 컨트랙트 보여주기:
   - Package ID: `0x5c34fe6...`

---

## 🎥 촬영 팁

### 화면 녹화 설정
```
Resolution: 1920x1080 (Full HD)
FPS: 30fps
Browser: Chrome (개발자 도구 끄기)
창 크기: 전체 화면 또는 1440x900
```

### 브라우저 준비
```
1. 캐시 클리어
2. 불필요한 탭 닫기
3. 북마크 바 숨기기
4. 확장 프로그램 비활성화
5. 시크릿 모드 (선택사항)
```

### 데모 데이터 준비
```
1. 백엔드 서버 실행 확인 (localhost:8000)
2. 프론트엔드 서버 실행 확인 (localhost:3001)
3. Mock AI 자동 활성화 확인 (API 키 없어도 OK)
4. (선택) Sui 지갑 연결 - UI 시연용만 필요
5. (선택) 샘플 CSV 파일 - Mock blob_id로 대체 가능
```

**💡 데모 팁**: 실제 업로드/트랜잭션 없이 Mock 데이터로 전체 플로우 시연 가능!

---

## 📊 시간 배분 (5분 기준)

| Part | 내용 | 시간 | 누적 |
|------|------|------|------|
| 1 | 플랫폼 소개 | 30s | 0:30 |
| 2 | 데이터 업로드 | 1:00 | 1:30 |
| 3 | 마켓플레이스 & 실행 | 1:30 | 3:00 |
| 4 | 템플릿 설정 | 1:30 | 4:30 |
| 5 | 마무리 | 30s | 5:00 |

---

## 🎤 음성 녹음 대본 (영어)

### Opening (30s)
```
Hi, I'm presenting Walrus Insight Engine -
a two-sided marketplace for AI analytics templates.

On one side, game studios and DeFi protocols upload data
and execute professional analytics.

On the other side, AI developers configure templates
and earn royalties per execution.

All results are stored on Walrus Storage
and verified on Sui blockchain.

Let's see how it works.
```

### User Flow - Upload (1min)
```
First, the user flow.

Let's say a game studio wants to analyze player behavior.

Step 1: Upload data to Walrus Storage.

We support CSV and JSON files.
Once uploaded, you receive a permanent blob_id.

Here I'm uploading "Player Data Q4 2024" - 2.3 MB.

Done! The file is now stored on Walrus with blob_id walrus_001.
```

### Marketplace & Execute (1.5min)
```
Step 2: Browse the marketplace.

Here's the Gaming category.

"FPS Anti-Cheat" detects multi-accounting and refund fraud.
It costs 2.5 SUI, has 67 uses, and 4.9 star rating.

This template was configured by @alice
based on the pre-built "game_abuse_detection" template.
She optimized the parameters for FPS games.

Let me connect my wallet and click Execute.

Now I select which dataset to analyze.
I'll choose "Player Data Q4 2024" that we just uploaded.

Pay 2.5 SUI and Execute.

The backend automatically:
1. Downloads the template config and data from Walrus using their blob_ids
2. Runs real-time AI analysis with auto-detection:
   - Claude 3 Haiku (Anthropic API - fast & cheap)
   - Claude 3.5 Sonnet (AWS Bedrock - enterprise-grade)
   - Mock AI (demo/testing - instant & free)
3. Returns structured results immediately - no Walrus storage needed
4. Frontend displays the analysis:
   - Summary of findings
   - Key patterns with confidence scores
   - Actionable recommendations
   - Metadata about analyzed records

This takes about 5-15 seconds with real AI, or instant with Mock AI.

Done! Here are the actual AI insights:
- 3 suspicious patterns detected
- 12 players flagged with confidence scores
- Specific recommendations for action

The execution history is saved in localStorage for reference.

Note: The demo works instantly with Mock AI if no API keys are configured.
```

### Creator Flow - Configure (1.5min)
```
Now let's see the creator side.

Important: Users cannot upload arbitrary code for security.
Only pre-built, audited templates are available.

Creators can only configure template parameters.

Alice selects "game_anti_cheat" template,
which detects speed hacks, aim bots, and impossible scores.

She's optimizing it for MOBA games:

kd_ratio_max: 8.0 - flag if kill/death ratio exceeds 8
score_velocity_limit: 1500 points per second maximum
impossible_movement_threshold: 92% confidence
headshot_percentage_max: 75% maximum

She names it "MOBA Anti-Cheat Pro"
and sets the price at 2.0 SUI.

When Alice uploads:
1. Config JSON is created with template parameters
2. Sent to backend /api/upload endpoint
3. Actually uploaded to Walrus Publisher (5-10 seconds)
4. Real config_blob_id is returned
5. Saved to browser localStorage (custom_rulesets)
6. Listed on marketplace automatically - appears at the top!

You can verify the upload by visiting the Walrus Aggregator URL
and downloading the actual config JSON.

Now, every time someone executes this ruleset,
Alice earns 2.0 SUI (83% = ~1.66 SUI).
17% platform fee covers server and AI costs.
```

### Closing (30s)
```
Walrus Insight Engine's key value:

For Creators: Monetize expertise without coding
For Users: Access professional analytics without data science teams
For Everyone: Transparent, verifiable results on-chain

Security: Pre-built templates only - no arbitrary code execution

Tech Stack:
- Sui blockchain for NFTs and payments
- Walrus Storage for decentralized data
- Multi-Provider AI: Anthropic API, AWS Bedrock, or Mock AI
- Next.js 14 + Python Flask

AI Options:
- Claude 3 Haiku via Anthropic API (fast & cheap)
- Claude 3.5 Sonnet via AWS Bedrock (enterprise-grade)
- Mock AI for instant demos (zero cost)

Live on Sui Testnet.
Works instantly with Mock AI - no API keys needed for demo!

Check out our GitHub for more details.

Thank you!
```

---

## 📸 스크린샷 체크리스트

촬영 중 꼭 캡처해야 할 화면들:

### Homepage (/)
- [ ] Hero section with CTA buttons ("Start Creating", "Explore Marketplace")
- [ ] Stats section (15+ Template Categories, 100% Verifiable Results)
- [ ] Problem/Solution comparison cards

### Upload Page (/upload)
- [ ] Drag & drop interface (파일 드롭 영역)
- [ ] File upload progress (스피너 또는 프로그레스 바)
- [ ] Upload success - **실제 Walrus blob_id** + file stats displayed
- [ ] Walrus Aggregator URL (실제 다운로드 가능한 링크)

### Marketplace (/marketplace)
- [ ] Category filters (Gaming, DeFi, Social, IoT, All)
- [ ] Template cards with ratings, prices, usage count
- [ ] **Custom rulesets** 표시 (localStorage에서 로드, 맨 위에 나타남)
- [ ] Execute modal - template info
- [ ] Execute modal - dataset selection (radio buttons)
- [ ] Execute modal - payment confirmation UI
- [ ] Execute in progress - 스피너 + "Executing..." 상태
- [ ] Success alert - **실제 AI 분석 결과** 표시:
  - Summary (요약)
  - Key Findings with confidence scores (핵심 발견사항 + 신뢰도)
  - Recommendations (추천사항)
  - Metadata (analyzed_records, flagged_items)

### Create Page (/create)
- [ ] **Step 1**: Template library (6개 템플릿, 카테고리 배지)
- [ ] **Step 1**: Template card hover state
- [ ] **Step 2**: Parameter sliders/inputs (실시간 JSON 업데이트)
- [ ] **Step 2**: Configuration JSON preview (실제 업로드될 config)
- [ ] **Step 2**: Price setting + revenue calculator
- [ ] **Step 2**: "Upload Config to Walrus" button
- [ ] Upload in progress - 스피너 + "Uploading to Walrus..." (5-10초)
- [ ] **Step 3**: Upload & Mint success screen
- [ ] **Step 3**: **실제 Walrus blob_id** (예: 8KbJsT7...)
- [ ] **Step 3**: NFT ID + estimated earnings (83% revenue share 계산)
- [ ] **Step 3**: Walrus Aggregator URL (실제 다운로드 가능)
- [ ] **Step 3**: "Go to Marketplace" 버튼 → 마켓플레이스 이동
- [ ] Marketplace에서 방금 생성한 템플릿 맨 위에 표시 확인

---

## 🔧 트러블슈팅

### 데모 중 발생 가능한 문제

**문제 1**: Walrus 업로드 실패
- **해결**: 백엔드에서 실제 Walrus Publisher API 호출 재시도
- **확인**:
  - Backend 로그 확인: `curl http://localhost:8000/`
  - Walrus testnet 상태 확인: https://walrus-testnet.mystenlabs.com
- **백업**: 업로드 실패 시 에러 메시지 표시, 재시도 가능
- **중요**: 실제 Walrus 통합이므로 testnet 연결 필수

**문제 2**: AI 분석 에러 (API 키 없음)
- **해결**: Mock AI가 자동으로 활성화됨 (API 키 없어도 정상 동작)
- **설명**: "We're using Mock AI for instant demo - production supports multiple AI providers"
- **장점**: 즉시 결과 생성, API 비용 없음, 안정적인 데모
- **확인**: Backend 로그에서 "Using Mock AI Client" 메시지 확인
- **AI Provider 전환**:
  - Anthropic API: .env에 `ANTHROPIC_API_KEY` 추가 → Claude 3 Haiku
  - AWS Bedrock: .env에 AWS credentials 추가 → Claude 3.5 Sonnet
  - Mock AI: API 키 없으면 자동 활성화

**문제 3**: 지갑 연결 실패
- **해결**: 미리 지갑 연결 완료해두기
- **백업**: 지갑 없이도 UI 탐색 가능 ("Connect Wallet" 버튼만 비활성화)
- **설명**: Mock wallet 사용 가능

**문제 4**: Backend 서버 다운
- **해결**: 데모 시작 전 health check
  ```bash
  curl http://localhost:8000/
  ```
- **백업**: Mock 데이터로 UI만 시연

**문제 5**: 프론트엔드 느린 로딩
- **해결**: 캐시 워밍업 (페이지 미리 로드)
- **백업**: 로딩 중에도 설명 계속

**문제 6**: localStorage 데이터 손실
- **원인**: 브라우저 시크릿 모드 사용 시
- **해결**: 일반 모드에서 데모 진행
- **확인**: DevTools Console에서 `localStorage.getItem('custom_rulesets')` 확인

**💡 추천 데모 방식** (실제 작동하는 구현):
1. **Upload**: 실제 Walrus 업로드 사용 (5-10초, 안정적)
   - 실제 blob_id 받기
   - Aggregator URL로 검증 가능
2. **Create**: 실제 Walrus 업로드 + localStorage 저장
   - 실제 config_blob_id 받기
   - 마켓플레이스에 즉시 표시
3. **Execute**: Mock AI 사용 (가장 안정적, 즉시 결과)
   - API 키 없어도 작동
   - 실제와 동일한 JSON 구조 반환
   - 실제 AI 분석 결과 형태 시연
4. **Wallet**: UI만 보여주기 (트랜잭션 생략 가능)

**실제 AI Provider 사용하려면**:

**Option 1 - Anthropic API (추천)**:
- .env에 `ANTHROPIC_API_KEY=sk-ant-...` 추가
- Backend 재시작
- Claude 3 Haiku 사용 (빠르고 저렴: ~$0.0004/실행)

**Option 2 - AWS Bedrock (엔터프라이즈)**:
- .env에 AWS credentials 추가:
  ```
  AWS_ACCESS_KEY_ID=AKIA...
  AWS_SECRET_ACCESS_KEY=...
  AWS_REGION=us-east-1
  BEDROCK_MODEL_ID=us.anthropic.claude-3-5-sonnet-20241022-v2:0
  ```
- Backend 재시작
- Claude 3.5 Sonnet 사용 (강력한 모델: ~$0.02/실행)

---

## 🎯 데모 성공 기준

### 꼭 보여줘야 할 것
- ✅ 양방향 플로우 (Creator ↔ User)
- ✅ **실제 Walrus Storage 통합** (upload → 실제 blob_id → aggregator URL)
- ✅ Sui NFT 발행 (RulesetNFT, ResultNFT)
- ✅ 가격 & 수익 모델 (2.5 SUI, 83% creator)
- ✅ 보안 모델 (pre-built templates only)
- ✅ **실시간 AI 분석 결과** (Summary, Findings, Recommendations, Metadata)
- ✅ **localStorage 통합** (Create → Marketplace 즉시 반영)

### 추가로 언급하면 좋은 것
- ⭐ 템플릿 6개 (Gaming, DeFi, Social, IoT)
- ⭐ **멀티-프로바이더 AI 엔진** (Anthropic API / AWS Bedrock / Mock AI 자동 전환)
- ⭐ **실제 Walrus testnet 사용** (config, data 실제 업로드)
- ⭐ **실제 분석 결과** (Mock AI라도 구조화된 JSON 반환)
- ⭐ **엔터프라이즈 지원**: AWS Bedrock으로 프로덕션 배포 가능
- ⭐ Mock AI: API 키 없이 즉시 데모 가능, 프로덕션과 동일한 인터페이스
- ⭐ 3-step wizard: 직관적인 템플릿 설정 UX
- ⭐ **검증 가능성**: Walrus Aggregator URL로 실제 config 다운로드 가능
- ⭐ **Execution history**: localStorage에 실행 이력 저장

---

## 📹 최종 체크리스트

### 촬영 전 (10분 전)
- [ ] 백엔드 서버 실행 확인 (http://localhost:8000)
  - [ ] Health check: `curl http://localhost:8000/`
  - [ ] Backend 로그에서 "Walrus Analytics API Server Starting..." 확인
- [ ] 프론트엔드 서버 실행 확인 (http://localhost:3001)
  - [ ] 홈페이지 로드 확인
- [ ] Mock AI 자동 활성화 확인 (✅ API 키 없어도 OK)
  - [ ] Backend 로그에서 "Using Mock AI Client" 메시지 확인
- [ ] **실제 Walrus testnet 연결 확인**:
  - [ ] 테스트 업로드: `POST http://localhost:8000/api/upload`
  - [ ] Aggregator 접근: https://aggregator.walrus-testnet.walrus.space
- [ ] **localStorage 초기화** (깨끗한 상태로 시작):
  - [ ] DevTools Console: `localStorage.clear()`
  - [ ] 또는 기존 custom_rulesets 유지해서 시연
- [ ] (선택) 지갑 연결 테스트 - UI만 보여줄 경우 생략 가능
- [ ] 브라우저 창 크기 조정 (1920x1080 또는 1440x900)
- [ ] 불필요한 탭/알림 끄기
- [ ] 일반 모드 사용 (시크릿 모드 X - localStorage 필요)
- [ ] 녹화 소프트웨어 설정 확인
- [ ] 마이크 테스트
- [ ] 각 페이지 미리 로드 (캐시 워밍업)

### 촬영 중
- [ ] 말하는 속도 일정하게 유지
- [ ] 각 액션 후 1-2초 대기 (편집 여유)
- [ ] 중요한 부분 강조 (마우스 호버)
- [ ] 에러 발생 시 침착하게 계속 진행

### 촬영 후
- [ ] 영상 길이 확인 (5분 이내)
- [ ] 오디오 볼륨 확인
- [ ] 중요 화면 모두 포함됐는지 확인
- [ ] 자막 추가 (선택사항)
- [ ] 썸네일 제작

---

**Good luck with your demo! 🚀**
