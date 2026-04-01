#!/usr/bin/env bash
# Dùng trên VPS (Linux): tạo thư mục site, clone repo, env mẫu, compose.
# Ví dụ: ./bootstrap-site.sh shop1 https://github.com/org/web_base.git 3001 https://shop1.com

set -euo pipefail
NAME="${1:?tên thư mục site, vd: shop1}"
REPO_URL="${2:?URL git}"
HOST_PORT="${3:?port host, vd: 3001}"
PUBLIC_URL="${4:?AUTH_URL, vd: https://shop1.com}"

BASE="${HOME}/sites"
DIR="${BASE}/${NAME}"
mkdir -p "$BASE"

if [[ -d "$DIR/.git" ]]; then
  echo "Đã tồn tại $DIR — pull thay vì clone."
  git -C "$DIR" pull
else
  git clone "$REPO_URL" "$DIR"
fi

cd "$DIR"
if [[ ! -f .env ]]; then
  SECRET="$(openssl rand -base64 32)"
  cat > .env << EOF
DATABASE_URL=file:/data/app.db
AUTH_SECRET=${SECRET}
AUTH_URL=${PUBLIC_URL}
COMPOSE_PROJECT_NAME=${NAME}
HOST_BIND=127.0.0.1
HOST_PORT=${HOST_PORT}
EOF
  echo "Đã tạo .env — kiểm tra lại AUTH_URL và lưu AUTH_SECRET an toàn."
else
  echo "Đã có .env — không ghi đè."
fi

export COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-$NAME}"
docker compose up -d --build
echo "Site ${NAME} → chỉ http://127.0.0.1:${HOST_PORT} (thêm block reverse_proxy tới port này; không đụng dịch vụ khác)."
