"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCartProducts, type CartProductRow } from "@/app/actions/orderActions";
import { useCart } from "@/hooks/useCart";
import { cartLineKey } from "@/lib/sizes";
import { formatMoney, type CurrencyCode } from "@/lib/format-price";

export function CartView() {
  const { cartItems, cartCurrency, setQuantity, removeItem } = useCart();
  const [products, setProducts] = useState<CartProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const ids = useMemo(() => cartItems.map((i) => i.productId), [cartItems]);

  const load = useCallback(async () => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    setLoading(true);
    const rows = await getCartProducts(ids);
    setProducts(rows);
    setLoading(false);
  }, [ids]);

  useEffect(() => {
    void load();
  }, [load]);

  const lines = useMemo(() => {
    return cartItems
      .map((ci) => {
        const p = products.find((x) => x.id === ci.productId);
        return p ? { ...ci, product: p } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [cartItems, products]);

  const subtotal = useMemo(() => {
    let sum = 0;
    for (const line of lines) {
      const n = Number(line.product.price.replace(",", "."));
      if (Number.isFinite(n)) sum += n * line.quantity;
    }
    return sum;
  }, [lines]);

  const currency: CurrencyCode = (cartCurrency ?? lines[0]?.product.currency ?? "USD") as CurrencyCode;

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl py-10 text-center text-sm text-zinc-500">Loading cart…</div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold text-zinc-900">Cart</h1>
        <p className="mt-3 text-sm text-zinc-600">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg px-6 py-2.5 text-sm font-medium text-white"
          style={{ backgroundColor: "var(--sf-primary)" }}
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const missing = cartItems.filter((ci) => !products.some((p) => p.id === ci.productId));

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-2xl font-semibold text-zinc-900">Cart</h1>
      <p className="mt-1 text-sm text-zinc-600">
        {cartCurrency ? `Currency: ${cartCurrency}` : null}
      </p>

      {missing.length > 0 ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Some items are no longer available. Remove them from your cart.
        </p>
      ) : null}

      <ul className="mt-8 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        {cartItems.map((ci) => {
          const p = products.find((x) => x.id === ci.productId);
          if (!p) {
            return (
              <li key={cartLineKey(ci.productId, ci.sizeLabel)} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <p className="flex-1 text-sm text-zinc-600">Product removed — {ci.productId}</p>
                <button
                  type="button"
                  onClick={() => removeItem(ci.productId, ci.sizeLabel)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            );
          }
          const linePrice = Number(p.price.replace(",", ".")) * ci.quantity;
          const lineKey = cartLineKey(ci.productId, ci.sizeLabel);
          return (
            <li key={lineKey} className="flex gap-4 p-4">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized={p.imageUrl.startsWith("/")}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-400">—</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/product/${p.id}`}
                  className="font-medium text-zinc-900 hover:underline"
                >
                  {p.name}
                </Link>
                {ci.sizeLabel ? (
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Size {ci.sizeLabel}
                  </p>
                ) : null}
                <p className="mt-1 text-sm tabular-nums" style={{ color: "var(--sf-primary)" }}>
                  {formatMoney(p.price, p.currency as CurrencyCode)} × {ci.quantity} ={" "}
                  {formatMoney(linePrice, p.currency as CurrencyCode)}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-zinc-600">
                    Qty
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={ci.quantity}
                      onChange={(e) => {
                        const q = Math.max(1, Math.min(999, Number(e.target.value) || 1));
                        setQuantity(ci.productId, ci.sizeLabel, q);
                      }}
                      className="w-16 rounded border border-zinc-300 px-2 py-1 text-center text-sm tabular-nums"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(ci.productId, ci.sizeLabel)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {loading ? <p className="mt-4 text-center text-sm text-zinc-500">Updating prices…</p> : null}

      <div className="mt-8 flex flex-col gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-semibold tabular-nums text-zinc-900">
          Subtotal: {formatMoney(subtotal, currency)}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Continue shopping
          </Link>
          {missing.length > 0 ? (
            <span className="cursor-not-allowed rounded-lg bg-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-600">
              Checkout
            </span>
          ) : (
            <Link
              href="/checkout"
              className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--sf-primary)" }}
            >
              Checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
