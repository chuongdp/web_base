import Image from "next/image";
import Link from "next/link";
import { getCollectionConfig } from "@/lib/collection-config";
import {
  collectionPath,
  resolveCollectionTileStyle,
  resolveEffectiveDisplayPreset,
  resolveEffectiveTileImageUrl,
} from "@/lib/collection-display";
import { productCollectionPath } from "@/lib/product-collection-path";
import { getCategorySectionClasses } from "@/lib/storefront-theme";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

function ensureHttps(url: string): string {
  const t = url.trim();
  if (t.startsWith("//")) return `https:${t}`;
  return t;
}

export async function HomeCollectionsSection() {
  const [productCollections, categories, config, site] = await Promise.all([
    prisma.productCollection.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: 12,
      include: {
        _count: { select: { products: true } },
        products: {
          take: 1,
          orderBy: { updatedAt: "desc" },
          include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
        },
      },
    }),
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
    getSiteSettings(),
  ]);

  const {
    heading: headingClass,
    grid: gridClass,
    tileRounded,
    browseHeaderMode,
  } = getCategorySectionClasses(site.storefrontTheme);

  const showViewAll = productCollections.length > 0;

  const headerBlock =
    browseHeaderMode === "row" ? (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="home-browse-heading" className={headingClass}>
          {config.homeSectionHeading}
        </h2>
        {showViewAll ? (
          <Link
            href="/collections"
            className="shrink-0 text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
          >
            Xem tất cả
          </Link>
        ) : null}
      </div>
    ) : (
      <div className="flex flex-col items-center text-center">
        <h2 id="home-browse-heading" className={headingClass}>
          {config.homeSectionHeading}
        </h2>
        {showViewAll ? (
          <Link
            href="/collections"
            className="mt-3 text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
          >
            Xem tất cả
          </Link>
        ) : null}
      </div>
    );

  if (productCollections.length > 0) {
    return (
      <section className="scroll-mt-24" aria-labelledby="home-browse-heading">
        {headerBlock}
        <ul className={gridClass}>
          {productCollections.map((col, i) => {
            const raw = col.products[0]?.images[0]?.url;
            const coverUrl = raw?.trim() ? ensureHttps(raw) : null;
            const count = col._count.products;
            const { gradient } = resolveCollectionTileStyle(config.defaultDisplayPreset, i);
            return (
              <li key={col.id}>
                <Link
                  href={productCollectionPath(col.slug)}
                  className={`group relative block aspect-[4/3] overflow-hidden ${tileRounded} shadow-md ring-1 ring-black/10 transition-shadow hover:shadow-lg`}
                >
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={col.name}
                      fill
                      className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      unoptimized={coverUrl.startsWith("/")}
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-500 ease-out will-change-transform group-hover:scale-105`}
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 pt-14">
                    <p className="text-lg font-bold leading-tight text-white drop-shadow sm:text-xl">{col.name}</p>
                    {col.description ? (
                      <p className="mt-1 line-clamp-2 text-left text-sm text-white/90">{col.description}</p>
                    ) : null}
                    <p className="mt-2 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                      {count} sản phẩm
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="scroll-mt-24" aria-labelledby="home-browse-heading">
      {headerBlock}
      <ul className={gridClass}>
        {categories.map((c, i) => {
          const preset = resolveEffectiveDisplayPreset(c.displayPreset, config.defaultDisplayPreset);
          const imgUrl = resolveEffectiveTileImageUrl(c.tileImageUrl, config.defaultTileImageUrl);
          const { gradient, aspectClass } = resolveCollectionTileStyle(preset, i);
          return (
            <li key={c.id}>
              <Link
                href={collectionPath(c.slug)}
                className={`group relative block ${aspectClass} overflow-hidden ${tileRounded} shadow-md ring-1 ring-black/10 transition-shadow hover:shadow-lg`}
              >
                {imgUrl ? (
                  <>
                    <Image
                      src={imgUrl}
                      alt={c.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
                      unoptimized={imgUrl.startsWith("/")}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                  </>
                ) : (
                  <>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-500 ease-out will-change-transform group-hover:scale-105`}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12),_transparent_55%)] opacity-80" />
                    <div className="pointer-events-none absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/35" />
                  </>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 pt-14">
                  <span className="text-lg font-bold leading-tight text-white drop-shadow sm:text-xl">{c.name}</span>
                  {c.description ? (
                    <span className="mt-1 line-clamp-2 text-left text-sm text-white/90">{c.description}</span>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
