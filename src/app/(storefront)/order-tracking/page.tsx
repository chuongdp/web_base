import type { Metadata } from "next";
import { PolicyPageLayout } from "@/components/storefront/PolicyPageLayout";

export const metadata: Metadata = { title: "Order tracking" };

export const revalidate = 3600;

export default function OrderTrackingPage() {
  return (
    <PolicyPageLayout title="Order tracking" lastUpdated={new Date().toISOString().slice(0, 10)}>
      <p>
        After your order ships, you will receive an email with a tracking link when your carrier provides one. If you
        did not receive it, check spam or contact us with your order number.
      </p>
      <h2>Where to find your order number</h2>
      <p>Your order confirmation email and account order history (if you have an account) include the order ID.</p>
    </PolicyPageLayout>
  );
}
