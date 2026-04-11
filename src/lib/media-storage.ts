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

/** Khi trình duyệt/OS không gửi `File.type` (thường gặp trên Windows). */
export function guessMimeFromFilename(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".ico")) return "image/x-icon";
  return null;
}

/** Nhận diện MIME từ vài byte đầu khi không có type / tên file lạ. */
export function sniffImageMime(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "image/png";
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) return "image/gif";
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return "image/webp";
  }
  if (
    (buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0x01 && buffer[3] === 0x00) ||
    (buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0x02 && buffer[3] === 0x00)
  ) {
    return "image/x-icon";
  }
  const head = buffer
    .slice(0, Math.min(512, buffer.length))
    .toString("utf8")
    .replace(/^\uFEFF/, "")
    .trimStart();
  if (/<\s*svg\b/i.test(head) || (head.startsWith("<?xml") && /<\s*svg\b/i.test(head))) {
    return "image/svg+xml";
  }
  return null;
}

export function resolveImageMime(blob: Blob, buffer: Buffer, filename: string | undefined): string | null {
  const t = blob.type.trim();
  if (t && isAllowedImageMime(t)) return t;
  const fromName = filename ? guessMimeFromFilename(filename) : null;
  if (fromName && isAllowedImageMime(fromName)) return fromName;
  const sniffed = sniffImageMime(buffer);
  return sniffed && isAllowedImageMime(sniffed) ? sniffed : null;
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
