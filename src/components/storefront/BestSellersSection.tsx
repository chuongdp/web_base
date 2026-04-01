import Link from "next/link";
import { ProductCard } from "@/components/storefront/ProductCard";
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
  const { heading: headingClass, grid: gridClass } = getBestSellersSectionClasses(site.storefrontTheme);

  return (
    <section className="scroll-mt-24" aria-labelledby="best-sellers-heading">
      <h2 id="best-sellers-heading" className={headingClass}>
        Best Sellers
      </h2>

      {products.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-14 text-center text-zinc-600">
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
                  className="rounded-none border-0 shadow-none ring-1 ring-zinc-200/90"
                />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-lg border-2 border-zinc-900 bg-transparent px-8 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
            >
              View All
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
