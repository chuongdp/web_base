import type { Metadata } from "next";
import { PolicyPageLayout } from "@/components/storefront/PolicyPageLayout";

export const metadata: Metadata = { title: "Disclaimer" };

export const revalidate = 3600;

export default function DisclaimerPage() {
  return (
    <PolicyPageLayout title="Disclaimer" lastUpdated={new Date().toISOString().slice(0, 10)}>
      <p>
        The information on this site is provided for general information only. It is not legal, financial, or
        professional advice. Replace with a disclaimer appropriate for your business and region.
      </p>
      <h2>Product information</h2>
      <p>Colors, images, and descriptions may vary slightly from the actual product. We aim to keep content accurate.</p>
      <h2>External links</h2>
      <p>We are not responsible for the content of third-party websites linked from our site.</p>
    </PolicyPageLayout>
  );
}
