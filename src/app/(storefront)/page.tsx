import { getSiteSetting } from "@/app/actions/settingActions";
import { BestSellersSection } from "@/components/storefront/BestSellersSection";
import { HomeCollectionsSection } from "@/components/storefront/HomeCollectionsSection";
import { HomeHero } from "@/components/storefront/HomeHero";
import { ProductCard } from "@/components/storefront/ProductCard";
import { DEFAULT_STOREFRONT_THEME, getFeaturedProductGridClass } from "@/lib/storefront-theme";
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

  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      <HomeHero
        theme={theme}
        heroTitle={setting?.heroTitle ?? null}
        heroSubtitle={setting?.heroSubtitle ?? null}
        heroButtonText={setting?.heroButtonText ?? null}
        heroButtonLink={setting?.heroButtonLink ?? null}
        heroImageUrl={setting?.heroImageUrl ?? null}
        heroOverlayImageUrl={setting?.heroOverlayImageUrl ?? null}
      />

      <HomeCollectionsSection />

      <BestSellersSection />

      <section id="products" className="scroll-mt-24">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="sf-section-heading text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Featured products
            </h2>
            <p className="mt-1 text-sm text-zinc-600">The latest picks from the store.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-14 text-center text-zinc-600">
            No products yet. Add products in Admin to show them here.
          </p>
        ) : (
          <ul className={getFeaturedProductGridClass(theme)}>
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard
                  name={p.name}
                  price={p.price}
                  currency={p.currency}
                  imageUrl={p.images[0]?.url ?? null}
                  href={`/product/${p.id}`}
                  className="rounded-none border-0 shadow-none ring-1 ring-zinc-200/90"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
