import type { Metadata } from "next";
import { getSiteSetting } from "@/app/actions/settingActions";
import { CheckoutView } from "@/components/storefront/CheckoutView";
import { paymentDisplayFromSiteSetting } from "@/lib/payment-display";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const s = await getSiteSetting();
  const paymentDisplay = paymentDisplayFromSiteSetting(s);
  return <CheckoutView paymentDisplay={paymentDisplay} />;
}
