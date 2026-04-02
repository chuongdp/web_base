import type { Metadata } from "next";
import { PolicyPageLayout } from "@/components/storefront/PolicyPageLayout";

export const metadata: Metadata = { title: "Privacy Policy" };

export const revalidate = 3600;

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout title="Privacy policy" lastUpdated={new Date().toISOString().slice(0, 10)}>
      <p>
        This policy describes how we collect, use, and protect personal information when you use our website and
        services. Replace with your legal text and jurisdiction-specific requirements.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Account and contact details you provide (e.g. name, email, shipping address).</li>
        <li>Order and payment information processed by our payment partners.</li>
        <li>Technical data such as browser type and pages visited, where applicable.</li>
      </ul>
      <h2>How we use information</h2>
      <p>To process orders, communicate with you, improve our services, and comply with legal obligations.</p>
      <h2>Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or delete your data. Contact us for
        requests.
      </p>
    </PolicyPageLayout>
  );
}
