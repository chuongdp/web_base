import type { StorefrontTheme } from "@prisma/client";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHeroLayoutMode } from "@/lib/storefront-theme";

function ensureHttps(url: string): string {
  const t = url.trim();
  if (t.startsWith("//")) return `https:${t}`;
  return t;
}

type Props = {
  theme: StorefrontTheme;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroButtonText?: string | null;
  heroButtonLink?: string | null;
  heroImageUrl?: string | null;
  heroOverlayImageUrl?: string | null;
  heroImageWidthPx?: number | null;
  heroImageHeightPx?: number | null;
};

function heroImgBoxStyle(w?: number | null, h?: number | null): CSSProperties | undefined {
  const s: CSSProperties = {};
  if (w && w > 0) s.maxWidth = `${w}px`;
  if (h && h > 0) s.maxHeight = `${h}px`;
  return Object.keys(s).length ? s : undefined;
}

function HeroCta({
  showCta,
  buttonHref,
  buttonText,
  className,
}: {
  showCta: boolean;
  buttonHref: string;
  buttonText: string;
  className?: string;
}) {
  if (!showCta) return null;
  return (
    <div className={className}>
      <Link
        href={buttonHref}
        className="inline-flex min-h-[48px] items-center justify-center px-10 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
        style={{ backgroundColor: "var(--sf-primary)" }}
      >
        {buttonText}
      </Link>
    </div>
  );
}

