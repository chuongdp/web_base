"use server";

import { revalidatePath } from "next/cache";
import { CollectionDisplayPreset, Prisma } from "@prisma/client";
import { requireAdminSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: true } | { ok: false; message: string };

/** `inherit` / empty → null (dùng CollectionConfig). */
function parseOptionalCategoryDisplayPreset(raw: string): CollectionDisplayPreset | null {
  const t = raw.trim();
  if (t === "" || t === "inherit") return null;
  const vals = Object.values(CollectionDisplayPreset) as string[];
  if (vals.includes(t)) return t as CollectionDisplayPreset;
  return null;
}

/** `inherit` / empty → null (ảnh thumb kế thừa CollectionConfig). */
function parseOptionalTileImageUrl(raw: string): string | null {
  const t = raw.trim();
  if (t === "" || t === "inherit") return null;
  return t;
}

function prismaError(e: unknown, fallback: string): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    return "Slug đã tồn tại, hãy đổi slug.";
  }
  return fallback;
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdminSession())) return { ok: false, message: "Chưa đăng nhập." };

  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const displayPreset = parseOptionalCategoryDisplayPreset(String(formData.get("displayPreset") ?? "inherit"));
  const tileImageUrl = parseOptionalTileImageUrl(String(formData.get("tileImageUrl") ?? "inherit"));

  if (!name) return { ok: false, message: "Tên danh mục không được để trống." };
  if (!slug) slug = slugify(name);
  if (!slug) return { ok: false, message: "Không tạo được slug hợp lệ." };

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
        description,
        ...(displayPreset != null ? { displayPreset } : {}),
        ...(tileImageUrl != null ? { tileImageUrl } : {}),
      },
    });
  } catch (e) {
    return { ok: false, message: prismaError(e, "Không thể tạo danh mục.") };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath(`/category/${slug}`);
  return { ok: true };
}

export async function updateCategory(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdminSession())) return { ok: false, message: "Chưa đăng nhập." };

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const displayPreset = parseOptionalCategoryDisplayPreset(String(formData.get("displayPreset") ?? "inherit"));
  const tileImageUrl = parseOptionalTileImageUrl(String(formData.get("tileImageUrl") ?? "inherit"));

  if (!id) return { ok: false, message: "Thiếu ID." };
  if (!name) return { ok: false, message: "Tên danh mục không được để trống." };
  if (!slug) slug = slugify(name);
  if (!slug) return { ok: false, message: "Không tạo được slug hợp lệ." };

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        ...(displayPreset != null ? { displayPreset } : { displayPreset: null }),
        ...(tileImageUrl != null ? { tileImageUrl } : { tileImageUrl: null }),
      } as Prisma.CategoryUpdateInput,
    });
  } catch (e) {
    return { ok: false, message: prismaError(e, "Không thể cập nhật danh mục.") };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath(`/category/${slug}`);
  return { ok: true };
}

export async function deleteCategory(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdminSession())) return { ok: false, message: "Chưa đăng nhập." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Thiếu ID." };

  try {
    await prisma.category.delete({ where: { id } });
  } catch (e) {
    return { ok: false, message: prismaError(e, "Không thể xóa danh mục.") };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { ok: true };
}
