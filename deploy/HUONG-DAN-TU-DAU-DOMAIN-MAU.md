# Hướng dẫn triển khai từ đầu — ví dụ cụ thể

**Site mẫu trong tài liệu này**

| Mục | Giá trị ví dụ |
|-----|----------------|
| Domain | `vegamitchellcourte.shop` |
| VPS | Ubuntu, user **root**, IP ví dụ **66.42.51.62** (thay bằng IP thật của bạn nếu khác) |
| Mã nguồn trên máy bạn | `D:\InternalTools\web_base` (Windows) |
| Thư mục trên VPS | `/root/sites/web_base` |
| Port app (Docker → host) | **3040** (chỉ `127.0.0.1`, không mở public) |

---

## Phần A — Trên máy Windows (đưa code lên VPS)

### A1. Đóng gói (PowerShell)

Mở **PowerShell**, chạy:

```powershell
cd D:\InternalTools\web_base
tar -czf ..\web_base-deploy.tgz `
  --exclude=node_modules --exclude=.next --exclude=.git `
  --exclude=.env --exclude=.cursor --exclude="*.db" .
scp ..\web_base-deploy.tgz root@66.42.51.62:/root/sites/
```

(Nhập mật khẩu SSH hoặc dùng SSH key. Đổi IP nếu VPS bạn không phải `66.42.51.62`.)

### A2. Trên VPS — giải nén (SSH)

```bash
ssh root@66.42.51.62
mkdir -p /root/sites/web_base
tar -xzf /root/sites/web_base-deploy.tgz -C /root/sites/web_base
rm -f /root/sites/web_base-deploy.tgz
ls -la /root/sites/web_base
```

Phải thấy `package.json`, `Dockerfile`, `src/`, `prisma/`, …

---

## Phần B — DNS (nhà cung cấp domain)

Tạo bản ghi **A**:

- **Tên / Host:** `@` (hoặc `vegamitchellcourte.shop`)
- **Giá trị:** IP VPS (ví dụ `66.42.51.62`)

(Tuỳ chọn) **www** → cùng IP.

