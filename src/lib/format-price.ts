/** Mã tiền tệ hỗ trợ (khớp Prisma enum Currency). */
export type CurrencyCode = "VND" | "USD";

/** Định dạng giá theo tiền tệ (Decimal/string/number). */
export function formatMoney(
  price: string | number | { toString(): string },
  currency: CurrencyCode = "USD",
): string {
  const raw =
    typeof price === "object" && price !== null && "toString" in price ? price.toString() : String(price);
  const n = Number(raw.replace(",", "."));
  if (!Number.isFinite(n)) return raw;
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  }
  return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

export function formatVnd(price: string | number | { toString(): string }): string {
  return formatMoney(price, "VND");
}
