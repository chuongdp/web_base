"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { uploadMediaAction } from "@/app/actions/mediaActions";

type FieldName = "logoUrl" | "faviconUrl";

type Props = {
  id: string;
  name: FieldName;
  label: string;
  defaultValue: string;
  helperText?: string;
  /** Variant ảnh: logo header vs icon tab */
  variant: "logo" | "favicon";
};

const ACCEPT_LOGO =
  "image/jpeg,image/png,image/gif,image/webp,image/svg+xml,.jpg,.jpeg,.png,.gif,.webp,.svg";
const ACCEPT_FAVICON =
  "image/jpeg,image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico,.png,.svg";

export function BrandAssetUploadField({ id, name, label, defaultValue, helperText, variant }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue.trim());
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    setValue(defaultValue.trim());
  }, [defaultValue]);

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
      setValue(res.url);
      router.refresh();
      setMsg({ kind: "ok", text: "Đã upload — nhấn «Lưu cấu hình» bên dưới để áp dụng lên site." });
      return;
    }
    setMsg({ kind: "err", text: res.message });
  }

  const showPreview = value.length > 0;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1 space-y-2">
          <input
            id={id}
            name={name}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setMsg(null);
            }}
            placeholder={variant === "logo" ? "/uploads/…/logo.png hoặc URL" : "/uploads/…/favicon.png"}
            className="w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={variant === "logo" ? ACCEPT_LOGO : ACCEPT_FAVICON}
              className="hidden"
              onChange={onFileChange}
              disabled={pending}
            />
            <button
              type="button"
              disabled={pending}
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:opacity-60"
            >
              {pending ? "Đang upload…" : "Upload từ máy"}
            </button>
            <span className="text-xs text-zinc-500">JPEG, PNG, WebP, SVG{faviconOnly(variant)} — tối đa 5 MB</span>
          </div>
          {msg ? (
            <p className={`text-sm ${msg.kind === "ok" ? "text-emerald-700" : "text-red-600"}`}>{msg.text}</p>
          ) : null}
        </div>
        <div
          className={`shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 ${
            variant === "logo" ? "flex h-20 w-40 items-center justify-center" : "flex h-14 w-14 items-center justify-center"
          }`}
        >
          {showPreview ? (
            <img
              src={value}
              alt=""
              className={
                variant === "logo"
                  ? "max-h-full max-w-full object-contain object-left p-1"
                  : "max-h-full max-w-full object-contain p-1"
              }
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span className="px-2 text-center text-[10px] text-zinc-400">
              {variant === "logo" ? "Preview logo" : "Icon"}
            </span>
          )}
        </div>
      </div>
      {helperText ? <p className="mt-1.5 text-xs text-zinc-500">{helperText}</p> : null}
    </div>
  );
}

function faviconOnly(variant: "logo" | "favicon"): string {
  return variant === "favicon" ? ", ICO" : "";
}
