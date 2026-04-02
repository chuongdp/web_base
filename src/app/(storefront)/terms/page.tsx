import type { Metadata } from "next";
import { PolicyPageLayout } from "@/components/storefront/PolicyPageLayout";

export const metadata: Metadata = { title: "Terms of Service" };

export const revalidate = 3600;

export default function TermsPage() {
  return (
    <PolicyPageLayout title="Terms of service" lastUpdated={new Date().toISOString().slice(0, 10)}>
      <p>
        By using this website and placing orders, you agree to these terms. Replace with your full terms of sale and
        use.
      </p>
      <h2>Orders &amp; pricing</h2>
      <p>Product descriptions and prices are shown as accurately as possible. We reserve the right to correct errors.</p>
      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, our liability is limited as set out in these terms. Nothing excludes liability
        that cannot be excluded by law.
      </p>
      <h2>Governing law</h2>
      <p>Specify the jurisdiction and dispute resolution process for your business.</p>
    </PolicyPageLayout>
  );
}
