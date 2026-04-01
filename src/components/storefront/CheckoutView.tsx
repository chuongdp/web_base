"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createOrder,
  getCartProducts,
  type CartProductRow,
} from "@/app/actions/orderActions";
import { useCart } from "@/hooks/useCart";
import { cartLineKey } from "@/lib/sizes";
import { formatMoney, type CurrencyCode } from "@/lib/format-price";
import { FLAT_SHIPPING_FEE } from "@/lib/shipping";

const COUNTRIES = [
  { value: "VN", label: "Vietnam" },
  { value: "US", label: "United States (US)" },
  { value: "GB", label: "United Kingdom (UK)" },
  { value: "SG", label: "Singapore" },
  { value: "OTHER", label: "Other" },
] as const;

const US_STATES = [
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "WA", label: "Washington" },
] as const;

type PaymentId = "paypal" | "card" | "cod" | "bank";

function CardBrandIcons() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-zinc-200 pt-3">
      <span className="text-xs text-zinc-500">Accepted:</span>
      <span className="inline-flex h-7 min-w-[2.75rem] items-center justify-center rounded border border-zinc-200 bg-white px-2 text-[10px] font-black tracking-tight text-[#1A1F71]">
        VISA
      </span>
      <span className="inline-flex h-7 items-center rounded border border-zinc-200 bg-white px-2 text-[10px] font-bold text-[#003087]">
        PayPal
      </span>
      <span className="relative inline-flex h-7 w-10 items-center justify-center rounded border border-zinc-200 bg-white">
        <span className="absolute left-2 h-4 w-4 rounded-full bg-[#EB001B]/90" />
        <span className="absolute right-2 h-4 w-4 rounded-full bg-[#F79E1B]/90" />
      </span>
      <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded border border-zinc-200 bg-white text-[9px] font-bold text-zinc-700">
        JCB
      </span>
      <span className="text-xs font-medium text-zinc-400">+3</span>
    </div>
  );
}

