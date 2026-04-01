import { revalidateTag, unstable_cache } from "next/cache";
import type { Currency, StorefrontTheme } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DEFAULT_STOREFRONT_THEME } from "@/lib/storefront-theme";

export type SiteSettingsDTO = {
  siteName: string;
  logoUrl: string | null;
  primaryColor: string;
  bannerText: string | null;
  defaultCurrency: Currency;
  storefrontTheme: StorefrontTheme;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroButtonText: string | null;
  heroButtonLink: string | null;
  heroImageUrl: string | null;
  heroOverlayImageUrl: string | null;
};

const DEFAULTS: SiteSettingsDTO = {
  siteName: "Store",
  logoUrl: null,
  primaryColor: "#2563eb",
  bannerText: null,
  defaultCurrency: "USD",
  storefrontTheme: DEFAULT_STOREFRONT_THEME,
  heroTitle: null,
  heroSubtitle: null,
  heroButtonText: null,
  heroButtonLink: null,
  heroImageUrl: null,
  heroOverlayImageUrl: null,
};

async function loadSiteSettings(): Promise<SiteSettingsDTO> {
  const row = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  if (!row) return DEFAULTS;
  return {
    siteName: row.siteName,
    logoUrl: row.logoUrl,
    primaryColor: row.primaryColor?.trim() || DEFAULTS.primaryColor,
    bannerText: row.bannerText,
    defaultCurrency: row.defaultCurrency,
    storefrontTheme: row.storefrontTheme ?? DEFAULT_STOREFRONT_THEME,
    heroTitle: row.heroTitle,
    heroSubtitle: row.heroSubtitle,
    heroButtonText: row.heroButtonText,
    heroButtonLink: row.heroButtonLink,
    heroImageUrl: row.heroImageUrl,
    heroOverlayImageUrl: row.heroOverlayImageUrl,
  };
}

/** Cache theo segment; gọi `revalidateTag('site-settings')` sau khi CMS cập nhật. */
export const getSiteSettings = unstable_cache(loadSiteSettings, ["site-settings-v6-themes"], {
  revalidate: 300,
  tags: ["site-settings"],
});

/** Gọi từ Server Action / Route Handler sau khi CMS lưu SiteSetting. */
export function revalidateSiteSettingsCache(): void {
  revalidateTag("site-settings");
}
