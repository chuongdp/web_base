# Triển khai web_base lên VPS (từ đầu)

VPS ví dụ: **66.42.51.62** — thay bằng IP hoặc tên miền của bạn khi làm thật.

Giả định: **Ubuntu**, đã cài **Docker** và plugin **Compose** (`docker compose version` chạy được).

---

## Bước 1 — Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

- **SSH (22)** phải mở trước khi `enable` để không khóa mình.
- Nếu cần thử site **trực tiếp bằng IP + port** (không qua reverse proxy), mở thêm port đó, ví dụ: `sudo ufw allow 3040/tcp`.

---

## Bước 2 — Lấy mã nguồn

```bash
mkdir -p ~/sites && cd ~/sites
git clone <URL-repo-web_base> web_base
cd web_base
```

---

## Bước 3 — Tạo file `.env`

```bash
cp .env.example .env
nano .env
```

Bắt buộc:

| Biến | Ý nghĩa |
|------|---------|
| `AUTH_SECRET` | Tạo: `openssl rand -base64 32` — dán vào `.env` |
| `DATABASE_URL` | Trong Docker: `file:/data/app.db` (giữ như `.env.example`) |
| `AUTH_URL` | **Phải trùng** URL bạn mở trên trình duyệt (xem hai cách dưới) |
| `COMPOSE_PROJECT_NAME` | Tên riêng, ví dụ `web_base_shop1` — tránh trùng project khác |
| `HOST_PORT` | Port **chưa ai dùng** trên VPS (kiểm tra: `ss -tlnp` rồi xem port), ví dụ `3040` |

---

## Cách A — Có tên miền + HTTPS (khuyến nghị)

1. DNS: bản ghi **A** `@` và `www` → `66.42.51.62`.
2. Trên VPS đã có **Caddy** / **Nginx** lắng nghe **80/443** — **chỉ thêm** block proxy tới app (không sửa site n8n/hrm khác).

`.env` (ví dụ domain `shop.example.com`):

```env
DATABASE_URL=file:/data/app.db
AUTH_SECRET=<chuỗi openssl rand -base64 32>
AUTH_URL=https://shop.example.com
COMPOSE_PROJECT_NAME=web_base_shop1
HOST_BIND=127.0.0.1
HOST_PORT=3040
```

- `HOST_BIND=127.0.0.1` — app chỉ nghe **localhost**; chỉ reverse proxy trên cùng máy gọi được.
- Thêm **Caddy** (ví dụ file `deploy/Caddyfile.example`):

```text
shop.example.com, www.shop.example.com {
    reverse_proxy 127.0.0.1:3040
}
```

Reload Caddy: `sudo systemctl reload caddy` (hoặc lệnh tương ứng).

3. Chạy:

```bash
docker compose up -d --build
```

4. Mở `https://shop.example.com`.

---

## Cách B — Thử nhanh bằng IP + port (chưa có domain)

1. Mở port trên firewall: `sudo ufw allow 3040/tcp`.

2. `.env`:

```env
DATABASE_URL=file:/data/app.db
AUTH_SECRET=<chuỗi openssl rand -base64 32>
AUTH_URL=http://66.42.51.62:3040
COMPOSE_PROJECT_NAME=web_base_shop1
HOST_BIND=0.0.0.0
HOST_PORT=3040
```

- `AUTH_URL` **phải** đúng `http://66.42.51.62:3040` (http, IP, port như trình duyệt).
- `HOST_BIND=0.0.0.0` để truy cập từ ngoài qua IP (chỉ nên dùng tạm; production nên dùng Cách A + HTTPS).

3. Chạy:

```bash
docker compose up -d --build
```

4. Mở trình duyệt: `http://66.42.51.62:3040`.

---

## Bước 4 — Kiểm tra

```bash
docker compose ps
docker compose logs -f web
```

- Container `web` phải `running`.
- Lỗi DB/migrate: xem log; entrypoint đã chạy `prisma migrate deploy` khi start.

---

## Bước 5 — Đăng nhập admin (mặc định code)

Trong `src/auth.config.ts` (credentials tĩnh): **admin@local.com** / **123456** — đổi mật khẩu / logic trong code trước khi public site thật.

---

## Nhiều site web_base trên cùng VPS

- Mỗi site: **thư mục riêng** hoặc **clone repo sang folder khác**.
- `.env` khác nhau: `COMPOSE_PROJECT_NAME`, `HOST_PORT`, `AUTH_URL`.
- `HOST_PORT` không trùng nhau; reverse proxy trỏ domain tới đúng port tương ứng.

---

## Sao lưu / backup

- SQLite nằm trong volume Docker (tên dạng `*_sqlite_data`).
- Backup: `docker cp <container>:/data/app.db ./backup.db` hoặc dump volume theo tài liệu Docker.

---

## Tóm tắt lệnh (Cách A — domain + proxy)

```bash
cd ~/sites/web_base
nano .env   # AUTH_SECRET, AUTH_URL=https://domain, HOST_BIND=127.0.0.1, HOST_PORT=3040, COMPOSE_PROJECT_NAME=...
docker compose up -d --build
# Thêm block reverse_proxy trong Caddy/Nginx → 127.0.0.1:3040
```

Tóm tắt (Cách B — IP tạm):

```bash
# ufw allow 3040
# .env: AUTH_URL=http://66.42.51.62:3040, HOST_BIND=0.0.0.0, HOST_PORT=3040
docker compose up -d --build
```
