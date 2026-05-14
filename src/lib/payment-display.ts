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

/** Có hiển thị radio «Credit / debit card…» (gồm mạng thẻ + PingPong / Payoneer nếu bật). */
export function hasCardOrOnlineWalletFlags(f: PaymentDisplayFlags): boolean {
  return f.visa || f.mastercard || f.amex || f.pingpong || f.payoneer;
}

export function pickDefaultCheckoutPayment(f: PaymentDisplayFlags): "paypal" | "card" | "cod" | "bank" {
  if (f.paypal) return "paypal";
  if (hasCardOrOnlineWalletFlags(f)) return "card";
  return "cod";
}
