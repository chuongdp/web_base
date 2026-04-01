"use client";

import type { ReactNode } from "react";

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

type ItemProps = {
  title: string;
  children: ReactNode;
};

function AccordionItem({ title, children }: ItemProps) {
  return (
    <details className="group border-b border-zinc-200 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-left text-sm font-medium text-zinc-900 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <ChevronIcon className="h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 group-open:-rotate-180" />
      </summary>
      <div className="pb-4 text-sm leading-relaxed text-zinc-600">{children}</div>
    </details>
  );
}

function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export type ProductAccordionsProps = {
  materials: string | null;
  careInstructions: string | null;
  shippingDetails: string | null;
};

export function ProductAccordions({ materials, careInstructions, shippingDetails }: ProductAccordionsProps) {
  const showM = hasText(materials);
  const showC = hasText(careInstructions);
  const showS = hasText(shippingDetails);

  if (!showM && !showC && !showS) return null;

  return (
    <div className="mt-8 border-t border-zinc-200">
      {showM ? (
        <AccordionItem title="Product Materials">
          <p className="whitespace-pre-wrap">{materials.trim()}</p>
        </AccordionItem>
      ) : null}
      {showC ? (
        <AccordionItem title="Care Information">
          <p className="whitespace-pre-wrap">{careInstructions.trim()}</p>
        </AccordionItem>
      ) : null}
      {showS ? (
        <AccordionItem title="Delivery & Shipping">
          <p className="whitespace-pre-wrap">{shippingDetails.trim()}</p>
        </AccordionItem>
      ) : null}
    </div>
  );
}
