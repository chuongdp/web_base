import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { type CurrencyCode, formatMoney } from "@/lib/format-price";

export type ProductCardProps = {
  name: string;
  /** Giá hiển thị (Decimal/string/number). */
  price: string | number | { toString(): string };
  /** Mặc định USD. */
  currency?: CurrencyCode;
  imageUrl: string | null;
  /** Nếu có, cả thẻ là link (vd: trang chi tiết sau này). */
  href?: string;
  className?: string;
  /** Zoom ảnh nhẹ khi hover (home / editorial grids). */
  imageHoverZoom?: boolean;
};

export function ProductCard({
  name,
  price,
  imageUrl,
  href,
  currency = "USD",
  className = "",
  imageHoverZoom = false,
}: ProductCardProps) {
  const priceEl = (
    <p className="mt-1 text-sm font-semibold tabular-nums" style={{ color: "var(--sf-primary)" }}>
      {formatMoney(price, currency)}
    </p>
  );

  const media = (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 ${imageHoverZoom ? "sf-card-shine" : ""}`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className={`object-cover ${imageHoverZoom ? "transition-transform duration-700 ease-out group-hover/card:scale-[1.04]" : ""}`}
          sizes="(max-width: 768px) 50vw, 33vw"
          unoptimized={imageUrl.startsWith("/")}
        />
      ) : (
        <div className="flex h-full items-center justify-center px-2 text-center text-xs text-zinc-400">
          No image
        </div>
      )}
    </div>
  );

  const body: ReactNode = (
    <>
      {media}
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-zinc-900">{name}</h3>
        {priceEl}
      </div>
    </>
  );

  const shell = `sf-product-card overflow-hidden border border-zinc-200 bg-white transition-[box-shadow,transform] duration-300 ${imageHoverZoom ? "hover:-translate-y-0.5" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={`group/card block ${shell}`}>
        {body}
      </Link>
    );
  }

  return <article className={shell}>{body}</article>;
}
