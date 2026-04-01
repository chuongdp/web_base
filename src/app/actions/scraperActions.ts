"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import type { Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";

/** Dữ liệu import thống nhất cho UI. */
export type ImportProductData = {
  title: string;
  price: string | null;
  description: string | null;
  images: string[];
  materials: string | null;
  careInstructions: string | null;
  shippingDetails: string | null;
  /** Comma-separated size values from Shopify options (e.g. S,M,L). */
  sizes: string | null;
};

/** Kết quả chuẩn: thành công có `data`, thất bại có `message`. */
export type ImportProductResult =
  | { ok: true; data: ImportProductData }
  | { ok: false; message: string };

/** @deprecated Dùng ImportProductData */
export type ScrapeProductData = ImportProductData;

/** @deprecated Dùng ImportProductResult */
export type ScrapeProductResult = ImportProductResult;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const MSG_THIRD_PARTY =
  "Nền tảng này cần tích hợp API bên thứ 3. Vui lòng cập nhật sau.";

function errResult(message: string): ImportProductResult {
  return { ok: false, message };
}

function okResult(data: ImportProductData): ImportProductResult {
  return { ok: true, data };
}

function toAbsoluteUrl(base: string, href: string): string | null {
  try {
    const u = new URL(href.trim(), base);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}

function stripHtml(html: string): string {
  try {
    const $ = cheerio.load(html);
    return $.text().replace(/\s+/g, " ").trim();
  } catch {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
}

const MAX_SECTION_LEN = 8000;

/** Chuẩn hóa đoạn text trích từ DOM / mô tả. */
function normalizeSectionText(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const t = raw.replace(/\s+/g, " ").trim();
  if (!t) return null;
  return t.slice(0, MAX_SECTION_LEN);
}

function labelLooksLikeMaterials(text: string): boolean {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length > 120) return false;
  return /product\s+materials/i.test(t) || /^materials$/i.test(t);
}

function labelLooksLikeCare(text: string): boolean {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length > 120) return false;
  return (
    /care\s+information/i.test(t) ||
    /care\s+instructions/i.test(t) ||
    /^care$/i.test(t)
  );
}

function labelLooksLikeShipping(text: string): boolean {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length > 160) return false;
  return (
    /delivery\s*&\s*shipping/i.test(t) ||
    /delivery\s+and\s+shipping/i.test(t) ||
    /shipping\s*&\s*delivery/i.test(t) ||
    /delivery\s*&\s*returns/i.test(t)
  );
}

type SectionBuckets = {
  materials: string | null;
  careInstructions: string | null;
  shippingDetails: string | null;
};

function emptySections(): SectionBuckets {
  return { materials: null, careInstructions: null, shippingDetails: null };
}

/**
 * Lấy nội dung từ phần tử liền kề sau heading (thường là sibling đầu tiên).
 */
function extractSiblingContent($: cheerio.CheerioAPI, $el: Cheerio<AnyNode>): string | null {
  try {
    const $next = $el.next();
    if ($next.length) {
      const html = $next.html();
      if (html && html.trim()) {
        const text = stripHtml(html);
        const t = normalizeSectionText(text);
        if (t) return t;
      }
      const txt = normalizeSectionText($next.text());
      if (txt) return txt;
    }

    const $parent = $el.parent();
    if ($parent.length) {
      const $ps = $parent.next();
      if ($ps.length) {
        const html = $ps.html();
        if (html && html.trim()) {
          const t = normalizeSectionText(stripHtml(html));
          if (t) return t;
        }
        const txt = normalizeSectionText($ps.text());
        if (txt) return txt;
      }
    }
  } catch {
    /* an toàn */
  }
  return null;
}

const DOM_HEADING_SELECTOR =
  "summary, h1, h2, h3, h4, h5, h6, span, strong, button, [role='tab'], [data-accordion-button]";

/** Trích sections từ HTML trang sản phẩm (accordion / collapsible). */
function extractSectionsFromDom($: cheerio.CheerioAPI): SectionBuckets {
  const out = emptySections();

  try {
    $(DOM_HEADING_SELECTOR).each((_, el) => {
      const $el = $(el);
      const text = $el.text().replace(/\s+/g, " ").trim();
      if (!text) return;

      if (!out.materials && labelLooksLikeMaterials(text)) {
        const got = extractSiblingContent($, $el);
        if (got) out.materials = got;
      }
      if (!out.careInstructions && labelLooksLikeCare(text)) {
        const got = extractSiblingContent($, $el);
        if (got) out.careInstructions = got;
      }
      if (!out.shippingDetails && labelLooksLikeShipping(text)) {
        const got = extractSiblingContent($, $el);
        if (got) out.shippingDetails = got;
      }
    });
  } catch {
    /* ignore */
  }

  return out;
}

