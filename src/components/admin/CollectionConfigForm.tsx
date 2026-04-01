"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCollectionConfig } from "@/app/admin/collections/actions";
import type { CollectionConfigDTO } from "@/lib/collection-config";
import { COLLECTION_DISPLAY_OPTIONS } from "@/lib/collection-display";

type Props = {
  initial: CollectionConfigDTO;
};

export function CollectionConfigForm({ initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(fd: FormData) {
    setError(null);
    setPending(true);
    const res = await updateCollectionConfig(fd);
    setPending(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    router.refresh();
  }

  /** Remount form sau refresh để defaultValue khớp server (tránh dropdown bị kẹt ở option đầu). */
  const formKey = JSON.stringify({
    p: initial.defaultDisplayPreset,
    h: initial.homeSectionHeading,
    i: initial.defaultTileImageUrl ?? "",
  });

  return (
    <form
      key={formKey}
      action={(fd) => void handleSubmit(fd)}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="cc-heading" className="mb-1 block text-sm font-medium text-zinc-700">
          Tiêu đề khối trên trang chủ
        </label>
        <input
          id="cc-heading"
          name="homeSectionHeading"
          type="text"
          defaultValue={initial.homeSectionHeading}
          placeholder="Bộ sưu tập"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>
      <div>
        <label htmlFor="cc-preset" className="mb-1 block text-sm font-medium text-zinc-700">
          Kiểu hiển thị mặc định (kế thừa)
        </label>
        <select
          id="cc-preset"
          name="defaultDisplayPreset"
          defaultValue={initial.defaultDisplayPreset}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        >
          {COLLECTION_DISPLAY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-zinc-500">
          Danh mục để &quot;Kế thừa cấu hình Collection&quot; sẽ dùng preset này cho tile và lưới sản phẩm.
        </p>
      </div>
      <div>
        <label htmlFor="cc-tile-img" className="mb-1 block text-sm font-medium text-zinc-700">
          Ảnh thumb thẻ danh mục (mặc định)
        </label>
        <input
          id="cc-tile-img"
          name="defaultTileImageUrl"
          type="url"
          defaultValue={initial.defaultTileImageUrl ?? ""}
          placeholder="https://… (để trống = chỉ dùng gradient, không ảnh)"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
        <p className="mt-1 text-xs text-zinc-500">
          URL ảnh nền cho thẻ danh mục trên trang chủ. Từng danh mục có thể ghi đè bằng URL riêng; để trống ở cả hai thì hiển thị gradient như trước.
        </p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
      >
        {pending ? "Đang lưu…" : "Lưu cấu hình"}
      </button>
    </form>
  );
}
