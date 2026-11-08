import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { conditionLabel, formatPrice, getProduct, getProducts, type Product } from "@/lib/api";
import { SiteShell } from "@/components/SiteShell";
import { AddToCartButton, InstantCryptoCheckoutButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    return {
      title: `${product.name} | Northstar / Supply`,
      description: product.description,
      alternates: { canonical: `/product/${product.slug}` },
      openGraph: { images: product.images[0]?.url ? [product.images[0].url] : [] },
    };
  } catch {
    return {};
  }
}

function ProductJsonLd({ product }: { product: Product }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          brand: { "@type": "Brand", name: product.brand },
          description: product.description,
          sku: product.sku,
          image: product.images.map((image) => image.url),
          offers: {
            "@type": "Offer",
            priceCurrency: product.currency,
            price: (product.priceCents / 100).toFixed(2),
            availability: product.stockStatus === "IN_STOCK" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `https://northstarsupply.example/product/${product.slug}`,
          },
        }),
      }}
    />
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: Product;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  // Load related items from same brand or category
  const relatedResult = await getProducts(`limit=4&sort=newest`).catch(() => ({ items: [] }));
  const relatedProducts = relatedResult.items.filter((p) => p.slug !== product.slug).slice(0, 4);

  const mainImage = product.images[0];

  return (
    <SiteShell>
      <ProductJsonLd product={product} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Nav */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-8 uppercase tracking-wider" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition-colors">Archive</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium truncate">{product.brand}</span>
        </nav>

        {/* 2-Column Shopify PDP Layout */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Main Image Frame (Luxury 4:5 Aspect Ratio) */}
            <div className="relative aspect-4/5 w-full bg-[#f6f5f2] rounded-xs overflow-hidden border border-[#ece8e1] shadow-sm">
              {mainImage && (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 750px"
                  quality={95}
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Floating Provenance Seal Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-white/95 backdrop-blur-xs text-neutral-900 px-3 py-1 border border-[#dedad2] rounded-xs font-semibold shadow-xs">
                  {conditionLabel(product.condition)}
                </span>
                <span className="text-[10px] tracking-wider uppercase bg-[#10b981]/10 backdrop-blur-xs text-[#047857] px-3 py-1 border border-[#10b981]/30 rounded-xs font-semibold shadow-xs">
                  RFID Verified
                </span>
              </div>
            </div>

            {/* Secondary Angle Thumbnails if present */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {product.images.map((img, idx) => (
                  <div key={`${img.url}-${idx}`} className="relative aspect-4/5 bg-[#f6f5f2] rounded-xs overflow-hidden border border-[#ece8e1]">
                    <Image
                      src={img.url}
                      alt={img.alt || `${product.name} angle ${idx + 1}`}
                      fill
                      sizes="200px"
                      quality={95}
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col justify-between">
            <div className="pb-6 border-b border-[#ece8e1]">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8c887e] block mb-2">
                {product.brand}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal leading-tight tracking-tight mb-3">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-mono text-2xl sm:text-3xl font-semibold text-neutral-950">
                  {formatPrice(product.priceCents)}
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  USD · Settled in BTC, ETH, or SOL
                </span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between text-xs font-medium text-[#047857] bg-[#10b981]/8 border border-[#10b981]/25 px-3.5 py-2.5 rounded-xs mb-6">
                <span>In Stock & Ready for Priority Dispatch</span>
                <span className="text-neutral-500 font-mono text-[11px]">24-Hour USA Delivery</span>
              </div>

              {/* Sizes / Dimensions */}
              {product.sizes?.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2">
                    Available Sizing:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <span
                        key={sz}
                        className="px-3.5 py-1.5 border border-[#d6d2c8] text-xs font-medium bg-white text-neutral-800 rounded-xs"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions: Add to Bag + Direct Checkout */}
              <div className="space-y-3 mb-6">
                <AddToCartButton
                  item={{
                    productId: product._id,
                    slug: product.slug,
                    name: product.name,
                    priceCents: product.priceCents,
                    imageUrl: product.images[0]?.url,
                  }}
                  className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer rounded-xs"
                />

                <InstantCryptoCheckoutButton
                  item={{
                    productId: product._id,
                    slug: product.slug,
                    name: product.name,
                    priceCents: product.priceCents,
                    imageUrl: product.images[0]?.url,
                  }}
                  className="w-full py-3.5 px-4 bg-[#f5f4ef] hover:bg-[#eae8e1] text-neutral-900 border border-[#d6d2c8] text-xs font-semibold uppercase tracking-[0.12em] transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-xs"
                />
              </div>

              {/* Quiet Luxury Guarantee Strip */}
              <div className="bg-[#faf9f6] p-4 border border-[#ece8e1] rounded-xs space-y-2.5 text-xs text-neutral-600">
                <div className="flex items-start gap-2.5">
                  <span className="text-neutral-900 font-bold shrink-0">·</span>
                  <span><strong>Guaranteed 24-Hour USA Delivery:</strong> Hand-delivered anywhere in the USA within 24 hours of payment.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-neutral-900 font-bold shrink-0">·</span>
                  <span><strong>100% Lifetime Authenticity:</strong> Verified RFID microchips, original dust bag, tags, and documentation.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-neutral-900 font-bold shrink-0">·</span>
                  <span><strong>Instant Crypto Settlement:</strong> BTC, ETH, and SOL escrow with live dispatch tracking to email.</span>
                </div>
              </div>
            </div>

            {/* Accordion / Specifications Details */}
            <div className="divide-y divide-[#ece8e1] text-xs pt-2">
              <details className="py-4 group" open>
                <summary className="font-semibold uppercase tracking-wider text-neutral-900 cursor-pointer flex justify-between items-center list-none">
                  <span>Product Description & Provenance</span>
                  <span className="text-neutral-400 group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <div className="mt-3 text-neutral-600 leading-relaxed space-y-2">
                  <p>{product.description}</p>
                  <p><strong>Authenticity Standard:</strong> {product.authenticity || "Official house dust covers and provenance documentation included."}</p>
                </div>
              </details>

              <details className="py-4 group">
                <summary className="font-semibold uppercase tracking-wider text-neutral-900 cursor-pointer flex justify-between items-center list-none">
                  <span>Specifications & Reference Data</span>
                  <span className="text-neutral-400 group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <dl className="mt-3 space-y-2">
                  <div className="flex justify-between py-1 border-b border-[#f3f2ee]">
                    <dt className="text-neutral-500">Stock SKU</dt>
                    <dd className="font-mono text-neutral-900">{product.sku}</dd>
                  </div>
                  {product.specs.map((spec) => (
                    <div key={spec.key} className="flex justify-between py-1 border-b border-[#f3f2ee]">
                      <dt className="text-neutral-500">{spec.key}</dt>
                      <dd className="text-neutral-900 font-medium text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </details>

              <details className="py-4 group">
                <summary className="font-semibold uppercase tracking-wider text-neutral-900 cursor-pointer flex justify-between items-center list-none">
                  <span>Guaranteed 24-Hour Nationwide Delivery Protocol</span>
                  <span className="text-neutral-400 group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <div className="mt-3 text-neutral-600 leading-relaxed space-y-2">
                  <p>
                    <strong>Anywhere in the USA within 24 Hours:</strong> No matter where you reside in the United States: from Manhattan to Maui, Aspen to Austin, Los Angeles to Chicago, or Miami to Seattle: our dedicated private armored air courier hand-delivers your acquired piece directly to your door within 24 hours of on-chain confirmation.
                  </p>
                  <p>
                    Every parcel is encased in serialized tamper-evident packaging with direct photo ID signature handover and 100% full declared value transit insurance at zero additional charge.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </article>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#ece8e1]">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b]">
                  Curated Recommendations
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal mt-1">
                  You May Also Consider
                </h2>
              </div>
              <Link href="/shop" className="text-xs font-semibold uppercase tracking-wider text-neutral-800 hover:text-black">
                View All Pieces →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
