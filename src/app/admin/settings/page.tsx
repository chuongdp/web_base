import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { getSiteSetting } from "@/app/actions/settingActions";

export const dynamic = "force-dynamic";

const emptyAboutContact = {
  aboutHeroTitle: "",
  aboutWhoTitle: "",
  aboutIntroP1: "",
  aboutIntroP2: "",
  aboutBlock1Title: "",
  aboutBlock1Body: "",
  aboutBlock1ImageUrl: "",
  aboutBlock2Title: "",
  aboutBlock2Body: "",
  aboutBlock2ImageUrl: "",
  aboutBlock3Title: "",
  aboutBlock3Body: "",
  aboutBlock3ImageUrl: "",
  aboutBestSellersTitle: "",
  galleryHeading: "",
  gallerySubtitle: "",
  contactPageTitle: "",
  contactIntro: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  contactMapEmbedUrl: "",
};

const defaults = {
  siteName: "Store",
  logoUrl: "",
  primaryColor: "#2563eb",
  bannerText: "",
  defaultCurrency: "USD" as const,
  storefrontTheme: "boutique" as const,
  heroTitle: "",
  heroSubtitle: "",
  heroButtonText: "",
  heroButtonLink: "",
  heroImageUrl: "",
  heroOverlayImageUrl: "",
  ...emptyAboutContact,
};

export default async function AdminSettingsPage() {
  const row = await getSiteSetting();

  const initial = row
    ? {
        siteName: row.siteName,
        logoUrl: row.logoUrl ?? "",
        primaryColor: row.primaryColor?.trim() || defaults.primaryColor,
        bannerText: row.bannerText ?? "",
        defaultCurrency: row.defaultCurrency === "USD" ? ("USD" as const) : ("VND" as const),
        storefrontTheme: row.storefrontTheme,
        heroTitle: row.heroTitle ?? "",
        heroSubtitle: row.heroSubtitle ?? "",
        heroButtonText: row.heroButtonText ?? "",
        heroButtonLink: row.heroButtonLink ?? "",
        heroImageUrl: row.heroImageUrl ?? "",
        heroOverlayImageUrl: row.heroOverlayImageUrl ?? "",
        aboutHeroTitle: row.aboutHeroTitle ?? "",
        aboutWhoTitle: row.aboutWhoTitle ?? "",
        aboutIntroP1: row.aboutIntroP1 ?? "",
        aboutIntroP2: row.aboutIntroP2 ?? "",
        aboutBlock1Title: row.aboutBlock1Title ?? "",
        aboutBlock1Body: row.aboutBlock1Body ?? "",
        aboutBlock1ImageUrl: row.aboutBlock1ImageUrl ?? "",
        aboutBlock2Title: row.aboutBlock2Title ?? "",
        aboutBlock2Body: row.aboutBlock2Body ?? "",
        aboutBlock2ImageUrl: row.aboutBlock2ImageUrl ?? "",
        aboutBlock3Title: row.aboutBlock3Title ?? "",
        aboutBlock3Body: row.aboutBlock3Body ?? "",
        aboutBlock3ImageUrl: row.aboutBlock3ImageUrl ?? "",
        aboutBestSellersTitle: row.aboutBestSellersTitle ?? "",
        galleryHeading: row.galleryHeading ?? "",
        gallerySubtitle: row.gallerySubtitle ?? "",
        contactPageTitle: row.contactPageTitle ?? "",
        contactIntro: row.contactIntro ?? "",
        contactEmail: row.contactEmail ?? "",
        contactPhone: row.contactPhone ?? "",
        contactAddress: row.contactAddress ?? "",
        contactMapEmbedUrl: row.contactMapEmbedUrl ?? "",
      }
    : defaults;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Site settings</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Branding, home hero, About Us and Contact content for the storefront.
      </p>
      <div className="mt-8 space-y-8">
        <ChangePasswordForm />
        <SiteSettingsForm initial={initial} />
      </div>
    </div>
  );
}
