# Triển khai từ đầu — Git + domain (ví dụ vegamitchellcourte.shop)

**Tham số ví dụ**

| Mục | Giá trị |
|-----|---------|
| Domain | `vegamitchellcourte.shop` |
| VPS | Ubuntu, **root**, IP ví dụ **66.42.51.62** |
| Repo Git | **`<URL-repo-của-bạn>`** (HTTPS hoặc SSH) |
| Thư mục deploy | `/root/sites/web_base` |
| Port app | **3040** → `127.0.0.1` (chỉ Nginx proxy vào) |

**Thứ tự tổng quát:** DNS → firewall → **clone/pull Git trên VPS** → `.env` → **Nginx** (port 80 đã dùng Nginx) → Docker.

---

## 1. DNS (nhà cung cấp domain)

Bản ghi **A**: `@` → IP VPS (ví dụ `66.42.51.62`). Tuỳ chọn **www** → cùng IP.

---

## 2. Firewall (UFW)

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

Không cần mở **3040** ra internet nếu dùng Nginx proxy.

---

## 3. Lấy mã nguồn bằng Git (trên VPS)

SSH vào VPS:

```bash
ssh root@66.42.51.62
```

Cài Git nếu chưa có:

```bash
apt update && apt install -y git
```

Tạo thư mục và **clone** (thay URL bằng repo thật):

```bash
mkdir -p /root/sites
cd /root/sites
git clone <URL-repo-của-bạn> web_base
cd web_base
git status
```

**Nhánh cụ thể** (nếu không dùng `main`/`master`):

```bash
cd /root/sites/web_base
git fetch origin
git checkout ten-nhanh
```

**Repo riêng (private)**

- **HTTPS:** GitHub/GitLab có thể yêu cầu **Personal Access Token** thay mật khẩu khi `git clone`/`git pull`.
- **SSH:** tạo SSH key trên VPS (`ssh-keygen`), thêm **Deploy key** hoặc public key vào repo, rồi clone dạng `git@github.com:org/web_base.git`.

**Cập nhật code sau này:**

```bash
cd /root/sites/web_base
git pull
docker compose up -d --build
```

---

## 4. File `.env` trên VPS

```bash
cd /root/sites/web_base
cp .env.example .env
nano .env
```

Tối thiểu:

```env
DATABASE_URL="file:/data/app.db"
AUTH_SECRET="(openssl rand -base64 32)"
AUTH_URL="https://vegamitchellcourte.shop"
COMPOSE_PROJECT_NAME=web_base_vega
HOST_BIND=127.0.0.1
HOST_PORT=3040
```

- Chưa có HTTPS: tạm `AUTH_URL="http://vegamitchellcourte.shop"`, sau khi có cert đổi sang `https://` và `docker compose up -d`.

---

## 5. Reverse proxy — Nginx (khuyến nghị khi port 80 đã là Nginx)

Kiểm tra:

```bash
sudo ss -tlnp | grep ':80 '
```

Nếu là **nginx**, thêm site (không xóa site cũ):

```bash
sudo nano /etc/nginx/sites-available/vegamitchellcourte.shop
```

Nội dung:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name vegamitchellcourte.shop www.vegamitchellcourte.shop;

    location / {
        proxy_pass http://127.0.0.1:3040;
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

Bật site và reload:

```bash
sudo ln -sf /etc/nginx/sites-available/vegamitchellcourte.shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

HTTPS (nếu đã cài certbot):

```bash
sudo certbot --nginx -d vegamitchellcourte.shop -d www.vegamitchellcourte.shop
```

**Caddy:** chỉ dùng nếu **không** có dịch vụ khác chiếm port 80 — xem phần “Ghi chú / lỗi” cuối file bản cũ hoặc tài liệu Caddy. Nếu trước đó Caddy lỗi `address already in use`, giữ **Nginx** và `systemctl disable --now caddy`.

---

## 6. Chạy Docker

```bash
cd /root/sites/web_base
docker compose up -d --build
docker compose ps
docker compose logs -f web
```

---

## 7. Kiểm tra

- `curl -I http://127.0.0.1:3040` (app phản hồi).
- Trình duyệt: `https://vegamitchellcourte.shop` (sau cert) hoặc `http://` tạm.

Admin mặc định trong code: `admin@local.com` / `123456` — đổi trước khi public.

---

## Phụ lục — Đưa code lên không dùng Git (tar / scp)

Khi chưa có remote Git, trên **PowerShell** tại `D:\InternalTools\web_base`:

```powershell
tar -czf ..\web_base-deploy.tgz `
  --exclude=node_modules --exclude=.next --exclude=.git `
  --exclude=.env --exclude=.cursor --exclude="*.db" .
scp ..\web_base-deploy.tgz root@66.42.51.62:/root/sites/
```

Trên VPS:

```bash
mkdir -p /root/sites/web_base
tar -xzf /root/sites/web_base-deploy.tgz -C /root/sites/web_base
```

Sau đó vẫn làm từ **mục 4** trở đi (`.env`, Nginx, Docker).

---

## Một dòng

**`git clone` → `.env` → Nginx → `docker compose up -d --build`** — cập nhật sau: **`git pull` + `docker compose up -d --build`**.
