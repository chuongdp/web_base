import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/app/actions/settingActions";
import { ProductAccordions } from "@/components/storefront/ProductAccordions";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { PaymentSecurity } from "@/components/storefront/PaymentSecurity";
import { ProductPurchaseSection } from "@/components/storefront/ProductPurchaseSection";
import { RelatedProducts } from "@/components/storefront/RelatedProducts";
import { collectionPath } from "@/lib/collection-display";
import { formatMoney } from "@/lib/format-price";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product" };
  return { title: product.name };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const desc =
    product.description?.trim() ||
    "Carefully selected pieces—materials and fit tuned for a modern wardrobe.";

  const imageUrls = product.images.map((img) => img.url);

  return (
    <div>
      <nav className="mb-8 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-800">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={collectionPath(product.category.slug)} className="hover:text-zinc-800">
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
        <ProductGallery images={imageUrls} alt={product.name} />

        <div className="flex flex-col">
          <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
            {product.name}
          </h1>
          <p
            className="mt-4 text-3xl font-semibold tabular-nums sm:text-4xl"
            style={{ color: "var(--sf-primary)" }}
          >
            {formatMoney(product.price, product.currency)}
          </p>
          <p className="mt-6 text-base leading-relaxed text-zinc-600">{desc}</p>

          <ProductAccordions
            materials={product.materials}
            careInstructions={product.careInstructions}
            shippingDetails={product.shippingDetails}
          />
          <PaymentSecurity />

          <div className="mt-10 border-t border-zinc-200 pt-8">
            <ProductPurchaseSection
              productId={product.id}
              productName={product.name}
              currency={product.currency}
              sizesString={product.sizes}
              sizeStocks={product.sizeStocks}
            />
          </div>
        </div>
      </div>

      <RelatedProducts currentProductId={product.id} />
    </div>
  );
}
