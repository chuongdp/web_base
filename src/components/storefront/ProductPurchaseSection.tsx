"use client";

import type { Currency } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { normalizeSizeLabel, parseSizesList } from "@/lib/sizes";
import { SizeGuideModal } from "@/components/storefront/SizeGuideModal";

type StockRow = { sizeLabel: string; quantity: number };

type Props = {
  productId: string;
  productName: string;
  currency: Currency;
  sizesString: string | null | undefined;
  sizeStocks: StockRow[];
};

export function ProductPurchaseSection({ productId, productName, currency, sizesString, sizeStocks }: Props) {
  const { addToCart } = useCart();
  const stockMap = useMemo(() => {
    const m: Record<string, number> = {};
    for (const r of sizeStocks) {
      m[normalizeSizeLabel(r.sizeLabel)] = r.quantity;
    }
    return m;
  }, [sizeStocks]);

  const sizes = useMemo(() => parseSizesList(sizesString), [sizesString]);
  const [selectedSize, setSelectedSize] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (sizes.length === 0) return;
    setSelectedSize((prev) => (prev && sizes.includes(prev) ? prev : sizes[0]));
  }, [sizes]);

  const effectiveSize = sizes.length === 0 ? "" : selectedSize;
  const available = stockMap[normalizeSizeLabel(effectiveSize)] ?? 0;

  const [qty, setQty] = useState(1);
  useEffect(() => {
    setQty(1);
  }, [effectiveSize]);

  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function handleAdd() {
    setErr(null);
    const res = addToCart(productId, qty, currency, effectiveSize);
    if (!res.ok) {
      setErr(res.message);
      return;
    }
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 4000);
  }

  const maxQty = available > 0 ? Math.min(999, available) : 0;

  return (
    <div className="space-y-4">
      {sizes.length > 0 ? (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-zinc-900">Size</span>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer text-xs font-medium text-zinc-500 underline decoration-zinc-400 underline-offset-2 transition-colors hover:text-zinc-800"
            >
              Size guide
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((size) => {
              const sel = selectedSize === size;
              const q = stockMap[normalizeSizeLabel(size)] ?? 0;
              const out = q <= 0;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={out}
                  onClick={() => setSelectedSize(size)}
                  title={out ? "Out of stock" : `${q} in stock`}
                  className={
                    out
                      ? "min-h-[2.5rem] min-w-[2.5rem] cursor-not-allowed rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-400 line-through"
                      : sel
                        ? "min-h-[2.5rem] min-w-[2.5rem] rounded-full border-2 border-black px-4 py-2 text-sm font-medium text-black transition-colors"
                        : "min-h-[2.5rem] min-w-[2.5rem] rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
                  }
                >
                  {size}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            {available > 0 ? `${available} in stock` : "Out of stock for this size"}
          </p>
          <SizeGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      ) : (
        <p className="mt-4 text-sm text-zinc-600">
          {available > 0 ? `${available} in stock` : "Out of stock"}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full max-w-[8rem]">
          <label htmlFor="qty" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Quantity
          </label>
          <input
            id="qty"
            type="number"
            min={1}
            max={maxQty > 0 ? maxQty : 1}
            value={maxQty === 0 ? 1 : Math.min(qty, maxQty)}
            disabled={maxQty === 0}
            onChange={(e) => setQty(Math.max(1, Math.min(maxQty || 1, Number(e.target.value) || 1)))}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-center text-sm tabular-nums focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          disabled={maxQty === 0}
          className="min-h-[48px] flex-1 rounded-lg px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-md"
          style={{ backgroundColor: "var(--sf-primary)" }}
          onClick={handleAdd}
          aria-label={`Add ${productName} to cart`}
        >
          Add to cart
        </button>
      </div>

      {err ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {err}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
          Added to cart
        </p>
      ) : null}
    </div>
  );
}