export function HomeHero({
  theme,
  heroTitle,
  heroSubtitle,
  heroButtonText,
  heroButtonLink,
  heroImageUrl,
  heroOverlayImageUrl,
  heroImageWidthPx,
  heroImageHeightPx,
}: Props) {
  const imgBox = heroImgBoxStyle(heroImageWidthPx, heroImageHeightPx);
  const title = heroTitle?.trim() ?? "";
  const subtitle = heroSubtitle?.trim() ?? "";
  const buttonText = heroButtonText?.trim() ?? "";
  const linkRaw = heroButtonLink?.trim() ?? "";
  const buttonHref = linkRaw.length > 0 ? linkRaw : "/#products";

  const mainImg = heroImageUrl?.trim() ? ensureHttps(heroImageUrl) : null;
  const overlayImg = heroOverlayImageUrl?.trim() ? ensureHttps(heroOverlayImageUrl) : null;

  const showCta = buttonText.length > 0;
  const mode = getHeroLayoutMode(theme);

  if (mode === "editorialCinematic") {
    return (
      <section className="relative left-1/2 mb-8 w-screen max-w-[100vw] -translate-x-1/2">
        <div
          className="relative aspect-[4/5] w-full sm:aspect-[21/9] lg:aspect-[2.4/1]"
          style={imgBox}
        >
          {mainImg ? (
            <Image
              src={mainImg}
              alt={title || "Hero"}
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized={mainImg.startsWith("/")}
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-zinc-200" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent sm:from-black/40" />
        </div>
        <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:py-12">
          {title ? (
            <h1 className="sf-hero-title text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">{subtitle}</p>
          ) : null}
          <HeroCta showCta={showCta} buttonHref={buttonHref} buttonText={buttonText} className="mt-8" />
        </div>
      </section>
    );
  }

  if (mode === "splitBorder") {
    return (
      <section className="grid gap-0 overflow-hidden border border-zinc-200 lg:grid-cols-2 lg:min-h-[min(520px,70vh)]">
        <div className="order-2 flex flex-col justify-center border-t border-zinc-200 p-8 sm:p-10 lg:order-1 lg:border-r lg:border-t-0">
          {title ? (
            <h1 className="sf-hero-title text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-600">{subtitle}</p>
          ) : null}
          <HeroCta showCta={showCta} buttonHref={buttonHref} buttonText={buttonText} className="mt-8" />
        </div>
        <div
          className="relative order-1 aspect-[4/3] min-h-[240px] bg-zinc-100 lg:order-2 lg:aspect-auto lg:min-h-0"
          style={imgBox}
        >
          {mainImg ? (
            <Image
              src={mainImg}
              alt={title || "Hero"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized={mainImg.startsWith("/")}
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 p-6 text-center">
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">Hero image</span>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (mode === "splitBorderReverse") {
    return (
      <section className="grid gap-0 overflow-hidden border-2 border-zinc-900 lg:grid-cols-2 lg:min-h-[min(520px,70vh)]">
        <div
          className="relative order-1 aspect-[4/3] min-h-[240px] bg-zinc-100 lg:aspect-auto lg:min-h-0"
          style={imgBox}
        >
          {mainImg ? (
            <Image
              src={mainImg}
              alt={title || "Hero"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized={mainImg.startsWith("/")}
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300 p-6 text-center">
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-600">Hero image</span>
            </div>
          )}
        </div>
        <div className="order-2 flex flex-col justify-center border-t border-zinc-900 bg-zinc-50/90 p-8 sm:p-10 lg:border-l lg:border-t-0">
          {title ? (
            <h1 className="sf-hero-title text-3xl font-semibold uppercase tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-600">{subtitle}</p>
          ) : null}
          <HeroCta showCta={showCta} buttonHref={buttonHref} buttonText={buttonText} className="mt-8" />
        </div>
      </section>
    );
  }

  if (mode === "wideCopy") {
    return (
      <section className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
        <div className="min-w-0 flex-1">
          {title ? (
            <h1 className="sf-hero-title text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl lg:max-w-[22ch] lg:text-6xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">{subtitle}</p>
          ) : null}
          <HeroCta showCta={showCta} buttonHref={buttonHref} buttonText={buttonText} className="mt-10" />
        </div>
        <div className="relative mx-auto w-full max-w-xs shrink-0 lg:mx-0 lg:mt-2" style={imgBox}>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-200">
            {mainImg ? (
              <Image
                src={mainImg}
                alt={title || "Hero"}
                fill
                className="object-cover"
                sizes="320px"
                unoptimized={mainImg.startsWith("/")}
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 p-4 text-center text-xs text-zinc-500">
                Image
              </div>
            )}
          </div>
          {overlayImg ? (
            <div className="absolute -bottom-3 -right-2 z-10 w-[38%] overflow-hidden rounded-lg border-2 border-white shadow-md">
              <div className="relative aspect-square w-full">
                <Image
                  src={overlayImg}
                  alt={title ? `${title} — overlay` : "Overlay"}
                  fill
                  className="object-cover"
                  sizes="120px"
                  unoptimized={overlayImg.startsWith("/")}
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  if (mode === "warmCard") {
    return (
      <section className="rounded-[2rem] bg-white/90 p-6 shadow-lg ring-1 ring-amber-200/60 sm:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-1">
            {title ? (
              <h1 className="sf-hero-title mt-1 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-600">{subtitle}</p>
            ) : null}
            <HeroCta showCta={showCta} buttonHref={buttonHref} buttonText={buttonText} className="mt-8" />
          </div>
          <div className="relative order-1 lg:order-2" style={imgBox}>
            <div className="relative mx-auto aspect-[3/4] max-h-[min(480px,65vh)] w-full max-w-md overflow-hidden rounded-[1.75rem] bg-zinc-200 shadow-inner">
              {mainImg ? (
                <Image
                  src={mainImg}
                  alt={title || "Hero"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 28rem"
                  unoptimized={mainImg.startsWith("/")}
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100/80 p-6 text-center">
                  <span className="text-xs font-medium uppercase tracking-widest text-amber-800/70">Hero image</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-3 left-4 z-10 w-[40%] max-w-[160px] overflow-hidden rounded-2xl border-4 border-white bg-zinc-300 shadow-lg">
              {overlayImg ? (
                <div className="relative aspect-square w-full">
                  <Image
                    src={overlayImg}
                    alt={title ? `${title} — overlay` : "Overlay"}
                    fill
                    className="object-cover"
                    sizes="160px"
                    unoptimized={overlayImg.startsWith("/")}
                  />
                </div>
              ) : (
                <div className="aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 p-2 text-center text-[10px] text-amber-900/70">
                  Overlay
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* boutique — default */
  return (
    <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="order-2 lg:order-1">
        {title ? (
          <h1 className="sf-hero-title mt-1 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-[2.75rem]">
            {title}
          </h1>
        ) : null}
        {subtitle ? (
          <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-600">{subtitle}</p>
        ) : null}
        <HeroCta showCta={showCta} buttonHref={buttonHref} buttonText={buttonText} className="mt-8" />
      </div>

      <div className="relative order-1 lg:order-2" style={imgBox}>
        <div className="relative mx-auto aspect-[3/4] max-h-[min(520px,70vh)] w-full max-w-md overflow-hidden rounded-2xl bg-zinc-200">
          {mainImg ? (
            <Image
              src={mainImg}
              alt={title || "Hero"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 28rem"
              unoptimized={mainImg.startsWith("/")}
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 p-6 text-center">
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">Hero image</span>
              <span className="mt-2 text-sm text-zinc-400">Add image URL in CMS</span>
            </div>
          )}
        </div>
        <div className="absolute -bottom-4 left-0 z-10 w-[42%] max-w-[180px] overflow-hidden rounded-xl border-4 border-white bg-zinc-300 shadow-lg sm:-bottom-6 sm:left-4">
          {overlayImg ? (
            <div className="relative aspect-square w-full">
              <Image
                src={overlayImg}
                alt={title ? `${title} — overlay` : "Overlay"}
                fill
                className="object-cover"
                sizes="180px"
                unoptimized={overlayImg.startsWith("/")}
              />
            </div>
          ) : (
            <div className="aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300 p-3 text-center">
              <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">Overlay</span>
              <span className="mt-1 text-[10px] text-zinc-500">Lifestyle</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
