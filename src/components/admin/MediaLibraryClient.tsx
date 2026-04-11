"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  deleteMediaAction,
  type MediaItem,
  uploadMediaAction,
} from "@/app/actions/mediaActions";

type Props = {
  items: MediaItem[];
};

function formatSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryClient({ items: initialItems }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setMsg(null);
    setPending(true);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadMediaAction(fd);
    setPending(false);
    if (res.ok) {
      setMsg({ kind: "ok", text: `Đã upload: ${res.url}` });
      router.refresh();
      return;
    }
    setMsg({ kind: "err", text: res.message });
  }

  async function onDelete(id: string) {
    if (!confirm("Xóa ảnh này? Liên kết đang dùng URL có thể gãy.")) return;
    setMsg(null);
    const fd = new FormData();
    fd.set("id", id);
    const res = await deleteMediaAction(fd);
    if (res.ok) {
      router.refresh();
      return;
    }
    setMsg({ kind: "err", text: res.message });
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMsg({ kind: "ok", text: "Đã copy URL vào clipboard." });
    } catch {
      setMsg({ kind: "err", text: "Không copy được (trình duyệt chặn)." });
    }
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Upload ảnh</h2>
        <p className="mt-1 text-sm text-zinc-600">
          JPEG, PNG, GIF, WebP, SVG, ICO — tối đa 5 MB. File lưu tại <code className="text-xs">/public/uploads/</code>.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.jpg,.jpeg,.png,.gif,.webp,.svg,.ico"
            className="hidden"
            onChange={onFileChange}
            disabled={pending}
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {pending ? "Đang upload…" : "Chọn file"}
          </button>
        </div>
        {msg ? (
          <p
            className={`mt-3 text-sm ${
              msg.kind === "ok" ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {msg.text}
          </p>
        ) : null}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Thư viện ({initialItems.length})</h2>
        {initialItems.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">Chưa có ảnh nào.</p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {initialItems.map((m) => {
              const absolute = m.url.startsWith("http") ? m.url : `${origin}${m.url}`;
              const useNativeImg =
                m.mimeType.includes("svg") || m.mimeType.includes("icon") || m.url.endsWith(".ico");
              return (
                <li
                  key={m.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-square w-full bg-zinc-100">
                    {useNativeImg ? (
                      <img src={m.url} alt="" className="h-full w-full object-contain p-2" />
                    ) : (
                      <Image
                        src={m.url}
                        alt=""
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 border-t border-zinc-100 p-3">
                    <p className="truncate text-xs text-zinc-500" title={m.filename}>
                      {m.filename}
                    </p>
                    <p className="text-xs text-zinc-400">{formatSize(m.sizeBytes)}</p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => copyUrl(absolute)}
                        className="rounded-md border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                      >
                        Copy URL
                      </button>
                      <button
                        type="button"
                        onClick={() => copyUrl(m.url)}
                        className="rounded-md border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                      >
                        Copy path
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(m.id)}
                        className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
