import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSiteSettings } from "@/lib/site-settings";
import { Providers } from "./providers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: {
      default: s.siteName,
      template: `%s | ${s.siteName}`,
    },
    icons: s.faviconUrl ? { icon: [{ url: s.faviconUrl }] } : undefined,
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-zinc-50 font-sans text-zinc-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
