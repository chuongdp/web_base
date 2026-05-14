"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { revalidateSiteSettingsCache } from "@/lib/site-settings";
import {
  Currency,
  StorefrontTheme,
  type Image,
  type Product,
  type ProductSizeStock,
  type SiteSetting,
} from "@prisma/client";

export type ProductWithCategory = Product & {
  category: { name: string; slug: string };
  images: Image[];
  sizeStocks: Pick<ProductSizeStock, "sizeLabel" | "quantity">[];
};

/** Lấy một sản phẩm theo id (kèm danh mục và ảnh). */
export async function getProductById(id: string): Promise<ProductWithCategory | null> {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" } },
      sizeStocks: { select: { sizeLabel: true, quantity: true } },
    },
  });
}

function normalizeHexColor(input: string): string | null {
  const t = input.trim();
  if (!t) return null;
  return /^#[0-9A-Fa-f]{6}$/.test(t) ? t : null;
}

function optStr(formData: FormData, key: string): string | null {
  const v = String(formData.get(key) ?? "").trim();
  return v.length > 0 ? v : null;
}

/** Mỗi dòng một giá trị (URL); bỏ dòng trống. */
function optMultiline(formData: FormData, key: string): string | null {
  const lines = String(formData.get(key) ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines.join("\n") : null;
}

function optPositiveInt(formData: FormData, key: string): number | null {
  const t = String(formData.get(key) ?? "").trim();
  if (!t) return null;
  const n = Number.parseInt(t, 10);
  if (!Number.isFinite(n) || n < 1 || n > 10000) return null;
  return n;
}

function optBannerScrollSec(formData: FormData, key: string): number | null {
  const t = String(formData.get(key) ?? "").trim();
  if (!t) return null;
  const n = Number.parseFloat(t);
  if (!Number.isFinite(n) || n < 1 || n > 600) return null;
  return n;
}

/** Lấy bản ghi SiteSetting đầu tiên (theo id tăng dần). */
export async function getSiteSetting(): Promise<SiteSetting | null> {
  return prisma.siteSetting.findFirst({
    orderBy: { id: "asc" },
  });
}

export type UpdateSiteSettingResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Cập nhật SiteSetting theo id của bản ghi đầu tiên (nếu chưa có bản ghi thì tạo id = 1).
 * Sau khi thành công: revalidate cache + path `/` và `/admin/settings`.
 */
export async function updateSiteSetting(formData: FormData): Promise<UpdateSiteSettingResult> {
  if (!(await requireAdminSession())) {
    return { ok: false, message: "Không có quyền quản trị." };
  }

  const siteName = String(formData.get("siteName") ?? "").trim();
  const logoUrlRaw = String(formData.get("logoUrl") ?? "").trim();
  const primaryColorRaw = String(formData.get("primaryColor") ?? "").trim();
  const bannerTextRaw = String(formData.get("bannerText") ?? "").trim();
  const bannerEnabled = formData.get("bannerEnabled") === "on";
  const defaultCurrencyRaw = String(formData.get("defaultCurrency") ?? "USD").trim();
  const storefrontThemeRaw = String(formData.get("storefrontTheme") ?? "boutique").trim();

  const heroTitleRaw = String(formData.get("heroTitle") ?? "").trim();
  const heroSubtitleRaw = String(formData.get("heroSubtitle") ?? "").trim();
  const heroButtonTextRaw = String(formData.get("heroButtonText") ?? "").trim();
  const heroButtonLinkRaw = String(formData.get("heroButtonLink") ?? "").trim();
  const heroImageUrlRaw = String(formData.get("heroImageUrl") ?? "").trim();
  const heroOverlayImageUrlRaw = String(formData.get("heroOverlayImageUrl") ?? "").trim();

  const heroTitle = heroTitleRaw.length > 0 ? heroTitleRaw : null;
  const heroSubtitle = heroSubtitleRaw.length > 0 ? heroSubtitleRaw : null;
  const heroButtonText = heroButtonTextRaw.length > 0 ? heroButtonTextRaw : null;
  const heroButtonLink = heroButtonLinkRaw.length > 0 ? heroButtonLinkRaw : null;
  const heroImageUrl = heroImageUrlRaw.length > 0 ? heroImageUrlRaw : null;
  const heroOverlayImageUrl = heroOverlayImageUrlRaw.length > 0 ? heroOverlayImageUrlRaw : null;

  const aboutHeroTitle = optStr(formData, "aboutHeroTitle");
  const aboutWhoTitle = optStr(formData, "aboutWhoTitle");
  const aboutIntroP1 = optStr(formData, "aboutIntroP1");
  const aboutIntroP2 = optStr(formData, "aboutIntroP2");
  const aboutBlock1Title = optStr(formData, "aboutBlock1Title");
  const aboutBlock1Body = optStr(formData, "aboutBlock1Body");
  const aboutBlock1ImageUrl = optStr(formData, "aboutBlock1ImageUrl");
  const aboutBlock2Title = optStr(formData, "aboutBlock2Title");
  const aboutBlock2Body = optStr(formData, "aboutBlock2Body");
  const aboutBlock2ImageUrl = optStr(formData, "aboutBlock2ImageUrl");
  const aboutBlock3Title = optStr(formData, "aboutBlock3Title");
  const aboutBlock3Body = optStr(formData, "aboutBlock3Body");
  const aboutBlock3ImageUrl = optStr(formData, "aboutBlock3ImageUrl");
  const aboutBestSellersTitle = optStr(formData, "aboutBestSellersTitle");
  const galleryHeading = optStr(formData, "galleryHeading");
  const gallerySubtitle = optStr(formData, "gallerySubtitle");
  const galleryImageUrls = optMultiline(formData, "galleryImageUrls");

  const contactPageTitle = optStr(formData, "contactPageTitle");
  const contactIntro = optStr(formData, "contactIntro");
  const contactEmail = optStr(formData, "contactEmail");
  const contactPhone = optStr(formData, "contactPhone");
  const contactAddress = optStr(formData, "contactAddress");
  const contactMapEmbedUrl = optStr(formData, "contactMapEmbedUrl");

  const footerMetaShopOwner = optStr(formData, "footerMetaShopOwner");
  const footerMetaAddress = optStr(formData, "footerMetaAddress");
  const footerMetaEmail = optStr(formData, "footerMetaEmail");
  const footerMetaHours = optStr(formData, "footerMetaHours");

  const paymentShowVisa = formData.get("paymentShowVisa") === "on";
  const paymentShowMastercard = formData.get("paymentShowMastercard") === "on";
  const paymentShowPaypal = formData.get("paymentShowPaypal") === "on";
  const paymentShowAmex = formData.get("paymentShowAmex") === "on";
  const paymentShowPingpong = formData.get("paymentShowPingpong") === "on";
  const paymentShowPayoneer = formData.get("paymentShowPayoneer") === "on";

  if (!siteName) {
    return { ok: false, message: "Site name is required." };
  }

  const defaultCurrency =
    defaultCurrencyRaw === Currency.USD || defaultCurrencyRaw === Currency.VND
      ? defaultCurrencyRaw
      : Currency.USD;

  const themeVals = Object.values(StorefrontTheme) as string[];
  const storefrontTheme: StorefrontTheme = themeVals.includes(storefrontThemeRaw)
    ? (storefrontThemeRaw as StorefrontTheme)
    : StorefrontTheme.boutique;

  const logoUrl = logoUrlRaw.length > 0 ? logoUrlRaw : null;
  const faviconUrlRaw = String(formData.get("faviconUrl") ?? "").trim();
  const faviconUrl = faviconUrlRaw.length > 0 ? faviconUrlRaw : null;
  const bannerText = bannerTextRaw.length > 0 ? bannerTextRaw : null;

  const logoWidthPx = optPositiveInt(formData, "logoWidthPx");
  const logoHeightPx = optPositiveInt(formData, "logoHeightPx");
  const heroImageWidthPx = optPositiveInt(formData, "heroImageWidthPx");
  const heroImageHeightPx = optPositiveInt(formData, "heroImageHeightPx");
  const aboutBlockImageWidthPx = optPositiveInt(formData, "aboutBlockImageWidthPx");
  const aboutBlockImageHeightPx = optPositiveInt(formData, "aboutBlockImageHeightPx");

  const bannerHeightPx = optPositiveInt(formData, "bannerHeightPx");
  const bannerFontSizePx = optPositiveInt(formData, "bannerFontSizePx");
  const bannerScrollSec = optBannerScrollSec(formData, "bannerScrollSec");

  const bannerBgRaw = String(formData.get("bannerBgColor") ?? "").trim();
  const bannerTextColorRaw = String(formData.get("bannerTextColor") ?? "").trim();
  let bannerBgColor: string | null = null;
  if (bannerBgRaw.length > 0) {
    const h = normalizeHexColor(bannerBgRaw);
    if (!h) {
      return { ok: false, message: "Màu nền banner phải là hex 6 ký tự (vd: #2563eb)." };
    }
    bannerBgColor = h;
  }
  let bannerTextColor: string | null = null;
  if (bannerTextColorRaw.length > 0) {
    const h = normalizeHexColor(bannerTextColorRaw);
    if (!h) {
      return { ok: false, message: "Màu chữ banner phải là hex 6 ký tự." };
    }
    bannerTextColor = h;
  }

  let primaryColor: string | null = null;
  if (primaryColorRaw.length > 0) {
    const hex = normalizeHexColor(primaryColorRaw);
    if (!hex) {
      return { ok: false, message: "Màu chủ đạo phải là mã hex 6 ký tự (vd: #2563eb)." };
    }
    primaryColor = hex;
  }

  const first = await prisma.siteSetting.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });

  const targetId = first?.id ?? 1;

  await prisma.siteSetting.upsert({
    where: { id: targetId },
    create: {
      id: targetId,
      siteName,
      logoUrl,
      faviconUrl,
      logoWidthPx,
      logoHeightPx,
      primaryColor,
      bannerText,
      bannerEnabled,
      bannerHeightPx,
      bannerFontSizePx,
      bannerBgColor,
      bannerTextColor,
      bannerScrollSec,
      defaultCurrency,
      storefrontTheme,
      heroTitle,
      heroSubtitle,
      heroButtonText,
      heroButtonLink,
      heroImageUrl,
      heroOverlayImageUrl,
      heroImageWidthPx,
      heroImageHeightPx,
      aboutHeroTitle,
      aboutWhoTitle,
      aboutIntroP1,
      aboutIntroP2,
      aboutBlock1Title,
      aboutBlock1Body,
      aboutBlock1ImageUrl,
      aboutBlock2Title,
      aboutBlock2Body,
      aboutBlock2ImageUrl,
      aboutBlock3Title,
      aboutBlock3Body,
      aboutBlock3ImageUrl,
      aboutBlockImageWidthPx,
      aboutBlockImageHeightPx,
      aboutBestSellersTitle,
      galleryHeading,
      gallerySubtitle,
      galleryImageUrls,
      contactPageTitle,
      contactIntro,
      contactEmail,
      contactPhone,
      contactAddress,
      contactMapEmbedUrl,
      footerMetaShopOwner,
      footerMetaAddress,
      footerMetaEmail,
      footerMetaHours,
      paymentShowVisa,
      paymentShowMastercard,
      paymentShowPaypal,
      paymentShowAmex,
      paymentShowPingpong,
      paymentShowPayoneer,
    },
    update: {
      siteName,
      logoUrl,
      faviconUrl,
      logoWidthPx,
      logoHeightPx,
      primaryColor,
      bannerText,
      bannerEnabled,
      bannerHeightPx,
      bannerFontSizePx,
      bannerBgColor,
      bannerTextColor,
      bannerScrollSec,
      defaultCurrency,
      storefrontTheme,
      heroTitle,
      heroSubtitle,
      heroButtonText,
      heroButtonLink,
      heroImageUrl,
      heroOverlayImageUrl,
      heroImageWidthPx,
      heroImageHeightPx,
      aboutHeroTitle,
      aboutWhoTitle,
      aboutIntroP1,
      aboutIntroP2,
      aboutBlock1Title,
      aboutBlock1Body,
      aboutBlock1ImageUrl,
      aboutBlock2Title,
      aboutBlock2Body,
      aboutBlock2ImageUrl,
      aboutBlock3Title,
      aboutBlock3Body,
      aboutBlock3ImageUrl,
      aboutBlockImageWidthPx,
      aboutBlockImageHeightPx,
      aboutBestSellersTitle,
      galleryHeading,
      gallerySubtitle,
      galleryImageUrls,
      contactPageTitle,
      contactIntro,
      contactEmail,
      contactPhone,
      contactAddress,
      contactMapEmbedUrl,
      footerMetaShopOwner,
      footerMetaAddress,
      footerMetaEmail,
      footerMetaHours,
      paymentShowVisa,
      paymentShowMastercard,
      paymentShowPaypal,
      paymentShowAmex,
      paymentShowPingpong,
      paymentShowPayoneer,
    },
  });

  revalidateSiteSettingsCache();
  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/about-us");
  revalidatePath("/contact");
  revalidatePath("/product/[id]", "page");
  revalidatePath("/checkout");

  return { ok: true };
}
