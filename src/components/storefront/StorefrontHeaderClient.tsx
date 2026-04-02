"use client";

import { useState } from "react";
import type { StorefrontTheme } from "@prisma/client";
import {
  HeaderIconActions,
  HeaderLogo,
  InlineNavLinks,
  MobileNavPanel,
  SearchBlock,
  ShopDropdown,
} from "@/components/storefront/header/HeaderShared";
import type { NavCategory, NavProductCollection } from "@/components/storefront/header/types";
import { getHeaderLayoutMode } from "@/lib/storefront-theme";

export type { NavCategory, NavProductCollection } from "@/components/storefront/header/types";

type Props = {
  siteName: string;
  logoUrl: string | null;
  logoWidthPx?: number | null;
  logoHeightPx?: number | null;
  categories: NavCategory[];
  productCollections: NavProductCollection[];
  theme: StorefrontTheme;
};

function HeaderShell({
  children,
  floating,
}: {
  children: React.ReactNode;
  floating?: boolean;
}) {
  return (
    <header
      className="sf-header sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        backgroundColor: "var(--sf-header-bg)",
        borderColor: "var(--sf-header-border)",
      }}
    >
      {floating ? (
        <div className="sf-header-shell-inner mt-3 px-3 sm:mt-4 sm:px-4">
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-md ring-1 ring-zinc-200/40">
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </header>
  );
}

export function StorefrontHeaderClient({
  siteName,
  logoUrl,
  logoWidthPx,
  logoHeightPx,
  categories,
  productCollections,
  theme,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mode = getHeaderLayoutMode(theme);

  const mobilePanel = (
    <MobileNavPanel
      open={mobileOpen}
      categories={categories}
      productCollections={productCollections}
      onNavigate={() => setMobileOpen(false)}
    />
  );

  if (mode === "stacked") {
    return (
      <HeaderShell>
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-5 lg:px-8">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="w-20 shrink-0 lg:w-28" aria-hidden />
            <HeaderLogo
              siteName={siteName}
              logoUrl={logoUrl}
              logoWidthPx={logoWidthPx}
              logoHeightPx={logoHeightPx}
              className="justify-center"
            />
            <div className="w-20 shrink-0 justify-end sm:w-28 lg:flex lg:justify-end">
              <HeaderIconActions mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            </div>
          </div>
          <nav
            className="hidden w-full flex-wrap items-center justify-center gap-x-8 gap-y-2 lg:flex"
            aria-label="Main"
          >
            <InlineNavLinks />
            <ShopDropdown categories={categories} productCollections={productCollections} />
          </nav>
          <SearchBlock className="hidden w-full max-w-xl md:block" />
          <SearchBlock className="w-full md:hidden" />
        </div>
        {mobilePanel}
      </HeaderShell>
    );
  }

  if (mode === "compact") {
    return (
      <HeaderShell>
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-3 py-2.5 sm:px-5 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <HeaderLogo
            siteName={siteName}
            logoUrl={logoUrl}
            logoWidthPx={logoWidthPx}
            logoHeightPx={logoHeightPx}
          />
            <nav className="hidden shrink-0 items-center gap-4 lg:flex" aria-label="Main">
              <InlineNavLinks navLinkClass="text-xs font-medium uppercase tracking-wide text-zinc-700 hover:text-zinc-900" />
              <ShopDropdown
                categories={categories}
                productCollections={productCollections}
                navLinkClass="text-xs font-medium uppercase tracking-wide text-zinc-700 hover:text-zinc-900"
              />
            </nav>
            <div className="hidden min-w-0 flex-1 md:flex">
              <SearchBlock className="w-full" />
            </div>
            <HeaderIconActions mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          </div>
          <div className="md:hidden">
            <SearchBlock />
          </div>
        </div>
        {mobilePanel}
      </HeaderShell>
    );
  }

  if (mode === "wide") {
    return (
      <HeaderShell>
        <div className="flex w-full flex-col gap-3 px-4 py-3 sm:px-8 lg:px-12 lg:py-4">
          <div className="flex items-center gap-4 lg:gap-8">
            <HeaderLogo
            siteName={siteName}
            logoUrl={logoUrl}
            logoWidthPx={logoWidthPx}
            logoHeightPx={logoHeightPx}
          />
            <div className="hidden min-w-0 flex-1 md:flex">
              <SearchBlock className="w-full max-w-2xl" />
            </div>
            <nav className="hidden shrink-0 items-center gap-5 lg:flex lg:gap-7" aria-label="Main">
              <InlineNavLinks navLinkClass="text-sm font-semibold uppercase tracking-wide text-zinc-800" />
              <ShopDropdown
                categories={categories}
                productCollections={productCollections}
                navLinkClass="text-sm font-semibold uppercase tracking-wide text-zinc-800"
              />
            </nav>
            <HeaderIconActions mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          </div>
          <div className="md:hidden">
            <SearchBlock />
          </div>
        </div>
        {mobilePanel}
      </HeaderShell>
    );
  }

  if (mode === "floating") {
    return (
      <HeaderShell floating>
        <div className="flex flex-col gap-3 px-4 py-3 lg:gap-4 lg:px-6 lg:py-4">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            <HeaderLogo
            siteName={siteName}
            logoUrl={logoUrl}
            logoWidthPx={logoWidthPx}
            logoHeightPx={logoHeightPx}
          />
            <div className="hidden min-w-0 flex-1 justify-center px-2 md:flex">
              <SearchBlock className="w-full max-w-xl" />
            </div>
            <nav className="hidden shrink-0 items-center gap-5 lg:flex lg:gap-8" aria-label="Main">
              <InlineNavLinks />
              <ShopDropdown categories={categories} productCollections={productCollections} />
            </nav>
            <HeaderIconActions mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          </div>
          <div className="md:hidden">
            <SearchBlock />
          </div>
        </div>
        {mobilePanel}
      </HeaderShell>
    );
  }

  /* classic / boutique */
  return (
    <HeaderShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 lg:gap-4 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
          <HeaderLogo
            siteName={siteName}
            logoUrl={logoUrl}
            logoWidthPx={logoWidthPx}
            logoHeightPx={logoHeightPx}
          />
          <div className="hidden min-w-0 flex-1 justify-center px-2 md:flex">
            <SearchBlock className="w-full" />
          </div>
          <nav className="hidden shrink-0 items-center gap-6 lg:flex lg:gap-8" aria-label="Main">
            <InlineNavLinks />
            <ShopDropdown categories={categories} productCollections={productCollections} />
          </nav>
          <HeaderIconActions mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        </div>
        <div className="md:hidden">
          <SearchBlock />
        </div>
      </div>
      {mobilePanel}
    </HeaderShell>
  );
}
