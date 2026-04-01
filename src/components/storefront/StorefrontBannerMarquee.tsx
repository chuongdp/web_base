"use client";

type Props = {
  text: string;
};

/**
 * Banner chạy ngang lặp vô hạn; khi prefers-reduced-motion thì một dòng tĩnh căn giữa.
 */
export function StorefrontBannerMarquee({ text }: Props) {
  return (
    <div
      className="w-full overflow-hidden bg-[var(--sf-primary)] py-2 text-sm text-white"
      role="region"
      aria-label="Thông báo"
    >
      <p className="sr-only">{text}</p>
      <div className="flex w-max animate-sf-marquee motion-reduce:mx-auto motion-reduce:animate-none">
        <span className="inline-block shrink-0 whitespace-nowrap px-8">{text}</span>
        <span className="inline-block shrink-0 whitespace-nowrap px-8 motion-reduce:hidden" aria-hidden="true">
          {text}
        </span>
      </div>
    </div>
  );
}
