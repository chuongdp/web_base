---
name: web-base-storefront-ui
description: >-
  Redesign storefront hoặc thêm theme mới cho template e-commerce web_base.
  Dùng cùng Taste Skill (design-taste-frontend, redesign-existing-projects).
  Chỉ sửa storefront; giữ CMS Admin và cloneability.
---

# Storefront UI (web_base + Taste Skill)

## Khi nào dùng

- Làm lại giao diện khách (home, shop, PDP, cart, checkout shell).
- Thêm **theme storefront** mới (CMS chọn trong Site settings).
- User nhắc [Taste Skill](https://www.tasteskill.dev/) hoặc anti-slop / redesign.

## Skill Taste gốc (đã cài trong repo)

1. **design-taste-frontend** — brief inference, anti-default, typography/motion.
2. **redesign-existing-projects** — audit trước khi đổi UI có sẵn.

Đọc và tuân theo các skill đó cho **phần marketing/storefront**. Bỏ qua rule “chỉ landing page” khi brief là **shop fashion/e-commerce** — áp dụng trust-first commerce, không dashboard.

## Ràng buộc bắt buộc (template clone)

| Việc | Quy tắc |
|------|---------|
| Admin | `src/components/admin/` — **Shadcn**, không redesign theo Taste |
| Storefront | `src/components/storefront/` |
| Theme switch | `SiteSetting.storefrontTheme` → `data-storefront-theme` trên layout |
| Một theme mới | 1) `enum StorefrontTheme` trong `prisma/schema.prisma` + migrate 2) block CSS trong `src/app/globals.css` 3) `STOREFRONT_THEME_OPTIONS` + các `get*LayoutMode` / class trong `src/lib/storefront-theme.ts` 4) preview nhanh qua CMS |
| Nội dung động | Logo, banner, text từ DB Settings — không hardcode tên shop |
| Tailwind | Giữ utility; token màu/spacing qua CSS vars theme khi có thể |
| Docker | Không thêm native bindings |

## Quy trình theme mới (checklist)

1. **Design Read** (1 dòng) theo Taste §0 — audience: người mua online, ngành fashion/retail.
2. **Audit** (redesign): liệt kê header/hero/footer/grid hiện tại và mode đang map trong `storefront-theme.ts`.
3. Chọn **layout mode** có sẵn hoặc thêm mode mới nếu JSX structure khác hẳn (Header/Hero/Footer components).
4. Implement CSS vars + section classes; không phá theme cũ.
5. `prisma migrate dev` (local) / deploy migrate trên VPS.

## Prompt mẫu cho Agent

```
Dùng web-base-storefront-ui + design-taste-frontend.
Thêm theme "neo-brutalist" cho shop thời trang: audit trước, Design Read 1 dòng,
rồi enum + globals.css + storefront-theme.ts. Không đụng admin/checkout logic.
```

## Cài lại Taste Skill (máy khác)

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend
npx skills add https://github.com/Leonxlnx/taste-skill --skill redesign-existing-projects
```
