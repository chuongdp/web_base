# Deploy — carleyjnaas.shop

Chạy trên **VPS** (Ubuntu). Thay `<GIT_URL>` và **PORT** nếu đã bận.

| Mục | Giá trị |
|-----|---------|
| Domain | `carleyjnaas.shop`, `www.carleyjnaas.shop` |
| Thư mục | `/root/sites/carleyjnaas` |
| Compose project | `carleyjnaas` (volume DB/upload riêng) |
| Port nội bộ (ví dụ) | `3047` — kiểm tra: `ss -tlnp \| grep 3047` |

## 1. DNS

- **A** `@` → IP VPS  
- **A** `www` → IP VPS  
- Nameserver trùng nơi tạo record.

Chờ `dig A carleyjnaas.shop @1.1.1.1 +short` ra đúng IP.

## 2. Clone

```bash
mkdir -p /root/sites
cd /root/sites
git clone <GIT_URL> carleyjnaas
cd carleyjnaas
git checkout develop
```

## 3. `.env`

```bash
cd /root/sites/carleyjnaas
cp .env.example .env
nano .env
```

```env
DATABASE_URL="file:/data/app.db"
AUTH_SECRET="<openssl rand -base64 32 — secret riêng site này>"
AUTH_URL="https://carleyjnaas.shop"
COMPOSE_PROJECT_NAME=carleyjnaas
HOST_BIND=127.0.0.1
HOST_PORT=3047
```

Chưa HTTPS: tạm `AUTH_URL="http://carleyjnaas.shop"`, sau certbot đổi `https://` + `docker compose up -d`.

## 4. Nginx

```bash
sudo nano /etc/nginx/sites-available/carleyjnaas.shop
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name carleyjnaas.shop www.carleyjnaas.shop;

    location / {
        proxy_pass http://127.0.0.1:3047;
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
sudo ln -sf /etc/nginx/sites-available/carleyjnaas.shop /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 5. Docker

```bash
cd /root/sites/carleyjnaas
docker compose up -d --build
docker compose ps
```

## 6. HTTPS

```bash
sudo certbot --nginx -d carleyjnaas.shop -d www.carleyjnaas.shop
```

Sau đó: `AUTH_URL="https://carleyjnaas.shop"` → `docker compose up -d`.

## 7. Kiểm tra

```bash
curl -I http://127.0.0.1:3047
```

Mở `https://carleyjnaas.shop`.

## Cập nhật sau

```bash
cd /root/sites/carleyjnaas
git pull
docker compose up -d --build
```

Không đổi `COMPOSE_PROJECT_NAME` sau khi đã có dữ liệu.