function extractBetweenMarkers(
  plain: string,
  startRe: RegExp,
  endRes: RegExp[],
): string | null {
  try {
    const match = plain.match(startRe);
    if (!match || match.index === undefined) return null;
    const start = match.index + match[0].length;
    let end = plain.length;
    const tail = plain.slice(start);
    for (const re of endRes) {
      const idx = tail.search(re);
      if (idx !== -1 && idx >= 0) {
        end = Math.min(end, start + idx);
      }
    }
    return normalizeSectionText(plain.slice(start, end));
  } catch {
    return null;
  }
}

/** Fallback: nhiều theme gộp nội dung vào product description (HTML hoặc plain). */
function extractSectionsFromDescription(description: string | null): SectionBuckets {
  const out = emptySections();
  if (!description?.trim()) return out;

  try {
    const plain = description.includes("<") ? stripHtml(description) : description;
    const normalized = plain.replace(/\r\n/g, "\n");

    const endOthers = [
      /\n\s*Product Materials\b/i,
      /\n\s*Care Information\b/i,
      /\n\s*Care Instructions\b/i,
      /\n\s*Delivery\b/i,
      /\n\s*Shipping\b/i,
    ];

    out.materials =
      extractBetweenMarkers(
        normalized,
        /(?:^|\n)\s*Product Materials\s*[:\s]*/i,
        [/\n\s*Care Information/i, /\n\s*Care Instructions/i, /\n\s*Delivery/i, /\n\s*(?:Shipping|Delivery\s*&\s*Shipping)/i],
      ) ?? out.materials;

    out.careInstructions =
      extractBetweenMarkers(
        normalized,
        /(?:^|\n)\s*Care Information\s*[:\s]*/i,
        [/\n\s*Product Materials/i, /\n\s*Delivery/i, /\n\s*(?:Shipping|Delivery\s*&\s*Shipping)/i],
      ) ??
      extractBetweenMarkers(
        normalized,
        /(?:^|\n)\s*Care Instructions\s*[:\s]*/i,
        [/\n\s*Product Materials/i, /\n\s*Delivery/i, /\n\s*(?:Shipping|Delivery\s*&\s*Shipping)/i],
      ) ??
      out.careInstructions;

    out.shippingDetails =
      extractBetweenMarkers(
        normalized,
        /(?:^|\n)\s*(?:Delivery\s*&\s*Shipping|Delivery and Shipping)\s*[:\s]*/i,
        [/\n\s*Product Materials/i, /\n\s*Care Information/i],
      ) ?? out.shippingDetails;

    if (!out.materials) {
      out.materials = extractBetweenMarkers(normalized, /(?:^|\n)\s*Materials\s*[:\s]*/i, endOthers);
    }
  } catch {
    /* ignore */
  }

  return out;
}

function mergeSections(dom: SectionBuckets, fallback: SectionBuckets): SectionBuckets {
  return {
    materials: dom.materials ?? fallback.materials ?? null,
    careInstructions: dom.careInstructions ?? fallback.careInstructions ?? null,
    shippingDetails: dom.shippingDetails ?? fallback.shippingDetails ?? null,
  };
}

