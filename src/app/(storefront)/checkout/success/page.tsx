import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getOrderPublicByNumber, type OrderSuccessDTO } from "@/app/actions/orderActions";
import { getSiteSetting } from "@/app/actions/settingActions";
import { PaymentMethodBadges } from "@/components/storefront/PaymentMethodBadges";
import { formatMoney, type CurrencyCode } from "@/lib/format-price";
import {
  paymentDisplayFromSiteSetting,
  type PaymentDisplayFlags,
} from "@/lib/payment-display";

export const metadata: Metadata = {
  title: "Order confirmation",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ n?: string }>;
};

function orderStatusBadge(status: string) {
  const s = status.toLowerCase();
  if (s === "completed" || s === "delivered") {
    return { label: "Completed", className: "bg-emerald-100 text-emerald-800" };
  }
  if (s === "cancelled" || s === "canceled") {
    return { label: "Cancelled", className: "bg-zinc-200 text-zinc-700" };
  }
  return { label: "Processing", className: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80" };
}

function paymentMethodLabel(m: string): string {
  switch (m) {
    case "paypal":
      return "PayPal";
    case "card":
      return "Credit / debit card";
    case "cod":
      return "Cash on delivery (COD)";
    case "bank":
      return "Bank transfer";
    default:
      return m;
  }
}

function formatPlacedAt(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(d);
}

function displayProductTitle(productName: string, sizeLabel: string): string {
  if (!sizeLabel) return productName;
  const suffix = ` (${sizeLabel})`;
  if (productName.endsWith(suffix)) return productName.slice(0, -suffix.length);
  return productName;
}

function LineItemImage({ url, name }: { url: string | null; name: string }) {
  if (!url) {
    return <div className="h-20 w-20 shrink-0 rounded-lg bg-zinc-200" aria-hidden />;
  }
  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
      <Image src={url} alt={name} fill className="object-cover" sizes="80px" unoptimized={url.startsWith("/")} />
    </div>
  );
}

function OrderCard({ order, paymentFlags }: { order: OrderSuccessDTO; paymentFlags: PaymentDisplayFlags }) {
  const cc = order.currency as CurrencyCode;
  const placed = formatPlacedAt(order.createdAt);
  const badge = orderStatusBadge(order.status);
  const showWalletBadges = order.paymentMethod === "paypal" || order.paymentMethod === "card";

  let paymentNote: string;
  if (order.paymentMethod === "cod") {
    paymentNote = "Pay in cash when your order arrives.";
  } else if (order.paymentMethod === "bank") {
    paymentNote = `Order placed on ${placed}. Bank transfer details will be confirmed separately.`;
  } else {
    paymentNote = `Paid on ${placed}`;
  }

  return (
    <div className="rounded-xl border border-zinc-200/90 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-3 border-b border-zinc-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
            Order #{order.orderNumber}
          </h2>
          <p className="mt-1.5 text-sm text-zinc-500">Placed on {placed}</p>
        </div>
        <span
          className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <ul className="divide-y divide-zinc-100">
        {order.items.map((it) => (
          <li key={it.id} className="flex gap-4 py-5 first:pt-6">
            <LineItemImage url={it.imageUrl} name={it.productName} />
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-snug text-zinc-900">{displayProductTitle(it.productName, it.sizeLabel)}</p>
              {it.sizeLabel ? (
                <p className="mt-1 text-sm text-zinc-600">
                  Size <span className="font-medium text-zinc-800">{it.sizeLabel}</span>
                </p>
              ) : null}
              <p className="mt-1 text-sm text-zinc-500">
                Quantity: <span className="tabular-nums text-zinc-700">{it.quantity}</span>
              </p>
              <p className="mt-1 text-xs text-zinc-500 tabular-nums">
                {formatMoney(it.unitPrice, cc)} each
              </p>
            </div>
            <p className="shrink-0 text-right text-sm font-semibold tabular-nums text-zinc-900">
              {formatMoney(it.lineTotal, cc)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-2 space-y-2 border-t border-zinc-100 pt-5 text-sm">
        <div className="flex justify-between gap-4 text-zinc-600">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatMoney(order.subtotal, cc)}</span>
        </div>
        <div className="flex justify-between gap-4 text-zinc-600">
          <span>Shipping</span>
          <span className="tabular-nums">{formatMoney(order.shippingFee, cc)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-zinc-200 pt-3 text-base font-semibold text-zinc-900">
          <span>Total</span>
          <span className="tabular-nums">{formatMoney(order.total, cc)}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 border-t border-zinc-100 pt-8 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Shipping address</h3>
          <div className="mt-3 text-sm leading-relaxed text-zinc-700">
            <p className="font-medium text-zinc-900">{order.customerName}</p>
            {order.address ? (
              <p className="mt-2 whitespace-pre-line">{order.address}</p>
            ) : (
              <p className="mt-2 text-zinc-500">—</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Payment method</h3>
          <p className="mt-3 text-sm font-medium text-zinc-900">{paymentMethodLabel(order.paymentMethod)}</p>
          {showWalletBadges ? (
            <div className="mt-4">
              <PaymentMethodBadges flags={paymentFlags} variant="product" />
            </div>
          ) : null}
          <p className="mt-4 text-sm text-zinc-600">{paymentNote}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-zinc-100 pt-6">
        <Link
          href="/shop"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--sf-primary)" }}
        >
          Continue shopping
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { n } = await searchParams;
  const orderNo = n ? decodeURIComponent(n).trim() : "";
  const [order, site] = await Promise.all([getOrderPublicByNumber(orderNo), getSiteSetting()]);
  const paymentFlags = paymentDisplayFromSiteSetting(site);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Thank you!</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Thank you for your purchase!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-600">
          We&apos;ve received your order. We&apos;ll contact you by email or phone to confirm when needed.
        </p>
      </div>

      {!orderNo ? (
        <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50/80 px-5 py-6 text-center text-sm text-amber-900">
          No order reference found. If you just completed checkout, use the link from the confirmation step.
          <div className="mt-4">
            <Link
              href="/"
              className="inline-block rounded-lg px-5 py-2.5 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--sf-primary)" }}
            >
              Back to home
            </Link>
          </div>
        </div>
      ) : !order ? (
        <div className="mt-10 rounded-xl border border-zinc-200 bg-white px-5 py-6 text-center text-sm text-zinc-600">
          We couldn&apos;t find this order. Check the link or contact us with your order number.
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="text-sm font-medium text-zinc-900 underline underline-offset-2">
              Continue shopping
            </Link>
            <Link href="/" className="text-sm font-medium text-zinc-900 underline underline-offset-2">
              Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <OrderCard order={order} paymentFlags={paymentFlags} />
        </div>
      )}
    </div>
  );
}
