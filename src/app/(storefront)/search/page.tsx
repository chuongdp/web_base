import Link from "next/link";
import { ProductCard } from "@/components/storefront/ProductCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const term = (q ?? "").trim();

  const products =
    term.length === 0
      ? []
      : await prisma.product.findMany({
          where: {
            name: { contains: term },
          },
          orderBy: { updatedAt: "desc" },
          include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
        });

  return (
    <div className="py-10">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-800">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-800">Search</span>
      </nav>

      {!term ? (
        <p className="py-16 text-center text-base text-zinc-600">Enter a search keyword to find products.</p>
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-base text-zinc-600">
          No products match: <span className="font-medium text-zinc-900">{term}</span>
        </p>
      ) : (
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Search Results for: {term}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              {products.length} {products.length === 1 ? "result" : "results"}
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
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
        </div>
      )}
    </div>
  );
}
