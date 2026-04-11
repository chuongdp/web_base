import type { CSSProperties } from "react";
import Image from "next/image";
import { getSiteSetting } from "@/app/actions/settingActions";
import { CustomerGallery } from "@/components/storefront/CustomerGallery";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ABOUT_CONTENT_DEFAULTS } from "@/lib/storefront-content-defaults";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const IMG_PRINT =
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&q=80&auto=format&fit=crop";
const IMG_FABRIC =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80&auto=format&fit=crop";
const IMG_FASHION =
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80&auto=format&fit=crop";

export default async function AboutUsPage() {
  const [s, bestSellers] = await Promise.all([
    getSiteSetting(),
    prisma.product.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    }),
  ]);

  const d = ABOUT_CONTENT_DEFAULTS;
  const heroTitle = s?.aboutHeroTitle ?? d.heroTitle;
  const whoTitle = s?.aboutWhoTitle ?? d.whoTitle;
  const introP1 = s?.aboutIntroP1 ?? d.introP1;
  const introP2 = s?.aboutIntroP2 ?? d.introP2;
  const b1t = s?.aboutBlock1Title ?? d.block1Title;
  const b1body = s?.aboutBlock1Body ?? d.block1Body;
  const b1img = s?.aboutBlock1ImageUrl ?? IMG_PRINT;
  const b2t = s?.aboutBlock2Title ?? d.block2Title;
  const b2body = s?.aboutBlock2Body ?? d.block2Body;
  const b2img = s?.aboutBlock2ImageUrl ?? IMG_FABRIC;
  const b3t = s?.aboutBlock3Title ?? d.block3Title;
  const b3body = s?.aboutBlock3Body ?? d.block3Body;
  const b3img = s?.aboutBlock3ImageUrl ?? IMG_FASHION;
  const bestTitle = s?.aboutBestSellersTitle ?? d.bestSellersTitle;

  const aboutImgStyle: CSSProperties | undefined =
    (s?.aboutBlockImageWidthPx && s.aboutBlockImageWidthPx > 0) ||
    (s?.aboutBlockImageHeightPx && s.aboutBlockImageHeightPx > 0)
      ? {
          maxWidth: s?.aboutBlockImageWidthPx && s.aboutBlockImageWidthPx > 0 ? `${s.aboutBlockImageWidthPx}px` : undefined,
          maxHeight: s?.aboutBlockImageHeightPx && s.aboutBlockImageHeightPx > 0 ? `${s.aboutBlockImageHeightPx}px` : undefined,
        }
      : undefined;

  return (
    <div className="-mx-4 -mt-10 lg:-mx-8">
      <section
        className="flex min-h-[40vh] items-center justify-center bg-blue-900 px-4"
        aria-labelledby="about-hero-heading"
      >
        <h1 id="about-hero-heading" className="text-center text-5xl font-bold text-white">
          {heroTitle}
        </h1>
      </section>

      <section className="bg-white px-4 py-16 md:py-20 lg:px-0">
        <h2 className="text-center font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {whoTitle}
        </h2>
        <div className="mx-auto mt-8 max-w-4xl space-y-4 text-center text-base leading-relaxed text-zinc-600">
          <p>{introP1}</p>
          <p>{introP2}</p>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 md:py-20 lg:px-0">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-12">
          <div className="order-2 space-y-4 md:order-1">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{b1t}</h2>
            <p className="text-base leading-relaxed text-zinc-600">{b1body}</p>
          </div>
          <div
            className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-200 md:order-2"
            style={aboutImgStyle}
          >
            <Image src={b1img} alt={b1t} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-20 lg:px-0">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-12">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-200"
            style={aboutImgStyle}
          >
            <Image src={b2img} alt={b2t} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{b2t}</h2>
            <p className="text-base leading-relaxed text-zinc-600">{b2body}</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 md:py-20 lg:px-0">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-12">
          <div className="order-2 space-y-4 md:order-1">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{b3t}</h2>
            <p className="text-base leading-relaxed text-zinc-600">{b3body}</p>
          </div>
          <div
            className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-200 md:order-2"
            style={aboutImgStyle}
          >
            <Image src={b3img} alt={b3t} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-20 lg:px-0">
        <div className="mx-auto max-w-7xl">
          <CustomerGallery
            heading={s?.galleryHeading}
            subtitle={s?.gallerySubtitle}
            imageUrlsText={s?.galleryImageUrls}
          />
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-20 lg:px-0">
        <h2 className="text-center font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {bestTitle}
        </h2>
        {bestSellers.length === 0 ? (
          <p className="mx-auto mt-10 max-w-xl text-center text-zinc-600">No products to show yet.</p>
        ) : (
          <ul className="mx-auto mt-10 grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-5">
            {bestSellers.map((p) => (
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
      </section>
    </div>
  );
}
