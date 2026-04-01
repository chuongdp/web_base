"use server";

import { revalidatePath } from "next/cache";
import { CollectionDisplayPreset } from "@prisma/client";
import { requireAdminSession } from "@/lib/admin-auth";
import { revalidateCollectionConfigCache } from "@/lib/collection-config";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: true } | { ok: false; message: string };

function parsePreset(raw: string): CollectionDisplayPreset {
  const t = raw.trim();
  const vals = Object.values(CollectionDisplayPreset) as string[];
  if (vals.includes(t)) return t as CollectionDisplayPreset;
  return CollectionDisplayPreset.default;
}

function parseOptionalImageUrl(raw: string): string | null {
  const t = raw.trim();
  return t.length > 0 ? t : null;
}

export async function updateCollectionConfig(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdminSession())) return { ok: false, message: "Chưa đăng nhập." };

  const defaultDisplayPreset = parsePreset(String(formData.get("defaultDisplayPreset") ?? "default"));
  const defaultTileImageUrl = parseOptionalImageUrl(String(formData.get("defaultTileImageUrl") ?? ""));
  const homeSectionHeading = String(formData.get("homeSectionHeading") ?? "").trim() || null;

  try {
    await prisma.collectionConfig.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        defaultDisplayPreset,
        defaultTileImageUrl,
        homeSectionHeading,
      },
      update: {
        defaultDisplayPreset,
        defaultTileImageUrl,
        homeSectionHeading,
      },
    });
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Không lưu được cấu hình collection." };
  }

  revalidateCollectionConfigCache();
  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/collections");
  return { ok: true };
}
