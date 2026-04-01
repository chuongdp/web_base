"use client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SIZE_ROWS: { size: string; chest: string; bodyLength: string; sleeveLength: string }[] = [
  { size: "S", chest: "38", bodyLength: "28", sleeveLength: "7 \u00BD" },
  { size: "M", chest: "41", bodyLength: "29", sleeveLength: "8" },
  { size: "L", chest: "44", bodyLength: "30", sleeveLength: "8 \u00BD" },
  { size: "XL", chest: "48", bodyLength: "31", sleeveLength: "9" },
  { size: "2XL", chest: "52", bodyLength: "32", sleeveLength: "9 \u00BD" },
  { size: "3XL", chest: "56", bodyLength: "33", sleeveLength: "10" },
];

export function SizeGuideModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Close"
        >
          <span className="text-xl leading-none" aria-hidden>
            &times;
          </span>
        </button>

        <h2 id="size-guide-title" className="pr-10 text-2xl font-bold text-zinc-900">
          Men&apos;s Size Chart
        </h2>

        <p className="mt-4 text-sm font-bold text-zinc-900">Product Specifications:</p>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm text-zinc-900">
            <thead>
              <tr className="bg-zinc-50">
                <th className="border border-gray-300 px-3 py-2 text-center font-bold">Size</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold">Chest</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold">Body Length</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold">Sleeve Length</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_ROWS.map((row) => (
                <tr key={row.size}>
                  <td className="border border-gray-300 px-3 py-2 text-center">{row.size}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">{row.chest}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">{row.bodyLength}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">{row.sleeveLength}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-zinc-800">
          <span className="font-bold">Care Instructions:</span> Machine wash cold. Do not bleach. Tumble dry low.
        </p>
      </div>
    </div>
  );
}
