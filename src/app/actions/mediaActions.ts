"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  extensionForMime,
  isAllowedImageMime,
  MAX_MEDIA_BYTES,
  removePublicFile,
  saveUploadedImage,
} from "@/lib/media-storage";
import { requireAdminSession } from "@/lib/admin-auth";

export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
};

export async function listMediaAssets(): Promise<MediaItem[]> {
  if (!(await requireAdminSession())) return [];
  return prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export type UploadMediaResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

export async function uploadMediaAction(formData: FormData): Promise<UploadMediaResult> {
  if (!(await requireAdminSession())) {
    return { ok: false, message: "Không có quyền quản trị." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Chọn file ảnh." };
  }
  if (file.size > MAX_MEDIA_BYTES) {
    return { ok: false, message: "File tối đa 5 MB." };
  }

  const mime = file.type || "application/octet-stream";
  if (!isAllowedImageMime(mime)) {
    return { ok: false, message: "Chỉ chấp nhận JPEG, PNG, GIF, WebP, SVG." };
  }
  if (!extensionForMime(mime)) {
    return { ok: false, message: "Định dạng ảnh không hợp lệ." };
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const { publicUrl, filename } = await saveUploadedImage(buf, mime);

  await prisma.mediaAsset.create({
    data: {
      url: publicUrl,
      filename,
      mimeType: mime,
      sizeBytes: file.size,
    },
  });

  revalidatePath("/admin/media");
  return { ok: true, url: publicUrl };
}

export type DeleteMediaResult = { ok: true } | { ok: false; message: string };

export async function deleteMediaAction(formData: FormData): Promise<DeleteMediaResult> {
  if (!(await requireAdminSession())) {
    return { ok: false, message: "Không có quyền quản trị." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { ok: false, message: "Thiếu id." };
  }

  const row = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!row) {
    return { ok: false, message: "Không tìm thấy file." };
  }

  await prisma.mediaAsset.delete({ where: { id } });
  await removePublicFile(row.url);

  revalidatePath("/admin/media");
  return { ok: true };
}
