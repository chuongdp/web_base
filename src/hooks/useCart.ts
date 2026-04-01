"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "@prisma/client";
import { normalizeSizeLabel } from "@/lib/sizes";

export type CartItem = {
  productId: string;
  quantity: number;
  /** Normalized; "" = single-size product */
  sizeLabel: string;
};

type CartStore = {
  items: CartItem[];
  cartCurrency: Currency | null;
  addToCart: (
    productId: string,
    quantity: number,
    currency: Currency,
    sizeLabel: string,
  ) => { ok: true } | { ok: false; message: string };
  setQuantity: (productId: string, sizeLabel: string, quantity: number) => void;
  removeItem: (productId: string, sizeLabel: string) => void;
  clearCart: () => void;
};

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartCurrency: null,
      addToCart: (productId, quantity, currency, sizeLabel) => {
        if (quantity < 1) return { ok: false, message: "Invalid quantity." };
        const label = normalizeSizeLabel(sizeLabel);
        const state = get();
        if (state.items.length > 0 && state.cartCurrency && state.cartCurrency !== currency) {
          return {
            ok: false,
            message: `Cart is using ${state.cartCurrency}. Clear the cart or check out before adding items in ${currency}.`,
          };
        }
        set((s) => {
          const idx = s.items.findIndex(
            (i) => i.productId === productId && normalizeSizeLabel(i.sizeLabel) === label,
          );
          if (idx >= 0) {
            const next = [...s.items];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
            return { items: next, cartCurrency: s.cartCurrency ?? currency };
          }
          return {
            items: [...s.items, { productId, quantity, sizeLabel: label }],
            cartCurrency: currency,
          };
        });
        return { ok: true };
      },
      setQuantity: (productId, sizeLabel, quantity) => {
        const label = normalizeSizeLabel(sizeLabel);
        set((state) => {
          if (quantity < 1) {
            const next = state.items.filter(
              (i) => !(i.productId === productId && normalizeSizeLabel(i.sizeLabel) === label),
            );
            return { items: next, cartCurrency: next.length === 0 ? null : state.cartCurrency };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId && normalizeSizeLabel(i.sizeLabel) === label
                ? { ...i, quantity }
                : i,
            ),
          };
        });
      },
      removeItem: (productId, sizeLabel) => {
        const label = normalizeSizeLabel(sizeLabel);
        set((state) => {
          const next = state.items.filter(
            (i) => !(i.productId === productId && normalizeSizeLabel(i.sizeLabel) === label),
          );
          return { items: next, cartCurrency: next.length === 0 ? null : state.cartCurrency };
        });
      },
      clearCart: () => set({ items: [], cartCurrency: null }),
    }),
    {
      name: "webshop-cart-v3",
    },
  ),
);

/** Local cart (Zustand + localStorage). */
export function useCart() {
  const items = useCartStore((s) => s.items);
  const cartCurrency = useCartStore((s) => s.cartCurrency);
  const addToCart = useCartStore((s) => s.addToCart);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const totalQuantity = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  return {
    cartItems: items,
    cartCurrency,
    addToCart,
    setQuantity,
    removeItem,
    clearCart,
    totalQuantity,
  };
}
