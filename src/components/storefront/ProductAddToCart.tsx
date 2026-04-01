"use client";

import type { Currency } from "@prisma/client";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

type Props = {
  productId: string;
  productName: string;
  currency: Currency;
};

export function ProductAddToCart({ productId, productName, currency }: Props) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function handleAdd() {
    setErr(null);
    const res = addToCart(productId, qty, currency, "");
    if (!res.ok) {
      setErr(res.message);
      return;
    }
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full max-w-[8rem]">
          <label htmlFor="qty" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Quantity
          </label>
          <input
            id="qty"
            type="number"
            min={1}
            max={999}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-center text-sm tabular-nums focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <button
          type="button"
          className="min-h-[48px] flex-1 rounded-lg px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 sm:max-w-md"
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
