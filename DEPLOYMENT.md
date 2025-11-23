# Deployment Guide - Walrus Insight Engine

## 🚀 Single EC2 Deployment (MVP/Hackathon)

네, **AWS EC2 하나에 전체 프로젝트 배포 가능**합니다! 프론트엔드(Next.js)와 백엔드(Flask)를 동일한 인스턴스에서 실행할 수 있습니다.

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  AWS EC2 Instance (Ubuntu 22.04)                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔴 Backend (Flask)                                 │
│  - Port 8000                                        │
│  - Python 3.11 + venv                               │
│  - PM2 또는 systemd로 프로세스 관리                    │
│                                                     │
│  🔵 Frontend (Next.js)                              │
│  - Port 3001 (development)                          │
│  - 또는 빌드 후 nginx로 정적 서빙 (port 80/443)        │
│  - PM2로 프로세스 관리                                 │
│                                                     │
│  🌐 Nginx (선택사항)                                 │
│  - 리버스 프록시: frontend(3001) + backend(8000)     │
│  - SSL/TLS 인증서 (Let's Encrypt)                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

### 1. AWS EC2 Instance
- **Type**: t3.medium 이상 (2 vCPU, 4GB RAM)
- **OS**: Ubuntu 22.04 LTS
- **Storage**: 20GB+ (General Purpose SSD)
- **Security Group**:
  - SSH (22) - 본인 IP만
  - HTTP (80) - 0.0.0.0/0
  - HTTPS (443) - 0.0.0.0/0
  - Custom TCP (3001) - 0.0.0.0/0 (테스트용, 나중에 제거)
  - Custom TCP (8000) - 0.0.0.0/0 (테스트용, 나중에 제거)

### 2. Domain (선택사항)
- Cloudflare / Route53에서 도메인 구매
- A 레코드: your-domain.com → EC2 Elastic IP

### 3. Environment Variables
- Sui private key
- Walrus URLs
- AI provider keys (Anthropic or AWS Bedrock)

---

## 🛠️ Step-by-Step Deployment

### Step 1: EC2 인스턴스 접속 및 기본 설정

```bash
# SSH 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# 필수 패키지 설치
sudo apt install -y git curl wget build-essential

# Node.js 18+ 설치 (nvm 사용)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
node -v  # v18.x.x 확인

# Python 3.11 설치
sudo apt install -y python3.11 python3.11-venv python3-pip
python3.11 --version  # Python 3.11.x 확인

# PM2 설치 (프로세스 관리)
npm install -g pm2

# Nginx 설치 (선택사항, 프로덕션 권장)
sudo apt install -y nginx
```

### Step 2: 프로젝트 클론 및 설정

```bash
# 프로젝트 클론
cd ~
git clone https://github.com/yourusername/walrus-rule-engine-platform.git
cd walrus-rule-engine-platform

# 환경 변수 설정
nano .env
```

**`.env` 파일 작성**:
```env
# Sui & Walrus
SUI_PRIVATE_KEY=suiprivkey...
WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space

# AI Provider (Option 1: Anthropic API - 추천)
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-haiku-20240307

# OR (Option 2: AWS Bedrock)
# AWS_ACCESS_KEY_ID=AKIA...
# AWS_SECRET_ACCESS_KEY=...
# AWS_REGION=us-east-1
# BEDROCK_MODEL_ID=us.anthropic.claude-3-5-sonnet-20241022-v2:0

# Deployed Contracts (Sui Testnet)
SUI_PACKAGE_ID=0x5c34fe6013030c9b4214aa7753e95c153b0f51cd23691368fbd2254cb1a0f98f
SUI_PLATFORM_TREASURY=0x5ef1f3696cb275ddf50859c200a86e8a991978104933366c25b96c97951ae3c6
```

### Step 3: 백엔드 배포 (Flask)

```bash
# 백엔드 디렉토리로 이동
cd ~/walrus-rule-engine-platform/backend

# Python 가상환경 생성
python3.11 -m venv venv
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 테스트 실행
python3 api_server.py
# Ctrl+C로 종료

# PM2로 백엔드 시작
pm2 start api_server.py --name walrus-backend --interpreter python3
pm2 save
pm2 startup  # 부팅 시 자동 시작
```

**백엔드 확인**:
```bash
curl http://localhost:8000/
# 응답: {"status":"running","service":"Walrus Analytics API","version":"1.0.0"}
```

### Step 4: 프론트엔드 배포 (Next.js)

#### Option A: Development Mode (빠른 테스트)

```bash
# 프론트엔드 디렉토리로 이동
cd ~/walrus-rule-engine-platform/frontend

# 의존성 설치
npm install

# 환경 변수 설정
nano .env.local
```

**`.env.local` 작성**:
```env
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
# PM2로 프론트엔드 시작
pm2 start npm --name walrus-frontend -- run dev
pm2 save
```

**프론트엔드 확인**:
```bash
curl http://localhost:3001/
# HTML 응답 확인
```

#### Option B: Production Build (프로덕션 권장)

```bash
# 프론트엔드 디렉토리
cd ~/walrus-rule-engine-platform/frontend

# 빌드
npm run build

# PM2로 프로덕션 시작
pm2 start npm --name walrus-frontend -- start
pm2 save
```

### Step 5: Nginx 리버스 프록시 설정 (선택사항, 프로덕션 권장)

```bash
# Nginx 설정 파일 생성
sudo nano /etc/nginx/sites-available/walrus-insight
```

**Nginx 설정**:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 또는 EC2 Public IP

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend (Flask API)
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 설정 활성화
sudo ln -s /etc/nginx/sites-available/walrus-insight /etc/nginx/sites-enabled/

# Nginx 테스트 및 재시작
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: SSL 인증서 설치 (프로덕션 필수)

```bash
# Certbot 설치
sudo apt install -y certbot python3-certbot-nginx

# SSL 인증서 발급 (도메인 필요)
sudo certbot --nginx -d your-domain.com

# 자동 갱신 확인
sudo certbot renew --dry-run
```

---

## 🔍 배포 확인

### 1. PM2 프로세스 상태 확인
```bash
pm2 list
# 출력:
# ┌─────┬───────────────────┬─────────┬─────────┬─────────┬──────────┐
# │ id  │ name              │ status  │ restart │ uptime  │ cpu      │
# ├─────┼───────────────────┼─────────┼─────────┼─────────┼──────────┤
# │ 0   │ walrus-backend    │ online  │ 0       │ 5m      │ 0%       │
# │ 1   │ walrus-frontend   │ online  │ 0       │ 5m      │ 0%       │
# └─────┴───────────────────┴─────────┴─────────┴─────────┴──────────┘

pm2 logs walrus-backend --lines 50   # 백엔드 로그 확인
pm2 logs walrus-frontend --lines 50  # 프론트엔드 로그 확인
```

### 2. 포트 확인
```bash
sudo netstat -tulpn | grep -E ':(8000|3001|80|443)'
# 출력:
# tcp        0      0 0.0.0.0:8000            0.0.0.0:*               LISTEN      12345/python3
# tcp        0      0 0.0.0.0:3001            0.0.0.0:*               LISTEN      12346/node
# tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      12347/nginx
# tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      12347/nginx
```

### 3. 엔드포인트 테스트
```bash
# 백엔드 Health Check
curl http://localhost:8000/
# {"status":"running","service":"Walrus Analytics API","version":"1.0.0"}

# 백엔드 Walrus 연동 테스트
curl http://localhost:8000/api/blob/AiAQDmNUwpxj1boxbJiYmKqdlfpqhd2i25L3ZBLh0ug
# Walrus blob 데이터 응답

# 프론트엔드 확인
curl http://localhost:3001/
# HTML 응답 (Next.js 페이지)
```

### 4. 브라우저 테스트
1. **프론트엔드**: `http://your-ec2-ip:3001` (또는 도메인)
2. **백엔드 API**: `http://your-ec2-ip:8000/` (JSON 응답)
3. **Nginx 프록시**: `http://your-domain.com` (SSL 설정 시 https)

---

## 🔧 운영 관리

### PM2 명령어
```bash
# 프로세스 상태 확인
pm2 list

# 로그 확인
pm2 logs walrus-backend
pm2 logs walrus-frontend

# 프로세스 재시작
pm2 restart walrus-backend
pm2 restart walrus-frontend
pm2 restart all

# 프로세스 중지
pm2 stop walrus-backend
pm2 delete walrus-backend

# 모니터링 대시보드
pm2 monit
```

### 업데이트 배포
```bash
# 코드 업데이트
cd ~/walrus-rule-engine-platform
git pull origin main

# 백엔드 업데이트
cd backend
source venv/bin/activate
pip install -r requirements.txt
pm2 restart walrus-backend

# 프론트엔드 업데이트
cd ../frontend
npm install
npm run build  # 프로덕션인 경우
pm2 restart walrus-frontend
```

### 로그 관리
```bash
# PM2 로그 확인
pm2 logs --lines 100

# Nginx 로그
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 시스템 로그
sudo journalctl -u nginx -f
```

---

## 🚨 문제 해결 (Troubleshooting)

### 1. 백엔드가 시작되지 않음
```bash
# 로그 확인
pm2 logs walrus-backend --lines 50

# 일반적인 원인:
# - .env 파일 누락 → 루트 디렉토리에 .env 생성
# - Python 의존성 누락 → pip install -r requirements.txt
# - 포트 8000 이미 사용 중 → sudo lsof -i :8000
```

### 2. 프론트엔드가 백엔드에 연결 안됨
```bash
# .env.local 확인
cat frontend/.env.local
# NEXT_PUBLIC_API_URL이 올바른지 확인 (http://localhost:8000 또는 도메인)

# CORS 문제일 경우 backend/api_server.py 확인:
# CORS(app)  # Flask-CORS가 활성화되어 있는지 확인
```

### 3. Walrus 업로드 실패
```bash
# 백엔드 로그에서 에러 확인
pm2 logs walrus-backend | grep -i walrus

# 일반적인 원인:
# - SUI_PRIVATE_KEY 미설정
# - Walrus Testnet 장애 → https://status.walrus.storage 확인
# - 네트워크 타임아웃 → Security Group outbound 규칙 확인
```

### 4. AI 분석 실패
```bash
# AI provider 확인
pm2 logs walrus-backend | grep -i "Using"
# 출력: "✅ Using Anthropic API" 또는 "✅ Using AWS Bedrock" 또는 "⚠️ Using Mock AI"

# Anthropic API 키 확인
echo $ANTHROPIC_API_KEY  # 또는 .env 파일 확인

# AWS Bedrock 권한 확인
aws bedrock-runtime invoke-model help  # AWS CLI로 권한 테스트
```

### 5. SSL 인증서 문제
```bash
# Certbot 로그 확인
sudo certbot certificates
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# 수동 갱신
sudo certbot renew --force-renewal
```

---

## 📊 비용 예상 (월간)

### Single EC2 배포 비용

| 항목 | 사양 | 비용 (USD/월) |
|------|------|---------------|
| **EC2 Instance** | t3.medium (2 vCPU, 4GB) | $30.37 |
| **EBS Storage** | 20GB gp3 | $1.60 |
| **Elastic IP** | 1개 (인스턴스 연결 시) | $0 |
| **Data Transfer** | 1GB out (프리티어) | $0 |
| **AI Provider** | Anthropic API (100회 실행) | $0.04 |
| **Walrus Storage** | 100 blobs (5 epochs) | $1.00 |
| **총 월간 비용** |  | **~$33** |

**비고**:
- AWS 프리티어 (첫 12개월): t3.micro 무료 (750시간/월)
- Anthropic API: $0.0004/실행 (Claude 3 Haiku 기준)
- Walrus: ~$0.01/blob (일회성, epochs 기준)

---

## 🚀 Alternative: 분리 배포 (프로덕션 스케일)

### Architecture Option 2: 분리된 인프라

```
┌──────────────────────────────────────────────────────┐
│  Frontend                                            │
│  - Vercel / Netlify (Serverless)                    │
│  - CDN + Global Edge Network                        │
│  - 자동 SSL, 무료 프리티어                             │
└────────────┬─────────────────────────────────────────┘
             │ HTTPS API Calls
             ▼
┌──────────────────────────────────────────────────────┐
│  Backend                                             │
│  - AWS Lambda (Serverless)                          │
│  - API Gateway                                       │
│  - 또는 AWS Fargate (Container)                      │
│  - 또는 EC2 Auto Scaling Group                       │
└──────────────────────────────────────────────────────┘
```

### Vercel 프론트엔드 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 프론트엔드 디렉토리에서 배포
cd frontend
vercel --prod

# 환경 변수 설정 (Vercel Dashboard)
# NEXT_PUBLIC_SUI_NETWORK=testnet
# NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
# NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### AWS Lambda 백엔드 배포 (선택사항)

```bash
# SAM CLI 설치
pip install aws-sam-cli

# SAM 템플릿 작성 (backend/sam-template.yaml)
# Lambda function으로 Flask 앱 패키징

# 배포
cd backend
sam build
sam deploy --guided
```

---

## ✅ 권장 배포 전략

### 해커톤/MVP (1-100명 사용자)
✅ **Single EC2** (이 가이드의 기본 방법)
- **장점**: 빠른 배포, 간단한 관리, 낮은 비용
- **단점**: 단일 장애점, 제한된 확장성
- **비용**: ~$33/월

### 프로덕션 초기 (100-1000명)
✅ **EC2 + Vercel**
- Frontend: Vercel (자동 CDN, SSL)
- Backend: EC2 t3.medium (PM2)
- **비용**: ~$30/월 (Vercel 프리티어 + EC2)

### 프로덕션 스케일 (1000명+)
✅ **Full Serverless**
- Frontend: Vercel/Cloudflare Pages
- Backend: AWS Lambda + API Gateway
- Database: DynamoDB (상태 저장 필요 시)
- **비용**: 사용량 기반 (idle 시 거의 $0)

---

## 📝 배포 체크리스트

### 배포 전
- [ ] `.env` 파일 작성 (모든 필수 변수 설정)
- [ ] AI provider 키 확인 (Anthropic 또는 Bedrock)
- [ ] Sui private key 설정
- [ ] Walrus URLs 확인
- [ ] EC2 Security Group 포트 오픈 (80, 443, 3001, 8000)

### 배포 중
- [ ] Node.js 18+ 설치 확인
- [ ] Python 3.11 설치 확인
- [ ] PM2 설치 및 프로세스 시작
- [ ] Nginx 설정 (선택사항)
- [ ] SSL 인증서 설치 (프로덕션 필수)

### 배포 후
- [ ] 백엔드 Health Check (`curl http://localhost:8000/`)
- [ ] 프론트엔드 접속 테스트
- [ ] Walrus 업로드 테스트
- [ ] AI 분석 실행 테스트
- [ ] PM2 startup 설정 (재부팅 시 자동 시작)
- [ ] 모니터링 설정 (PM2 monit, CloudWatch)

---

## 🎯 요약

### 빠른 답변
✅ **네, AWS EC2 하나에 전체 배포 가능합니다!**

- **백엔드**: Flask (port 8000) - PM2로 실행
- **프론트엔드**: Next.js (port 3001) - PM2로 실행
- **프록시**: Nginx (선택사항, 프로덕션 권장)
- **비용**: ~$33/월 (t3.medium)
- **배포 시간**: ~30분

### 가장 빠른 배포 방법
```bash
# 1. EC2 접속
ssh -i key.pem ubuntu@ec2-ip

# 2. 환경 설정 (Node.js, Python, PM2)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
sudo apt install -y python3.11 python3.11-venv
npm install -g pm2

# 3. 프로젝트 클론 및 .env 설정
git clone https://github.com/yourrepo/walrus-rule-engine-platform.git
cd walrus-rule-engine-platform
nano .env  # 환경 변수 입력

# 4. 백엔드 시작
cd backend
python3.11 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
pm2 start api_server.py --name walrus-backend --interpreter python3

# 5. 프론트엔드 시작
cd ../frontend
npm install
pm2 start npm --name walrus-frontend -- run dev

# 6. 확인
pm2 list
curl http://localhost:8000/
curl http://localhost:3001/
```

**접속**: `http://your-ec2-ip:3001`

프로덕션 배포 시 Nginx + SSL 추가 권장!

---

## 📦 Smart Contract Addresses (Reference)

### Sui Testnet Deployment
```
Package ID: 0x5c34fe6013030c9b4214aa7753e95c153b0f51cd23691368fbd2254cb1a0f98f
Platform Treasury: 0x5ef1f3696cb275ddf50859c200a86e8a991978104933366c25b96c97951ae3c6
Network: Sui Testnet
Explorer: https://suiexplorer.com/?network=testnet
```

### Walrus Storage
```
Publisher URL: https://publisher.walrus-testnet.walrus.space
Aggregator URL: https://aggregator.walrus-testnet.walrus.space
Network: Walrus Testnet
Storage Epochs: 5 (configurable)
```

---

**Last Updated**: 2025-11-24
**Deployment Type**: Single EC2 (MVP/Hackathon)
**Estimated Setup Time**: 30 minutes
**Monthly Cost**: ~$33 USD
