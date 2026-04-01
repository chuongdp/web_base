/** Comma-separated sizes from Product.sizes (SQLite). */
export function parseSizesList(raw: string | null | undefined): string[] {
  if (raw == null || !String(raw).trim()) return [];
  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function normalizeSizeLabel(raw: string | null | undefined): string {
  if (raw == null) return "";
  return String(raw).trim();
}

export function cartLineKey(productId: string, sizeLabel: string): string {
  return `${productId}::${normalizeSizeLabel(sizeLabel)}`;
}
