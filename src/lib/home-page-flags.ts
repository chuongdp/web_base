export type HomePageFlags = {
  showTrustStrip: boolean;
  showAmbient: boolean;
  showScrollCue: boolean;
  showCollections: boolean;
  showBestSellers: boolean;
  showFeatured: boolean;
  showShopCta: boolean;
};

export const DEFAULT_HOME_PAGE_FLAGS: HomePageFlags = {
  showTrustStrip: true,
  showAmbient: true,
  showScrollCue: true,
  showCollections: true,
  showBestSellers: true,
  showFeatured: true,
  showShopCta: true,
};

type Row = {
  homeShowTrustStrip?: boolean;
  homeShowAmbient?: boolean;
  homeShowScrollCue?: boolean;
  homeShowCollections?: boolean;
  homeShowBestSellers?: boolean;
  homeShowFeatured?: boolean;
  homeShowShopCta?: boolean;
};

export function homePageFlagsFromSetting(row: Row | null | undefined): HomePageFlags {
  if (!row) return DEFAULT_HOME_PAGE_FLAGS;
  return {
    showTrustStrip: row.homeShowTrustStrip ?? true,
    showAmbient: row.homeShowAmbient ?? true,
    showScrollCue: row.homeShowScrollCue ?? true,
    showCollections: row.homeShowCollections ?? true,
    showBestSellers: row.homeShowBestSellers ?? true,
    showFeatured: row.homeShowFeatured ?? true,
    showShopCta: row.homeShowShopCta ?? true,
  };
}
