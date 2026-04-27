# Deploy — kenziewaldron.shop

Chạy trên **VPS** (Ubuntu). Thay `<GIT_URL>` và **PORT** nếu đã bận.

| Mục | Giá trị |
|-----|---------|
| Domain | `kenziewaldron.shop`, `www.kenziewaldron.shop` |
| Thư mục | `/root/sites/kenziewaldron` |
| Compose project | `kenziewaldron` (volume DB/upload riêng) |
| Port nội bộ (ví dụ) | `3044` — kiểm tra: `ss -tlnp \| grep 3044` |

## 1. DNS (Namecheap / nơi quản DNS)

- **A** `@` → IP VPS  
- **A** `www` → IP VPS  
- Đảm bảo nameserver trùng nơi bạn tạo record (BasicDNS hoặc Cloudflare, v.v.)

Chờ `dig A kenziewaldron.shop @1.1.1.1 +short` ra đúng IP rồi mới certbot.

## 2. Clone

```bash
mkdir -p /root/sites
cd /root/sites
git clone <GIT_URL> kenziewaldron
cd kenziewaldron
git checkout develop   # hoặc nhánh deploy của bạn
```

## 3. `.env`

```bash
cd /root/sites/kenziewaldron
cp .env.example .env
nano .env
```

Nội dung tối thiểu:

```env
DATABASE_URL="file:/data/app.db"
AUTH_SECRET="<openssl rand -base64 32 — secret riêng site này>"
AUTH_URL="https://kenziewaldron.shop"
COMPOSE_PROJECT_NAME=kenziewaldron
HOST_BIND=127.0.0.1
HOST_PORT=3044
```

Chưa có HTTPS: tạm `AUTH_URL="http://kenziewaldron.shop"`, sau certbot đổi lại `https://` và `docker compose up -d`.

## 4. Nginx

```bash
sudo nano /etc/nginx/sites-available/kenziewaldron.shop
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name kenziewaldron.shop www.kenziewaldron.shop;

    location / {
        proxy_pass http://127.0.0.1:3044;
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
sudo ln -sf /etc/nginx/sites-available/kenziewaldron.shop /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 5. Docker

```bash
cd /root/sites/kenziewaldron
docker compose up -d --build
docker compose ps
```

## 6. HTTPS

```bash
sudo certbot --nginx -d kenziewaldron.shop -d www.kenziewaldron.shop
```

Sau đó: `AUTH_URL="https://kenziewaldron.shop"` trong `.env` → `docker compose up -d`.

## 7. Kiểm tra

```bash
curl -I http://127.0.0.1:3044
```

Mở `https://kenziewaldron.shop`.

## Cập nhật sau này

```bash
cd /root/sites/kenziewaldron
git pull
docker compose up -d --build
```

**Không** đổi `COMPOSE_PROJECT_NAME` sau khi đã có dữ liệu (tránh mất DB trong volume cũ).
