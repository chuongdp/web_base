# Deploy — vuvanquyet.shop

Chạy trên **VPS** (Ubuntu). Thay `<GIT_URL>` và **PORT** nếu đã bận.

| Mục | Giá trị |
|-----|---------|
| Domain | `vuvanquyet.shop`, `www.vuvanquyet.shop` |
| Thư mục | `/root/sites/vuvanquyet` |
| Compose project | `vuvanquyet` (volume DB/upload riêng) |
| Port nội bộ (ví dụ) | `3055` — kiểm tra: `ss -tlnp \| grep 3055` |

## 1. DNS

- **A** `@` → IP VPS  
- **A** `www` → IP VPS  
- Nameserver trùng nơi tạo record.

Trước certbot: `dig A vuvanquyet.shop @1.1.1.1 +short` phải ra IP (không NXDOMAIN).

## 2. Clone

```bash
mkdir -p /root/sites
cd /root/sites
git clone <GIT_URL> vuvanquyet
cd vuvanquyet
git checkout develop
```

## 3. `.env`

```bash
cd /root/sites/vuvanquyet
cp .env.example .env
nano .env
```

```env
DATABASE_URL="file:/data/app.db"
AUTH_SECRET="<openssl rand -base64 32 — secret riêng site này>"
AUTH_URL="https://vuvanquyet.shop"
COMPOSE_PROJECT_NAME=vuvanquyet
HOST_BIND=127.0.0.1
HOST_PORT=3055
```

Chưa HTTPS: tạm `AUTH_URL="http://vuvanquyet.shop"`, sau certbot đổi `https://` + `docker compose up -d`.

## 4. Nginx

```bash
sudo nano /etc/nginx/sites-available/vuvanquyet.shop
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name vuvanquyet.shop www.vuvanquyet.shop;

    location / {
        proxy_pass http://127.0.0.1:3055;
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
sudo ln -sf /etc/nginx/sites-available/vuvanquyet.shop /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 5. Docker

```bash
cd /root/sites/vuvanquyet
docker compose up -d --build
docker compose ps
```

## 6. HTTPS

```bash
sudo certbot --nginx -d vuvanquyet.shop -d www.vuvanquyet.shop
```

Sau đó: `AUTH_URL="https://vuvanquyet.shop"` → `docker compose up -d`.

## 7. Kiểm tra

```bash
curl -I http://127.0.0.1:3055
```

Mở `https://vuvanquyet.shop`.

## Cập nhật sau

```bash
cd /root/sites/vuvanquyet
git pull
docker compose up -d --build
```

Không đổi `COMPOSE_PROJECT_NAME` sau khi đã có dữ liệu.

## Lưu ý (site cũ quyetvuvan.shop)

`vuvanquyet.shop` và `quyetvuvan.shop` là **hai domain khác nhau** — cần **hai thư mục**, **hai `COMPOSE_PROJECT_NAME`**, **hai port**, **hai block Nginx**. Không dùng chung volume Docker.

Nếu muốn **thay thế** site cũ bằng domain mới (giữ dữ liệu): backup volume DB cũ, deploy mới, rồi restore — không chỉ đổi tên domain trong Nginx.
