"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CollectionDisplayPreset } from "@prisma/client";
import { createCategory, deleteCategory, updateCategory } from "@/app/admin/categories/actions";
import { Modal } from "@/components/admin/Modal";
import { COLLECTION_DISPLAY_OPTIONS } from "@/lib/collection-display";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayPreset: CollectionDisplayPreset | null;
  tileImageUrl: string | null;
};

type Props = {
  categories: CategoryRow[];
  collectionGlobalDefault: CollectionDisplayPreset;
  collectionDefaultTileImageUrl: string | null;
};

function presetLabel(p: CollectionDisplayPreset): string {
  return COLLECTION_DISPLAY_OPTIONS.find((o) => o.value === p)?.label ?? p;
}

function thumbHint(url: string | null): string {
  if (url == null || url.trim() === "") return "—";
  return url.length > 40 ? `${url.slice(0, 40)}…` : url;
}

export function CategoriesTable({
  categories,
  collectionGlobalDefault,
  collectionDefaultTileImageUrl,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function openCreate() {
    setEditing(null);
    setError(null);
    setFormKey((k) => k + 1);
    setOpen(true);
  }

  function openEdit(row: CategoryRow) {
    setEditing(row);
    setError(null);
    setFormKey((k) => k + 1);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setEditing(null);
    setError(null);
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      const res = editing ? await updateCategory(formData) : await createCategory(formData);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      close();
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa danh mục này?")) return;
    setError(null);
    setPending(true);
    try {
      const fd = new FormData();
      fd.set("id", id);
      const res = await deleteCategory(fd);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-zinc-900">Danh mục</h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Thêm danh mục
        </button>
      </div>

      {error && !open ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Tên</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Hiển thị</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Thumb tile</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Mô tả</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Chưa có danh mục.
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/80">
                  <td className="px-4 py-3 font-medium text-zinc-900">{c.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{c.slug}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {c.displayPreset == null
                      ? `Kế thừa (${presetLabel(collectionGlobalDefault)})`
                      : presetLabel(c.displayPreset)}
                  </td>
                  <td className="max-w-[12rem] px-4 py-3 font-mono text-xs text-zinc-700">
                    {c.tileImageUrl == null || c.tileImageUrl.trim() === ""
                      ? `Kế thừa (${thumbHint(collectionDefaultTileImageUrl)})`
                      : thumbHint(c.tileImageUrl)}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-zinc-600">
                    {c.description ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="mr-2 text-zinc-700 underline hover:text-zinc-900"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(c.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editing ? "Sửa danh mục" : "Thêm danh mục"} onClose={close}>
        <form
          key={`cat-form-${formKey}-${editing?.id ?? "new"}`}
          action={(fd) => void handleSubmit(fd)}
          className="space-y-4"
        >
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

          <div>
            <label htmlFor="cat-name" className="mb-1 block text-sm font-medium text-zinc-700">
              Tên
            </label>
            <input
              id="cat-name"
              name="name"
              required
              defaultValue={editing?.name ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="cat-slug" className="mb-1 block text-sm font-medium text-zinc-700">
              Slug (để trống để tự tạo)
            </label>
            <input
              id="cat-slug"
              name="slug"
              defaultValue={editing?.slug ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="cat-desc" className="mb-1 block text-sm font-medium text-zinc-700">
              Mô tả
            </label>
            <textarea
              id="cat-desc"
              name="description"
              rows={3}
              defaultValue={editing?.description ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="cat-display" className="mb-1 block text-sm font-medium text-zinc-700">
              Kiểu hiển thị collection
            </label>
            <select
              id="cat-display"
              name="displayPreset"
              defaultValue={
                editing == null || editing.displayPreset == null ? "inherit" : editing.displayPreset
              }
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="inherit">Kế thừa (cấu hình Collection)</option>
              {COLLECTION_DISPLAY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-zinc-500">
              “Kế thừa” dùng preset mặc định tại Cấu hình Collection. Ảnh hưởng kích thước tile &amp; lưới sản phẩm.
            </p>
          </div>
          <div>
            <label htmlFor="cat-tile-img" className="mb-1 block text-sm font-medium text-zinc-700">
              Ảnh thumb thẻ trang chủ
            </label>
            <input
              id="cat-tile-img"
              name="tileImageUrl"
              type="url"
              defaultValue={editing?.tileImageUrl ?? ""}
              placeholder="https://… (để trống = kế thừa URL mặc định trong Collection)"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
            <p className="mt-1 text-xs text-zinc-500">
              URL ảnh nền cho thẻ danh mục trên trang chủ. Để trống để dùng ảnh mặc định từ Cấu hình Collection (nếu có).
            </p>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={close}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {pending ? "Đang lưu…" : "Lưu"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
