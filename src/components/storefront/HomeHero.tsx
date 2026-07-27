import type { StorefrontTheme } from "@prisma/client";
import type { CSSProperties, ReactNode } from "react";
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
  return (
    <div className={`flex flex-wrap items-center gap-3 sm:gap-4 ${className ?? ""}`}>
      {showCta ? (
        <Link
          href={buttonHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-[var(--sf-card-radius)] px-8 py-3 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:brightness-110 active:scale-[0.99] sf-btn-primary-glow"
          style={{ backgroundColor: "var(--sf-primary)" }}
        >
          {buttonText}
        </Link>
      ) : null}
      <Link
        href="/shop"
        className="inline-flex min-h-[48px] items-center justify-center rounded-[var(--sf-card-radius)] border border-zinc-300/90 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-900 backdrop-blur-sm transition hover:border-zinc-400 hover:bg-white"
      >
        Browse shop
      </Link>
    </div>
  );
}

function HeroTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <h1
      className={`sf-hero-title text-balance font-semibold leading-[1.08] tracking-tight text-zinc-900 ${className}`}
    >
      {children}
    </h1>
  );
}

function HeroSubtitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  if (!children) return null;
  return <p className={`text-pretty leading-relaxed text-zinc-600 ${className}`}>{children}</p>;
}

function HeroImageGlow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] opacity-60 sm:-inset-4 ${className}`}
      style={{
        background:
          "radial-gradient(ellipse at 70% 30%, color-mix(in srgb, var(--sf-primary) 18%, transparent), transparent 55%)",
      }}
      aria-hidden
    />
  );
}

function HeroMediaFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`sf-hero-media-shine relative overflow-hidden ${className}`}>{children}</div>;
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
      <section className="relative left-1/2 mb-2 w-screen max-w-[100vw] -translate-x-1/2">
        <div
          className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[21/9] lg:aspect-[2.4/1]"
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/5" />
          <div className="absolute inset-x-0 bottom-0 hidden px-6 pb-8 pt-24 text-center lg:block lg:px-10 lg:pb-10">
            {title ? (
              <HeroTitle className="mx-auto max-w-4xl text-3xl text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                {title}
              </HeroTitle>
            ) : null}
            {subtitle ? (
              <HeroSubtitle className="mx-auto mt-4 max-w-xl text-base text-white/90 sm:text-lg">{subtitle}</HeroSubtitle>
            ) : null}
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:py-10 lg:hidden">
          {title ? <HeroTitle className="text-3xl sm:text-4xl">{title}</HeroTitle> : null}
          {subtitle ? (
            <HeroSubtitle className="mx-auto mt-4 max-w-xl text-base sm:text-lg">{subtitle}</HeroSubtitle>
          ) : null}
          <HeroCta
            showCta={showCta}
            buttonHref={buttonHref}
            buttonText={buttonText}
            className="mt-8 justify-center"
          />
        </div>
        <div className="mx-auto hidden max-w-3xl px-4 pb-2 text-center lg:block">
          <HeroCta
            showCta={showCta}
            buttonHref={buttonHref}
            buttonText={buttonText}
            className="mt-2 justify-center"
          />
        </div>
      </section>
    );
  }

  if (mode === "splitBorder") {
    return (
      <section className="grid gap-0 overflow-hidden rounded-[var(--sf-card-radius)] border border-zinc-200/90 shadow-sm ring-1 ring-zinc-900/[0.04] lg:grid-cols-2 lg:min-h-[min(520px,70vh)]">
        <div className="order-2 flex flex-col justify-center border-t border-zinc-200 p-8 sm:p-10 lg:order-1 lg:border-r lg:border-t-0">
          {title ? <HeroTitle className="text-3xl sm:text-4xl lg:text-5xl">{title}</HeroTitle> : null}
          {subtitle ? <HeroSubtitle className="mt-5 max-w-md text-base">{subtitle}</HeroSubtitle> : null}
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
      <section className="grid gap-0 overflow-hidden rounded-none border-2 border-zinc-900 shadow-[6px_6px_0_0_rgb(24_24_27)] lg:grid-cols-2 lg:min-h-[min(520px,70vh)]">
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
            <HeroTitle className="text-3xl uppercase sm:text-4xl lg:text-5xl">{title}</HeroTitle>
          ) : null}
          {subtitle ? <HeroSubtitle className="mt-5 max-w-md text-base">{subtitle}</HeroSubtitle> : null}
          <HeroCta showCta={showCta} buttonHref={buttonHref} buttonText={buttonText} className="mt-8" />
        </div>
      </section>
    );
  }

  if (mode === "wideCopy") {
    return (
      <section className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16 xl:gap-20">
        <div className="min-w-0 flex-1 lg:py-2">
          {title ? (
            <HeroTitle className="text-4xl sm:text-5xl lg:max-w-[18ch] lg:text-6xl">{title}</HeroTitle>
          ) : null}
          {subtitle ? <HeroSubtitle className="mt-6 max-w-2xl text-lg">{subtitle}</HeroSubtitle> : null}
          <HeroCta showCta={showCta} buttonHref={buttonHref} buttonText={buttonText} className="mt-10" />
        </div>
        <div className="relative mx-auto w-full max-w-xs shrink-0 lg:mx-0 lg:mt-2" style={imgBox}>
          <HeroImageGlow />
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--sf-card-radius)] bg-zinc-200 shadow-lg ring-1 ring-zinc-900/10">
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
            {title ? <HeroTitle className="text-4xl sm:text-5xl">{title}</HeroTitle> : null}
            {subtitle ? <HeroSubtitle className="mt-5 max-w-md text-base">{subtitle}</HeroSubtitle> : null}
            <HeroCta showCta={showCta} buttonHref={buttonHref} buttonText={buttonText} className="mt-8" />
          </div>
          <div className="relative order-1 lg:order-2" style={imgBox}>
            <HeroImageGlow className="opacity-50" />
            <div className="relative mx-auto aspect-[3/4] max-h-[min(480px,65vh)] w-full max-w-md overflow-hidden rounded-[1.75rem] bg-zinc-200 shadow-inner ring-1 ring-amber-200/50">
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
    <section className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-20">
      <div className="order-2 lg:order-1 lg:py-4">
        {title ? <HeroTitle className="text-4xl sm:text-5xl lg:text-[3.25rem]">{title}</HeroTitle> : null}
        {subtitle ? <HeroSubtitle className="mt-6 max-w-md text-base sm:text-lg">{subtitle}</HeroSubtitle> : null}
        <HeroCta showCta={showCta} buttonHref={buttonHref} buttonText={buttonText} className="mt-9" />
      </div>

      <div className="relative order-1 lg:order-2" style={imgBox}>
        <HeroImageGlow />
          <HeroMediaFrame className="relative mx-auto aspect-[3/4] max-h-[min(540px,72vh)] w-full max-w-md rounded-[var(--sf-card-radius)] bg-zinc-200 shadow-[0_24px_60px_-28px_rgb(0_0_0/0.35)] ring-1 ring-zinc-900/10">
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
        </HeroMediaFrame>
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
