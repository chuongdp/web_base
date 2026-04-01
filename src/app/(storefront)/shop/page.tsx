import { ProductCard } from "@/components/storefront/ProductCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">All Products</h1>
        <p className="mt-2 text-sm text-zinc-600">Everything in the catalog.</p>
      </div>

      {products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-14 text-center text-zinc-600">
          No products yet. Add products in Admin to show them here.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
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
    </div>
  );
}
