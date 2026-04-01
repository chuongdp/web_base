import { CategoriesTable } from "@/components/admin/CategoriesTable";
import { getCollectionConfig } from "@/lib/collection-config";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [rows, coll] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        displayPreset: true,
        tileImageUrl: true,
      },
    }),
    getCollectionConfig(),
  ]);

  return (
    <CategoriesTable
      categories={rows}
      collectionGlobalDefault={coll.defaultDisplayPreset}
      collectionDefaultTileImageUrl={coll.defaultTileImageUrl}
    />
  );
}
