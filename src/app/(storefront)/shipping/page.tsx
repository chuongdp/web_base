import type { Metadata } from "next";
import { PolicyPageLayout } from "@/components/storefront/PolicyPageLayout";

export const metadata: Metadata = { title: "Shipping" };

export const revalidate = 3600;

export default function ShippingPage() {
  return (
    <PolicyPageLayout title="Shipping information" lastUpdated={new Date().toISOString().slice(0, 10)}>
      <p>
        Delivery times and costs depend on your location and the shipping method selected at checkout. Replace with your
        carrier partners, cut-off times, and regions served.
      </p>
      <h2>Processing</h2>
      <p>Orders are typically processed within 1–2 business days unless stated otherwise.</p>
      <h2>Tracking</h2>
      <p>
        When your order ships, you will receive tracking information where available. See also Order tracking for
        updates.
      </p>
    </PolicyPageLayout>
  );
}
