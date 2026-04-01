/** URL bộ sưu tập (curated) trên storefront. */
export function productCollectionPath(slug: string): string {
  const s = slug.trim();
  if (!s) return "/collections";
  return `/collections/${encodeURIComponent(s)}`;
}
