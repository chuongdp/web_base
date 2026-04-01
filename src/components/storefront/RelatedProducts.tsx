import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";

type Props = {
  currentProductId: string;
};

export async function RelatedProducts({ currentProductId }: Props) {
  const products = await prisma.product.findMany({
    where: { id: { not: currentProductId } },
    take: 5,
    orderBy: { updatedAt: "desc" },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });

  if (products.length === 0) return null;

  return (
    <section className="mt-16 border-t border-zinc-200 pt-14">
      <h2 className="text-center font-serif text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
        You May Also Like
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            name={p.name}
            price={p.price}
            currency={p.currency}
            imageUrl={p.images[0]?.url ?? null}
            href={`/product/${p.id}`}
          />
        ))}
      </div>
    </section>
  );
}
