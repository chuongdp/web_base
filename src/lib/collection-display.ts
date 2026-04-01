import type { CollectionDisplayPreset } from "@prisma/client";

/**
 * All collection/category links must stay on this app. Never point category navigation to external sites.
 */
export function collectionPath(slug: string): string {
  const s = slug.trim();
  if (!s) return "/shop";
  return `/category/${encodeURIComponent(s)}`;
}

const GRADIENTS_DEFAULT = [
  "from-violet-600 via-purple-600 to-fuchsia-600",
  "from-sky-600 via-blue-600 to-indigo-700",
  "from-emerald-600 via-teal-600 to-cyan-700",
  "from-amber-500 via-orange-600 to-rose-600",
  "from-slate-700 via-zinc-800 to-neutral-900",
  "from-pink-600 via-rose-600 to-red-700",
  "from-cyan-600 via-blue-600 to-violet-700",
  "from-lime-600 via-green-600 to-emerald-800",
];

const GRADIENTS_CLOTHING = [
  "from-rose-500 via-fuchsia-600 to-indigo-700",
  "from-orange-500 via-red-600 to-rose-800",
  "from-stone-600 via-neutral-800 to-zinc-900",
  "from-pink-500 via-rose-600 to-red-800",
];

const GRADIENTS_DRINKWARE = [
  "from-cyan-500 via-sky-600 to-blue-800",
  "from-stone-400 via-slate-500 to-zinc-700",
  "from-teal-500 via-cyan-600 to-sky-800",
  "from-amber-600 via-orange-700 to-amber-900",
];

const GRADIENTS_HOUSEHOLD = [
  "from-lime-600 via-emerald-700 to-green-900",
  "from-amber-600 via-yellow-700 to-orange-800",
  "from-slate-500 via-zinc-600 to-neutral-800",
  "from-emerald-600 via-teal-700 to-cyan-900",
];

function gradientPool(preset: CollectionDisplayPreset): string[] {
  switch (preset) {
    case "clothing":
      return GRADIENTS_CLOTHING;
    case "drinkware":
      return GRADIENTS_DRINKWARE;
    case "household":
      return GRADIENTS_HOUSEHOLD;
    default:
      return GRADIENTS_DEFAULT;
  }
}

/** Home page “Shop by category” tile: shape + gradient. */
export function resolveCollectionTileStyle(preset: CollectionDisplayPreset, index: number) {
  const pool = gradientPool(preset);
  const gradient = pool[index % pool.length];
  const aspect: Record<CollectionDisplayPreset, string> = {
    default: "aspect-[4/3]",
    clothing: "aspect-[3/4]",
    drinkware: "aspect-square",
    household: "aspect-[5/4]",
  };
  return { gradient, aspectClass: aspect[preset] };
}

/** Category listing page: product grid. */
export function resolveCategoryListingLayout(preset: CollectionDisplayPreset) {
  const grid: Record<CollectionDisplayPreset, string> = {
    default: "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6",
    clothing: "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3",
    drinkware: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6",
    household: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6",
  };
  const section: Record<CollectionDisplayPreset, string> = {
    default: "",
    clothing: "max-w-6xl mx-auto",
    drinkware: "",
    household: "",
  };
  return { gridClass: grid[preset], sectionClass: section[preset] };
}

export const COLLECTION_DISPLAY_OPTIONS: {
  value: CollectionDisplayPreset;
  label: string;
  hint: string;
}[] = [
  { value: "default", label: "Default", hint: "Balanced tiles and product grid." },
  { value: "clothing", label: "Apparel", hint: "Taller tiles, 3-column product grid on large screens." },
  { value: "drinkware", label: "Drinkware & mugs", hint: "Square tiles, denser product grid." },
  { value: "household", label: "Household", hint: "Wider tiles, roomy product grid." },
];

/** When category has no own preset, use global default from CollectionConfig. */
export function resolveEffectiveDisplayPreset(
  categoryPreset: CollectionDisplayPreset | null | undefined,
  globalDefault: CollectionDisplayPreset,
): CollectionDisplayPreset {
  return categoryPreset ?? globalDefault;
}

/** Ảnh thumb thẻ danh mục: ưu tiên URL danh mục, sau đó URL mặc định CollectionConfig. */
export function resolveEffectiveTileImageUrl(
  categoryUrl: string | null | undefined,
  globalUrl: string | null | undefined,
): string | null {
  const c = categoryUrl?.trim();
  if (c) return c;
  const g = globalUrl?.trim();
  return g && g.length > 0 ? g : null;
}
