import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { productCollectionPath } from "@/lib/product-collection-path";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Collections",
};

export default async function CollectionsIndexPage() {
  const items = await prisma.productCollection.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: { select: { products: true } },
    },
  });

  return (
    <div>
      <nav className="mb-4 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-800">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-800">Collections</span>
      </nav>

      <h1 className="text-2xl font-semibold text-zinc-900">Collections</h1>
      <p className="mt-2 text-sm text-zinc-600">Bộ sưu tập được chọn lọc từ cửa hàng.</p>

      {items.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-center text-zinc-600">
          Chưa có bộ sưu tập nào.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <li key={c.id}>
              <Link
                href={productCollectionPath(c.slug)}
                className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow"
              >
                <h2 className="font-medium text-zinc-900">{c.name}</h2>
                {c.description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{c.description}</p>
                ) : null}
                <p className="mt-3 text-xs text-zinc-500">{c._count.products} sản phẩm</p>
                <span className="mt-3 inline-block text-sm font-medium text-zinc-800">Xem →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
