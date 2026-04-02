-- Footer meta strip (preset cards) — CMS fields
ALTER TABLE "site_settings" ADD COLUMN "footer_meta_shop_owner" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "footer_meta_address" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "footer_meta_email" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "footer_meta_hours" TEXT;
