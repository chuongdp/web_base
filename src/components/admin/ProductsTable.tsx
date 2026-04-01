"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createProduct,
  deleteProduct,
  deleteProductsBulk,
  updateProduct,
} from "@/app/admin/products/actions";
import { importProduct } from "@/app/actions/scraperActions";
import { Modal } from "@/components/admin/Modal";
import { ProductSizeStockFields } from "@/components/admin/ProductSizeStockFields";
import { type CurrencyCode, formatMoney } from "@/lib/format-price";
import { slugify } from "@/lib/slug";

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  materials: string | null;
  careInstructions: string | null;
  shippingDetails: string | null;
  sizes: string | null;
  sizeStocks: { sizeLabel: string; quantity: number }[];
  price: string;
  currency: CurrencyCode;
  images: string[];
  categoryId: string;
  categoryName: string;
  /** ID các bộ sưu tập (ProductCollection) gán cho sản phẩm. */
  collectionIds: string[];
};

export type CategoryOption = { id: string; name: string };

export type CollectionOption = { id: string; name: string };

type Props = {
  products: ProductRow[];
  categories: CategoryOption[];
  collectionOptions: CollectionOption[];
  /** Tiền tệ mặc định từ CMS (sản phẩm mới / form trống). */
  defaultStoreCurrency: CurrencyCode;
};

type ToastState = { kind: "ok" | "err"; message: string } | null;

const IMPORT_PLATFORMS = [
  { value: "shopify", label: "Shopify" },
  { value: "shopbase", label: "ShopBase" },
  { value: "amazon", label: "Amazon" },
  { value: "aliexpress", label: "AliExpress" },
  { value: "ebay", label: "eBay" },
] as const;

type Prefill = {
  name: string;
  slug: string;
  price: string;
  currency: CurrencyCode;
  images: string[];
  description: string;
  materials: string;
  careInstructions: string;
  shippingDetails: string;
  sizes: string;
};

function guessCurrencyFromPriceText(raw: string | null): CurrencyCode {
  if (!raw) return "USD";
  const lower = raw.toLowerCase();
  if (raw.includes("$") || lower.includes("usd") || /\bdollar\b/.test(lower)) return "USD";
  if (lower.includes("₫") || lower.includes("vnd") || lower.includes("đồng")) return "VND";
  return "USD";
}

/** Chuẩn hóa giá từ scrape: VND chỉ số; USD giữ phần thập phân (vd 29.99). */
function parsePriceFromScrapedText(raw: string | null, currency: CurrencyCode): string {
  if (!raw) return "";
  const normalized = raw.replace(/\u00a0/g, " ").trim();
  if (currency === "USD") {
    const m = normalized.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)/);
    if (!m) return "";
    return m[1].replace(/,/g, "");
  }
  return normalized.replace(/[^\d]/g, "");
}

function emptyPrefill(currency: CurrencyCode): Prefill {
  return {
    name: "",
    slug: "",
    price: "",
    currency,
    images: [],
    description: "",
    materials: "",
    careInstructions: "",
    shippingDetails: "",
    sizes: "",
  };
}

