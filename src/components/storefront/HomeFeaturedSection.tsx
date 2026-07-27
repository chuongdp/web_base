import type { Currency, StorefrontTheme } from "@prisma/client";
import { HomeSectionHeader } from "@/components/storefront/HomeSectionHeader";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getFeaturedProductGridClass, getHomeFeaturedHeaderAlign } from "@/lib/storefront-theme";
import { HOME_PRODUCT_CARD_CLASS } from "@/lib/storefront-home";

export type HomeFeaturedProduct = {
  id: string;
  name: string;
  price: { toString(): string } | number | string;
  currency: Currency;
  imageUrl: string | null;
};

type Props = {
  theme: StorefrontTheme;
  products: HomeFeaturedProduct[];
};

export function HomeFeaturedSection({ theme, products }: Props) {
  const gridClass = getFeaturedProductGridClass(theme);
  const headerAlign = getHomeFeaturedHeaderAlign(theme);

  return (
    <section id="products" className="scroll-mt-24">
      <div className="sf-home-section-rule mb-10 sm:mb-12" aria-hidden />
      <HomeSectionHeader
        id="home-featured-heading"
        eyebrow="New arrivals"
        title="Featured products"
        description="Fresh picks from the catalog — styled for how you shop online."
        align={headerAlign}
        action={{ href: "/shop", label: "Shop all" }}
      />

      {products.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-zinc-200/90 bg-zinc-50/80 px-6 py-16 text-center text-sm text-zinc-600">
          No products yet. Add products in Admin to show them here.
        </p>
      ) : (
        <ul className={`${gridClass} mt-10 sm:mt-12`}>
          {products.map((p, index) => (
            <li key={p.id} className={index === 0 ? "lg:col-span-1" : undefined}>
              <ProductCard
                name={p.name}
                price={p.price}
                currency={p.currency}
                imageUrl={p.imageUrl}
                href={`/product/${p.id}`}
                imageHoverZoom
                className={HOME_PRODUCT_CARD_CLASS}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
