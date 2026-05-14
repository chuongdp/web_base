"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import type { PaymentDisplayFlags } from "@/lib/payment-display";

const PAYONEER_LOGO_SRC =
  "https://banner2.cleanpng.com/lnd/20241224/qj/ab93c2e169064bdfffe5fe527b6767.webp";

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
      <img
        src={PAYONEER_LOGO_SRC}
        alt=""
        className="h-7 w-auto max-h-7 max-w-full object-contain object-left"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function buildBadgeList(flags: PaymentDisplayFlags): ReactNode[] {
  const badges: ReactNode[] = [];
  if (flags.paypal) badges.push(<PaypalMark key="paypal" />);
  if (flags.visa) badges.push(<VisaMark key="visa" />);
  if (flags.mastercard) badges.push(<MastercardMark key="mastercard" />);
  if (flags.amex) badges.push(<AmexMark key="amex" />);
  if (flags.pingpong) badges.push(<PingpongMark key="pingpong" />);
  if (flags.payoneer) badges.push(<PayoneerMark key="payoneer" />);
  return badges;
}

type Props = {
  flags: PaymentDisplayFlags;
  /** product: chỉ hàng logo (trang PDP). checkout: thêm «Accepted» + viền như sidebar checkout. */
  variant: "product" | "checkout";
};

export function PaymentMethodBadges({ flags, variant }: Props) {
  const badges = buildBadgeList(flags);
  if (badges.length === 0) return null;

  if (variant === "product") {
    return <div className="mt-3 flex flex-wrap gap-2">{badges}</div>;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-zinc-200 pt-3">
      <span className="text-xs text-zinc-500">Accepted:</span>
      {badges}
    </div>
  );
}
