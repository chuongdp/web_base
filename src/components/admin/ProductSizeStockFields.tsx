"use client";

import { useEffect, useMemo, useState } from "react";
import { normalizeSizeLabel, parseSizesList } from "@/lib/sizes";

type Props = {
  defaultSizes: string;
  sizeStocks: { sizeLabel: string; quantity: number }[];
};

export function ProductSizeStockFields({ defaultSizes, sizeStocks }: Props) {
  const initialMap = useMemo(() => {
    const m: Record<string, number> = {};
    for (const r of sizeStocks) {
      m[normalizeSizeLabel(r.sizeLabel)] = r.quantity;
    }
    return m;
  }, [sizeStocks]);

  const [sizesText, setSizesText] = useState(defaultSizes);
  useEffect(() => {
    setSizesText(defaultSizes);
  }, [defaultSizes]);

  const sizesList = useMemo(() => parseSizesList(sizesText), [sizesText]);
  const labels = sizesList.length > 0 ? sizesList : [""];

  const [qty, setQty] = useState<Record<string, number>>(() => ({ ...initialMap }));

  useEffect(() => {
    setQty((prev) => {
      const next: Record<string, number> = {};
      for (const l of labels) {
        const key = normalizeSizeLabel(l);
        next[key] = prev[key] ?? initialMap[key] ?? 0;
      }
      return next;
    });
  }, [labels.join("|"), initialMap]);

  const json = useMemo(
    () =>
      JSON.stringify(
        Object.fromEntries(labels.map((l) => [l, qty[normalizeSizeLabel(l)] ?? 0])),
      ),
    [labels, qty],
  );

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4">
      <input type="hidden" name="sizeStocksJson" value={json} />
      <div>
        <label htmlFor="p-sizes" className="mb-1 block text-sm font-medium text-zinc-700">
          Sizes (comma-separated — optional)
        </label>
        <input
          id="p-sizes"
          type="text"
          name="sizes"
          value={sizesText}
          onChange={(e) => setSizesText(e.target.value)}
          placeholder="S,M,L,XL"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Leave empty for a single-size item. Stock below applies to that variant.
        </p>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">Stock by size</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {labels.map((label) => {
            const key = normalizeSizeLabel(label);
            const display = label === "" ? "Default (no sizes)" : label;
            return (
              <label key={key || "__empty"} className="block text-sm">
                <span className="mb-1 block font-medium text-zinc-700">{display}</span>
                <input
                  type="number"
                  min={0}
                  max={999999}
                  value={qty[key] ?? 0}
                  onChange={(e) => {
                    const n = Math.max(0, Math.min(999999, Math.floor(Number(e.target.value) || 0)));
                    setQty((q) => ({ ...q, [key]: n }));
                  }}
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm tabular-nums focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
