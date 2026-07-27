import Link from "next/link";
import { HomeSectionHeader } from "@/components/storefront/HomeSectionHeader";
import { ProductCard } from "@/components/storefront/ProductCard";
import { HOME_PRODUCT_CARD_CLASS } from "@/lib/storefront-home";
import { getBestSellersSectionClasses } from "@/lib/storefront-theme";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

export async function BestSellersSection() {
  const [products, site] = await Promise.all([
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    }),
    getSiteSettings(),
  ]);
  const { titleAccent, grid: gridClass, headerAlign } = getBestSellersSectionClasses(site.storefrontTheme);

  return (
    <section className="scroll-mt-24" aria-labelledby="best-sellers-heading">
      <div className="sf-home-section-rule mb-10 sm:mb-12" aria-hidden />
      <HomeSectionHeader
        id="best-sellers-heading"
        eyebrow="Top picks"
        title="Best Sellers"
        description="Popular pieces shoppers reach for first."
        align={headerAlign}
        titleClassName={titleAccent}
        action={{ href: "/shop", label: "View all" }}
      />

      {products.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-zinc-200/90 bg-zinc-50/80 px-6 py-16 text-center text-sm text-zinc-600">
          No products yet.
        </p>
      ) : (
        <>
          <ul className={gridClass}>
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard
                  name={p.name}
                  price={p.price}
                  currency={p.currency}
                  imageUrl={p.images[0]?.url ?? null}
                  href={`/product/${p.id}`}
                  imageHoverZoom
                  className={HOME_PRODUCT_CARD_CLASS}
                />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center sm:mt-12">
            <Link
              href="/shop"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--sf-card-radius)] border border-zinc-900/90 bg-transparent px-8 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
            >
              View all products
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
