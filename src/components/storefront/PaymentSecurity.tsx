import { getSiteSetting } from "@/app/actions/settingActions";
import { PaymentMethodBadges } from "@/components/storefront/PaymentMethodBadges";
import { paymentDisplayFromSiteSetting } from "@/lib/payment-display";

export async function PaymentSecurity() {
  const s = await getSiteSetting();
  const flags = paymentDisplayFromSiteSetting(s);

  return (
    <section className="mt-8 border-t border-zinc-200 pt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-900">
        Payment &amp; Security
      </h2>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">Payment methods</p>
      <PaymentMethodBadges flags={flags} variant="product" />
      <p className="mt-4 text-sm leading-relaxed text-zinc-600">
        Your payment information is processed securely. We do not store credit card details nor have
        access to your full card information. Transactions are protected with industry-standard
        encryption.
      </p>
    </section>
  );
}
