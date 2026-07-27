import { getSiteSetting } from "@/app/actions/settingActions";
import { BestSellersSection } from "@/components/storefront/BestSellersSection";
import { HomeAmbientShell } from "@/components/storefront/HomeAmbientShell";
import { HomeCollectionsSection } from "@/components/storefront/HomeCollectionsSection";
import { HomeFeaturedSection } from "@/components/storefront/HomeFeaturedSection";
import { HomeHero } from "@/components/storefront/HomeHero";
import { HomeHeroScrollCue } from "@/components/storefront/HomeHeroScrollCue";
import { HomeReveal } from "@/components/storefront/HomeReveal";
import { HomeShopCtaBand } from "@/components/storefront/HomeShopCtaBand";
import { HomeTrustStrip } from "@/components/storefront/HomeTrustStrip";
import { homePageFlagsFromSetting } from "@/lib/home-page-flags";
import { DEFAULT_STOREFRONT_THEME } from "@/lib/storefront-theme";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function StorefrontHomePage() {
  const [setting, products] = await Promise.all([
    getSiteSetting(),
    prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    }),
  ]);

  const theme = setting?.storefrontTheme ?? DEFAULT_STOREFRONT_THEME;
  const home = homePageFlagsFromSetting(setting);

  const body = (
    <div className="sf-home-flow">
      <HomeReveal>
        <HomeHero
          theme={theme}
          heroTitle={setting?.heroTitle ?? null}
          heroSubtitle={setting?.heroSubtitle ?? null}
          heroButtonText={setting?.heroButtonText ?? null}
          heroButtonLink={setting?.heroButtonLink ?? null}
          heroImageUrl={setting?.heroImageUrl ?? null}
          heroOverlayImageUrl={setting?.heroOverlayImageUrl ?? null}
          heroImageWidthPx={setting?.heroImageWidthPx ?? null}
          heroImageHeightPx={setting?.heroImageHeightPx ?? null}
        />
        {home.showScrollCue ? <HomeHeroScrollCue /> : null}
      </HomeReveal>

      {home.showTrustStrip ? (
        <HomeReveal delay={80}>
          <HomeTrustStrip />
        </HomeReveal>
      ) : null}

      {home.showCollections ? (
        <HomeReveal delay={120}>
          <HomeCollectionsSection />
        </HomeReveal>
      ) : null}

      {home.showShopCta ? (
        <HomeReveal delay={140}>
          <HomeShopCtaBand />
        </HomeReveal>
      ) : null}

      {home.showBestSellers ? (
        <HomeReveal delay={160}>
          <BestSellersSection />
        </HomeReveal>
      ) : null}

      {home.showFeatured ? (
        <HomeReveal delay={200}>
          <HomeFeaturedSection
            theme={theme}
            products={products.map((p) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              currency: p.currency,
              imageUrl: p.images[0]?.url ?? null,
            }))}
          />
        </HomeReveal>
      ) : null}
    </div>
  );

  if (!home.showAmbient) {
    return body;
  }

  return <HomeAmbientShell>{body}</HomeAmbientShell>;
}
