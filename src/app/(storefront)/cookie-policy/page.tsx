import type { Metadata } from "next";
import { PolicyPageLayout } from "@/components/storefront/PolicyPageLayout";

export const metadata: Metadata = { title: "Cookie Policy" };

export const revalidate = 3600;

export default function CookiePolicyPage() {
  return (
    <PolicyPageLayout title="Cookie policy" lastUpdated={new Date().toISOString().slice(0, 10)}>
      <p>
        This site may use cookies and similar technologies to operate the store, remember preferences, and measure
        traffic. Replace with details of cookies you actually use and consent mechanisms if required.
      </p>
      <h2>Types of cookies</h2>
      <ul>
        <li>Essential: required for cart, checkout, and security.</li>
        <li>Functional: remember your choices where applicable.</li>
        <li>Analytics: optional, to understand how the site is used.</li>
      </ul>
      <h2>Managing cookies</h2>
      <p>You can control cookies through your browser settings. Blocking some cookies may affect site functionality.</p>
    </PolicyPageLayout>
  );
}