async function fetchProductPageHtml(productPageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(productPageUrl, {
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": USER_AGENT,
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    return html && html.length > 50 ? html : null;
  } catch {
    return null;
  }
}

/** Ảnh Shopify AJAX thường là protocol-relative `//cdn...` → thêm `https:`. */
function normalizeShopifyImageUrl(src: string): string {
  const s = src.trim();
  if (s.startsWith("//")) return `https:${s}`;
  return s;
}

/** Shopify JSON `product.options`: tìm option Size / Kích thước → nối values bằng dấu phẩy. */
function extractShopifySizes(root: Record<string, unknown>): string | null {
  const opts = root.options;
  if (!Array.isArray(opts)) return null;
  for (const item of opts) {
    if (!item || typeof item !== "object") continue;
    const rec = item as { name?: unknown; values?: unknown };
    if (typeof rec.name !== "string") continue;
    const label = rec.name.trim().toLowerCase();
    if (label !== "size" && label !== "kích thước") continue;
    if (!Array.isArray(rec.values)) continue;
    const parts = rec.values
      .map((v) => (typeof v === "string" ? v.trim() : String(v).trim()))
      .filter(Boolean);
    if (parts.length === 0) return null;
    return parts.join(",");
  }
  return null;
}

/**
 * Shopify: bỏ query → thêm `.js` → `fetch` JSON sản phẩm (Ajax Product API).
 * Giá `price` trong JSON là cent → chia 100. Chỉ dùng `json.images` (không lấy logo/header).
 * @see https://shopify.dev/docs/api/ajax/reference/product
 */
export async function scrapeShopify(url: string): Promise<ImportProductResult> {
  try {
    const trimmed = url?.trim();
    if (!trimmed) return errResult("URL không hợp lệ.");

    let u: URL;
    try {
      u = new URL(trimmed);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        return errResult("Chỉ hỗ trợ http hoặc https.");
      }
    } catch {
      return errResult("URL không hợp lệ.");
    }

    u.search = "";
    const pathClean = u.pathname.replace(/\/$/, "") || "/";
    const productPageUrl = `${u.origin}${pathClean}`;
    let path = pathClean;
    if (!path.endsWith(".js")) {
      path = `${path}.js`;
    }
    const jsonUrl = `${u.origin}${path}`;

    const res = await fetch(jsonUrl, {
      redirect: "follow",
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT,
      },
    });

    if (!res.ok) {
      return errResult(`Shopify: HTTP ${res.status} khi tải ${jsonUrl}`);
    }

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      return errResult("Shopify: không parse được JSON.");
    }

    const root =
      json && typeof json === "object" && json !== null && "product" in json
        ? (json as { product: Record<string, unknown> }).product
        : (json as Record<string, unknown> | null);

    if (!root || typeof root !== "object") {
      return errResult("Không đọc được JSON Shopify.");
    }

    const title = typeof root.title === "string" ? root.title.trim() : "";
    if (!title) {
      return errResult("JSON Shopify thiếu title.");
    }

    let price: string | null = null;
    if (root.price != null) {
      const cents = Number(root.price);
      if (Number.isFinite(cents)) {
        const dollars = cents / 100;
        price = String(dollars);
      }
    }

    let rawDescription: string | null = null;
    if (typeof root.description === "string" && root.description.trim()) {
      rawDescription = root.description.trim();
    }
    let description: string | null = null;
    if (rawDescription) {
      description = rawDescription.includes("<")
        ? stripHtml(rawDescription).slice(0, 8000) || null
        : rawDescription.slice(0, 8000);
    }

    const images: string[] = [];
    if (Array.isArray(root.images)) {
      const mapped = root.images.map((item) => {
        if (typeof item === "string") return normalizeShopifyImageUrl(item);
        if (item && typeof item === "object" && "src" in item) {
          return normalizeShopifyImageUrl(String((item as { src: string }).src));
        }
        return "";
      });
      for (const href of mapped) {
        if (href) images.push(href);
      }
    }

    let domSections = emptySections();
    const pageHtml = await fetchProductPageHtml(productPageUrl);
    if (pageHtml) {
      try {
        const $page = cheerio.load(pageHtml);
        domSections = extractSectionsFromDom($page);
      } catch {
        /* HTML không parse được — bỏ qua */
      }
    }

    const fromDesc = extractSectionsFromDescription(rawDescription);
    const merged = mergeSections(domSections, fromDesc);
    const sizes = extractShopifySizes(root);

    return okResult({
      title,
      price,
      description,
      images,
      materials: merged.materials,
      careInstructions: merged.careInstructions,
      shippingDetails: merged.shippingDetails,
      sizes,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lỗi không xác định.";
    return errResult(`Shopify: ${msg}`);
  }
}

/**
 * Shopbase: parse HTML — title, giá (class chứa price), ảnh.
 */
