-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN "home_show_trust_strip" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "site_settings" ADD COLUMN "home_show_ambient" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "site_settings" ADD COLUMN "home_show_scroll_cue" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "site_settings" ADD COLUMN "home_show_collections" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "site_settings" ADD COLUMN "home_show_best_sellers" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "site_settings" ADD COLUMN "home_show_featured" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "site_settings" ADD COLUMN "home_show_shop_cta" BOOLEAN NOT NULL DEFAULT true;
