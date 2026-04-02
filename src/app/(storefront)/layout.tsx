import type { ReactNode } from "react";
import { StorefrontBannerMarquee } from "@/components/storefront/StorefrontBannerMarquee";
import { StorefrontFooter } from "@/components/storefront/StorefrontFooter";
import { StorefrontHeaderClient } from "@/components/storefront/StorefrontHeaderClient";
import { getMainShellClass } from "@/lib/storefront-theme";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

export default async function StorefrontLayout({ children }: { children: ReactNode }) {
  const [s, categories, productCollections] = await Promise.all([
    getSiteSettings(),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, displayPreset: true },
    }),
    prisma.productCollection.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true },
      take: 24,
    }),
  ]);
  const primary = s.primaryColor;
  const footerMeta = {
    shopOwner: s.footerMetaShopOwner?.trim() || s.siteName,
    address: s.footerMetaAddress?.trim() || s.contactAddress?.trim() || "—",
    email: s.footerMetaEmail?.trim() || s.contactEmail?.trim() || "—",
    hours: s.footerMetaHours?.trim() || "—",
  };

  return (
    <div
      data-storefront-theme={s.storefrontTheme}
      className="sf-store-root flex min-h-dvh flex-col bg-[var(--sf-page-bg)] transition-colors duration-300"
      style={
        {
          "--sf-primary": primary,
        } as React.CSSProperties
      }
    >
      {s.bannerEnabled && s.bannerText?.trim() ? (
        <StorefrontBannerMarquee
          text={s.bannerText.trim()}
          backgroundColor={s.bannerBgColor}
          textColor={s.bannerTextColor}
          heightPx={s.bannerHeightPx}
          fontSizePx={s.bannerFontSizePx}
          scrollSec={s.bannerScrollSec}
        />
      ) : null}

      <StorefrontHeaderClient
        siteName={s.siteName}
        logoUrl={s.logoUrl}
        logoWidthPx={s.logoWidthPx}
        logoHeightPx={s.logoHeightPx}
        categories={categories}
        productCollections={productCollections}
        theme={s.storefrontTheme}
      />

      <main className={`sf-main mx-auto w-full min-w-0 flex-1 ${getMainShellClass(s.storefrontTheme)}`}>{children}</main>

      <StorefrontFooter siteName={s.siteName} theme={s.storefrontTheme} footerMeta={footerMeta} />
    </div>
  );
}
