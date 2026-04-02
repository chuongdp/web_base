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
 * Banner chạy ngang; khi prefers-reduced-motion thì một dòng tĩnh căn giữa.
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
      <div
        className="sf-banner-track flex w-max motion-reduce:mx-auto motion-reduce:animate-none"
        style={trackStyle}
      >
        <span className="inline-block shrink-0 whitespace-nowrap px-8">{text}</span>
        <span className="inline-block shrink-0 whitespace-nowrap px-8 motion-reduce:hidden" aria-hidden="true">
          {text}
        </span>
      </div>
    </div>
  );
}
