import type { Metadata } from "next";
import { PolicyPageLayout } from "@/components/storefront/PolicyPageLayout";

export const metadata: Metadata = { title: "Return & Refund" };

export const revalidate = 3600;

export default function ReturnRefundPage() {
  return (
    <PolicyPageLayout title="Return & refund policy" lastUpdated={new Date().toISOString().slice(0, 10)}>
      <p>
        We want you to be happy with your purchase. This policy explains how returns and refunds work. Replace this
        text with your store&apos;s real rules.
      </p>
      <h2>Eligibility</h2>
      <ul>
        <li>Items must be unused, in original packaging, with tags attached where applicable.</li>
        <li>Return requests must be started within the timeframe stated in your order confirmation (e.g. 14 or 30 days).</li>
      </ul>
      <h2>How to return</h2>
      <ol>
        <li>Contact us using the contact form or email with your order number.</li>
        <li>We will confirm the return address and any instructions.</li>
        <li>Ship the item back using a trackable carrier when required.</li>
      </ol>
      <h2>Refunds</h2>
      <p>
        Approved refunds are processed to the original payment method. Processing times depend on your bank or card
        issuer.
      </p>
    </PolicyPageLayout>
  );
}
