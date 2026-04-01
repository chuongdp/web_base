import { ProductsTable } from "@/components/admin/ProductsTable";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories, collections, site] = await Promise.all([
    prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        category: { select: { name: true } },
        productCollections: { select: { id: true, name: true } },
        images: { orderBy: { sortOrder: "asc" } },
        sizeStocks: { select: { sizeLabel: true, quantity: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.productCollection.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
    getSiteSettings(),
  ]);

  const productRows = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    materials: p.materials,
    careInstructions: p.careInstructions,
    shippingDetails: p.shippingDetails,
    sizes: p.sizes,
    sizeStocks: p.sizeStocks.map((s) => ({ sizeLabel: s.sizeLabel, quantity: s.quantity })),
    price: p.price.toString(),
    currency: p.currency,
    images: p.images.map((img) => img.url),
    categoryId: p.categoryId,
    categoryName: p.category.name,
    collectionIds: p.productCollections.map((c) => c.id),
  }));

  return (
    <ProductsTable
      products={productRows}
      categories={categories}
      collectionOptions={collections}
      defaultStoreCurrency={site.defaultCurrency}
    />
  );
}
