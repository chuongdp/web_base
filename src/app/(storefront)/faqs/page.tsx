import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPageLayout } from "@/components/storefront/PolicyPageLayout";

export const metadata: Metadata = { title: "FAQs" };

export const revalidate = 3600;

export default function FaqsPage() {
  return (
    <PolicyPageLayout title="Frequently asked questions" lastUpdated={new Date().toISOString().slice(0, 10)}>
      <p>
        Quick answers about ordering, shipping, and returns. For anything else, contact us via the{" "}
        <Link href="/contact" className="font-medium text-zinc-900 underline underline-offset-2 hover:no-underline">
          Contact
        </Link>{" "}
        page.
      </p>
      <h2>Ordering &amp; payment</h2>
      <ul>
        <li>How do I place an order? Add items to your cart, go to checkout, and complete payment.</li>
        <li>Which payment methods are accepted? See our Payment methods page for supported options.</li>
      </ul>
      <h2>Shipping</h2>
      <ul>
        <li>How long does delivery take? Times vary by region; see Shipping for estimates.</li>
        <li>Do you ship internationally? If available, regions and fees are shown at checkout.</li>
      </ul>
      <h2>Returns &amp; refunds</h2>
      <ul>
        <li>Can I return an item? See Return &amp; Refund for eligibility and how to start a return.</li>
      </ul>
    </PolicyPageLayout>
  );
}