export function CheckoutView() {
  const router = useRouter();
  const { cartItems, cartCurrency, clearCart } = useCart();
  const [products, setProducts] = useState<CartProductRow[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentId>("paypal");
  const [country, setCountry] = useState<string>("VN");

  useEffect(() => setMounted(true), []);

  const ids = useMemo(() => cartItems.map((i) => i.productId), [cartItems]);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setLoadingProducts(false);
      return;
    }
    setLoadingProducts(true);
    void getCartProducts(ids).then((rows) => {
      setProducts(rows);
      setLoadingProducts(false);
    });
  }, [ids]);

  useEffect(() => {
    if (!mounted) return;
    if (cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [mounted, cartItems.length, router]);

  const lines = useMemo(() => {
    return cartItems
      .map((ci) => {
        const p = products.find((x) => x.id === ci.productId);
        return p ? { ...ci, product: p } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [cartItems, products]);

  const subtotal = useMemo(() => {
    let sum = 0;
    for (const line of lines) {
      const n = Number(line.product.price.replace(",", "."));
      if (Number.isFinite(n)) sum += n * line.quantity;
    }
    return sum;
  }, [lines]);

  const currency: CurrencyCode = (cartCurrency ?? lines[0]?.product.currency ?? "USD") as CurrencyCode;
  const shippingAmount = FLAT_SHIPPING_FEE[currency as keyof typeof FLAT_SHIPPING_FEE] ?? 0;
  const grandTotal = subtotal + shippingAmount;

  const cartIncomplete =
    cartItems.length > 0 && !loadingProducts && lines.length !== cartItems.length;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (cartItems.length === 0 || cartIncomplete) return;
    setPending(true);
    const fd = new FormData(e.currentTarget);
    fd.set(
      "items",
      JSON.stringify(
        cartItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          sizeLabel: i.sizeLabel,
        })),
      ),
    );
    fd.set("paymentMethod", payment);
    const res = await createOrder(fd);
    setPending(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    clearCart();
    router.push(`/checkout/success?n=${encodeURIComponent(res.orderNumber)}`);
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl py-10 text-center text-sm text-zinc-500">Loading…</div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center text-sm text-zinc-600">
        Redirecting to cart…
      </div>
    );
  }

  const showUsState = country === "US";

  return (
    <div className="mx-auto max-w-6xl pb-16">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/cart" className="hover:text-zinc-800">
          Cart
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-800">Checkout</span>
      </nav>

      <h1 className="font-serif text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
        Checkout
      </h1>

      {cartIncomplete ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Some items are no longer available.{" "}
          <Link href="/cart" className="font-medium underline">
            Back to cart
          </Link>
        </p>
      ) : null}

      <form onSubmit={(ev) => void handleSubmit(ev)} className="mt-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
          <div className="lg:col-span-7">
            <h2 className="text-lg font-semibold text-zinc-900">Billing details</h2>
            <p className="mt-1 text-sm text-zinc-500">Fields marked * are required.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-zinc-700">
                  First name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-zinc-700">
                  Last name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="companyName" className="mb-1 block text-sm font-medium text-zinc-700">
                Company name (optional)
              </label>
              <input
                id="companyName"
                name="companyName"
                autoComplete="organization"
                className="w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="country" className="mb-1 block text-sm font-medium text-zinc-700">
                Country / region *
              </label>
              <select
                id="country"
                name="country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label htmlFor="addressLine1" className="mb-1 block text-sm font-medium text-zinc-700">
                Street address *
              </label>
              <input
                id="addressLine1"
                name="addressLine1"
                required
                placeholder="House number and street name"
                autoComplete="address-line1"
                className="w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
            <div className="mt-3">
              <label htmlFor="addressLine2" className="mb-1 block text-sm font-medium text-zinc-700">
                Apartment, suite, etc. (optional)
              </label>
              <input
                id="addressLine2"
                name="addressLine2"
                placeholder="Optional"
                autoComplete="address-line2"
                className="w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="city" className="mb-1 block text-sm font-medium text-zinc-700">
                City / town *
              </label>
              <input
                id="city"
                name="city"
                required
                autoComplete="address-level2"
                className="w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="stateRegion" className="mb-1 block text-sm font-medium text-zinc-700">
                  {showUsState ? "State *" : "State / province"}
                </label>
                {showUsState ? (
                  <select
                    id="stateRegion"
                    name="stateRegion"
                    required
                    autoComplete="address-level1"
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                  >
                    <option value="">Select state</option>
                    {US_STATES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="stateRegion"
                    name="stateRegion"
                    autoComplete="address-level1"
                    className="w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                  />
                )}
              </div>
              <div>
                <label htmlFor="postalCode" className="mb-1 block text-sm font-medium text-zinc-700">
                  Postal code {showUsState ? "*" : ""}
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  required={showUsState}
                  autoComplete="postal-code"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-zinc-700">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="note" className="mb-1 block text-sm font-medium text-zinc-700">
                Order notes
              </label>
              <textarea
                id="note"
                name="note"
                rows={3}
                className="w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/90 p-6 shadow-sm lg:sticky lg:top-28">
              <h2 className="text-lg font-semibold text-zinc-900">Your order</h2>

              {loadingProducts ? (
                <p className="mt-4 text-sm text-zinc-500">Loading products…</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {lines.map((l) => {
                    const unit = Number(l.product.price.replace(",", "."));
                    const lineSum = unit * l.quantity;
                    return (
                      <li key={cartLineKey(l.productId, l.sizeLabel)} className="flex gap-3">
                        <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-200">
                          {l.product.imageUrl ? (
                            <Image
                              src={l.product.imageUrl}
                              alt={l.product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                              unoptimized={l.product.imageUrl.startsWith("/")}
                            />
                          ) : null}
                          <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-zinc-600 px-1 text-[10px] font-semibold text-white">
                            {l.quantity}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug text-zinc-900">{l.product.name}</p>
                          {l.sizeLabel ? (
                            <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                              Size {l.sizeLabel}
                            </p>
                          ) : null}
                          <p className="mt-1 text-sm tabular-nums text-zinc-600">
                            {formatMoney(l.product.price, l.product.currency as CurrencyCode)} × {l.quantity}
                          </p>
                          <p className="mt-0.5 text-sm font-medium tabular-nums text-zinc-900">
                            {formatMoney(lineSum, l.product.currency as CurrencyCode)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="mt-6 space-y-2 border-t border-zinc-200 pt-4 text-sm">
                <div className="flex justify-between gap-4 text-zinc-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatMoney(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between gap-4 text-zinc-600">
                  <span>Shipping</span>
                  <span className="tabular-nums">{formatMoney(shippingAmount, currency)}</span>
                </div>
                <div className="flex justify-between gap-4 border-t border-zinc-200 pt-3 text-base font-semibold text-zinc-900">
                  <span>Total</span>
                  <span className="tabular-nums">{formatMoney(grandTotal, currency)}</span>
                </div>
              </div>

              <div className="mt-8 border-t border-zinc-200 pt-6">
                <p className="text-sm font-medium text-zinc-900">Payment method</p>
                <div className="mt-3 space-y-2">
                  {(
                    [
                      { id: "paypal" as const, label: "PayPal", desc: "Pay securely with PayPal" },
                      { id: "card" as const, label: "Credit / debit card", desc: "Visa, Mastercard, JCB, …" },
                      { id: "cod" as const, label: "Cash on delivery (COD)", desc: "Pay in cash when your order arrives" },
                      { id: "bank" as const, label: "Bank transfer", desc: "QR / account details (confirmed separately)" },
                    ] as const
                  ).map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                        payment === opt.id
                          ? "border-zinc-900 bg-white ring-1 ring-zinc-900/10"
                          : "border-zinc-200 bg-white/60 hover:border-zinc-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={opt.id}
                        checked={payment === opt.id}
                        onChange={() => setPayment(opt.id)}
                        className="mt-1 accent-zinc-900"
                      />
                      <span>
                        <span className="block text-sm font-medium text-zinc-900">{opt.label}</span>
                        <span className="text-xs text-zinc-500">{opt.desc}</span>
                      </span>
                    </label>
                  ))}
                </div>

                {(payment === "paypal" || payment === "card") ? <CardBrandIcons /> : null}

                <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                  Your personal data will be used to process your order, support your experience on this website, and for
                  other purposes described in our{" "}
                  <Link href="/" className="underline hover:text-zinc-700">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>

              {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  disabled={pending || cartIncomplete || loadingProducts}
                  className={
                    payment === "paypal"
                      ? "flex w-full min-h-[48px] items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-[#FFC439] px-4 py-3 text-sm font-bold text-[#003087] shadow-sm hover:bg-[#f5bd38] disabled:opacity-60"
                      : "flex w-full min-h-[48px] items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  }
                  style={payment === "paypal" ? undefined : { backgroundColor: "var(--sf-primary)" }}
                >
                  {pending ? "Processing…" : payment === "paypal" ? "Pay with PayPal" : "Place order"}
                </button>
                <Link
                  href="/cart"
                  className="block w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                >
                  Back to cart
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
