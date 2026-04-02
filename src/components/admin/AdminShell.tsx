"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { signOutAction } from "@/app/admin/sign-out-action";

const nav = [
  { href: "/admin", label: "Dashboard", match: (p: string) => p === "/admin" },
  { href: "/admin/media", label: "Media", match: (p: string) => p.startsWith("/admin/media") },
  { href: "/admin/settings", label: "Cấu hình Web", match: (p: string) => p.startsWith("/admin/settings") },
  { href: "/admin/products", label: "Sản phẩm", match: (p: string) => p.startsWith("/admin/products") },
  { href: "/admin/categories", label: "Danh mục", match: (p: string) => p.startsWith("/admin/categories") },
  { href: "/admin/collections", label: "Collection", match: (p: string) => p === "/admin/collections" },
  {
    href: "/admin/product-collections",
    label: "Bộ sưu tập",
    match: (p: string) => p.startsWith("/admin/product-collections"),
  },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 p-3" aria-label="Menu admin">
      {nav.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-zinc-900 text-white"
                : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-100 md:flex-row">
      {open ? (
        <button
          type="button"
          aria-label="Đóng menu"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-zinc-200 bg-white shadow-xl transition-transform duration-200 ease-out md:relative md:z-0 md:w-56 md:max-w-none md:translate-x-0 md:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center border-b border-zinc-100 px-4 md:h-16">
          <span className="text-sm font-semibold tracking-tight text-zinc-900">Admin</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
        <div className="shrink-0 border-t border-zinc-100 p-3">
          <Link
            href="/"
            className="mb-2 block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          >
            ← Xem storefront
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-800"
            >
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur md:hidden">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="admin-sidebar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-sm hover:bg-zinc-50"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Mở menu</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <span className="text-sm font-semibold text-zinc-900">Admin</span>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
