import type { ReactNode } from "react";
import { getSiteSetting } from "@/app/actions/settingActions";

function VisaMark() {
  return (
    <div
      className="flex h-9 min-w-[3.25rem] items-center justify-center rounded border border-zinc-200 bg-white px-2 text-[10px] font-bold tracking-tight text-[#1A1F71]"
      aria-label="Visa"
    >
      VISA
    </div>
  );
}

function MastercardMark() {
  return (
    <div
      className="flex h-9 min-w-[3.25rem] items-center justify-center rounded border border-zinc-200 bg-white px-2"
      aria-label="Mastercard"
    >
      <svg viewBox="0 0 40 24" className="h-5 w-10" aria-hidden>
        <circle cx="16" cy="12" r="9" fill="#EB001B" />
        <circle cx="24" cy="12" r="9" fill="#F79E1B" />
        <path d="M20 7.5a8.5 8.5 0 000 9 8.5 8.5 0 000-9z" fill="#FF5F00" />
      </svg>
    </div>
  );
}

function PaypalMark() {
  return (
    <div
      className="flex h-9 min-w-[3.25rem] items-center justify-center rounded border border-zinc-200 bg-[#003087] px-2 text-[10px] font-bold text-white"
      aria-label="PayPal"
    >
      PayPal
    </div>
  );
}

function AmexMark() {
  return (
    <div
      className="flex h-9 min-w-[3.25rem] items-center justify-center rounded border border-zinc-200 bg-[#006FCF] px-1.5 text-[9px] font-bold leading-tight text-white"
      aria-label="American Express"
    >
      AMEX
    </div>
  );
}

function PingpongMark() {
  return (
    <div
      className="flex h-9 min-w-[3.25rem] items-center justify-center rounded border border-zinc-200 bg-[#E02020] px-1.5 text-[9px] font-bold leading-tight text-white"
      aria-label="PingPong"
    >
      PingPong
    </div>
  );
}

function PayoneerMark() {
  return (
    <div
      className="flex h-9 min-w-[3.25rem] items-center justify-center rounded border border-zinc-200 bg-[#FF4800] px-1.5 text-[9px] font-bold leading-tight text-white"
      aria-label="Payoneer"
    >
      Payoneer
    </div>
  );
}

export async function PaymentSecurity() {
  const s = await getSiteSetting();
  const paypal = s?.paymentShowPaypal ?? true;
  const visa = s?.paymentShowVisa ?? true;
  const mastercard = s?.paymentShowMastercard ?? true;
  const amex = s?.paymentShowAmex ?? true;
  const pingpong = s?.paymentShowPingpong ?? false;
  const payoneer = s?.paymentShowPayoneer ?? false;

  const badges: ReactNode[] = [];
  if (paypal) badges.push(<PaypalMark key="paypal" />);
  if (visa) badges.push(<VisaMark key="visa" />);
  if (mastercard) badges.push(<MastercardMark key="mastercard" />);
  if (amex) badges.push(<AmexMark key="amex" />);
  if (pingpong) badges.push(<PingpongMark key="pingpong" />);
  if (payoneer) badges.push(<PayoneerMark key="payoneer" />);

  return (
    <section className="mt-8 border-t border-zinc-200 pt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-900">
        Payment &amp; Security
      </h2>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">Payment methods</p>
      {badges.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">{badges}</div>
      ) : null}
      <p className="mt-4 text-sm leading-relaxed text-zinc-600">
        Your payment information is processed securely. We do not store credit card details nor have
        access to your full card information. Transactions are protected with industry-standard
        encryption.
      </p>
    </section>
  );
}
