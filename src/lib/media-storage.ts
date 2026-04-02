import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export const MAX_MEDIA_BYTES = 5 * 1024 * 1024;

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
};

export function isAllowedImageMime(mime: string): mime is keyof typeof ALLOWED {
  return mime in ALLOWED;
}

export function extensionForMime(mime: string): string | null {
  return ALLOWED[mime] ?? null;
}

export function publicUploadsDir(): string {
  return path.join(process.cwd(), "public", "uploads");
}

export async function saveUploadedImage(buffer: Buffer, mime: string): Promise<{ publicUrl: string; filename: string }> {
  const ext = extensionForMime(mime);
  if (!ext) throw new Error("Unsupported image type");

  const now = new Date();
  const y = String(now.getFullYear());
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const id = crypto.randomUUID();
  const filename = `${id}.${ext}`;
  const relativeDir = path.join("uploads", y, m);
  const dir = path.join(process.cwd(), "public", relativeDir);
  await mkdir(dir, { recursive: true });

  const diskPath = path.join(dir, filename);
  await writeFile(diskPath, buffer);

  const publicUrl = `/${relativeDir.replace(/\\/g, "/")}/${filename}`;
  return { publicUrl, filename: `${y}/${m}/${filename}` };
}

export async function removePublicFile(publicUrl: string): Promise<void> {
  if (!publicUrl.startsWith("/uploads/")) return;
  const rel = publicUrl.replace(/^\//, "");
  const disk = path.join(process.cwd(), "public", rel);
  try {
    await unlink(disk);
  } catch {
    /* ignore */
  }
}
