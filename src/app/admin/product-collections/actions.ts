"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { requireAdminSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: true } | { ok: false; message: string };

function prismaError(e: unknown, fallback: string): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    return "Slug đã tồn tại, hãy đổi slug.";
  }
  return fallback;
}

export async function createProductCollection(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdminSession())) return { ok: false, message: "Chưa đăng nhập." };

  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const sortOrderRaw = String(formData.get("sortOrder") ?? "").trim();
  const sortOrder = sortOrderRaw === "" ? 0 : Math.max(0, Math.floor(Number(sortOrderRaw)) || 0);

  if (!name) return { ok: false, message: "Tên không được để trống." };
  if (!slug) slug = slugify(name);
  if (!slug) return { ok: false, message: "Không tạo được slug hợp lệ." };

  try {
    await prisma.productCollection.create({
      data: { name, slug, description, sortOrder },
    });
  } catch (e) {
    return { ok: false, message: prismaError(e, "Không thể tạo bộ sưu tập.") };
  }

  revalidatePath("/admin/product-collections");
  revalidatePath("/collections");
  return { ok: true };
}

export async function updateProductCollection(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdminSession())) return { ok: false, message: "Chưa đăng nhập." };

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const sortOrderRaw = String(formData.get("sortOrder") ?? "").trim();
  const sortOrder = sortOrderRaw === "" ? 0 : Math.max(0, Math.floor(Number(sortOrderRaw)) || 0);

  if (!id) return { ok: false, message: "Thiếu ID." };
  if (!name) return { ok: false, message: "Tên không được để trống." };
  if (!slug) slug = slugify(name);
  if (!slug) return { ok: false, message: "Không tạo được slug hợp lệ." };

  try {
    await prisma.productCollection.update({
      where: { id },
      data: { name, slug, description, sortOrder },
    });
  } catch (e) {
    return { ok: false, message: prismaError(e, "Không thể cập nhật.") };
  }

  revalidatePath("/admin/product-collections");
  revalidatePath("/collections");
  revalidatePath(`/collections/${slug}`);
  return { ok: true };
}

export async function deleteProductCollection(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdminSession())) return { ok: false, message: "Chưa đăng nhập." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Thiếu ID." };

  let slug = "";
  try {
    const row = await prisma.productCollection.findUnique({ where: { id }, select: { slug: true } });
    slug = row?.slug ?? "";
    await prisma.productCollection.delete({ where: { id } });
  } catch (e) {
    return { ok: false, message: prismaError(e, "Không thể xóa.") };
  }

  revalidatePath("/admin/product-collections");
  revalidatePath("/collections");
  if (slug) revalidatePath(`/collections/${slug}`);
  return { ok: true };
}