export async function scrapeShopbase(url: string): Promise<ImportProductResult> {
  try {
    const trimmed = url?.trim();
    if (!trimmed) return errResult("URL không hợp lệ.");

    let pageUrl: URL;
    try {
      pageUrl = new URL(trimmed);
      if (pageUrl.protocol !== "http:" && pageUrl.protocol !== "https:") {
        return errResult("Chỉ hỗ trợ http hoặc https.");
      }
    } catch {
      return errResult("URL không hợp lệ.");
    }

    const res = await axios.get<string>(pageUrl.href, {
      responseType: "text",
      timeout: 25_000,
      maxRedirects: 5,
      validateStatus: (s) => s >= 200 && s < 400,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "vi,en;q=0.9",
      },
    });

    const html = res.data;
    if (!html || html.length < 50) {
      return errResult("Nội dung trang quá ngắn hoặc rỗng.");
    }

    const $ = cheerio.load(html);

    const title =
      $("h1").first().text().trim() ||
      $('meta[property="og:title"]').attr("content")?.trim() ||
      $("title").first().text().trim() ||
      "";

    if (!title) {
      return errResult("Không tìm thấy tiêu đề sản phẩm.");
    }

    let price: string | null = null;
    const priceSelectors = [
      "[class*='product-price']",
      "[class*='ProductPrice']",
      "[class*='price']",
      "[data-product-price]",
      "[itemprop='price']",
    ];
    for (const sel of priceSelectors) {
      const el = $(sel).first();
      let text = el.text().trim();
      if (!text && el.is("[data-product-price]")) {
        text = el.attr("data-product-price")?.trim() ?? "";
      }
      if (!text && el.is("[itemprop='price']")) {
        text = el.attr("content")?.trim() ?? el.text().trim();
      }
      if (text && /\d/.test(text)) {
        price = text.replace(/\s+/g, " ").slice(0, 200);
        break;
      }
    }

    const description =
      $('meta[property="og:description"]').attr("content")?.trim() ||
      $('meta[name="description"]').attr("content")?.trim() ||
      $(".product-description, .product__description, [class*='description']").first().text().trim() ||
      null;

    const images: string[] = [];
    const seen = new Set<string>();
    $(
      ".product-gallery img, .product__media img, [class*='product-image'] img, .swiper-slide img",
    ).each((_, el) => {
      const $el = $(el);
      const src =
        $el.attr("src") ||
        $el.attr("data-src") ||
        $el.attr("data-lazy-src") ||
        $el.attr("data-original");
      if (!src || src.startsWith("data:")) return;
      const abs = toAbsoluteUrl(pageUrl.href, src);
      if (abs && !seen.has(abs)) {
        seen.add(abs);
        images.push(abs);
      }
    });
    if (images.length === 0) {
      $("img").each((_, el) => {
        const $el = $(el);
        const src =
          $el.attr("src") ||
          $el.attr("data-src") ||
          $el.attr("data-lazy-src") ||
          $el.attr("data-original");
        if (!src || src.startsWith("data:")) return;
        const abs = toAbsoluteUrl(pageUrl.href, src);
        if (abs && !seen.has(abs)) {
          seen.add(abs);
          images.push(abs);
        }
        return images.length < 40 ? undefined : false;
      });
    }

    const descSlice = description ? description.slice(0, 8000) : null;
    const domSb = extractSectionsFromDom($);
    const fromDescSb = extractSectionsFromDescription(descSlice);
    const mergedSb = mergeSections(domSb, fromDescSb);

    return okResult({
      title,
      price,
      description: descSlice,
      images: images.slice(0, 40),
      materials: mergedSb.materials,
      careInstructions: mergedSb.careInstructions,
      shippingDetails: mergedSb.shippingDetails,
      sizes: null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lỗi không xác định.";
    return errResult(`Shopbase: ${msg}`);
  }
}

export async function scrapeAmazon(_url: string): Promise<ImportProductResult> {
  try {
    return errResult(MSG_THIRD_PARTY);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lỗi không xác định.";
    return errResult(`Amazon: ${msg}`);
  }
}

export async function scrapeAliExpress(_url: string): Promise<ImportProductResult> {
  try {
    return errResult(MSG_THIRD_PARTY);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lỗi không xác định.";
    return errResult(`AliExpress: ${msg}`);
  }
}

export async function scrapeEbay(_url: string): Promise<ImportProductResult> {
  try {
    return errResult(MSG_THIRD_PARTY);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lỗi không xác định.";
    return errResult(`eBay: ${msg}`);
  }
}

function pickDescription($: cheerio.CheerioAPI): string | null {
  const og = $('meta[property="og:description"]').attr("content")?.trim();
  if (og) return og;
  const meta = $('meta[name="description"]').attr("content")?.trim();
  if (meta) return meta;
  const article = $("article p").first().text().trim();
  if (article.length > 0) return article.slice(0, 2000);
  const main = $("main p").first().text().trim();
  if (main.length > 0) return main.slice(0, 2000);
  return null;
}

function pickTitle($: cheerio.CheerioAPI): string | null {
  const h1 = $("h1").first().text().trim();
  if (h1) return h1;
  const og = $('meta[property="og:title"]').attr("content")?.trim();
  if (og) return og;
  return $("title").first().text().trim() || null;
}

function pickPrice($: cheerio.CheerioAPI): string | null {
  const selectors = [
    '[class*="price"]',
    '[class*="Price"]',
    '[id*="price"]',
    '[id*="Price"]',
    "[data-price]",
    "[itemprop=price]",
  ];
  for (const sel of selectors) {
    const els = $(sel);
    for (let i = 0; i < els.length; i++) {
      const el = els.eq(i);
      let text = el.text().trim();
      if (!text && el.is("[data-price]")) {
        text = el.attr("data-price")?.trim() ?? "";
      }
      if (!text && el.is("[itemprop=price]")) {
        text = el.attr("content")?.trim() ?? el.text().trim();
      }
      if (text && /\d/.test(text)) {
        return text.replace(/\s+/g, " ").slice(0, 200);
      }
    }
  }
  return null;
}

function collectImages($: cheerio.CheerioAPI, pageUrl: string, max = 40): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  $("img").each((_, el) => {
    const $el = $(el);
    const src =
      $el.attr("src") ||
      $el.attr("data-src") ||
      $el.attr("data-lazy-src") ||
      $el.attr("data-original");
    if (!src || src.startsWith("data:")) return;
    const abs = toAbsoluteUrl(pageUrl, src);
    if (!abs || seen.has(abs)) return;
    seen.add(abs);
    out.push(abs);
    if (out.length >= max) return false;
    return undefined;
  });

  return out;
}

