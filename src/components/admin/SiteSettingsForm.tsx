"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateSiteSetting } from "@/app/actions/settingActions";
import { BrandAssetUploadField } from "@/components/admin/BrandAssetUploadField";
import { ColorHexField } from "@/components/admin/ColorHexField";
import { STOREFRONT_THEME_OPTIONS } from "@/lib/storefront-theme";
import type { StorefrontTheme } from "@prisma/client";

export type SiteSettingsInitial = {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  bannerText: string;
  defaultCurrency: "VND" | "USD";
  storefrontTheme: StorefrontTheme;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroImageUrl: string;
  heroOverlayImageUrl: string;
  aboutHeroTitle: string;
  aboutWhoTitle: string;
  aboutIntroP1: string;
  aboutIntroP2: string;
  aboutBlock1Title: string;
  aboutBlock1Body: string;
  aboutBlock1ImageUrl: string;
  aboutBlock2Title: string;
  aboutBlock2Body: string;
  aboutBlock2ImageUrl: string;
  aboutBlock3Title: string;
  aboutBlock3Body: string;
  aboutBlock3ImageUrl: string;
  aboutBestSellersTitle: string;
  galleryHeading: string;
  gallerySubtitle: string;
  galleryImageUrls: string;
  contactPageTitle: string;
  contactIntro: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactMapEmbedUrl: string;
  bannerEnabled: boolean;
  bannerHeightPx: number | null;
  bannerFontSizePx: number | null;
  bannerBgColor: string;
  bannerTextColor: string;
  bannerScrollSec: number | null;
  logoWidthPx: number | null;
  logoHeightPx: number | null;
  heroImageWidthPx: number | null;
  heroImageHeightPx: number | null;
  aboutBlockImageWidthPx: number | null;
  aboutBlockImageHeightPx: number | null;
  footerMetaShopOwner: string;
  footerMetaAddress: string;
  footerMetaEmail: string;
  footerMetaHours: string;
};

type Props = {
  initial: SiteSettingsInitial;
};

const SECTIONS = [
  {
    id: "appearance" as const,
    label: "Giao diện storefront",
    description: "Preset bố cục, typography, bo góc thẻ (màu chủ đạo ở tab Chung)",
  },
  {
    id: "footer" as const,
    label: "Footer — dòng thông tin",
    description: "Khối Shop owner / Address / Email / Hours (preset giao diện dạng cards)",
  },
  { id: "general" as const, label: "Chung & thương hiệu", description: "Tên site, logo, favicon, màu, tiền tệ" },
  {
    id: "banner" as const,
    label: "Banner trên cùng",
    description: "Thông báo chạy ngang, màu, tốc độ",
  },
  {
    id: "images" as const,
    label: "Ảnh & kích thước",
    description: "Logo, hero, About — hiển thị trên web (px)",
  },
  { id: "hero" as const, label: "Hero trang chủ", description: "Tiêu đề, CTA, URL ảnh hero" },
  { id: "about" as const, label: "About Us", description: "Nội dung /about-us" },
  { id: "contact" as const, label: "Liên hệ", description: "Nội dung /contact" },
];

type SectionId = (typeof SECTIONS)[number]["id"];

function sectionHidden(active: SectionId, id: SectionId) {
  return active !== id ? "hidden" : "";
}

