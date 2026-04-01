"use server";

import { revalidatePath } from "next/cache";
import { Currency, Prisma } from "@prisma/client";
import { requireAdminSession } from "@/lib/admin-auth";
import { normalizeSizeLabel, parseSizesList } from "@/lib/sizes";
import { slugify } from "@/lib/slug";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: true } | { ok: false; message: string };

function prismaError(e: unknown, fallback: string): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    return "Slug đã tồn tại, hãy đổi slug.";
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
    return "Danh mục không hợp lệ.";
  }
  return fallback;
}

function parsePrice(raw: string): { ok: true; value: Prisma.Decimal } | { ok: false; message: string } {
  const t = raw.trim().replace(",", ".");
  if (!t) return { ok: false, message: "Giá không được để trống." };
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) return { ok: false, message: "Giá không hợp lệ." };
  return { ok: true, value: new Prisma.Decimal(t) };
}

function parseCurrency(raw: string): { ok: true; value: Currency } | { ok: false; message: string } {
  const t = raw.trim();
  if (t === Currency.VND || t === Currency.USD) return { ok: true, value: t };
  return { ok: false, message: "Chọn VND hoặc USD." };
}

/** Mỗi dòng một URL ảnh (hoặc JSON array từ import). */
function parseImageUrlsFromForm(formData: FormData): string[] {
  const raw = String(formData.get("imageUrls") ?? "").trim();
  if (!raw) return [];
  if (raw.startsWith("[")) {
    try {
      const arr = JSON.parse(raw) as unknown;
      if (Array.isArray(arr)) {
        return [...new Set(arr.map((x) => String(x).trim()).filter(Boolean))];
      }
    } catch {
      /* fallback dòng */
    }
  }
  const lines = raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  return [...new Set(lines)];
}

function optionalTrimmed(formData: FormData, key: string): string | null {
  const t = String(formData.get(key) ?? "").trim();
  return t.length > 0 ? t : null;
}

function parseCollectionIds(formData: FormData): string[] {
  const raw = formData.getAll("collectionIds");
  return [...new Set(raw.map((x) => String(x).trim()).filter(Boolean))];
}

async function revalidateCollectionStorefrontPaths(collectionIds: string[]) {
  const uniq = [...new Set(collectionIds)].filter(Boolean);
  revalidatePath("/collections");
  if (uniq.length === 0) return;
  const rows = await prisma.productCollection.findMany({
    where: { id: { in: uniq } },
    select: { slug: true },
  });
  for (const { slug } of rows) {
    revalidatePath(`/collections/${slug}`);
  }
}

function parseStockMapFromForm(formData: FormData, sizesList: string[]): Map<string, number> {
  const raw = String(formData.get("sizeStocksJson") ?? "").trim();
  const parsed = new Map<string, number>();
  if (raw) {
    try {
      const obj = JSON.parse(raw) as Record<string, unknown>;
      for (const [k, v] of Object.entries(obj)) {
        const label = normalizeSizeLabel(k);
        const n = typeof v === "number" ? v : Number(v);
        if (Number.isFinite(n) && n >= 0) parsed.set(label, Math.min(999999, Math.floor(n)));
      }
    } catch {
      /* ignore */
    }
  }
  const labels = sizesList.length > 0 ? sizesList : [""];
  const out = new Map<string, number>();
  for (const l of labels) {
    const key = normalizeSizeLabel(l);
    out.set(key, parsed.get(key) ?? 0);
  }
  return out;
}

async function replaceProductSizeStocks(
  tx: Prisma.TransactionClient,
  productId: string,
  stockMap: Map<string, number>,
) {
  await tx.productSizeStock.deleteMany({ where: { productId } });
  const entries = [...stockMap.entries()];
  if (entries.length === 0) {
    await tx.productSizeStock.create({
      data: { productId, sizeLabel: "", quantity: 0 },
    });
    return;
  }
  await tx.productSizeStock.createMany({
    data: entries.map(([sizeLabel, quantity]) => ({
      productId,
      sizeLabel,
      quantity: Math.max(0, quantity),
    })),
  });
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdminSession())) return { ok: false, message: "Chưa đăng nhập." };

  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const materials = optionalTrimmed(formData, "materials");
  const careInstructions = optionalTrimmed(formData, "careInstructions");
  const shippingDetails = optionalTrimmed(formData, "shippingDetails");
  const sizes = optionalTrimmed(formData, "sizes");
  const imageUrls = parseImageUrlsFromForm(formData);
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "");
  const currency = parseCurrency(String(formData.get("currency") ?? "USD"));
  if (!currency.ok) return currency;

  if (!name) return { ok: false, message: "Tên sản phẩm không được để trống." };
  if (!slug) slug = slugify(name);
  if (!slug) return { ok: false, message: "Không tạo được slug hợp lệ." };
  if (!categoryId) return { ok: false, message: "Chọn danh mục." };

  const price = parsePrice(priceRaw);
  if (!price.ok) return price;

  const sizesList = parseSizesList(sizes);
  const stockMap = parseStockMapFromForm(formData, sizesList);
  const collectionIds = parseCollectionIds(formData);

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          slug,
          description,
          materials,
          careInstructions,
          shippingDetails,
          sizes,
          price: price.value,
          currency: currency.value,
          categoryId,
          productCollections:
            collectionIds.length > 0 ? { connect: collectionIds.map((cid) => ({ id: cid })) } : undefined,
          images:
            imageUrls.length > 0
              ? {
                  create: imageUrls.map((url, i) => ({ url, sortOrder: i })),
                }
              : undefined,
        },
      });
      await replaceProductSizeStocks(tx, product.id, stockMap);
    });
  } catch (e) {
    return { ok: false, message: prismaError(e, "Không thể tạo sản phẩm.") };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  await revalidateCollectionStorefrontPaths(collectionIds);
  return { ok: true };
}

