import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order placed",
};

type Props = {
  searchParams: Promise<{ n?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { n } = await searchParams;
  const orderNo = n ? decodeURIComponent(n) : "";

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-sm font-medium text-green-700">Order placed successfully</p>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-zinc-900">Thank you!</h1>
      {orderNo ? (
        <p className="mt-4 text-sm text-zinc-600">
          Order number:{" "}
          <span className="font-mono font-semibold tabular-nums text-zinc-900">{orderNo}</span>
        </p>
      ) : null}
      <p className="mt-3 text-sm text-zinc-600">
        We will contact you by email or phone to confirm and arrange delivery (including COD).
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg px-6 py-2.5 text-sm font-medium text-white"
        style={{ backgroundColor: "var(--sf-primary)" }}
      >
        Back to home
      </Link>
    </div>
  );
}
