"use client";

import { useEffect, useMemo, useState } from "react";
import { SizeGuideModal } from "@/components/storefront/SizeGuideModal";

function parseSizes(raw: string | null | undefined): string[] {
  if (raw == null || !String(raw).trim()) return [];
  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

type Props = {
  sizesString: string | null | undefined;
};

export function SizeSelector({ sizesString }: Props) {
  const sizes = useMemo(() => parseSizes(sizesString), [sizesString]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (sizes.length === 0) return;
    setSelectedSize((prev) => (prev && sizes.includes(prev) ? prev : sizes[0]));
  }, [sizes]);

  if (sizes.length === 0) return null;

  return (
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
          const selected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={
                selected
                  ? "min-h-[2.5rem] min-w-[2.5rem] rounded-full border-2 border-black px-4 py-2 text-sm font-medium text-black transition-colors"
                  : "min-h-[2.5rem] min-w-[2.5rem] rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
              }
            >
              {size}
            </button>
          );
        })}
      </div>

      <SizeGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