export async function updateProduct(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdminSession())) return { ok: false, message: "Chưa đăng nhập." };

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const materials = optionalTrimmed(formData, "materials");
  const careInstructions = optionalTrimmed(formData, "careInstructions");
  const shippingDetails = optionalTrimmed(formData, "shippingDetails");
  const sizes = optionalTrimmed(formData, "sizes");
  const imageUrls = parseImageUrlsFromForm(formData);
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "");
  const currency = parseCurrency(String(formData.get("currency") ?? "USD"));
  if (!currency.ok) return currency;

  if (!id) return { ok: false, message: "Thiếu ID." };
  if (!name) return { ok: false, message: "Tên sản phẩm không được để trống." };
  if (!slug) slug = slugify(name);
  if (!slug) return { ok: false, message: "Không tạo được slug hợp lệ." };
  if (!categoryId) return { ok: false, message: "Chọn danh mục." };

  const price = parsePrice(priceRaw);
  if (!price.ok) return price;

  const sizesList = parseSizesList(sizes);
  const stockMap = parseStockMapFromForm(formData, sizesList);
  const collectionIds = parseCollectionIds(formData);

  let prevCollectionIds: string[] = [];
  try {
    const prev = await prisma.product.findUnique({
      where: { id },
      select: { productCollections: { select: { id: true } } },
    });
    prevCollectionIds = prev?.productCollections.map((c) => c.id) ?? [];
  } catch {
    /* ignore */
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name,
          slug,
          description,
          materials,
          careInstructions,
          shippingDetails,
          sizes,
          price: price.value,
          currency: currency.value,
          categoryId,
          productCollections: { set: collectionIds.map((cid) => ({ id: cid })) },
          images: {
            deleteMany: {},
            create: imageUrls.map((url, i) => ({ url, sortOrder: i })),
          },
        },
      });
      await replaceProductSizeStocks(tx, id, stockMap);
    });
  } catch (e) {
    return { ok: false, message: prismaError(e, "Không thể cập nhật sản phẩm.") };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath(`/product/${id}`);
  await revalidateCollectionStorefrontPaths([...new Set([...collectionIds, ...prevCollectionIds])]);
  return { ok: true };
}

export async function deleteProductsBulk(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdminSession())) return { ok: false, message: "Chưa đăng nhập." };

  const raw = String(formData.get("ids") ?? "").trim();
  let ids: string[];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return { ok: false, message: "Danh sách ID không hợp lệ." };
    ids = parsed.filter((x): x is string => typeof x === "string" && x.length > 0);
  } catch {
    return { ok: false, message: "Danh sách ID không hợp lệ." };
  }
  if (ids.length === 0) return { ok: false, message: "Chưa chọn sản phẩm." };

  let collectionIdsForRevalidate: string[] = [];
  try {
    const found = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { productCollections: { select: { id: true } } },
    });
    collectionIdsForRevalidate = [...new Set(found.flatMap((p) => p.productCollections.map((c) => c.id)))];
    await prisma.product.deleteMany({ where: { id: { in: ids } } });
  } catch (e) {
    return { ok: false, message: prismaError(e, "Không thể xóa sản phẩm.") };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  for (const id of ids) {
    revalidatePath(`/product/${id}`);
  }
  await revalidateCollectionStorefrontPaths(collectionIdsForRevalidate);
  return { ok: true };
}

export async function deleteProduct(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdminSession())) return { ok: false, message: "Chưa đăng nhập." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Thiếu ID." };

  let collectionIdsForRevalidate: string[] = [];
  try {
    const prev = await prisma.product.findUnique({
      where: { id },
      select: { productCollections: { select: { id: true } } },
    });
    collectionIdsForRevalidate = prev?.productCollections.map((c) => c.id) ?? [];
    await prisma.product.delete({ where: { id } });
  } catch (e) {
    return { ok: false, message: prismaError(e, "Không thể xóa sản phẩm.") };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath(`/product/${id}`);
  await revalidateCollectionStorefrontPaths(collectionIdsForRevalidate);
  return { ok: true };
}
