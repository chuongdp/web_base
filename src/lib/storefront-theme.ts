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
  {
    value: "runway",
    label: "Runway / Fashion week",
    description: "Tạp chí thời trang: hero cinematic full-bleed, header xếp tầng, footer magazine, nền champagne.",
  },
  {
    value: "streetwear",
    label: "Streetwear",
    description: "Đường phố urban: header full-width, góc vuông, lưới chặt 4 cột, hero chia đôi đảo ngược.",
  },
  {
    value: "atelier",
    label: "Atelier",
    description: "Boutique nữ tính: header nổi bo góc, nền blush pastel, hero card ấm, tile bo tròn.",
  },
  {
    value: "noir",
    label: "Noir / Dark luxe",
    description: "Nền tối sang, header đậm, hero cinematic, thẻ sáng nổi trên nền đen.",
  },
  {
    value: "coastal",
    label: "Coastal",
    description: "Biển nhẹ: nền xanh cát, header nổi, hero card, tile bo mềm.",
  },
  {
    value: "heritage",
    label: "Heritage",
    description: "Cổ điển tailoring: serif, footer magazine, lưới 3 cột gọn.",
  },
  {
    value: "gallery",
    label: "Gallery",
    description: "Không gian triển lãm: nhiều khoảng trắng, hero chữ lớn, sản phẩm 2 cột editorial.",
  },
  {
    value: "neon",
    label: "Neon / Night market",
    description: "Đêm neon: nền charcoal, viền sắc, hero split, lưới dày 4 cột.",
  },
];

export const DEFAULT_STOREFRONT_THEME: StorefrontTheme = "boutique";

/** Bố cục header (cấu trúc JSX khác nhau). */
export type HeaderLayoutMode = "classic" | "stacked" | "compact" | "wide" | "floating";

export function getHeaderLayoutMode(theme: StorefrontTheme): HeaderLayoutMode {
  switch (theme) {
    case "editorial":
    case "playful":
    case "runway":
      return "stacked";
    case "minimal":
      return "compact";
    case "modern":
    case "industrial":
    case "streetwear":
      return "wide";
    case "warm":
    case "atelier":
    case "coastal":
      return "floating";
    case "noir":
    case "neon":
      return "wide";
    case "gallery":
      return "compact";
    default:
      return "classic";
  }
}

export type FooterLayoutMode = "cards" | "magazine" | "minimal" | "strip";

export function getFooterLayoutMode(theme: StorefrontTheme): FooterLayoutMode {
  switch (theme) {
    case "editorial":
    case "luxury":
    case "runway":
      return "magazine";
    case "minimal":
    case "playful":
      return "minimal";
    case "heritage":
      return "magazine";
    case "gallery":
      return "minimal";
    case "noir":
    case "neon":
    case "modern":
    case "industrial":
    case "streetwear":
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
    case "runway":
      return "editorialCinematic";
    case "modern":
      return "splitBorder";
    case "streetwear":
      return "splitBorderReverse";
    case "minimal":
      return "wideCopy";
    case "warm":
    case "atelier":
      return "warmCard";
    case "luxury":
      return "boutique";
    case "industrial":
      return "splitBorderReverse";
    case "noir":
      return "editorialCinematic";
    case "coastal":
      return "warmCard";
    case "heritage":
      return "boutique";
    case "gallery":
      return "wideCopy";
    case "neon":
      return "splitBorder";
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
    case "runway":
      return "px-6 py-14 sm:px-10 lg:px-16";
    case "streetwear":
      return "px-3 py-8 sm:px-5 lg:px-8";
    case "atelier":
      return "rounded-3xl bg-white/90 shadow-lg ring-1 ring-rose-100/80 my-5 min-w-0 px-5 py-10 sm:my-8 sm:px-8 lg:px-12";
    case "noir":
      return "my-6 min-w-0 rounded-sm bg-white px-5 py-10 shadow-2xl ring-1 ring-zinc-200/80 sm:my-10 sm:px-8 lg:px-12";
    case "coastal":
      return "my-5 min-w-0 rounded-[1.75rem] bg-white/90 px-5 py-10 shadow-lg ring-1 ring-sky-200/70 sm:my-8 sm:px-8 lg:px-12";
    case "heritage":
      return "px-6 py-12 sm:px-10 lg:px-14";
    case "gallery":
      return "px-5 py-12 sm:px-12 lg:px-16 lg:py-16";
    case "neon":
      return "my-4 min-w-0 rounded-none border-2 border-zinc-900 bg-white px-4 py-10 shadow-[8px_8px_0_0_rgb(24_24_27)] sm:my-6 sm:px-6 lg:px-10";
    default:
      return "px-4 py-10 lg:px-8";
  }
}

