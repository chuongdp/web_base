import Link from "next/link";

export function HomeHeroScrollCue() {
  return (
    <div className="flex justify-center pt-2 sm:pt-4">
      <Link
        href="/#products"
        className="sf-home-scroll-cue group inline-flex flex-col items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 transition hover:text-zinc-800"
      >
        <span>Explore</span>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300/80 bg-white/70 shadow-sm backdrop-blur-sm transition group-hover:border-zinc-400 group-hover:shadow-md"
          aria-hidden
        >
          <svg className="h-4 w-4 animate-[sf-bounce-soft_2s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </Link>
    </div>
  );
}
