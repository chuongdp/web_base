import { ProductCollectionsTable } from "@/components/admin/ProductCollectionsTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProductCollectionsPage() {
  const rows = await prisma.productCollection.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      sortOrder: true,
      _count: { select: { products: true } },
    },
  });

  return <ProductCollectionsTable rows={rows} />;
}