/** Tiêu đề + lưới section bộ sưu tập / danh mục trên trang chủ. */
export function getCategorySectionClasses(theme: StorefrontTheme): {
  titleAccent: string;
  grid: string;
  tileRounded: string;
  browseHeaderMode: "row" | "stackedCenter";
  headerAlign: "start" | "center";
} {
  switch (theme) {
    case "editorial":
    case "luxury":
    case "runway":
      return {
        titleAccent: "text-3xl font-bold sm:text-4xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-3",
        tileRounded: "rounded-md",
        browseHeaderMode: "row",
        headerAlign: "start",
      };
    case "streetwear":
      return {
        titleAccent: "text-2xl font-black uppercase tracking-widest sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4",
        tileRounded: "rounded-none",
        browseHeaderMode: "row",
        headerAlign: "start",
      };
    case "atelier":
      return {
        titleAccent: "text-3xl font-semibold text-rose-950 sm:text-4xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-5 md:grid-cols-3",
        tileRounded: "rounded-2xl",
        browseHeaderMode: "stackedCenter",
        headerAlign: "center",
      };
    case "industrial":
      return {
        titleAccent: "text-2xl font-bold uppercase tracking-wider sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-3 md:grid-cols-4",
        tileRounded: "rounded-none",
        browseHeaderMode: "row",
        headerAlign: "start",
      };
    case "playful":
      return {
        titleAccent: "text-3xl font-extrabold sm:text-4xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-5 md:grid-cols-3",
        tileRounded: "rounded-2xl",
        browseHeaderMode: "stackedCenter",
        headerAlign: "center",
      };
    case "heritage":
      return {
        titleAccent: "text-3xl font-semibold tracking-tight sm:text-4xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-6 lg:grid-cols-3",
        tileRounded: "rounded-sm",
        browseHeaderMode: "row",
        headerAlign: "start",
      };
    case "gallery":
      return {
        titleAccent: "text-3xl font-light tracking-tight sm:text-4xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2",
        tileRounded: "rounded-none",
        browseHeaderMode: "row",
        headerAlign: "start",
      };
    case "coastal":
      return {
        titleAccent: "text-3xl font-semibold text-sky-950 sm:text-4xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-4 md:grid-cols-3",
        tileRounded: "rounded-2xl",
        browseHeaderMode: "stackedCenter",
        headerAlign: "center",
      };
    case "noir":
      return {
        titleAccent: "text-2xl font-semibold uppercase tracking-[0.18em] sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-4 md:grid-cols-3",
        tileRounded: "rounded-none",
        browseHeaderMode: "row",
        headerAlign: "start",
      };
    case "neon":
      return {
        titleAccent: "text-2xl font-black uppercase tracking-widest sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4",
        tileRounded: "rounded-none",
        browseHeaderMode: "row",
        headerAlign: "start",
      };
    default:
      return {
        titleAccent: "text-3xl font-bold sm:text-4xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-4 md:grid-cols-4",
        tileRounded: "rounded-lg",
        browseHeaderMode: "stackedCenter",
        headerAlign: "center",
      };
  }
}

export function getBestSellersSectionClasses(theme: StorefrontTheme): {
  titleAccent: string;
  grid: string;
  headerAlign: "start" | "center";
} {
  switch (theme) {
    case "luxury":
      return {
        titleAccent: "text-2xl font-semibold sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        headerAlign: "start",
      };
    case "industrial":
      return {
        titleAccent: "text-2xl font-bold uppercase tracking-wider sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4",
        headerAlign: "start",
      };
    case "playful":
      return {
        titleAccent: "text-2xl font-extrabold sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5",
        headerAlign: "center",
      };
    case "runway":
      return {
        titleAccent: "text-2xl font-semibold uppercase tracking-[0.2em] sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        headerAlign: "start",
      };
    case "streetwear":
      return {
        titleAccent: "text-2xl font-black uppercase tracking-widest sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4",
        headerAlign: "start",
      };
    case "atelier":
      return {
        titleAccent: "text-2xl font-semibold text-rose-950 sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4",
        headerAlign: "center",
      };
    case "heritage":
      return {
        titleAccent: "text-2xl font-semibold sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-6 lg:grid-cols-3",
        headerAlign: "start",
      };
    case "gallery":
      return {
        titleAccent: "text-2xl font-light sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2",
        headerAlign: "start",
      };
    case "coastal":
      return {
        titleAccent: "text-2xl font-semibold text-sky-950 sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-5 md:grid-cols-3",
        headerAlign: "center",
      };
    case "noir":
      return {
        titleAccent: "text-2xl font-semibold uppercase tracking-[0.15em] sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-5 lg:grid-cols-3",
        headerAlign: "start",
      };
    case "neon":
      return {
        titleAccent: "text-2xl font-black uppercase tracking-widest sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-2 md:grid-cols-4",
        headerAlign: "start",
      };
    default:
      return {
        titleAccent: "text-2xl font-semibold sm:text-3xl",
        grid: "mt-10 sm:mt-12 grid grid-cols-2 gap-6 md:grid-cols-4",
        headerAlign: "center",
      };
  }
}

export function getHomeFeaturedHeaderAlign(theme: StorefrontTheme): "start" | "center" {
  switch (theme) {
    case "luxury":
    case "runway":
    case "editorial":
    case "industrial":
    case "streetwear":
    case "modern":
    case "neon":
    case "noir":
    case "gallery":
      return "start";
    default:
      return "center";
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
    case "streetwear":
      return "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4";
    case "atelier":
      return "grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4";
    case "runway":
      return "grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3";
    case "gallery":
      return "grid grid-cols-1 gap-8 sm:grid-cols-2";
    case "heritage":
      return "grid grid-cols-2 gap-6 lg:grid-cols-3";
    case "coastal":
      return "grid grid-cols-2 gap-5 md:grid-cols-3";
    case "noir":
      return "grid grid-cols-2 gap-5 lg:grid-cols-3";
    case "neon":
      return "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4";
    default:
      return "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3";
  }
}
