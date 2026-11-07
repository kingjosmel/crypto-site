import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { conditionDetails, conditionLabel, formatPrice, getProduct, getProducts, getShippingCarrierDetails, type Product } from "@/lib/api";
import { SiteShell } from "@/components/SiteShell";
import { AddToCartButton, InstantCryptoCheckoutButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { MultiAngleGallery } from "@/components/MultiAngleGallery";
import { ConditionChecklist } from "@/components/ConditionChecklist";
import { StickyMobileBuyBar } from "@/components/StickyMobileBuyBar";

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-24 lg:pb-12">
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
          {/* Left Column: Multi-Angle Interactive Gallery & Condition Dossier */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <MultiAngleGallery
              product={product}
              conditionLabelText={conditionLabel(product.condition)}
            />

            {/* Interactive 10-Point Vault Inspection Checklist */}
            <ConditionChecklist
              product={product}
              conditionLabelText={conditionLabel(product.condition)}
            />
          </div>

          {/* Right Column: Sticky Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col justify-between">
            <div className="pb-6 border-b border-[#ece8e1]">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
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
                  USD · Direct On-Chain Settlement
                </span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 bg-[#f7f6f2] border border-[#ece8e1] px-3.5 py-2.5 rounded-xs mb-6">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span>Available for Immediate Allocation · Vault Stored & Authenticated</span>
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
              <div id="main-purchase-cta" className="space-y-3 mb-6">
                <AddToCartButton
                  item={{
                    productId: product._id,
                    slug: product.slug,
                    name: product.name,
                    priceCents: product.priceCents,
                    imageUrl: product.images[0]?.url,
                  }}
                  className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                />

                <InstantCryptoCheckoutButton
                  item={{
                    productId: product._id,
                    slug: product.slug,
                    name: product.name,
                    priceCents: product.priceCents,
                    imageUrl: product.images[0]?.url,
                  }}
                  className="w-full py-3.5 px-4 bg-[#f4f3ef] hover:bg-[#e8e6e0] text-neutral-900 border border-[#d8d5cd] text-xs font-semibold uppercase tracking-[0.12em] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                />
              </div>

              {/* Restrained Condition & Carrier Matrix Dossier */}
              {(() => {
                const condInfo = conditionDetails(product.condition);
                const shippingInfo = getShippingCarrierDetails();
                return (
                  <div className="bg-[#faf9f6] p-4 sm:p-5 border border-[#ece8e1] rounded-xs space-y-3 text-xs text-neutral-700">
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-neutral-950 block">{condInfo.title}</span>
                        <p className="text-neutral-500 mt-0.5 leading-relaxed">{condInfo.definition}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 pt-2.5 border-t border-[#f0eee9]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-neutral-950 block">{shippingInfo.tier}: {shippingInfo.carriers}</span>
                        <p className="text-neutral-500 mt-0.5 leading-relaxed">{shippingInfo.features[0]} · {shippingInfo.transitTime}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Accordion / Specifications Details */}
            <div className="divide-y divide-[#ece8e1] text-xs pt-2">
              <details className="py-4 group" open>
                <summary className="font-semibold uppercase tracking-wider text-neutral-900 cursor-pointer flex justify-between items-center list-none">
                  <span>Condition Report & Provenance Dossier</span>
                  <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-3 text-neutral-600 leading-relaxed space-y-2.5">
                  <p>{product.description}</p>
                  <div className="bg-white p-3 border border-[#ece8e1] rounded-xs space-y-1.5 text-[11.5px]">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Condition Grade:</span>
                      <strong className="text-neutral-900">{conditionLabel(product.condition)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Box & Documentation:</span>
                      <strong className="text-neutral-900">{product.authenticity || "Original presentation box & archive documents"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Warranty Coverage:</span>
                      <strong className="text-neutral-900">{product.warranty || "Northstar Archival Craftsmanship Guarantee"}</strong>
                    </div>
                  </div>
                </div>
              </details>

              <details className="py-4 group">
                <summary className="font-semibold uppercase tracking-wider text-neutral-900 cursor-pointer flex justify-between items-center list-none">
                  <span>Specifications & Reference Data</span>
                  <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
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
                  <span>Secured Courier Logistics & Inspection</span>
                  <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                {(() => {
                  const shippingInfo = getShippingCarrierDetails(product.priceCents, product.categoryId);
                  return (
                    <div className="mt-3 text-neutral-600 leading-relaxed space-y-2">
                      <p>
                        This acquisition is classified under <strong>{shippingInfo.tier}</strong> and routed through <strong>{shippingInfo.carriers}</strong>.
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-neutral-500">
                        {shippingInfo.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                      <p className="text-[11px] text-neutral-500 pt-1">
                        Adult signature and photo identification are required at physical handoff. Dispatched with serialized tamper-evident sealing.
                      </p>
                    </div>
                  );
                })()}
              </details>
            </div>
          </div>
        </article>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-[#ece8e1]">
            <div className="flex justify-between items-end mb-6 sm:mb-8">
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b]">
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
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Buy Bar (Appears when scrolling past main CTA) */}
      <StickyMobileBuyBar product={product} triggerId="main-purchase-cta" />
    </SiteShell>
  );
}