Đợi DNS propagate (vài phút đến vài giờ). Kiểm tra: `ping vegamitchellcourte.shop` hoặc [dnschecker.org](https://dnschecker.org).

---

## Phần C — Firewall VPS (UFW)

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

**Không** cần mở port `3040` ra internet — app chỉ lắng nghe `127.0.0.1:3040`, Caddy/Nginx trên cùng máy sẽ proxy vào đó.

---

## Phần D — File `.env` trên VPS

```bash
cd /root/sites/web_base
cp .env.example .env
nano .env
```

Điền **tối thiểu** (sau khi đã có **HTTPS** qua Caddy — xem Phần E):

```env
DATABASE_URL="file:/data/app.db"
AUTH_SECRET="(chạy: openssl rand -base64 32 rồi dán)"
AUTH_URL="https://vegamitchellcourte.shop"
COMPOSE_PROJECT_NAME=web_base_vega
HOST_BIND=127.0.0.1
HOST_PORT=3040
```

- `AUTH_SECRET`: trên VPS chạy `openssl rand -base64 32`, copy vào.
- **Giai đoạn chỉ có HTTP** (chưa cấu hình SSL): tạm dùng  
  `AUTH_URL="http://vegamitchellcourte.shop"`  
  Khi đã vào được bằng **https://** ổn định, đổi lại `AUTH_URL` sang `https://...` và `docker compose up -d`.

Lưu file: **Ctrl+O**, Enter, **Ctrl+X**.

---

## Phần E — Reverse proxy + HTTPS (Caddy)

### E0 — Cài Caddy (nếu máy chưa có)

Xem chính thức: [caddyserver.com/docs/install](https://caddyserver.com/docs/install) (Ubuntu thường dùng gói `.deb` hoặc `apt`).

Kiểm tra đã cài chưa:

```bash
which caddy
caddy version
systemctl status caddy
```

Nếu bạn dùng **Caddy chạy bằng Docker** thay vì `systemctl`, cách sửa file cấu hình sẽ khác (volume mount file Caddyfile) — phần dưới là cho **Caddy cài như dịch vụ systemd**, file mặc định `/etc/caddy/Caddyfile`.

---

### E1 — Sao lưu file cấu hình hiện tại (an toàn trước khi sửa)

```bash
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak.$(date +%Y%m%d)
```

---

### E2 — Xem nội dung hiện tại (đừng xóa block cũ)

```bash
sudo cat /etc/caddy/Caddyfile
```

Hoặc mở bằng `nano` để thấy toàn bộ — các site n8n/HRM thường là các block `domain { ... }` riêng; bạn **chỉ thêm** một block **mới** ở **cuối file** (hoặc sau một dòng trống).

---

### E3 — Sửa file: thêm block cho domain shop

```bash
sudo nano /etc/caddy/Caddyfile
```

- Dùng phím **mũi tên** xuống **cuối file**.
- Xuống dòng trống (Enter).
- **Dán** block sau (tab hoặc 4 space đều được, nhất quán là được):

```text
vegamitchellcourte.shop, www.vegamitchellcourte.shop {
	reverse_proxy 127.0.0.1:3040
}
```

- Lưu: **Ctrl+O**, Enter.
- Thoát: **Ctrl+X**.

**Không** xóa hay sửa các block `n8n`, `hrm`, … đã có.

---

### E4 — Kiểm tra cú pháp rồi nạp lại Caddy

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
```

Nếu báo `Valid configuration` (hoặc tương đương) thì:

```bash
sudo systemctl reload caddy
```

Nếu `reload` lỗi, xem log:

```bash
sudo journalctl -u caddy -n 50 --no-pager
```

---

### E5 — Kiểm tra dịch vụ

```bash
sudo systemctl status caddy
```

Trạng thái **active (running)** là ổn.

---

### E6 — Sau khi DNS đã trỏ đúng IP VPS

Caddy sẽ tự xin chứng chỉ Let’s Encrypt khi có request HTTPS tới domain. Thử trình duyệt: `https://vegamitchellcourte.shop`.

Nếu lỗi certificate, kiểm tra: DNS đã trỏ đúng chưa, port **80/443** có mở không, firewall có chặn không.

---

### Ghi chú

| Vấn đề | Gợi ý |
|--------|--------|
| Không có `/etc/caddy/Caddyfile` | Caddy có thể cài khác đường dẫn; chạy `sudo caddy list-modules` hoặc xem `systemctl cat caddy` để biết file config. |
| Caddy chạy trong Docker | Sửa file trên host rồi mount vào container, hoặc `docker exec` vào container chỉnh file tương ứng — tùy cách bạn đã deploy. |
| Chỉ cần HTTP tạm | Có thể thêm `tls internal` cho dev — production nên để Caddy tự HTTPS. |

---

### E7 — Lỗi Caddy: `listen tcp :80: bind: address already in use`

**Ý nghĩa:** Port **80** đã bị **Nginx**, **Apache**, **Traefik**, hoặc container khác chiếm. Trên **một** máy chỉ có **một** tiến trình được lắng nghe `:80` (tương tự **443**).

**Xem ai đang dùng 80 / 443:**

```bash
sudo ss -tlnp | grep -E ':80 |:443 '
```

Hoặc:

```bash
sudo lsof -i :80
sudo lsof -i :443
```

**Cách xử lý thực tế (khuyến nghị trên VPS đã có n8n/HRM):**

- **Không** cố chạy thêm Caddy systemd nếu **Nginx (hoặc proxy khác) đã giữ 80/443** — sẽ luôn lỗi như trên.
- **Thêm site mới vào đúng proxy đang dùng** (thường là **Nginx**): tạo file site mới trong `sites-available`, `proxy_pass http://127.0.0.1:3040;`, bật SSL bằng **certbot** (`certbot --nginx`) hoặc cấu hình sẵn của bạn.

**Ví dụ Nginx** (HTTP — chỉ minh họa; đường dẫn file tùy distro, ví dụ `/etc/nginx/sites-available/vegamitchellcourte.shop`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name vegamitchellcourte.shop www.vegamitchellcourte.shop;

    location / {
        proxy_pass http://127.0.0.1:3040;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Sau đó:

```bash
sudo ln -sf /etc/nginx/sites-available/vegamitchellcourte.shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

HTTPS: `sudo certbot --nginx -d vegamitchellcourte.shop -d www.vegamitchellcourte.shop` (nếu đã cài certbot).

**Nếu thật sự muốn dùng Caddy cho mọi thứ:** phải **gỡ dịch vụ đang chiếm 80** hoặc gom toàn bộ site sang Caddy — dễ làm gián đoạn n8n/HRM; **không** khuyến nghị nếu chưa có kế hoạch migrate.

**Tạm tắt Caddy** (tránh restart loop) nếu không dùng:

```bash
sudo systemctl stop caddy
sudo systemctl disable caddy
```

---

## Phần F — Chạy Docker

```bash
cd /root/sites/web_base
docker compose up -d --build
docker compose ps
docker compose logs -f web
```

Container `web` phải **running**. Lỗi migrate/DB xem log.

---

## Phần G — Kiểm tra

1. Trình duyệt: `https://vegamitchellcourte.shop` (hoặc `http://` nếu đang giai đoạn tạm).
2. Đăng nhập admin (mặc định trong code): `admin@local.com` / `123456` — **nên đổi** trước khi site public.

---

## Sửa code rồi cập nhật VPS

Trên Windows: đóng gói lại + `scp` như Phần A, trên VPS:

```bash
cd /root/sites/web_base
tar -xzf /root/sites/web_base-deploy.tgz -C /root/sites/web_base
docker compose up -d --build
```

(Hoặc dùng `git pull` nếu bạn đã cấu hình Git trên VPS.)

---

## Tóm tắt một dòng

**DNS → UFW (80/443) → `.env` (`AUTH_URL` khớp URL thật) → reverse proxy (Caddy **hoặc** Nginx đã có) → `127.0.0.1:3040` → `docker compose up -d --build`.**

*(Nếu port 80 đã dùng: xem **E7** — thêm `server` Nginx thay vì chạy thêm Caddy.)*
