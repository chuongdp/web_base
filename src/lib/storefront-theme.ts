import type { StorefrontTheme } from "@prisma/client";

export const STOREFRONT_THEME_OPTIONS: {
  value: StorefrontTheme;
  label: string;
  description: string;
}[] = [
  {
    value: "minimal",
    label: "Tối giản",
    description:
      "Header một hàng gọn, nội dung tập trung; hero chữ rộng + ảnh nhỏ; footer liên kết ngang.",
  },
  {
    value: "boutique",
    label: "Boutique",
    description: "Header classic, hero 2 cột + overlay, footer dạng thẻ.",
  },
  {
    value: "editorial",
    label: "Editorial",
    description: "Header xếp tầng; hero ảnh rộng full-bleed; footer magazine.",
  },
  {
    value: "modern",
    label: "Modern / Tech",
    description: "Header full-width; hero chia đôi viền; lưới 4 cột; footer strip.",
  },
  {
    value: "warm",
    label: "Warm",
    description: "Header nổi bo góc; main như thẻ căn giữa; hero bọc card.",
  },
  {
    value: "luxury",
    label: "Luxury",
    description: "Khổ hẹp tinh tế; danh mục 3 cột trái; hero boutique; footer magazine.",
  },
  {
    value: "industrial",
    label: "Industrial",
    description: "Viền đậm, góc vuông; hero ảnh trái / chữ phải; lưới chặt.",
  },
  {
    value: "playful",
    label: "Playful",
    description: "Header xếp tầng; tile bo lớn, shadow ‘đùa’; hero chữ rộng.",
  },
];

export const DEFAULT_STOREFRONT_THEME: StorefrontTheme = "boutique";

/** Bố cục header (cấu trúc JSX khác nhau). */
export type HeaderLayoutMode = "classic" | "stacked" | "compact" | "wide" | "floating";

export function getHeaderLayoutMode(theme: StorefrontTheme): HeaderLayoutMode {
  switch (theme) {
    case "editorial":
    case "playful":
      return "stacked";
    case "minimal":
      return "compact";
    case "modern":
    case "industrial":
      return "wide";
    case "warm":
      return "floating";
    default:
      return "classic";
  }
}

export type FooterLayoutMode = "cards" | "magazine" | "minimal" | "strip";

export function getFooterLayoutMode(theme: StorefrontTheme): FooterLayoutMode {
  switch (theme) {
    case "editorial":
    case "luxury":
      return "magazine";
    case "minimal":
    case "playful":
      return "minimal";
    case "modern":
    case "industrial":
      return "strip";
    default:
      return "cards";
  }
}

export type HeroLayoutMode =
  | "boutique"
  | "splitBorder"
  | "splitBorderReverse"
  | "editorialCinematic"
  | "wideCopy"
  | "warmCard";

export function getHeroLayoutMode(theme: StorefrontTheme): HeroLayoutMode {
  switch (theme) {
    case "editorial":
      return "editorialCinematic";
    case "modern":
      return "splitBorder";
    case "minimal":
      return "wideCopy";
    case "warm":
      return "warmCard";
    case "luxury":
      return "boutique";
    case "industrial":
      return "splitBorderReverse";
    case "playful":
      return "wideCopy";
    default:
      return "boutique";
  }
}

/** Toàn bộ class cho thẻ <main> (padding + khối nội dung theo theme). */
export function getMainShellClass(theme: StorefrontTheme): string {
  switch (theme) {
    case "warm":
      return "rounded-3xl bg-white/85 shadow-xl ring-1 ring-zinc-200/80 my-4 min-w-0 px-4 py-10 sm:my-6 sm:px-6 lg:px-10";
    case "modern":
      return "px-5 py-10 sm:px-10 lg:px-14";
    case "editorial":
      return "px-5 py-10 sm:px-8 lg:px-10";
    case "minimal":
      return "px-4 py-8 sm:px-5 lg:py-10";
    case "luxury":
      return "px-6 py-12 sm:px-10 lg:px-14";
    case "industrial":
      return "px-4 py-8 sm:px-6 lg:px-10";
    case "playful":
      return "px-4 py-10 sm:px-6 lg:px-12";
    default:
      return "px-4 py-10 lg:px-8";
  }
}

/** Tiêu đề + lưới section bộ sưu tập / danh mục trên trang chủ. */
export function getCategorySectionClasses(theme: StorefrontTheme): {
  heading: string;
  grid: string;
  tileRounded: string;
  /** Tiêu đề trái + link “Xem tất cả” phải; hoặc tiêu đề giữa + link dưới. */
  browseHeaderMode: "row" | "stackedCenter";
} {
  switch (theme) {
    case "editorial":
    case "luxury":
      return {
        heading: "sf-section-heading text-left text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl",
        grid: "mt-10 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-3",
        tileRounded: "rounded-md",
        browseHeaderMode: "row",
      };
    case "industrial":
      return {
        heading: "sf-section-heading text-left text-2xl font-bold uppercase tracking-wider text-zinc-900 sm:text-3xl",
        grid: "mt-10 grid grid-cols-2 gap-3 md:grid-cols-4",
        tileRounded: "rounded-none",
        browseHeaderMode: "row",
      };
    case "playful":
      return {
        heading: "sf-section-heading text-center text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl",
        grid: "mt-10 grid grid-cols-2 gap-5 md:grid-cols-3",
        tileRounded: "rounded-2xl",
        browseHeaderMode: "stackedCenter",
      };
    default:
      return {
        heading: "sf-section-heading text-center text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl",
        grid: "mt-10 grid grid-cols-2 gap-4 md:grid-cols-4",
        tileRounded: "rounded-lg",
        browseHeaderMode: "stackedCenter",
      };
  }
}

export function getBestSellersSectionClasses(theme: StorefrontTheme): { heading: string; grid: string } {
  switch (theme) {
    case "luxury":
      return {
        heading: "sf-section-heading text-left text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl",
        grid: "mt-10 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3",
      };
    case "industrial":
      return {
        heading: "sf-section-heading text-left text-2xl font-bold uppercase tracking-wider text-zinc-900 sm:text-3xl",
        grid: "mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4",
      };
    case "playful":
      return {
        heading: "sf-section-heading text-center text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl",
        grid: "mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5",
      };
    default:
      return {
        heading: "sf-section-heading text-center text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl",
        grid: "mt-10 grid grid-cols-2 gap-6 md:grid-cols-4",
      };
  }
}

export function getFeaturedProductGridClass(theme: StorefrontTheme): string {
  switch (theme) {
    case "modern":
      return "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4";
    case "playful":
      return "grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4";
    case "luxury":
      return "grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3";
    case "industrial":
      return "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4";
    default:
      return "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3";
  }
}
