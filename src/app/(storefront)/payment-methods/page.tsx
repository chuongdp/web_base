import type { Metadata } from "next";
import { PolicyPageLayout } from "@/components/storefront/PolicyPageLayout";

export const metadata: Metadata = { title: "Payment methods" };

export const revalidate = 3600;

export default function PaymentMethodsPage() {
  return (
    <PolicyPageLayout title="Payment methods" lastUpdated={new Date().toISOString().slice(0, 10)}>
      <p>
        We accept payment methods shown at checkout. Replace this list with the options you actually use (cards, wallets,
        bank transfer, COD, etc.).
      </p>
      <h2>Security</h2>
      <p>
        Payment details are processed securely. We do not store full card numbers on our servers when payments are
        handled by a PCI-compliant provider.
      </p>
    </PolicyPageLayout>
  );
}
