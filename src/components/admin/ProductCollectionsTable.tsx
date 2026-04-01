"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createProductCollection,
  deleteProductCollection,
  updateProductCollection,
} from "@/app/admin/product-collections/actions";
import { Modal } from "@/components/admin/Modal";

export type ProductCollectionRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  _count: { products: number };
};

type Props = { rows: ProductCollectionRow[] };

export function ProductCollectionsTable({ rows }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductCollectionRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function openCreate() {
    setEditing(null);
    setError(null);
    setOpen(true);
  }

  function openEdit(row: ProductCollectionRow) {
    setEditing(row);
    setError(null);
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
      const res = editing ? await updateProductCollection(formData) : await createProductCollection(formData);
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
    if (!confirm("Xóa bộ sưu tập này? Sản phẩm chỉ bị gỡ khỏi bộ sưu tập, không bị xóa.")) return;
    setError(null);
    setPending(true);
    try {
      const fd = new FormData();
      fd.set("id", id);
      const res = await deleteProductCollection(fd);
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
        <h1 className="text-2xl font-semibold text-zinc-900">Bộ sưu tập (Collections)</h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Thêm bộ sưu tập
        </button>
      </div>

      <p className="mb-4 max-w-2xl text-sm text-zinc-600">
        Gán sản phẩm vào bộ sưu tập từ mục Sản phẩm. Trang khách xem tại{" "}
        <a href="/collections" className="font-medium text-zinc-900 underline">
          /collections
        </a>
        .
      </p>

      {error && !open ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Tên</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Slug</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-700">SP</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-700">Thứ tự</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  Chưa có bộ sưu tập.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50/80">
                  <td className="px-4 py-3 font-medium text-zinc-900">{r.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-600">{r.slug}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-700">{r._count.products}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-600">{r.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(r)}
                      className="mr-2 text-zinc-700 underline hover:text-zinc-900"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(r.id)}
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

      <Modal open={open} title={editing ? "Sửa bộ sưu tập" : "Thêm bộ sưu tập"} onClose={close}>
        <form action={(fd) => void handleSubmit(fd)} className="space-y-4">
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

          <div>
            <label htmlFor="pc-name" className="mb-1 block text-sm font-medium text-zinc-700">
              Tên
            </label>
            <input
              id="pc-name"
              name="name"
              required
              defaultValue={editing?.name ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="pc-slug" className="mb-1 block text-sm font-medium text-zinc-700">
              Slug (URL, để trống để tự tạo)
            </label>
            <input
              id="pc-slug"
              name="slug"
              defaultValue={editing?.slug ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="pc-desc" className="mb-1 block text-sm font-medium text-zinc-700">
              Mô tả (tùy chọn)
            </label>
            <textarea
              id="pc-desc"
              name="description"
              rows={3}
              defaultValue={editing?.description ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="pc-sort" className="mb-1 block text-sm font-medium text-zinc-700">
              Thứ tự hiển thị (số nhỏ lên trước)
            </label>
            <input
              id="pc-sort"
              name="sortOrder"
              type="number"
              min={0}
              step={1}
              defaultValue={editing?.sortOrder ?? 0}
              className="w-full max-w-[12rem] rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
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