/** Crawl HTML chung (không gắn nền tảng cụ thể). */
async function scrapeGeneric(url: string): Promise<ImportProductResult> {
  try {
    const trimmed = url?.trim();
    if (!trimmed) {
      return errResult("URL không hợp lệ.");
    }

    let pageUrl: URL;
    try {
      pageUrl = new URL(trimmed);
      if (pageUrl.protocol !== "http:" && pageUrl.protocol !== "https:") {
        return errResult("Chỉ hỗ trợ http hoặc https.");
      }
    } catch {
      return errResult("URL không hợp lệ.");
    }

    let html: string;
    try {
      const res = await axios.get<string>(pageUrl.href, {
        responseType: "text",
        timeout: 25_000,
        maxRedirects: 5,
        validateStatus: (s) => s >= 200 && s < 400,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "vi,en;q=0.9",
        },
      });
      html = res.data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Không tải được trang.";
      return errResult(`Lỗi tải trang: ${msg}`);
    }

    if (!html || html.length < 50) {
      return errResult("Nội dung trang quá ngắn hoặc rỗng.");
    }

    const $ = cheerio.load(html);

    const title = pickTitle($);
    if (!title) {
      return errResult("Không parse được tên sản phẩm (không có h1 / og:title / title).");
    }

    const price = pickPrice($);
    const description = pickDescription($);
    const images = collectImages($, pageUrl.href);

    const domGen = extractSectionsFromDom($);
    const fromDescGen = extractSectionsFromDescription(description);
    const mergedGen = mergeSections(domGen, fromDescGen);

    return okResult({
      title,
      price,
      description,
      images,
      materials: mergedGen.materials,
      careInstructions: mergedGen.careInstructions,
      shippingDetails: mergedGen.shippingDetails,
      sizes: null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lỗi không xác định.";
    return errResult(msg);
  }
}

/**
 * Import sản phẩm đa nền tảng.
 * `platform`: shopify | shopbase | amazon | aliexpress | generic (HTML chung).
 */
export async function importProduct(url: string, platform: string): Promise<ImportProductResult> {
  try {
    const p = platform?.trim().toLowerCase() || "generic";
    switch (p) {
      case "shopify":
        return await scrapeShopify(url);
      case "shopbase":
        return await scrapeShopbase(url);
      case "amazon":
        return await scrapeAmazon(url);
      case "aliexpress":
        return await scrapeAliExpress(url);
      case "ebay":
        return await scrapeEbay(url);
      case "generic":
      case "default":
      case "auto":
        return await scrapeGeneric(url);
      default:
        return errResult(`Nền tảng không hỗ trợ: ${platform}`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lỗi không xác định.";
    return errResult(`importProduct: ${msg}`);
  }
}

/**
 * Tương thích code cũ: gọi crawl HTML chung.
 * Để import theo nền tảng, dùng `importProduct(url, platform)`.
 */
export async function scrapeProduct(url: string): Promise<ImportProductResult> {
  return importProduct(url, "generic");
}
