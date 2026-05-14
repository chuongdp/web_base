import type { ReactNode } from "react";
import Image from "next/image";
import { getSiteSetting } from "@/app/actions/settingActions";

/** Logo chính thức (Commons); dùng bản 320px đủ nét khi hiển thị ~36px cao. */
const PAYONEER_LOGO_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Payoneer_logo.svg/320px-Payoneer_logo.svg.png";

/** Wordmark xanh; ký tự [] mã hóa trong URL. */
const PINGPONG_LOGO_SRC =
  "https://cdn.cookielaw.org/logos/7c7895c5-e5c1-4f3a-8409-eebf1aac9696/59cdcb65-ffae-4720-9f1b-524493f3f57f/00879ab7-bc97-4719-8bbe-fa6127afa9db/PingPong_Logo_%5BBlue%5D.png";

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
      className="flex h-9 max-w-[7.5rem] items-center justify-center rounded-md border border-zinc-200 bg-white px-2"
      role="img"
      aria-label="PingPong"
    >
      <Image
        src={PINGPONG_LOGO_SRC}
        alt=""
        width={120}
        height={32}
        className="h-7 w-auto max-h-7 object-contain object-center"
      />
    </div>
  );
}

function PayoneerMark() {
  return (
    <div
      className="flex h-9 max-w-[9rem] items-center justify-center rounded-md border border-zinc-200 bg-white px-2"
      role="img"
      aria-label="Payoneer"
    >
      <Image
        src={PAYONEER_LOGO_SRC}
        alt=""
        width={128}
        height={36}
        className="h-7 w-auto max-h-7 object-contain object-left"
      />
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
