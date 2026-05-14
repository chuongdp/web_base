# Deploy — shaundtellnwilliams.shop

Chạy trên **VPS** (Ubuntu). Thay `<GIT_URL>` và **PORT** nếu đã bận.

| Mục | Giá trị |
|-----|---------|
| Domain | `shaundtellnwilliams.shop`, `www.shaundtellnwilliams.shop` |
| Thư mục | `/root/sites/shaundtellnwilliams` |
| Compose project | `shaundtellnwilliams` (volume DB/upload riêng) |
| Port nội bộ (ví dụ) | `3048` — kiểm tra: `ss -tlnp \| grep 3048` |

## 1. DNS

- **A** `@` → IP VPS  
- **A** `www` → IP VPS  
- Nameserver trùng nơi tạo record.

Chờ `dig A shaundtellnwilliams.shop @1.1.1.1 +short` ra đúng IP.

## 2. Clone

```bash
mkdir -p /root/sites
cd /root/sites
git clone <GIT_URL> shaundtellnwilliams
cd shaundtellnwilliams
git checkout develop
```

## 3. `.env`

```bash
cd /root/sites/shaundtellnwilliams
cp .env.example .env
nano .env
```

```env
DATABASE_URL="file:/data/app.db"
AUTH_SECRET="<openssl rand -base64 32 — secret riêng site này>"
AUTH_URL="https://shaundtellnwilliams.shop"
COMPOSE_PROJECT_NAME=shaundtellnwilliams
HOST_BIND=127.0.0.1
HOST_PORT=3048
```

Chưa HTTPS: tạm `AUTH_URL="http://shaundtellnwilliams.shop"`, sau certbot đổi `https://` + `docker compose up -d`.

## 4. Nginx

```bash
sudo nano /etc/nginx/sites-available/shaundtellnwilliams.shop
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name shaundtellnwilliams.shop www.shaundtellnwilliams.shop;

    location / {
        proxy_pass http://127.0.0.1:3048;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
sudo ln -sf /etc/nginx/sites-available/shaundtellnwilliams.shop /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 5. Docker

```bash
cd /root/sites/shaundtellnwilliams
docker compose up -d --build
docker compose ps
```

## 6. HTTPS

```bash
sudo certbot --nginx -d shaundtellnwilliams.shop -d www.shaundtellnwilliams.shop
```

Sau đó: `AUTH_URL="https://shaundtellnwilliams.shop"` → `docker compose up -d`.

## 7. Kiểm tra

```bash
curl -I http://127.0.0.1:3048
```

Mở `https://shaundtellnwilliams.shop`.

## Cập nhật sau

```bash
cd /root/sites/shaundtellnwilliams
git pull
docker compose up -d --build
```

Không đổi `COMPOSE_PROJECT_NAME` sau khi đã có dữ liệu.
