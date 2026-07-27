import Link from "next/link";

export function HomeShopCtaBand() {
  return (
    <section className="sf-home-cta-band relative overflow-hidden rounded-2xl px-6 py-12 text-center sm:px-10 sm:py-14">
      <div className="sf-home-cta-band-glow pointer-events-none absolute inset-0" aria-hidden />
      <p className="sf-home-eyebrow mb-3">Curated for you</p>
      <h2 className="sf-section-heading text-balance text-2xl font-semibold text-zinc-900 sm:text-3xl">
        Find your next favorite piece
      </h2>
      <p className="mx-auto mt-3 max-w-md text-pretty text-sm text-zinc-600 sm:text-base">
        Browse the full catalog — new drops, best sellers, and collections in one place.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="sf-btn-primary-glow inline-flex min-h-[48px] items-center justify-center rounded-[var(--sf-card-radius)] px-8 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          style={{ backgroundColor: "var(--sf-primary)" }}
        >
          Shop now
        </Link>
        <Link
          href="/collections"
          className="inline-flex min-h-[48px] items-center justify-center rounded-[var(--sf-card-radius)] border border-zinc-300/90 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-900 backdrop-blur-sm transition hover:border-zinc-400"
        >
          Collections
        </Link>
      </div>
    </section>
  );
}
