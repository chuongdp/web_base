import type { SiteSetting } from "@prisma/client";

/** Cờ bật/tắt logo phương thức thanh toán (CMS Site settings). */
export type PaymentDisplayFlags = {
  paypal: boolean;
  visa: boolean;
  mastercard: boolean;
  amex: boolean;
  pingpong: boolean;
  payoneer: boolean;
};

export function paymentDisplayFromSiteSetting(s: SiteSetting | null): PaymentDisplayFlags {
  return {
    paypal: s?.paymentShowPaypal ?? true,
    visa: s?.paymentShowVisa ?? true,
    mastercard: s?.paymentShowMastercard ?? true,
    amex: s?.paymentShowAmex ?? true,
    pingpong: s?.paymentShowPingpong ?? false,
    payoneer: s?.paymentShowPayoneer ?? false,
  };
}

/** Có ít nhất một logo phương thức bật (để hiện hàng badge). */
export function hasAnyPaymentBadgeFlag(f: PaymentDisplayFlags): boolean {
  return f.paypal || f.visa || f.mastercard || f.amex || f.pingpong || f.payoneer;
}

/** Radio «Credit / debit card / online» — thẻ + PingPong (Payoneer là lựa chọn riêng). */
export function hasCardOrOnlineWalletFlags(f: PaymentDisplayFlags): boolean {
  return f.visa || f.mastercard || f.amex || f.pingpong;
}

export type CheckoutPaymentId = "paypal" | "card" | "cod" | "bank" | "payoneer";

export function pickDefaultCheckoutPayment(f: PaymentDisplayFlags): CheckoutPaymentId {
  if (f.paypal) return "paypal";
  if (f.payoneer) return "payoneer";
  if (hasCardOrOnlineWalletFlags(f)) return "card";
  return "cod";
}
