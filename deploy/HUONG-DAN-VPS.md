# Triển khai web_base lên VPS (từ đầu)

**→ Bản đi từng bước cho một domain cụ thể** (`vegamitchellcourte.shop`, root, tar+scp, Caddy, Docker): xem **[HUONG-DAN-TU-DAU-DOMAIN-MAU.md](./HUONG-DAN-TU-DAU-DOMAIN-MAU.md)**.

---

VPS ví dụ: **66.42.51.62** — thay bằng IP hoặc tên miền của bạn khi làm thật.

Giả định: **Ubuntu**, đã cài **Docker** và plugin **Compose** (`docker compose version` chạy được).

Ví dụ SSH dùng user **`root`** (home: `/root/`, `~/sites` = `/root/sites`). Nếu VPS của bạn là user khác (vd. `ubuntu`), thay mọi chỗ `root@66.42.51.62` bằng `ubuntu@...`.

---

## Bước 1 — Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

(User **`root`** có thể bỏ `sudo` — `ufw allow OpenSSH` …)

- **SSH (22)** phải mở trước khi `enable` để không khóa mình.
- Nếu cần thử site **trực tiếp bằng IP + port** (không qua reverse proxy), mở thêm port đó, ví dụ: `sudo ufw allow 3040/tcp`.

---

## Bước 2 — Đưa mã nguồn lên VPS

Không bắt buộc dùng `git clone` từ GitHub; có thể **đồng bộ từ máy đang code** hoặc **đẩy Git thẳng lên VPS**.

**Luôn bỏ qua** (hoặc không commit) trên máy local: `node_modules/`, `.next/`, `.env`, file `*.db` — tránh upload thừa và lộ secret.

---

### Cách 1 — `git clone` từ remote (GitHub / GitLab / …)

```bash
mkdir -p ~/sites && cd ~/sites
git clone <URL-repo-web_base> web_base
cd web_base
```

---

### Cách 2 — `rsync` hoặc `scp` từ máy Windows / local

Phù hợp khi **chưa có** repo public hoặc muốn đẩy đúng bản đang có trên ổ cứng.

**Quan trọng:** Lệnh `rsync` / `scp` bên dưới chạy trên **máy đang có source** (PC Windows — Git Bash hoặc PowerShell), **không** chạy sau khi đã `ssh` vào VPS. Trên VPS không có thư mục `./web_base` thì sẽ lỗi `No such file or directory`.

**`rsync` không có trên PowerShell** (và **Git Bash** mặc định cũng **thường không** có `rsync`). Chọn một trong các cách:

| Cách | Gợi ý |
|------|--------|
| **WSL (Ubuntu)** | `wsl` → `sudo apt update && sudo apt install -y rsync` → `cd /mnt/d/InternalTools/web_base` → chạy lệnh rsync như **Trường hợp B** |
| **PowerShell: `tar` + `scp`** | Xem đoạn ngay bên dưới (không cần cài rsync) |

---

**rsync** (chỉ khi đã có `rsync` — ví dụ trong **WSL** sau `apt install rsync`):

**Trường hợp A — Project nằm ở `D:\InternalTools\web_base` (thư mục cha là `InternalTools`):**

```bash
cd /d/InternalTools
rsync -avz --delete \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude .env --exclude "*.db" --exclude ".cursor" \
  ./web_base/ root@66.42.51.62:~/sites/web_base/
```

**Trường hợp B — Bạn đang đứng **trong** thư mục gốc repo (`.../web_base`), không có cấp `web_base/` bên dưới:**

```bash
cd /d/InternalTools/web_base
rsync -avz --delete \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude .env --exclude "*.db" --exclude ".cursor" \
  ./ root@66.42.51.62:~/sites/web_base/
```

(`./` = nội dung thư mục hiện tại; đừng nhầm với `./web_base/` khi đã `cd` vào `web_base`.)

- `--delete`: xóa trên server file đã xóa local (cẩn thận nếu trên VPS có file riêng trong thư mục đó).  
- Trên VPS, lần đầu có thể tạo sẵn: `mkdir -p ~/sites/web_base` (rsync thường tự tạo).

**PowerShell — `tar` + `scp`** (Windows 10+ có `tar` và `scp`; không cần `rsync`):

Chạy trong **PowerShell**, từ thư mục gốc project (`D:\InternalTools\web_base`):

```powershell
cd D:\InternalTools\web_base
tar -czf ..\web_base-deploy.tgz `
  --exclude=node_modules --exclude=.next --exclude=.git `
  --exclude=.env --exclude=.cursor --exclude="*.db" .
scp ..\web_base-deploy.tgz root@66.42.51.62:/root/sites/
```

Trên **VPS** (SSH):

```bash
mkdir -p ~/sites/web_base
tar -xzf /root/sites/web_base-deploy.tgz -C ~/sites/web_base
rm /root/sites/web_base-deploy.tgz
```

(Nếu lệnh `tar --exclude` báo lỗi trên bản Windows cũ, dùng **WSL** + `rsync` hoặc cài [rsync qua Chocolatey](https://community.chocolatey.org/packages/rsync) rồi chạy trong CMD có PATH.)

**PowerShell — nén zip** (dễ nén nhầm cả `node_modules` nếu không lọc — chỉ dùng khi không dùng được `tar`):

```powershell
Compress-Archive -Path * -DestinationPath ..\web_base-src.zip
```

→ thường **không nên** vì `*` có thể gồm thư mục nặng; ưu tiên `tar` + `--exclude` ở trên.

---

### Cách 3 — `git push` trực tiếp từ local lên VPS (không qua GitHub)

Trên **VPS** tạo **bare repo** (chỉ để nhận push):

```bash
mkdir -p ~/git/web_base.git && cd ~/git/web_base.git
git init --bare
```

Trên **máy local** (đã có repo `web_base`):

```bash
cd web_base
git remote add vps root@66.42.51.62:~/git/web_base.git
# hoặc dạng đầy đủ: ssh://root@66.42.51.62/root/git/web_base.git
git push -u vps main
# hoặc nhánh master, tùy repo
```

Trên **VPS** clone (hoặc pull) ra thư mục chạy Docker:

```bash
mkdir -p ~/sites
git clone ~/git/web_base.git ~/sites/web_base
cd ~/sites/web_base
```

Lần sau cập nhật: local `git push vps main`, trên VPS `cd ~/sites/web_base && git pull`.

*(Nâng cao: hook `post-receive` trên bare repo để tự `git pull` + `docker compose up -d --build` — có thể thêm sau.)*

---

### Cách 4 — Build image ở local, VPS chỉ kéo image (không cần mã nguồn trên VPS)

1. Máy local: `docker build -t yourname/web_base:1.0 .` rồi `docker push` lên Docker Hub / GHCR.  
2. VPS: chỉ cần `docker compose` trỏ `image: yourname/web_base:1.0` thay cho `build:`.  
Phù hợp CI/CD; cần chỉnh `docker-compose` và file `.env` trên VPS.

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
