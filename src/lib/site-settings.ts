import { revalidateTag, unstable_cache } from "next/cache";
import type { Currency, StorefrontTheme } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DEFAULT_STOREFRONT_THEME } from "@/lib/storefront-theme";

export type SiteSettingsDTO = {
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  logoWidthPx: number | null;
  logoHeightPx: number | null;
  primaryColor: string;
  bannerText: string | null;
  bannerEnabled: boolean;
  bannerHeightPx: number | null;
  bannerFontSizePx: number | null;
  bannerBgColor: string | null;
  bannerTextColor: string | null;
  bannerScrollSec: number | null;
  defaultCurrency: Currency;
  storefrontTheme: StorefrontTheme;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroButtonText: string | null;
  heroButtonLink: string | null;
  heroImageUrl: string | null;
  heroOverlayImageUrl: string | null;
  heroImageWidthPx: number | null;
  heroImageHeightPx: number | null;
  aboutBlockImageWidthPx: number | null;
  aboutBlockImageHeightPx: number | null;
  /** Footer meta strip (preset cards) */
  footerMetaShopOwner: string | null;
  footerMetaAddress: string | null;
  footerMetaEmail: string | null;
  footerMetaHours: string | null;
  /** Dùng fallback cho email/địa chỉ footer khi ô footer để trống */
  contactEmail: string | null;
  contactAddress: string | null;
};

const DEFAULTS: SiteSettingsDTO = {
  siteName: "Store",
  logoUrl: null,
  faviconUrl: null,
  logoWidthPx: null,
  logoHeightPx: null,
  primaryColor: "#2563eb",
  bannerText: null,
  bannerEnabled: true,
  bannerHeightPx: null,
  bannerFontSizePx: null,
  bannerBgColor: null,
  bannerTextColor: null,
  bannerScrollSec: null,
  defaultCurrency: "USD",
  storefrontTheme: DEFAULT_STOREFRONT_THEME,
  heroTitle: null,
  heroSubtitle: null,
  heroButtonText: null,
  heroButtonLink: null,
  heroImageUrl: null,
  heroOverlayImageUrl: null,
  heroImageWidthPx: null,
  heroImageHeightPx: null,
  aboutBlockImageWidthPx: null,
  aboutBlockImageHeightPx: null,
  footerMetaShopOwner: null,
  footerMetaAddress: null,
  footerMetaEmail: null,
  footerMetaHours: null,
  contactEmail: null,
  contactAddress: null,
};

async function loadSiteSettings(): Promise<SiteSettingsDTO> {
  const row = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  if (!row) return DEFAULTS;
  return {
    siteName: row.siteName,
    logoUrl: row.logoUrl,
    faviconUrl: row.faviconUrl,
    logoWidthPx: row.logoWidthPx,
    logoHeightPx: row.logoHeightPx,
    primaryColor: row.primaryColor?.trim() || DEFAULTS.primaryColor,
    bannerText: row.bannerText,
    bannerEnabled: row.bannerEnabled,
    bannerHeightPx: row.bannerHeightPx,
    bannerFontSizePx: row.bannerFontSizePx,
    bannerBgColor: row.bannerBgColor,
    bannerTextColor: row.bannerTextColor,
    bannerScrollSec: row.bannerScrollSec,
    defaultCurrency: row.defaultCurrency,
    storefrontTheme: row.storefrontTheme ?? DEFAULT_STOREFRONT_THEME,
    heroTitle: row.heroTitle,
    heroSubtitle: row.heroSubtitle,
    heroButtonText: row.heroButtonText,
    heroButtonLink: row.heroButtonLink,
    heroImageUrl: row.heroImageUrl,
    heroOverlayImageUrl: row.heroOverlayImageUrl,
    heroImageWidthPx: row.heroImageWidthPx,
    heroImageHeightPx: row.heroImageHeightPx,
    aboutBlockImageWidthPx: row.aboutBlockImageWidthPx,
    aboutBlockImageHeightPx: row.aboutBlockImageHeightPx,
    footerMetaShopOwner: row.footerMetaShopOwner,
    footerMetaAddress: row.footerMetaAddress,
    footerMetaEmail: row.footerMetaEmail,
    footerMetaHours: row.footerMetaHours,
    contactEmail: row.contactEmail,
    contactAddress: row.contactAddress,
  };
}

/** Cache theo segment; gọi `revalidateTag('site-settings')` sau khi CMS cập nhật. */
export const getSiteSettings = unstable_cache(loadSiteSettings, ["site-settings-v10-footer-meta"], {
  revalidate: 300,
  tags: ["site-settings"],
});

/** Gọi từ Server Action / Route Handler sau khi CMS lưu SiteSetting. */
export function revalidateSiteSettingsCache(): void {
  revalidateTag("site-settings");
}
