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
  galleryImageUrls: "",
  contactPageTitle: "",
  contactIntro: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  contactMapEmbedUrl: "",
  footerMetaShopOwner: "",
  footerMetaAddress: "",
  footerMetaEmail: "",
  footerMetaHours: "",
  paymentShowVisa: true,
  paymentShowMastercard: true,
  paymentShowPaypal: true,
  paymentShowAmex: true,
  paymentShowPingpong: false,
  paymentShowPayoneer: false,
  homeShowTrustStrip: true,
  homeShowAmbient: true,
  homeShowScrollCue: true,
  homeShowCollections: true,
  homeShowBestSellers: true,
  homeShowFeatured: true,
  homeShowShopCta: true,
};

const defaults = {
  siteName: "Store",
  logoUrl: "",
  faviconUrl: "",
  primaryColor: "#2563eb",
  bannerText: "",
  bannerEnabled: true,
  bannerHeightPx: null as number | null,
  bannerFontSizePx: null as number | null,
  bannerBgColor: "",
  bannerTextColor: "",
  bannerScrollSec: null as number | null,
  logoWidthPx: null as number | null,
  logoHeightPx: null as number | null,
  heroImageWidthPx: null as number | null,
  heroImageHeightPx: null as number | null,
  aboutBlockImageWidthPx: null as number | null,
  aboutBlockImageHeightPx: null as number | null,
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
        faviconUrl: row.faviconUrl ?? "",
        primaryColor: row.primaryColor?.trim() || defaults.primaryColor,
        bannerText: row.bannerText ?? "",
        bannerEnabled: row.bannerEnabled,
        bannerHeightPx: row.bannerHeightPx,
        bannerFontSizePx: row.bannerFontSizePx,
        bannerBgColor: row.bannerBgColor ?? "",
        bannerTextColor: row.bannerTextColor ?? "",
        bannerScrollSec: row.bannerScrollSec,
        logoWidthPx: row.logoWidthPx,
        logoHeightPx: row.logoHeightPx,
        heroImageWidthPx: row.heroImageWidthPx,
        heroImageHeightPx: row.heroImageHeightPx,
        aboutBlockImageWidthPx: row.aboutBlockImageWidthPx,
        aboutBlockImageHeightPx: row.aboutBlockImageHeightPx,
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
        galleryImageUrls: row.galleryImageUrls ?? "",
        contactPageTitle: row.contactPageTitle ?? "",
        contactIntro: row.contactIntro ?? "",
        contactEmail: row.contactEmail ?? "",
        contactPhone: row.contactPhone ?? "",
        contactAddress: row.contactAddress ?? "",
        contactMapEmbedUrl: row.contactMapEmbedUrl ?? "",
        footerMetaShopOwner: row.footerMetaShopOwner ?? "",
        footerMetaAddress: row.footerMetaAddress ?? "",
        footerMetaEmail: row.footerMetaEmail ?? "",
        footerMetaHours: row.footerMetaHours ?? "",
        paymentShowVisa: row.paymentShowVisa,
        paymentShowMastercard: row.paymentShowMastercard,
        paymentShowPaypal: row.paymentShowPaypal,
        paymentShowAmex: row.paymentShowAmex,
        paymentShowPingpong: row.paymentShowPingpong,
        paymentShowPayoneer: row.paymentShowPayoneer,
        homeShowTrustStrip: row.homeShowTrustStrip,
        homeShowAmbient: row.homeShowAmbient,
        homeShowScrollCue: row.homeShowScrollCue,
        homeShowCollections: row.homeShowCollections,
        homeShowBestSellers: row.homeShowBestSellers,
        homeShowFeatured: row.homeShowFeatured,
        homeShowShopCta: row.homeShowShopCta,
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
