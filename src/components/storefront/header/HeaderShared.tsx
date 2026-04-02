"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/storefront/SearchBar";
import { useCart } from "@/hooks/useCart";
import { collectionPath } from "@/lib/collection-display";
import { productCollectionPath } from "@/lib/product-collection-path";
import type { NavCategory, NavProductCollection } from "@/components/storefront/header/types";

export function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <path d="M20 21a8 8 0 10-16 0" strokeLinecap="round" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

export function IconBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <path d="M6 9h15l-1.5 12H7.5L6 9z" strokeLinejoin="round" />
      <path d="M9 9V6a3 3 0 016 0v3" strokeLinecap="round" />
    </svg>
  );
}

export function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeaderLogo({
  siteName,
  logoUrl,
  logoWidthPx,
  logoHeightPx,
  className = "",
}: {
  siteName: string;
  logoUrl: string | null;
  logoWidthPx?: number | null;
  logoHeightPx?: number | null;
  className?: string;
}) {
  const wIn = logoWidthPx && logoWidthPx > 0 ? logoWidthPx : null;
  const hIn = logoHeightPx && logoHeightPx > 0 ? logoHeightPx : null;
  const w = wIn ?? (hIn ? 128 : null);
  const h = hIn ?? (wIn ? 40 : null);
  const useCustom = w != null && h != null;
  const boxStyle: CSSProperties | undefined = useCustom
    ? { width: `${w}px`, height: `${h}px` }
    : undefined;

  return (
    <Link href="/" className={`flex shrink-0 items-center gap-2 ${className}`}>
      {logoUrl ? (
        <div className={`relative ${useCustom ? "" : "h-9 w-32 sm:h-10 sm:w-36"}`} style={boxStyle}>
          <Image
            src={logoUrl}
            alt={siteName}
            fill
            className="object-contain object-left"
            sizes={w ? `${w}px` : "144px"}
            unoptimized={logoUrl.startsWith("/")}
          />
        </div>
      ) : (
        <span
          className="max-w-[10rem] truncate font-serif text-lg font-semibold tracking-tight sm:max-w-xs sm:text-xl"
          style={{ color: "var(--sf-primary)" }}
        >
          {siteName}
        </span>
      )}
    </Link>
  );
}

export function ShopDropdown({
  categories,
  productCollections,
  navLinkClass,
}: {
  categories: NavCategory[];
  productCollections: NavProductCollection[];
  navLinkClass?: string;
}) {
  const linkCls = navLinkClass ?? "text-sm font-medium text-zinc-800 transition hover:text-zinc-600";
  return (
    <div className="group relative">
      <button
        type="button"
        className={`inline-flex items-center gap-1 ${linkCls}`}
        aria-expanded={false}
        aria-haspopup="true"
      >
        Shop
        <IconChevronDown className="h-4 w-4 opacity-70" />
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 min-w-[12rem] -translate-x-1/2 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
        <div className="rounded-xl border border-zinc-200 bg-white py-2 shadow-lg">
          <Link
            href="/shop"
            className="block border-b border-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            All products
          </Link>
          <Link
            href="/collections"
            className="block border-b border-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Collections
          </Link>
          {productCollections.length > 0 ? (
            <div className="border-b border-zinc-100 px-2 py-1">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                Bộ sưu tập
              </p>
              {productCollections.map((c) => (
                <Link
                  key={c.id}
                  href={productCollectionPath(c.slug)}
                  className="block rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          ) : null}
          {categories.length === 0 ? (
            <p className="px-4 py-2 text-xs text-zinc-500">No categories yet</p>
          ) : (
            categories.map((c) => (
              <Link
                key={c.id}
                href={collectionPath(c.slug)}
                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
              >
                {c.name}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function InlineNavLinks({
  navLinkClass,
}: {
  navLinkClass?: string;
}) {
  const linkCls = navLinkClass ?? "text-sm font-medium text-zinc-800 transition hover:text-zinc-600";
  return (
    <>
      <Link href="/" className={linkCls}>
        Home
      </Link>
      <Link href="/about-us" className={linkCls}>
        About Us
      </Link>
      <Link href="/contact" className={linkCls}>
        Contact
      </Link>
    </>
  );
}

export function HeaderIconActions({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean | ((b: boolean) => boolean)) => void;
}) {
  const { totalQuantity } = useCart();
  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <Link
        href="/login"
        className="rounded-full p-2.5 text-zinc-700 transition hover:bg-zinc-100"
        aria-label="Account"
      >
        <IconUser className="h-5 w-5" />
      </Link>
      <Link
        href="/cart"
        className="relative rounded-full p-2.5 text-zinc-700 transition hover:bg-zinc-100"
        aria-label="Cart"
      >
        <IconBag className="h-5 w-5" />
        {totalQuantity > 0 ? (
          <span
            className="absolute right-1 top-1 flex h-4 min-w-[1.1rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-semibold text-white tabular-nums"
            aria-label={`${totalQuantity} items in cart`}
          >
            {totalQuantity > 99 ? "99+" : totalQuantity}
          </span>
        ) : null}
      </Link>
      <button
        type="button"
        className="inline-flex rounded-full p-2.5 text-zinc-800 lg:hidden"
        aria-expanded={mobileOpen}
        aria-label="Open menu"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <IconMenu className="h-6 w-6" />
      </button>
    </div>
  );
}

export function MobileNavPanel({
  open,
  categories,
  productCollections,
  onNavigate,
}: {
  open: boolean;
  categories: NavCategory[];
  productCollections: NavProductCollection[];
  onNavigate: () => void;
}) {
  if (!open) return null;
  return (
    <div className="border-t border-zinc-100 bg-white px-4 py-4 lg:hidden">
      <nav className="flex flex-col gap-3 text-sm font-medium text-zinc-800">
        <Link href="/" onClick={onNavigate}>
          Home
        </Link>
        <Link href="/shop" onClick={onNavigate}>
          All products
        </Link>
        <Link href="/collections" onClick={onNavigate}>
          Collections
        </Link>
        {productCollections.map((c) => (
          <Link
            key={c.id}
            href={productCollectionPath(c.slug)}
            onClick={onNavigate}
          >
            Collection: {c.name}
          </Link>
        ))}
        {categories.map((c) => (
          <Link key={c.id} href={collectionPath(c.slug)} onClick={onNavigate}>
            {c.name}
          </Link>
        ))}
        <Link href="/about-us" onClick={onNavigate}>
          About Us
        </Link>
        <Link href="/contact" onClick={onNavigate}>
          Contact
        </Link>
        <Link href="/login" onClick={onNavigate}>
          Account / Sign in
        </Link>
      </nav>
    </div>
  );
}

export function SearchBlock({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <SearchBar />
    </div>
  );
}
