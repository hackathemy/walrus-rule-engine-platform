#!/bin/bash
#
# EC2 간단 배포 스크립트
# 사용법: bash deploy-ec2.sh
#

set -e  # 에러 발생 시 중단

echo "🚀 Walrus Rule Engine Platform - EC2 배포 시작"
echo "================================================"

# 1. 환경 설정
echo ""
echo "📦 1/6 시스템 패키지 설치..."
sudo apt update
sudo apt install -y git curl

# 2. Node.js 설치
echo ""
echo "📦 2/6 Node.js 설치..."
if ! command -v node &> /dev/null; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm use 18
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# 3. Python 설치
echo ""
echo "📦 3/6 Python 3.11 설치..."
if ! command -v python3.11 &> /dev/null; then
    sudo apt install -y python3.11 python3.11-venv python3-pip
else
    echo "✅ Python 3.11 already installed"
fi

# 4. PM2 설치
echo ""
echo "📦 4/6 PM2 설치..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
else
    echo "✅ PM2 already installed"
fi

# 5. 프로젝트 설정
echo ""
echo "📦 5/6 프로젝트 설정..."
cd ~/walrus-rule-engine-platform

# .env 파일 확인
if [ ! -f .env ]; then
    echo "⚠️  .env 파일이 없습니다. 샘플 파일을 생성합니다..."
    cat > .env << 'EOF'
# Walrus Configuration
WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space

# Anthropic API
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ANTHROPIC_MODEL=claude-3-haiku-20240307

# Sui Network
SUI_NETWORK=testnet
SUI_PRIVATE_KEY=your-sui-private-key-here
EOF
    echo "❗ .env 파일을 수정해주세요: nano .env"
    exit 1
fi

# 백엔드 설정
echo "  → 백엔드 패키지 설치..."
cd backend
if [ ! -d "venv" ]; then
    python3.11 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
deactivate

# 프론트엔드 설정
echo "  → 프론트엔드 패키지 설치..."
cd ../frontend
npm install --silent

# .env.local 생성
if [ ! -f .env.local ]; then
    # EC2 퍼블릭 IP 가져오기
    EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://${EC2_IP}:8000
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
NEXT_PUBLIC_SUI_NETWORK=testnet
EOF
    echo "  ✅ .env.local 생성 완료 (API URL: http://${EC2_IP}:8000)"
fi

# 6. PM2로 실행
echo ""
echo "🚀 6/6 서비스 실행..."

cd ~/walrus-rule-engine-platform

# 기존 프로세스 중지 (있으면)
pm2 delete walrus-backend 2>/dev/null || true
pm2 delete walrus-frontend 2>/dev/null || true

# 백엔드 실행
echo "  → 백엔드 실행 (포트 8000)..."
cd backend
pm2 start api_server.py \
    --name walrus-backend \
    --interpreter python3 \
    --watch false

# 프론트엔드 실행
echo "  → 프론트엔드 실행 (포트 3001)..."
cd ../frontend
pm2 start npm \
    --name walrus-frontend \
    -- run dev -- -p 3001

# PM2 자동 시작 설정
pm2 startup | tail -1 | sudo bash
pm2 save

echo ""
echo "================================================"
echo "✅ 배포 완료!"
echo "================================================"
echo ""
echo "📡 서비스 URL:"
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "  프론트엔드: http://${EC2_IP}:3001"
echo "  백엔드:     http://${EC2_IP}:8000"
echo ""
echo "🔍 프로세스 상태:"
pm2 list
echo ""
echo "📋 유용한 명령어:"
echo "  pm2 logs              - 모든 로그 보기"
echo "  pm2 logs walrus-backend   - 백엔드 로그"
echo "  pm2 logs walrus-frontend  - 프론트엔드 로그"
echo "  pm2 restart all       - 모든 서비스 재시작"
echo "  pm2 stop all          - 모든 서비스 중지"
echo ""
