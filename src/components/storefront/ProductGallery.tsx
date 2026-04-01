"use client";

import Image from "next/image";
import { useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

function ensureHttps(src: string): string {
  const s = src.trim();
  if (s.startsWith("//")) return `https:${s}`;
  return s;
}

export type ProductGalleryProps = {
  /** URL ảnh theo thứ tự hiển thị (từ Prisma `images[].url`). */
  images: string[];
  /** Alt cơ bản cho ảnh (tên sản phẩm). */
  alt: string;
};

/**
 * Gallery: ảnh lớn + thumbnails. Ảnh lớn dùng react-inner-image-zoom (zoom trong khung khi hover).
 * Lưu ý: API thư viện chỉ có zoomType `hover` | `click` — zoom “inner” là kiểu mặc định của component.
 */
export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative flex min-h-[12rem] w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 p-8 text-center text-sm text-zinc-400 ring-1 ring-zinc-200/80">
        No product images
      </div>
    );
  }

  const mainSrc = ensureHttps(images[active] ?? images[0]);

  return (
    <div className="flex w-full flex-col gap-2">
      {/*
        Ref layout: khung sát nội dung — không ép aspect-[3/4] (dễ tạo nửa khung trắng).
        Ảnh full width, height auto theo tỷ lệ file; khe nhỏ tới thumbnails (gap-2).
      */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/90">
        <InnerImageZoom
          key={mainSrc}
          src={mainSrc}
          zoomSrc={mainSrc}
          zoomType="hover"
          zoomPreload
          zoomScale={2.25}
          hideHint
          className="!m-0 !block !w-full !max-w-none [&_figure]:!relative [&_figure]:!m-0 [&_figure]:!block [&_figure]:!h-auto [&_figure]:!w-full [&_figure]:!max-w-full [&_figure>div]:!relative [&_figure>div]:!m-0 [&_figure>div]:!block [&_figure>div]:!h-auto [&_figure>div]:!w-full [&_.iiz__img]:!relative [&_.iiz__img]:!m-0 [&_.iiz__img]:!block [&_.iiz__img]:!h-auto [&_.iiz__img]:!w-full [&_.iiz__img]:!max-w-full [&_.iiz__img]:!object-contain [&_.iiz__zoom-img]:!object-contain"
          imgAttributes={{
            alt: `${alt} — image ${active + 1}`,
            decoding: "async",
            draggable: false,
          }}
        />
      </div>

      {images.length > 1 ? (
        <div className="flex flex-wrap gap-2 sm:gap-3" role="tablist" aria-label="Product images">
          {images.map((url, i) => {
            const selected = i === active;
            const thumbSrc = ensureHttps(url);
            return (
              <button
                key={`${url}-${i}`}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-zinc-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
                  selected ? "border-zinc-900 ring-2 ring-zinc-900/20" : "border-zinc-200 hover:border-zinc-400"
                }`}
              >
                <Image
                  src={thumbSrc}
                  alt=""
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  unoptimized={thumbSrc.startsWith("/")}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