export function ProductsTable({ products, categories, collectionOptions, defaultStoreCurrency }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [importUrl, setImportUrl] = useState("");
  const [importPlatform, setImportPlatform] = useState<string>("shopify");
  const [fetchingImport, setFetchingImport] = useState(false);
  const [prefill, setPrefill] = useState<Prefill>(() => emptyPrefill(defaultStoreCurrency));
  const [formKey, setFormKey] = useState(0);
  const [toast, setToast] = useState<ToastState>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const selectAllRef = useRef<HTMLInputElement>(null);

  const productIdSet = useMemo(() => new Set(products.map((p) => p.id)), [products]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    setSelectedIds((prev) => {
      const next = new Set<string>();
      for (const id of prev) {
        if (productIdSet.has(id)) next.add(id);
      }
      return next;
    });
  }, [productIdSet]);

  const allSelected = products.length > 0 && selectedIds.size === products.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  useEffect(() => {
    const el = selectAllRef.current;
    if (el) el.indeterminate = someSelected;
  }, [someSelected]);

  const defaultCategoryId = categories[0]?.id ?? "";

  function openCreate() {
    setEditing(null);
    setError(null);
    setPrefill(emptyPrefill(defaultStoreCurrency));
    setImportPlatform("shopify");
    setImportUrl("");
    setFormKey((k) => k + 1);
    setOpen(true);
  }

  function openEdit(row: ProductRow) {
    setEditing(row);
    setError(null);
    setPrefill(emptyPrefill(defaultStoreCurrency));
    setFormKey((k) => k + 1);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setEditing(null);
    setError(null);
    setPrefill(emptyPrefill(defaultStoreCurrency));
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      const res = editing ? await updateProduct(formData) : await createProduct(formData);
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

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Xóa ${selectedIds.size} sản phẩm đã chọn? Không hoàn tác.`)) return;
    setError(null);
    setPending(true);
    try {
      const fd = new FormData();
      fd.set("ids", JSON.stringify([...selectedIds]));
      const res = await deleteProductsBulk(fd);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      setSelectedIds(new Set());
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa sản phẩm này?")) return;
    setError(null);
    setPending(true);
    try {
      const fd = new FormData();
      fd.set("id", id);
      const res = await deleteProduct(fd);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleFetchFromUrl() {
    const url = importUrl.trim();
    if (!url) {
      setToast({ kind: "err", message: "Vui lòng dán URL sản phẩm." });
      return;
    }
    setFetchingImport(true);
    setToast(null);
    const res = await importProduct(url, importPlatform);
    setFetchingImport(false);

    if (!res.ok) {
      setToast({ kind: "err", message: res.message });
      return;
    }

    const {
      title,
      price,
      description,
      images,
      materials,
      careInstructions,
      shippingDetails,
      sizes,
    } = res.data;
    const currencyGuess = guessCurrencyFromPriceText(price);
    const priceParsed = parsePriceFromScrapedText(price, currencyGuess);
    const suggestedSlug = slugify(title);

    setEditing(null);
    setPrefill({
      name: title,
      slug: suggestedSlug,
      price: priceParsed,
      currency: currencyGuess,
      images: images.length > 0 ? images : [],
      description: description ?? "",
      materials: materials ?? "",
      careInstructions: careInstructions ?? "",
      shippingDetails: shippingDetails ?? "",
      sizes: sizes ?? "",
    });
    setFormKey((k) => k + 1);
    setToast({
      kind: "ok",
      message: "Đã tải dữ liệu từ URL. Kiểm tra và bấm Lưu vào Database.",
    });
  }

  const isEdit = !!editing;
  const nameDefault = isEdit ? editing.name : prefill.name;
  const slugDefault = isEdit ? editing.slug : prefill.slug;
  const priceDefault = isEdit ? editing.price : prefill.price;
  const currencyDefault = isEdit ? editing.currency : prefill.currency;
  const imageUrlsDefault = isEdit ? editing.images.join("\n") : prefill.images.join("\n");
  const descDefault = isEdit ? editing.description ?? "" : prefill.description;
  const materialsDefault = isEdit ? editing.materials ?? "" : prefill.materials;
  const careDefault = isEdit ? editing.careInstructions ?? "" : prefill.careInstructions;
  const shippingDefault = isEdit ? editing.shippingDetails ?? "" : prefill.shippingDetails;
  const sizesDefault = isEdit ? editing.sizes ?? "" : prefill.sizes;
  const sizeStocksDefault = isEdit ? editing.sizeStocks : [];
  const catDefault = isEdit ? editing.categoryId : defaultCategoryId;

  return (
    <div>
      {toast ? (
        <div
          className={`fixed right-4 top-4 z-[200] max-w-md rounded-lg border-2 px-4 py-3 text-sm shadow-lg ${
            toast.kind === "ok"
              ? "border-green-200 bg-green-50 text-green-900"
              : "border-red-500 bg-red-50 text-red-900 ring-2 ring-red-200"
          }`}
          role={toast.kind === "err" ? "alert" : "status"}
          aria-live={toast.kind === "err" ? "assertive" : "polite"}
        >
          {toast.kind === "err" ? (
            <p className="font-medium text-red-950">Lỗi import</p>
          ) : null}
          <p className={toast.kind === "err" ? "mt-1 text-red-900" : ""}>{toast.message}</p>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-zinc-900">Sản phẩm</h1>
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.size > 0 ? (
            <button
              type="button"
              onClick={() => void handleBulkDelete()}
              disabled={pending}
              className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100 disabled:opacity-60"
            >
              Xóa đã chọn ({selectedIds.size})
            </button>
          ) : null}
          <button
            type="button"
            onClick={openCreate}
            disabled={categories.length === 0}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="mb-3 text-sm text-amber-700">
          Cần có ít nhất một danh mục trước khi thêm sản phẩm.
        </p>
      ) : null}

      {error && !open ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="w-10 px-2 py-3 text-center font-medium text-zinc-700">
                <span className="sr-only">Chọn</span>
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(new Set(products.map((p) => p.id)));
                    } else {
                      setSelectedIds(new Set());
                    }
                  }}
                  disabled={products.length === 0 || pending}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                  aria-label="Chọn tất cả"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Tên</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Danh mục</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Bộ sưu tập</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-700">Giá</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-700">Stock</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Ảnh (URL)</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                  Chưa có sản phẩm.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/80">
                  <td className="px-2 py-3 text-center align-middle">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(p.id)}
                      onChange={() => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(p.id)) next.delete(p.id);
                          else next.add(p.id);
                          return next;
                        });
                      }}
                      disabled={pending}
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                      aria-label={`Chọn ${p.name}`}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{p.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{p.categoryName}</td>
                  <td className="max-w-[14rem] px-4 py-3 text-xs text-zinc-600">
                    {p.collectionIds.length === 0
                      ? "—"
                      : p.collectionIds
                          .map((id) => collectionOptions.find((c) => c.id === id)?.name ?? id)
                          .join(", ")}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-900">
                    {formatMoney(p.price, p.currency)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-600">
                    {p.sizeStocks.reduce((s, x) => s + x.quantity, 0)}
                  </td>
                  <td className="max-w-[12rem] px-4 py-3 text-zinc-600">
                    {p.images.length > 0 ? `${p.images.length} ảnh` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="mr-2 text-zinc-700 underline hover:text-zinc-900"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(p.id)}
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

      <Modal
        open={open}
        title={
          isEdit ? "Sửa sản phẩm" : prefill.name ? "Thêm sản phẩm (đã import từ URL)" : "Thêm sản phẩm"
        }
        onClose={close}
      >
        <form
          key={`product-form-${formKey}-${editing?.id ?? "new"}`}
          action={(fd) => void handleSubmit(fd)}
          className="space-y-4"
        >
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

          {!isEdit ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/90 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Import sản phẩm</h3>
              <p className="mt-1 text-xs text-zinc-500">
                Chọn nền tảng, dán URL trang sản phẩm, bấm Fetch Data để điền nhanh các trường bên dưới.
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
                <div className="sm:col-span-3">
                  <label htmlFor="import-platform" className="mb-1 block text-xs font-medium text-zinc-600">
                    Nền tảng
                  </label>
                  <select
                    id="import-platform"
                    value={importPlatform}
                    onChange={(e) => setImportPlatform(e.target.value)}
                    disabled={fetchingImport || categories.length === 0}
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 disabled:opacity-50"
                  >
                    {IMPORT_PLATFORMS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-7">
                  <label htmlFor="import-url" className="mb-1 block text-xs font-medium text-zinc-600">
                    URL sản phẩm
                  </label>
                  <input
                    id="import-url"
                    type="url"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="https://..."
                    disabled={fetchingImport || categories.length === 0}
                    autoComplete="off"
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 disabled:opacity-50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    disabled={fetchingImport || categories.length === 0}
                    onClick={() => void handleFetchFromUrl()}
                    className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {fetchingImport ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <span
                          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                          aria-hidden
                        />
                        Đang tải…
                      </span>
                    ) : (
                      "Fetch Data"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div>
            <label htmlFor="p-name" className="mb-1 block text-sm font-medium text-zinc-700">
              Tên
            </label>
            <input
              id="p-name"
              name="name"
              required
              defaultValue={nameDefault}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="p-slug" className="mb-1 block text-sm font-medium text-zinc-700">
              Slug (để trống để tự tạo)
            </label>
            <input
              id="p-slug"
              name="slug"
              defaultValue={slugDefault}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="p-cat" className="mb-1 block text-sm font-medium text-zinc-700">
              Danh mục
            </label>
            <select
              id="p-cat"
              name="categoryId"
              required
              defaultValue={catDefault}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium text-zinc-700">Bộ sưu tập (Collection)</span>
            {collectionOptions.length === 0 ? (
              <p className="text-xs text-zinc-500">
                Chưa có bộ sưu tập. Tạo tại Admin → Bộ sưu tập, rồi gán sản phẩm tại đây.
              </p>
            ) : (
              <ul className="max-h-40 space-y-2 overflow-y-auto rounded-md border border-zinc-200 bg-zinc-50/80 px-3 py-2">
                {collectionOptions.map((c) => (
                  <li key={c.id}>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800">
                      <input
                        type="checkbox"
                        name="collectionIds"
                        value={c.id}
                        defaultChecked={isEdit && (editing?.collectionIds.includes(c.id) ?? false)}
                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                      />
                      {c.name}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="p-currency" className="mb-1 block text-sm font-medium text-zinc-700">
                Tiền tệ
              </label>
              <select
                id="p-currency"
                name="currency"
                required
                defaultValue={currencyDefault}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              >
                <option value="VND">VND (₫)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div>
              <label htmlFor="p-price" className="mb-1 block text-sm font-medium text-zinc-700">
                Giá (số)
              </label>
              <input
                id="p-price"
                name="price"
                type="text"
                inputMode="decimal"
                required
                defaultValue={priceDefault}
                placeholder="99000 hoặc 29.99"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="p-imgs" className="mb-1 block text-sm font-medium text-zinc-700">
              URL ảnh (mỗi dòng một ảnh)
            </label>
            <textarea
              id="p-imgs"
              name="imageUrls"
              rows={5}
              defaultValue={imageUrlsDefault}
              placeholder={"https://…\nhttps://…"}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
            {!isEdit && prefill.images.length > 0 ? (
              <p className="mt-1 text-xs text-zinc-500">
                Đã nhập {prefill.images.length} ảnh từ nguồn — có thể chỉnh trước khi lưu.
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="p-desc" className="mb-1 block text-sm font-medium text-zinc-700">
              Mô tả
            </label>
            <textarea
              id="p-desc"
              name="description"
              rows={3}
              defaultValue={descDefault}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <ProductSizeStockFields
            key={formKey}
            defaultSizes={sizesDefault}
            sizeStocks={sizeStocksDefault}
          />
          <div>
            <label htmlFor="p-materials" className="mb-1 block text-sm font-medium text-zinc-700">
              Materials (từ import / tùy chọn)
            </label>
            <textarea
              id="p-materials"
              name="materials"
              rows={3}
              defaultValue={materialsDefault}
              placeholder="Product materials…"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="p-care" className="mb-1 block text-sm font-medium text-zinc-700">
              Care instructions (tùy chọn)
            </label>
            <textarea
              id="p-care"
              name="careInstructions"
              rows={3}
              defaultValue={careDefault}
              placeholder="Care information…"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="p-shipping" className="mb-1 block text-sm font-medium text-zinc-700">
              Shipping &amp; delivery (tùy chọn)
            </label>
            <textarea
              id="p-shipping"
              name="shippingDetails"
              rows={3}
              defaultValue={shippingDefault}
              placeholder="Delivery & shipping…"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
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
              {pending ? "Đang lưu…" : isEdit ? "Lưu" : "Lưu vào Database"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
