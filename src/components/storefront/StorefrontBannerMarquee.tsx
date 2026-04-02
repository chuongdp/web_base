"use client";

import type { CSSProperties } from "react";

type Props = {
  text: string;
  backgroundColor?: string | null;
  textColor?: string | null;
  heightPx?: number | null;
  fontSizePx?: number | null;
  scrollSec?: number | null;
};

/**
 * Banner chạy ngang full viewport: mỗi bản sao tối thiểu 100vw để vòng lặp không bị “cục” nhỏ bên trái.
 * prefers-reduced-motion: một dòng tĩnh căn giữa.
 */
export function StorefrontBannerMarquee({
  text,
  backgroundColor,
  textColor,
  heightPx,
  fontSizePx,
  scrollSec,
}: Props) {
  const duration = scrollSec && scrollSec > 0 ? scrollSec : 32;
  const outerStyle: CSSProperties = {
    backgroundColor: backgroundColor ?? "var(--sf-primary)",
    color: textColor ?? "#ffffff",
    minHeight: heightPx && heightPx > 0 ? `${heightPx}px` : undefined,
    fontSize: fontSizePx && fontSizePx > 0 ? `${fontSizePx}px` : undefined,
  };

  const trackStyle: CSSProperties = {
    animation: `sf-marquee ${duration}s linear infinite`,
  };

  return (
    <div
      className="w-full overflow-hidden py-2 text-sm motion-reduce:py-3"
      style={outerStyle}
      role="region"
      aria-label="Thông báo"
    >
      <p className="sr-only">{text}</p>

      <p className="hidden px-4 text-center motion-reduce:block">{text}</p>

      <div className="w-full overflow-hidden motion-reduce:hidden">
        <div className="sf-banner-track flex w-max" style={trackStyle}>
          <span className="inline-flex min-w-[100vw] shrink-0 items-center justify-center whitespace-nowrap px-8">
            {text}
          </span>
          <span
            className="inline-flex min-w-[100vw] shrink-0 items-center justify-center whitespace-nowrap px-8"
            aria-hidden="true"
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
