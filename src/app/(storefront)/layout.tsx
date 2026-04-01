import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StorefrontBannerMarquee } from "@/components/storefront/StorefrontBannerMarquee";
import { StorefrontFooter } from "@/components/storefront/StorefrontFooter";
import { StorefrontHeaderClient } from "@/components/storefront/StorefrontHeaderClient";
import { getMainShellClass } from "@/lib/storefront-theme";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: {
      default: s.siteName,
      template: `%s | ${s.siteName}`,
    },
  };
}

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
      {s.bannerText ? <StorefrontBannerMarquee text={s.bannerText} /> : null}

      <StorefrontHeaderClient
        siteName={s.siteName}
        logoUrl={s.logoUrl}
        categories={categories}
        productCollections={productCollections}
        theme={s.storefrontTheme}
      />

      <main className={`sf-main mx-auto w-full min-w-0 flex-1 ${getMainShellClass(s.storefrontTheme)}`}>{children}</main>

      <StorefrontFooter siteName={s.siteName} theme={s.storefrontTheme} />
    </div>
  );
}
