import type { StorefrontTheme } from "@prisma/client";
import Link from "next/link";
import { getFooterLayoutMode } from "@/lib/storefront-theme";

export type FooterMetaStrip = {
  shopOwner: string;
  address: string;
  email: string;
  hours: string;
};

type Props = { siteName: string; theme: StorefrontTheme; footerMeta: FooterMetaStrip };

function ShopLinks() {
  const link = "transition hover:text-zinc-900";
  return (
    <ul className="space-y-2.5 text-sm text-zinc-700">
      <li>
        <Link href="/" className={link}>
          Home
        </Link>
      </li>
      <li>
        <Link href="/about-us" className={link}>
          About Us
        </Link>
      </li>
      <li>
        <Link href="/contact" className={link}>
          Contact
        </Link>
      </li>
      <li>
        <Link href="/faqs" className={link}>
          FAQs
        </Link>
      </li>
      <li>
        <Link href="/return-refund" className={link}>
          Return &amp; Refund
        </Link>
      </li>
    </ul>
  );
}

function LegalLinks() {
  const link = "transition hover:text-zinc-900";
  return (
    <ul className="space-y-2.5 text-sm text-zinc-700">
      <li>
        <Link href="/privacy-policy" className={link}>
          Privacy Policy
        </Link>
      </li>
      <li>
        <Link href="/disclaimer" className={link}>
          Disclaimer
        </Link>
      </li>
      <li>
        <Link href="/cookie-policy" className={link}>
          Cookie Policy
        </Link>
      </li>
      <li>
        <Link href="/terms" className={link}>
          Terms
        </Link>
      </li>
    </ul>
  );
}

function SupportLinks() {
  const link = "transition hover:text-zinc-900";
  return (
    <ul className="space-y-2.5 text-sm text-zinc-700">
      <li>
        <Link href="/payment-methods" className={link}>
          Payment Method
        </Link>
      </li>
      <li>
        <Link href="/order-tracking" className={link}>
          Order Tracking
        </Link>
      </li>
      <li>
        <Link href="/shipping" className={link}>
          Shipping
        </Link>
      </li>
    </ul>
  );
}

function NewsletterBlock({ siteName }: { siteName: string }) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
      <p className="font-serif text-2xl font-semibold tracking-tight text-zinc-900">{siteName}</p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">
        Subscribe to our newsletter and get the latest updates straight to your inbox.
      </p>
      <form className="mt-6 flex max-w-md items-stretch gap-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 pl-4">
        <label htmlFor="footer-email" className="sr-only">
          Email
        </label>
        <input
          id="footer-email"
          type="email"
          placeholder="Email address..."
          className="min-w-0 flex-1 bg-transparent py-3 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
          readOnly
          aria-readonly
        />
        <button
          type="button"
          className="shrink-0 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: "var(--sf-primary)" }}
        >
          Join
        </button>
      </form>
    </div>
  );
}

function FooterMetaGrid({ meta }: { meta: FooterMetaStrip }) {
  return (
    <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
      <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Shop owner</p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">{meta.shopOwner}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Address</p>
          <p className="mt-1 break-words text-sm text-zinc-800">{meta.address}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Email</p>
          <p className="mt-1 break-all text-sm text-zinc-800">{meta.email}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Hours</p>
          <p className="mt-1 break-words text-sm text-zinc-800">{meta.hours}</p>
        </div>
      </div>
    </div>
  );
}

function PaymentBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {["PayPal", "MC", "Discover", "Amex", "Visa"].map((label) => (
        <span
          key={label}
          className="rounded border border-zinc-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase text-zinc-600"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function FooterCards({ siteName, year, footerMeta }: { siteName: string; year: number; footerMeta: FooterMetaStrip }) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <NewsletterBlock siteName={siteName} />

        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-100 lg:col-span-2">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Shop</h3>
              <div className="mt-4">
                <ShopLinks />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Legal</h3>
              <div className="mt-4">
                <LegalLinks />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Support</h3>
              <div className="mt-4">
                <SupportLinks />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterMetaGrid meta={footerMeta} />

      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 sm:flex-row">
        <p className="text-center text-[11px] font-medium uppercase tracking-wide text-zinc-500">
          © {year} {siteName}. All rights reserved.
        </p>
        <PaymentBadges />
      </div>
    </>
  );
}

function FooterMagazine({ siteName, year }: { siteName: string; year: number }) {
  return (
    <>
      <div className="border-b border-zinc-200/80 pb-10">
        <p className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">{siteName}</p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-600">
          Curated stories, new arrivals, and seasonal edits — delivered with care.
        </p>
      </div>
      <div className="grid gap-12 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Explore</h3>
          <div className="mt-5">
            <ShopLinks />
          </div>
        </div>
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Legal</h3>
          <div className="mt-5">
            <LegalLinks />
          </div>
        </div>
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Support</h3>
          <div className="mt-5">
            <SupportLinks />
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Newsletter</h3>
          <p className="mt-3 text-sm text-zinc-600">Occasional updates. Unsubscribe anytime.</p>
          <form className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              placeholder="Email"
              readOnly
              className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
              aria-readonly
            />
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--sf-primary)" }}
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-6 border-t border-zinc-200 pt-8 sm:flex-row">
        <p className="text-xs text-zinc-500">© {year} {siteName}</p>
        <PaymentBadges />
      </div>
    </>
  );
}

function FooterMinimal({ siteName, year }: { siteName: string; year: number }) {
  const link = "transition hover:text-zinc-900";
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-zinc-700">
        <Link href="/" className={link}>
          Home
        </Link>
        <Link href="/shop" className={link}>
          Shop
        </Link>
        <Link href="/about-us" className={link}>
          About
        </Link>
        <Link href="/contact" className={link}>
          Contact
        </Link>
        <Link href="/faqs" className={link}>
          FAQs
        </Link>
        <Link href="/shipping" className={link}>
          Shipping
        </Link>
        <Link href="/return-refund" className={link}>
          Returns
        </Link>
        <Link href="/privacy-policy" className={link}>
          Privacy
        </Link>
      </nav>
      <p className="text-center text-xs text-zinc-500">
        © {year} {siteName}
      </p>
    </div>
  );
}

function FooterStrip({ siteName, year }: { siteName: string; year: number }) {
  const link = "transition hover:text-zinc-900";
  return (
    <div className="flex flex-col gap-6 py-6 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm font-semibold tracking-tight text-zinc-900">{siteName}</p>
      <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600">
        <Link href="/" className={link}>
          Home
        </Link>
        <Link href="/shop" className={link}>
          Catalog
        </Link>
        <Link href="/contact" className={link}>
          Support
        </Link>
        <Link href="/faqs" className={link}>
          FAQs
        </Link>
        <Link href="/privacy-policy" className={link}>
          Legal
        </Link>
      </nav>
      <div className="flex flex-wrap items-center gap-4 lg:justify-end">
        <p className="text-xs text-zinc-500">© {year}</p>
        <PaymentBadges />
      </div>
    </div>
  );
}

export function StorefrontFooter({ siteName, theme, footerMeta }: Props) {
  const year = new Date().getFullYear();
  const mode = getFooterLayoutMode(theme);

  return (
    <footer
      className="sf-footer-themed mt-auto border-t"
      style={{
        backgroundColor: "var(--sf-footer-bg)",
        borderColor: "var(--sf-footer-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {mode === "magazine" ? <FooterMagazine siteName={siteName} year={year} /> : null}
        {mode === "minimal" ? <FooterMinimal siteName={siteName} year={year} /> : null}
        {mode === "strip" ? <FooterStrip siteName={siteName} year={year} /> : null}
        {mode === "cards" ? <FooterCards siteName={siteName} year={year} footerMeta={footerMeta} /> : null}
      </div>
    </footer>
  );
}
