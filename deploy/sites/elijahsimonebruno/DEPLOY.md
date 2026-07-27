# Deploy — elijahsimonebruno.store

Chạy trên **VPS** (Ubuntu). Thay `<GIT_URL>` và **PORT** nếu đã bận.

| Mục | Giá trị |
|-----|---------|
| Domain | `elijahsimonebruno.store`, `www.elijahsimonebruno.store` |
| Thư mục | `/root/sites/elijahsimonebruno` |
| Compose project | `elijahsimonebruno` (volume DB/upload riêng) |
| Port nội bộ (ví dụ) | `3059` — kiểm tra: `ss -tlnp \| grep 3059` |

## 1. DNS

- **A** `@` → IP VPS  
- **A** `www` → IP VPS  
- Nameserver trùng nơi tạo record.

Trước certbot: `dig A elijahsimonebruno.store @1.1.1.1 +short` phải ra IP (không NXDOMAIN).

## 2. Clone

```bash
mkdir -p /root/sites
cd /root/sites
git clone <GIT_URL> elijahsimonebruno
cd elijahsimonebruno
git checkout develop
```

## 3. `.env`

```bash
cd /root/sites/elijahsimonebruno
cp .env.example .env
nano .env
```

```env
DATABASE_URL="file:/data/app.db"
AUTH_SECRET="<openssl rand -base64 32 — secret riêng site này>"
AUTH_URL="https://elijahsimonebruno.store"
COMPOSE_PROJECT_NAME=elijahsimonebruno
HOST_BIND=127.0.0.1
HOST_PORT=3059
```

Chưa HTTPS: tạm `AUTH_URL="http://elijahsimonebruno.store"`, sau certbot đổi `https://` + `docker compose up -d`.

## 4. Nginx

```bash
sudo nano /etc/nginx/sites-available/elijahsimonebruno.store
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name elijahsimonebruno.store www.elijahsimonebruno.store;

    location / {
        proxy_pass http://127.0.0.1:3059;
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
sudo ln -sf /etc/nginx/sites-available/elijahsimonebruno.store /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 5. Docker

```bash
cd /root/sites/elijahsimonebruno
docker compose up -d --build
docker compose ps
```

Sau deploy: `docker builder prune -a -f && docker image prune -f`

## 6. HTTPS

```bash
sudo certbot --nginx -d elijahsimonebruno.store -d www.elijahsimonebruno.store
```

Sau đó: `AUTH_URL="https://elijahsimonebruno.store"` → `docker compose up -d`.

## 7. Kiểm tra

```bash
curl -I http://127.0.0.1:3059
```

Mở `https://elijahsimonebruno.store`.

## Cập nhật sau

```bash
cd /root/sites/elijahsimonebruno
git pull
docker compose up -d --build
docker builder prune -a -f
```

Không đổi `COMPOSE_PROJECT_NAME` sau khi đã có dữ liệu.
