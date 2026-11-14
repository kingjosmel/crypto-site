import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { conditionLabel, formatPrice, getProduct, getProducts, type Product } from "@/lib/api";
import { SiteShell } from "@/components/SiteShell";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { ConditionChecklist } from "@/components/ConditionChecklist";
import { StickyMobileBar } from "@/components/StickyMobileBar";

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
          {/* Left Column: Interactive Multi-Angle Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
              conditionLabelText={conditionLabel(product.condition)}
            />

            {/* Interactive 10-Point Condition Breakdown */}
            <ConditionChecklist brand={product.brand} sku={product.sku} />
          </div>

          {/* Right Column: Sticky Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col justify-between">
            <div className="pb-6 border-b border-[#dcdcdc]">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#6b6b6b] block mb-2">
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

              {/* Interactive Size Selection & Purchase Actions */}
              <div className="mb-6">
                <ProductPurchasePanel product={product} />
              </div>

              {/* Quiet Luxury Guarantee Strip */}
              <div className="bg-[#fafafa] p-4 border border-[#e5e5e5] rounded-xs space-y-2.5 text-xs text-neutral-600">
                <div className="flex items-start gap-2.5">
                  <span className="text-neutral-900 font-bold shrink-0">·</span>
                  <span><strong>Guaranteed 24-Hour USA Delivery:</strong> Dispatched via priority express courier with signature required.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-neutral-900 font-bold shrink-0">·</span>
                  <span><strong>100% Lifetime Authenticity:</strong> Physical serial audit, RFID microchips, original dust bag, box, and tags.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-neutral-900 font-bold shrink-0">·</span>
                  <span><strong>Direct Crypto Settlement:</strong> Pay privately with Bitcoin, Ethereum, or Solana without wire limits.</span>
                </div>
              </div>
            </div>

            {/* Accordion / Specifications Details */}
            <div className="divide-y divide-[#dcdcdc] text-xs pt-2">
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
                  <div className="flex justify-between py-1 border-b border-[#e5e5e5]">
                    <dt className="text-neutral-500">Stock SKU</dt>
                    <dd className="font-mono text-neutral-900">{product.sku}</dd>
                  </div>
                  {product.specs.map((spec) => (
                    <div key={spec.key} className="flex justify-between py-1 border-b border-[#e5e5e5]">
                    <dt className="text-neutral-500">{spec.key}</dt>
                    <dd className="text-neutral-900 font-medium text-right">{spec.value}</dd>
                  </div>
                  ))}
                </dl>
              </details>

              <details className="py-4 group">
                <summary className="font-semibold uppercase tracking-wider text-neutral-900 cursor-pointer flex justify-between items-center list-none">
                  <span>How Crypto Payment & 24h Shipping Works</span>
                  <span className="text-neutral-400 group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <div className="mt-3 text-neutral-600 leading-relaxed space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">1</span>
                    <p><strong>Select Coin:</strong> Choose Bitcoin (BTC), Ethereum (ETH), or Solana (SOL) at checkout. The exact crypto total is calculated with zero payment surcharges.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">2</span>
                    <p><strong>Transfer Funds:</strong> Scan the QR code or copy the generated deposit address from your wallet.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">3</span>
                    <p><strong>Instant Confirmation:</strong> Once verified on-chain, your order status updates immediately and a receipt with live tracking is generated.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">4</span>
                    <p><strong>24-Hour Delivery:</strong> Dispatched via FedEx Priority Overnight or UPS Next Day Air with direct signature required upon delivery.</p>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </article>

        {/* Discrete Sticky Mobile Purchase Bar */}
        <StickyMobileBar
          productName={product.name}
          priceCents={product.priceCents}
          productId={product._id}
          slug={product.slug}
          imageUrl={product.images[0]?.url}
          brand={product.brand}
        />

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#dcdcdc]">
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
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible no-scrollbar">
              {relatedProducts.map((rel) => (
                <div
                  key={rel._id}
                  className="shrink-0 w-[64vw] max-w-[270px] sm:w-[42vw] md:w-auto md:max-w-none snap-start"
                >
                  <ProductCard product={rel} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