export function SiteSettingsForm({ initial }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<SectionId>("appearance");
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const result = await updateSiteSetting(fd);
    setPending(false);

    if (result.ok) {
      setMessage({ kind: "ok", text: "Lưu thành công" });
      router.refresh();
      return;
    }
    setMessage({ kind: "err", text: result.message });
  }

  const formKey = `${initial.storefrontTheme}-${initial.primaryColor}-${initial.siteName}-${initial.defaultCurrency}-${initial.logoUrl}-${initial.faviconUrl}-${initial.footerMetaShopOwner}-${initial.footerMetaAddress}-${initial.footerMetaEmail}-${initial.footerMetaHours}-${initial.galleryImageUrls}`;

  const currentMeta = SECTIONS.find((s) => s.id === active);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
      <nav
        className="shrink-0 lg:w-56"
        aria-label="Nhóm cấu hình"
      >
        <p className="mb-2 hidden text-xs font-medium uppercase tracking-wide text-zinc-500 lg:block">
          Danh mục
        </p>
        <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:border-r lg:border-zinc-200 lg:pr-4 lg:pb-0">
          {SECTIONS.map((s) => {
            const isOn = active === s.id;
            return (
              <li key={s.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => setActive(s.id)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition lg:py-2 ${
                    isOn
                      ? "bg-zinc-900 font-medium text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 lg:bg-transparent lg:hover:bg-zinc-100"
                  }`}
                >
                  {s.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <form key={formKey} onSubmit={handleSubmit} className="min-w-0 flex-1 space-y-6">
        <div className="border-b border-zinc-100 pb-4">
          <h2 className="text-lg font-semibold text-zinc-900">{currentMeta?.label}</h2>
          <p className="mt-1 text-sm text-zinc-600">{currentMeta?.description}</p>
        </div>

        {/* —— Giao diện storefront —— */}
        <div className={`space-y-6 ${sectionHidden(active, "appearance")}`}>
          <p className="text-sm text-zinc-600">
            Màu chủ đạo (tab Chung) áp dụng cho nút, giá, banner. Preset bên dưới đổi nền trang, bo góc thẻ sản phẩm,
            font tiêu đề và header.
          </p>
          <fieldset>
            <legend className="sr-only">Preset giao diện</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {STOREFRONT_THEME_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 has-[:checked]:border-zinc-900 has-[:checked]:ring-2 has-[:checked]:ring-zinc-900/10"
                >
                  <input
                    type="radio"
                    name="storefrontTheme"
                    value={opt.value}
                    defaultChecked={initial.storefrontTheme === opt.value}
                    className="mt-1 h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                  />
                  <div>
                    <div className="font-medium text-zinc-900">{opt.label}</div>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">{opt.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* —— Footer meta (cards) —— */}
        <div className={`space-y-6 ${sectionHidden(active, "footer")}`}>
          <p className="text-sm text-zinc-600">
            Hiển thị trên preset <strong>boutique</strong> (footer dạng thẻ): một dòng bốn cột phía dưới newsletter. Để
            trống «Tên chủ shop» sẽ dùng tên website. Để trống email/địa chỉ có thể lấy từ tab Liên hệ nếu đã nhập ở đó.
          </p>
          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="footerMetaShopOwner" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Tên chủ shop (Shop owner)
              </label>
              <input
                id="footerMetaShopOwner"
                name="footerMetaShopOwner"
                type="text"
                defaultValue={initial.footerMetaShopOwner}
                placeholder="Để trống = tên website"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="footerMetaAddress" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Địa chỉ (Address)
              </label>
              <input
                id="footerMetaAddress"
                name="footerMetaAddress"
                type="text"
                defaultValue={initial.footerMetaAddress}
                placeholder="Để trống có thể dùng địa chỉ tab Liên hệ"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="footerMetaEmail" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Email hiển thị
              </label>
              <input
                id="footerMetaEmail"
                name="footerMetaEmail"
                type="text"
                defaultValue={initial.footerMetaEmail}
                placeholder="Để trống = email tab Liên hệ"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="footerMetaHours" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Giờ làm việc (Hours)
              </label>
              <input
                id="footerMetaHours"
                name="footerMetaHours"
                type="text"
                defaultValue={initial.footerMetaHours}
                placeholder="vd: Mon–Fri | 8:00 – 17:00"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* —— Chung —— */}
        <div className={`space-y-6 ${sectionHidden(active, "general")}`}>
          <div>
            <label htmlFor="siteName" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Tên website
            </label>
            <input
              id="siteName"
              name="siteName"
              type="text"
              required
              defaultValue={initial.siteName}
              className="w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>

          <BrandAssetUploadField
            id="logoUrl"
            name="logoUrl"
            label="Logo (header)"
            defaultValue={initial.logoUrl}
            variant="logo"
            helperText="Upload file hoặc dán URL. Khuyến nghị PNG/SVG nền trong suốt. Kích thước hiển thị chỉnh ở tab «Ảnh & kích thước»."
          />

          <BrandAssetUploadField
            id="faviconUrl"
            name="faviconUrl"
            label="Favicon (icon tab trình duyệt)"
            defaultValue={initial.faviconUrl}
            variant="favicon"
            helperText="PNG / ICO / SVG vuông (vd 32×32). Có thể upload trực tiếp hoặc chọn ảnh đã có trong Media."
          />

          <ColorHexField
            id="primaryColor"
            name="primaryColor"
            label="Màu chủ đạo"
            defaultValue={initial.primaryColor}
            placeholder="#2563eb"
            hint="Dùng cho nút, giá, banner (khi không tùy chỉnh màu nền banner)."
          />

          <div>
            <label htmlFor="defaultCurrency" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Tiền tệ mặc định cửa hàng
            </label>
            <select
              id="defaultCurrency"
              name="defaultCurrency"
              defaultValue={initial.defaultCurrency}
              className="w-full max-w-xs rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            >
              <option value="VND">VND (₫)</option>
              <option value="USD">USD ($)</option>
            </select>
            <p className="mt-1.5 text-xs text-zinc-500">
              Dùng làm mặc định khi thêm sản phẩm mới (từng sản phẩm vẫn có thể đổi riêng).
            </p>
          </div>
        </div>

        {/* —— Banner —— */}
        <div className={`space-y-6 ${sectionHidden(active, "banner")}`}>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-800">
            <input
              type="checkbox"
              name="bannerEnabled"
              defaultChecked={initial.bannerEnabled}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900"
            />
            Bật banner chạy ngang trên cùng
          </label>
          <div>
            <label htmlFor="bannerText" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Nội dung banner
            </label>
            <textarea
              id="bannerText"
              name="bannerText"
              rows={3}
              defaultValue={initial.bannerText}
              placeholder="Thông báo (để trống = ẩn banner)"
              className="w-full max-w-xl resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="bannerHeightPx" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Chiều cao tối thiểu (px)
              </label>
              <input
                id="bannerHeightPx"
                name="bannerHeightPx"
                type="number"
                min={24}
                max={200}
                placeholder="Mặc định"
                defaultValue={initial.bannerHeightPx ?? ""}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="bannerFontSizePx" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Cỡ chữ (px)
              </label>
              <input
                id="bannerFontSizePx"
                name="bannerFontSizePx"
                type="number"
                min={10}
                max={32}
                placeholder="Mặc định (text-sm)"
                defaultValue={initial.bannerFontSizePx ?? ""}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
              />
            </div>
          </div>
          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            <ColorHexField
              id="bannerBgColor"
              name="bannerBgColor"
              label="Màu nền"
              defaultValue={initial.bannerBgColor}
              placeholder="#2563eb"
              optional
              hint="Để trống = màu chủ đạo."
            />
            <ColorHexField
              id="bannerTextColor"
              name="bannerTextColor"
              label="Màu chữ"
              defaultValue={initial.bannerTextColor}
              placeholder="#ffffff"
              optional
              hint="Để trống = trắng (#ffffff)."
            />
          </div>
          <div>
            <label htmlFor="bannerScrollSec" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Thời gian một vòng chạy (giây)
            </label>
            <input
              id="bannerScrollSec"
              name="bannerScrollSec"
              type="number"
              min={5}
              max={300}
              step={1}
              placeholder="32"
              defaultValue={initial.bannerScrollSec ?? ""}
              className="w-full max-w-xs rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
            <p className="mt-1 text-xs text-zinc-500">Số càng lớn chữ chạy càng chậm.</p>
          </div>
        </div>

        {/* —— Ảnh & kích thước —— */}
        <div className={`space-y-6 ${sectionHidden(active, "images")}`}>
          <p className="text-sm text-zinc-600">
            Nhập số pixel (px) để giới hạn hiển thị. Để trống = bố cục mặc định. Favicon không áp dụng kích thước trên
            tab trình duyệt.
          </p>
          <div>
            <p className="mb-2 text-sm font-medium text-zinc-800">Logo header</p>
            <div className="grid max-w-xl gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="logoWidthPx" className="mb-1.5 block text-xs text-zinc-600">
                  Rộng (px)
                </label>
                <input
                  id="logoWidthPx"
                  name="logoWidthPx"
                  type="number"
                  min={16}
                  max={400}
                  defaultValue={initial.logoWidthPx ?? ""}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="logoHeightPx" className="mb-1.5 block text-xs text-zinc-600">
                  Cao (px)
                </label>
                <input
                  id="logoHeightPx"
                  name="logoHeightPx"
                  type="number"
                  min={16}
                  max={200}
                  defaultValue={initial.logoHeightPx ?? ""}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm"
                />
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-zinc-800">Ảnh hero trang chủ</p>
            <div className="grid max-w-xl gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="heroImageWidthPx" className="mb-1.5 block text-xs text-zinc-600">
                  max-width (px)
                </label>
                <input
                  id="heroImageWidthPx"
                  name="heroImageWidthPx"
                  type="number"
                  min={100}
                  max={2000}
                  defaultValue={initial.heroImageWidthPx ?? ""}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="heroImageHeightPx" className="mb-1.5 block text-xs text-zinc-600">
                  max-height (px)
                </label>
                <input
                  id="heroImageHeightPx"
                  name="heroImageHeightPx"
                  type="number"
                  min={100}
                  max={1200}
                  defaultValue={initial.heroImageHeightPx ?? ""}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm"
                />
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-zinc-800">Ảnh khối About Us (3 ảnh)</p>
            <div className="grid max-w-xl gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="aboutBlockImageWidthPx" className="mb-1.5 block text-xs text-zinc-600">
                  max-width (px)
                </label>
                <input
                  id="aboutBlockImageWidthPx"
                  name="aboutBlockImageWidthPx"
                  type="number"
                  min={100}
                  max={2000}
                  defaultValue={initial.aboutBlockImageWidthPx ?? ""}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="aboutBlockImageHeightPx" className="mb-1.5 block text-xs text-zinc-600">
                  max-height (px)
                </label>
                <input
                  id="aboutBlockImageHeightPx"
                  name="aboutBlockImageHeightPx"
                  type="number"
                  min={100}
                  max={1200}
                  defaultValue={initial.aboutBlockImageHeightPx ?? ""}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* —— Hero —— */}
        <div className={`space-y-4 ${sectionHidden(active, "hero")}`}>
          <p className="text-sm text-zinc-600">
            Để trống để dùng nội dung mặc định (trừ ảnh nếu cần).             Kích thước hiển thị ảnh hero: mở tab Ảnh &amp; kích thước.
          </p>
          <div>
            <label htmlFor="heroTitle" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Hero title
            </label>
            <input
              id="heroTitle"
              name="heroTitle"
              type="text"
              defaultValue={initial.heroTitle}
              placeholder="Tiêu đề lớn"
              className="w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div>
            <label htmlFor="heroSubtitle" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Hero subtitle
            </label>
            <input
              id="heroSubtitle"
              name="heroSubtitle"
              type="text"
              defaultValue={initial.heroSubtitle}
              placeholder="Đoạn mô tả ngắn"
              className="w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div>
            <label htmlFor="heroButtonText" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Hero button text
            </label>
            <input
              id="heroButtonText"
              name="heroButtonText"
              type="text"
              defaultValue={initial.heroButtonText}
              placeholder="Shop collection"
              className="w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div>
            <label htmlFor="heroButtonLink" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Hero button link
            </label>
            <input
              id="heroButtonLink"
              name="heroButtonLink"
              type="text"
              defaultValue={initial.heroButtonLink}
              placeholder="/#products hoặc https://…"
              className="w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div>
            <label htmlFor="heroImageUrl" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Hero image URL
            </label>
            <input
              id="heroImageUrl"
              name="heroImageUrl"
              type="text"
              defaultValue={initial.heroImageUrl}
              placeholder="https://… ảnh chính"
              className="w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div>
            <label htmlFor="heroOverlayImageUrl" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Hero overlay image URL
            </label>
            <input
              id="heroOverlayImageUrl"
              name="heroOverlayImageUrl"
              type="text"
              defaultValue={initial.heroOverlayImageUrl}
              placeholder="https://… ảnh nhỏ góc"
              className="w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
        </div>

        {/* —— About —— */}
        <div className={`grid gap-4 sm:grid-cols-2 ${sectionHidden(active, "about")}`}>
          <p className="text-sm text-zinc-600 sm:col-span-2">
            Nội dung tại /about-us. Để trống để dùng bản mặc định trong code.
          </p>
          <div className="sm:col-span-2">
            <label htmlFor="aboutHeroTitle" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Tiêu đề hero
            </label>
            <input
              id="aboutHeroTitle"
              name="aboutHeroTitle"
              type="text"
              defaultValue={initial.aboutHeroTitle}
              className="w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="aboutWhoTitle" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Tiêu đề khối Who We Are
            </label>
            <input
              id="aboutWhoTitle"
              name="aboutWhoTitle"
              type="text"
              defaultValue={initial.aboutWhoTitle}
              className="w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="aboutIntroP1" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Đoạn giới thiệu 1
            </label>
            <textarea
              id="aboutIntroP1"
              name="aboutIntroP1"
              rows={3}
              defaultValue={initial.aboutIntroP1}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="aboutIntroP2" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Đoạn giới thiệu 2
            </label>
            <textarea
              id="aboutIntroP2"
              name="aboutIntroP2"
              rows={3}
              defaultValue={initial.aboutIntroP2}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="aboutBlock1Title" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Block 1 — tiêu đề
            </label>
            <input
              id="aboutBlock1Title"
              name="aboutBlock1Title"
              type="text"
              defaultValue={initial.aboutBlock1Title}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="aboutBlock1ImageUrl" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Block 1 — URL ảnh
            </label>
            <input
              id="aboutBlock1ImageUrl"
              name="aboutBlock1ImageUrl"
              type="text"
              defaultValue={initial.aboutBlock1ImageUrl}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="aboutBlock1Body" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Block 1 — nội dung
            </label>
            <textarea
              id="aboutBlock1Body"
              name="aboutBlock1Body"
              rows={3}
              defaultValue={initial.aboutBlock1Body}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="aboutBlock2Title" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Block 2 — tiêu đề
            </label>
            <input
              id="aboutBlock2Title"
              name="aboutBlock2Title"
              type="text"
              defaultValue={initial.aboutBlock2Title}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="aboutBlock2ImageUrl" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Block 2 — URL ảnh
            </label>
            <input
              id="aboutBlock2ImageUrl"
              name="aboutBlock2ImageUrl"
              type="text"
              defaultValue={initial.aboutBlock2ImageUrl}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="aboutBlock2Body" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Block 2 — nội dung
            </label>
            <textarea
              id="aboutBlock2Body"
              name="aboutBlock2Body"
              rows={3}
              defaultValue={initial.aboutBlock2Body}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="aboutBlock3Title" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Block 3 — tiêu đề
            </label>
            <input
              id="aboutBlock3Title"
              name="aboutBlock3Title"
              type="text"
              defaultValue={initial.aboutBlock3Title}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="aboutBlock3ImageUrl" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Block 3 — URL ảnh
            </label>
            <input
              id="aboutBlock3ImageUrl"
              name="aboutBlock3ImageUrl"
              type="text"
              defaultValue={initial.aboutBlock3ImageUrl}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="aboutBlock3Body" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Block 3 — nội dung
            </label>
            <textarea
              id="aboutBlock3Body"
              name="aboutBlock3Body"
              rows={3}
              defaultValue={initial.aboutBlock3Body}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="aboutBestSellersTitle" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Tiêu đề Best Sellers
            </label>
            <input
              id="aboutBestSellersTitle"
              name="aboutBestSellersTitle"
              type="text"
              defaultValue={initial.aboutBestSellersTitle}
              className="w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="galleryHeading" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Gallery — tiêu đề
            </label>
            <input
              id="galleryHeading"
              name="galleryHeading"
              type="text"
              defaultValue={initial.galleryHeading}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="gallerySubtitle" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Gallery — mô tả phụ
            </label>
            <input
              id="gallerySubtitle"
              name="gallerySubtitle"
              type="text"
              defaultValue={initial.gallerySubtitle}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="galleryImageUrls" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Gallery — URL ảnh (6 dòng, mỗi dòng một URL)
            </label>
            <textarea
              id="galleryImageUrls"
              name="galleryImageUrls"
              rows={8}
              placeholder={
                "https://…\nhttps://…\n… (tối đa 6 dòng; ít hơn sẽ bù ảnh mẫu)\nHoặc /uploads/… sau khi upload Media"
              }
              defaultValue={initial.galleryImageUrls}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 font-mono text-sm shadow-sm"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Không ghi gì ở đây thì dùng bộ ảnh mặc định. Tiêu đề / mô tả phụ chỉnh ở hai ô phía trên (vd «Follow Us
              @tên_shop»).
            </p>
          </div>
        </div>

        {/* —— Contact —— */}
        <div className={`max-w-xl space-y-4 ${sectionHidden(active, "contact")}`}>
          <p className="text-sm text-zinc-600">Nội dung hiển thị tại /contact.</p>
          <div>
            <label htmlFor="contactPageTitle" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Tiêu đề trang
            </label>
            <input
              id="contactPageTitle"
              name="contactPageTitle"
              type="text"
              defaultValue={initial.contactPageTitle}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="contactIntro" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Đoạn mở đầu (cột trái)
            </label>
            <textarea
              id="contactIntro"
              name="contactIntro"
              rows={3}
              defaultValue={initial.contactIntro}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="contactEmail" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Email hiển thị
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={initial.contactEmail}
              placeholder="hello@example.com"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="contactPhone" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Số điện thoại hiển thị
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="text"
              defaultValue={initial.contactPhone}
              placeholder="+84 90 123 4567"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="contactAddress" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Địa chỉ
            </label>
            <textarea
              id="contactAddress"
              name="contactAddress"
              rows={3}
              defaultValue={initial.contactAddress}
              placeholder="Số nhà, đường, quận, thành phố…"
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="contactMapEmbedUrl" className="mb-1.5 block text-sm font-medium text-zinc-700">
              URL nhúng Google Maps
            </label>
            <input
              id="contactMapEmbedUrl"
              name="contactMapEmbedUrl"
              type="url"
              defaultValue={initial.contactMapEmbedUrl}
              placeholder="https://www.google.com/maps/embed?pb=…"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Mở Google Maps → Chia sẻ → Nhúng bản đồ → sao chép URL trong thẻ iframe (thuộc tính src).
            </p>
          </div>
        </div>

        {message ? (
          <div
            role="status"
            className={`rounded-lg px-3 py-2 text-sm ${
              message.kind === "ok"
                ? "border border-green-200 bg-green-50 text-green-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-6">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-60"
          >
            {pending ? "Đang lưu…" : "Lưu toàn bộ cấu hình"}
          </button>
          <span className="text-xs text-zinc-500">
            Một lần lưu ghi tất cả các nhóm (kể cả tab đang ẩn).
          </span>
        </div>
      </form>
    </div>
  );
}
