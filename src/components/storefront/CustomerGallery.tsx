import Image from "next/image";

/** Ảnh mặc định khi CMS không nhập đủ 6 URL (Unsplash). */
const FALLBACK_GALLERY: readonly { src: string; alt: string }[] = [
  {
    src: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=85&auto=format&fit=crop",
    alt: "White tee — fabric and fit",
  },
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=85&auto=format&fit=crop",
    alt: "Hanging shirts — color and collection",
  },
  {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=85&auto=format&fit=crop",
    alt: "Personal style",
  },
  {
    src: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=85&auto=format&fit=crop",
    alt: "Street style",
  },
  {
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85&auto=format&fit=crop",
    alt: "Everyday fashion",
  },
  {
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&q=85&auto=format&fit=crop",
    alt: "Outdoor and athletic style",
  },
];

/** Parse CMS: mỗi dòng một URL; cần 6 ảnh — thiếu lấy từ FALLBACK. */
export function buildGalleryItems(imageUrlsText: string | null | undefined): { src: string; alt: string }[] {
  const lines = imageUrlsText
    ?.split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean) ?? [];
  const out: { src: string; alt: string }[] = [];
  for (let i = 0; i < 6; i++) {
    const src = lines[i] ?? FALLBACK_GALLERY[i].src;
    out.push({ src, alt: `Gallery ${i + 1}` });
  }
  return out;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function GalleryTile({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const local = src.startsWith("/") && !src.startsWith("//");
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200/80 ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={local}
        className="object-cover transition-opacity duration-300 group-hover:opacity-80"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <InstagramIcon className="h-9 w-9 text-white drop-shadow-md sm:h-10 sm:w-10" />
      </div>
    </div>
  );
}

type GalleryProps = {
  heading?: string | null;
  subtitle?: string | null;
  /** Mỗi dòng một URL ảnh (tối đa 6); thiếu bù ảnh mặc định */
  imageUrlsText?: string | null;
};

export function CustomerGallery({ heading, subtitle, imageUrlsText }: GalleryProps) {
  const items = buildGalleryItems(imageUrlsText);
  const [g1, g2, g3, g4, g5, g6] = items;
  const title = heading?.trim() || "Follow Us";
  const sub = subtitle?.trim() || "Customer Gallery — inspiration from the community.";

  return (
    <section className="scroll-mt-24" aria-labelledby="customer-gallery-heading">
      <h2
        id="customer-gallery-heading"
        className="text-center font-serif text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
      >
        {title}
      </h2>
      <p className="mt-2 text-center text-sm text-zinc-600">{sub}</p>

      <div className="mt-10 flex flex-col gap-4 md:gap-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2 md:gap-6">
          <GalleryTile
            src={g1.src}
            alt={g1.alt}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="col-span-2 row-span-2 min-h-[260px] md:min-h-[min(360px,40vw)]"
          />
          <GalleryTile
            src={g2.src}
            alt={g2.alt}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="min-h-[140px] md:min-h-0"
          />
          <GalleryTile
            src={g3.src}
            alt={g3.alt}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="min-h-[140px] md:min-h-0"
          />
          <GalleryTile
            src={g4.src}
            alt={g4.alt}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="min-h-[140px] md:min-h-0"
          />
          <GalleryTile
            src={g5.src}
            alt={g5.alt}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="min-h-[140px] md:min-h-0"
          />
        </div>

        <div className="group relative mx-auto aspect-[21/9] w-full max-w-4xl overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200/80">
          <Image
            src={g6.src}
            alt={g6.alt}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            unoptimized={g6.src.startsWith("/") && !g6.src.startsWith("//")}
            className="object-cover transition-opacity duration-300 group-hover:opacity-80"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <InstagramIcon className="h-10 w-10 text-white drop-shadow-md sm:h-11 sm:w-11" />
          </div>
        </div>
      </div>
    </section>
  );
}
