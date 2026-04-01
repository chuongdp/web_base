import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getCollectionConfig } from "@/lib/collection-config";
import { resolveCategoryListingLayout, resolveEffectiveDisplayPreset } from "@/lib/collection-display";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = await prisma.productCollection.findUnique({
    where: { slug },
    select: { name: true },
  });
  if (!col) return { title: "Collection" };
  return { title: col.name };
}

export default async function ProductCollectionPage({ params }: Props) {
  const { slug } = await params;

  const [col, collConfig] = await Promise.all([
    prisma.productCollection.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { updatedAt: "desc" },
          include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
        },
      },
    }),
    getCollectionConfig(),
  ]);

  if (!col) notFound();

  const preset = resolveEffectiveDisplayPreset(undefined, collConfig.defaultDisplayPreset);
  const { gridClass, sectionClass } = resolveCategoryListingLayout(preset);

  return (
    <div>
      <nav className="mb-4 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-800">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/collections" className="hover:text-zinc-800">
          Collections
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-800">{col.name}</span>
      </nav>

      <h1 className="text-2xl font-semibold text-zinc-900">{col.name}</h1>
      {col.description ? <p className="mt-2 text-sm text-zinc-600">{col.description}</p> : null}

      <div className={`mt-8 ${sectionClass}`}>
        {col.products.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-center text-zinc-600">
            Chưa có sản phẩm trong bộ sưu tập này.
          </p>
        ) : (
          <ul className={gridClass}>
            {col.products.map((p) => (
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
    </div>
  );
}
