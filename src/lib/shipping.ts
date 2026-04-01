import type { Currency } from "@prisma/client";

/** Phí vận chuyển cố định theo tiền tệ (đồng bộ server — không tin client). */
export const FLAT_SHIPPING_FEE: Record<Currency, number> = {
  VND: 30000,
  USD: 6.99,
};
