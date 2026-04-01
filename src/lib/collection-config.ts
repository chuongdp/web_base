import { revalidateTag, unstable_cache } from "next/cache";
import { CollectionDisplayPreset } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const DEFAULT_HEADING = "Bộ sưu tập";

export type CollectionConfigDTO = {
  defaultDisplayPreset: CollectionDisplayPreset;
  defaultTileImageUrl: string | null;
  homeSectionHeading: string;
};

async function loadCollectionConfig(): Promise<CollectionConfigDTO> {
  let row = await prisma.collectionConfig.findUnique({ where: { id: 1 } });
  if (!row) {
    row = await prisma.collectionConfig.create({
      data: {
        id: 1,
        defaultDisplayPreset: CollectionDisplayPreset.default,
        homeSectionHeading: DEFAULT_HEADING,
      },
    });
  }
  const raw = row.defaultTileImageUrl?.trim();
  return {
    defaultDisplayPreset: row.defaultDisplayPreset,
    defaultTileImageUrl: raw && raw.length > 0 ? raw : null,
    homeSectionHeading: row.homeSectionHeading?.trim() || DEFAULT_HEADING,
  };
}

export const getCollectionConfig = unstable_cache(loadCollectionConfig, ["collection-config-v3"], {
  revalidate: 300,
  tags: ["collection-config"],
});

export function revalidateCollectionConfigCache() {
  revalidateTag("collection-config");
}
