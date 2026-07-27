const ITEMS = [
  {
    label: "Secure checkout",
    detail: "Encrypted payment flow",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M12 11c1.657 0 3-1.343 3-3V5a3 3 0 10-6 0v3c0 1.657 1.343 3 3 3zm-7 8v-2a4 4 0 014-4h6a4 4 0 014 4v2H5z"
        />
      </svg>
    ),
  },
  {
    label: "Tracked shipping",
    detail: "Updates at every step",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M3 7h11v8H3V7zm11 0h4l3 3v5h-7V7zM7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"
        />
      </svg>
    ),
  },
  {
    label: "Easy returns",
    detail: "Hassle-free policy",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7.5M19 5a9 9 0 00-14 7.5"
        />
      </svg>
    ),
  },
] as const;

export function HomeTrustStrip() {
  return (
    <section
      className="sf-home-trust relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/55 px-4 py-6 backdrop-blur-md sm:px-8"
      aria-label="Store policies"
    >
      <div className="sf-home-trust-glow pointer-events-none absolute inset-0" aria-hidden />
      <ul className="relative grid gap-6 sm:grid-cols-3 sm:gap-4">
        {ITEMS.map((item, i) => (
          <li
            key={item.label}
            className={`flex gap-3 sm:gap-4 ${i > 0 ? "sm:border-l sm:border-zinc-200/90 sm:pl-6" : ""}`}
          >
            <span
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white/90 text-zinc-800 shadow-sm"
              style={{ color: "var(--sf-primary)" }}
            >
              {item.icon}
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-900">{item.label}</span>
              <span className="text-sm text-zinc-600">{item.detail}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
