#!/bin/bash
#
# Cafe24 가상서버 자동 배포 스크립트
# 사용법: bash cafe24-deploy.sh
#

set -e  # 에러 발생 시 중단

echo "🚀 Walrus Rule Engine - Cafe24 배포 시작"
echo "========================================"

# 1. 시스템 업데이트
echo ""
echo "📦 1/7 시스템 업데이트..."
apt update -qq

# 2. 기본 패키지
echo ""
echo "📦 2/7 기본 패키지 설치..."
apt install -y git curl wget build-essential

# 3. Node.js 설치
echo ""
echo "📦 3/7 Node.js 설치..."
if ! command -v node &> /dev/null; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm use 18
    echo "✅ Node.js $(node --version) 설치 완료"
else
    echo "✅ Node.js 이미 설치됨: $(node --version)"
fi

# 4. Python 확인 및 설치
echo ""
echo "📦 4/7 Python 확인..."

# Python 3.8+ 찾기
PYTHON_CMD=""
for py_version in python3.11 python3.10 python3.9 python3.8 python3; do
    if command -v $py_version &> /dev/null; then
        # 버전 확인
        PY_VER=$($py_version --version 2>&1 | grep -oP '\d+\.\d+' | head -1)
        PY_MAJOR=$(echo $PY_VER | cut -d. -f1)
        PY_MINOR=$(echo $PY_VER | cut -d. -f2)

        if [ "$PY_MAJOR" -ge 3 ] && [ "$PY_MINOR" -ge 8 ]; then
            PYTHON_CMD=$py_version
            echo "✅ Python $PY_VER 발견: $py_version"
            break
        fi
    fi
done

# Python 3.8+ 없으면 설치
if [ -z "$PYTHON_CMD" ]; then
    echo "⚠️  Python 3.8+ 없음. Python 3.11 설치 중..."
    apt install -y python3.11 python3.11-venv python3-pip
    PYTHON_CMD=python3.11
    echo "✅ Python 3.11 설치 완료"
fi

# 5. PM2 설치
echo ""
echo "📦 5/7 PM2 설치..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo "✅ PM2 설치 완료"
else
    echo "✅ PM2 이미 설치됨"
fi

# 6. 프로젝트 설정
echo ""
echo "📦 6/7 프로젝트 설정..."
cd $HOME

# .env 파일 확인
if [ ! -f $HOME/walrus-rule-engine-platform/.env ]; then
    echo ""
    echo "⚠️  .env 파일이 없습니다!"
    echo ""
    echo "다음 명령어로 .env 파일을 생성해주세요:"
    echo "  cd $HOME/walrus-rule-engine-platform"
    echo "  nano .env"
    echo ""
    echo "필수 환경 변수:"
    echo "  WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space"
    echo "  WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space"
    echo "  ANTHROPIC_API_KEY=your-key"
    echo "  SUI_NETWORK=testnet"
    echo "  SUI_PRIVATE_KEY=your-key"
    exit 1
fi

# 백엔드 설정
echo "  → 백엔드 패키지 설치 ($PYTHON_CMD 사용)..."
cd $HOME/walrus-rule-engine-platform/backend
if [ ! -d "venv" ]; then
    $PYTHON_CMD -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
deactivate

# 프론트엔드 설정
echo "  → 프론트엔드 패키지 설치..."
cd $HOME/walrus-rule-engine-platform/frontend
npm install --silent

# .env.local 생성
if [ ! -f .env.local ]; then
    # 서버 IP 가져오기
    SERVER_IP=$(curl -s ifconfig.me)
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://${SERVER_IP}:8000
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
NEXT_PUBLIC_SUI_NETWORK=testnet
EOF
    echo "  ✅ .env.local 생성 완료 (API URL: http://${SERVER_IP}:8000)"
fi

# 7. PM2로 실행
echo ""
echo "🚀 7/7 서비스 실행..."

cd $HOME

# 기존 프로세스 중지
pm2 delete walrus-backend 2>/dev/null || true
pm2 delete walrus-frontend 2>/dev/null || true

# 백엔드 실행
echo "  → 백엔드 실행 (포트 8000, $PYTHON_CMD 사용)..."
cd $HOME/walrus-rule-engine-platform/backend
pm2 start api_server.py \
    --name walrus-backend \
    --interpreter $PYTHON_CMD \
    --watch false

# 프론트엔드 실행
echo "  → 프론트엔드 실행 (포트 3001)..."
cd $HOME/walrus-rule-engine-platform/frontend
pm2 start npm \
    --name walrus-frontend \
    -- run dev -- -p 3001

# PM2 자동 시작 설정
echo ""
echo "🔄 PM2 자동 시작 설정..."
# PM2 startup 명령 실행
STARTUP_CMD=$(pm2 startup systemd -u $USER --hp $HOME | grep "sudo")
if [ ! -z "$STARTUP_CMD" ]; then
    echo "  실행 중: $STARTUP_CMD"
    eval $STARTUP_CMD
fi
pm2 save
echo "  ✅ PM2 프로세스 저장 완료"

# 방화벽 설정
echo ""
echo "🔒 방화벽 설정..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp 2>/dev/null || true
    ufw allow 8000/tcp 2>/dev/null || true
    ufw allow 3001/tcp 2>/dev/null || true
    echo "  ✅ UFW 방화벽 규칙 추가 완료"
fi

echo ""
echo "========================================"
echo "✅ Cafe24 배포 완료!"
echo "========================================"
echo ""
echo "📡 서비스 URL:"
SERVER_IP=$(curl -s ifconfig.me)
echo "  프론트엔드: http://${SERVER_IP}:3001"
echo "  백엔드:     http://${SERVER_IP}:8000"
echo ""
echo "⚠️  Cafe24 관리 콘솔에서 포트 열기:"
echo "  1. Cafe24 호스팅 관리 페이지 접속"
echo "  2. 서버 관리 → 방화벽 설정"
echo "  3. 포트 8000, 3001 열기"
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
echo "🧪 AI 연동 테스트:"
echo "  cd $HOME/walrus-rule-engine-platform/backend"
echo "  source venv/bin/activate"
echo "  python3 test_ai_client.py"
echo ""
