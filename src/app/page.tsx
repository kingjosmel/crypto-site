import Image from "next/image";
import Link from "next/link";
import { CatalogError } from "@/components/CatalogStates";
import { HomeFeaturedShowcase } from "@/components/HomeFeaturedShowcase";
import { SiteShell } from "@/components/SiteShell";
import { getCategories, getProducts, LUXURY_BRANDS } from "@/lib/api";

export const dynamic = "force-dynamic";

async function loadHome() {
  try {
    return await Promise.all([getProducts("limit=100&sort=newest"), getCategories()]);
  } catch {
    return null;
  }
}

export default async function Home() {
  const result = await loadHome();
  if (!result) return <SiteShell><CatalogError /></SiteShell>;
  const [{ items: products }, { items: categories }] = result;

  return (
    <SiteShell>
      {/* 1. Flagship Hero Editorial Campaign */}
      <section className="relative bg-[#f8f7f4] border-b border-[#ece8e1] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-[#8c887e] block mb-3">
                Curated Luxury Archive · 2026 Collection
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-neutral-950 font-normal leading-[1.08] tracking-[-0.03em] mb-6">
                Modern Luxury, Delivered in 24 Hours.
              </h1>

              <p className="text-base text-neutral-600 leading-relaxed max-w-lg mb-8">
                An edited collection of authentic Goyard bags, Prada accessories, Celine leather goods, and fine Italian garments. Guaranteed 24-hour delivery anywhere in the USA with instant crypto checkout.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  href="/shop"
                  className="px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-all shadow-sm rounded-xs"
                  style={{ color: "#ffffff" }}
                >
                  <span style={{ color: "#ffffff" }}>Shop The Collection</span>
                </Link>
                <Link
                  href="/category/belts-wallets-accessories"
                  className="px-7 py-4 bg-white hover:bg-neutral-100 text-neutral-900 border border-[#d6d2c8] text-xs font-semibold uppercase tracking-[0.14em] transition-all rounded-xs"
                >
                  Explore Bags
                </Link>
              </div>

              {/* Quiet Micro Trust Markers */}
              <div className="pt-6 border-t border-[#e6e2da] grid grid-cols-3 gap-4 text-left text-xs">
                <div>
                  <span className="block font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">24h USA Delivery</span>
                  <span className="text-[11px] text-neutral-500">All 50 states</span>
                </div>
                <div>
                  <span className="block font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">100% Authentic</span>
                  <span className="text-[11px] text-neutral-500">Verified & certified</span>
                </div>
                <div>
                  <span className="block font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">Pure Crypto</span>
                  <span className="text-[11px] text-neutral-500">BTC · ETH · SOL</span>
                </div>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-6">
              <div className="relative aspect-4/3 w-full bg-[#edebe4] rounded-xs overflow-hidden border border-[#dedad2] shadow-xl group">
                <Image
                  src="/images/hero_luxury_editorial.jpg"
                  alt="Editorial still life showcasing authentic luxury designer bags, footwear, and tailored garments"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 650px"
                  quality={95}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Strip (Quiet Luxury, 3 Pillars) */}
      <section className="bg-white border-b border-[#ece8e1] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-10 h-10 rounded-xs bg-[#f6f5f2] border border-[#e8e5de] flex items-center justify-center shrink-0 text-sm font-serif font-bold text-neutral-900">
                01
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-900 mb-1">
                  Guaranteed 24-Hour USA Delivery
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  No backorders or waiting weeks. Everything listed is in stock and delivered directly to your door anywhere in the US within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-10 h-10 rounded-xs bg-[#f6f5f2] border border-[#e8e5de] flex items-center justify-center shrink-0 text-sm font-serif font-bold text-neutral-900">
                02
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-900 mb-1">
                  100% Lifetime Authenticity
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Every bag, shoe, and garment is physically inspected by specialists in New York. Includes original packaging, serial tags, and provenance papers.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-10 h-10 rounded-xs bg-[#f6f5f2] border border-[#e8e5de] flex items-center justify-center shrink-0 text-sm font-serif font-bold text-neutral-900">
                03
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-900 mb-1">
                  Instant Crypto Checkout
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Direct on-chain payment via Bitcoin, Ethereum, and Solana. Instant receipt, certificate, and live tracking dispatched straight to your email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Seasonal Showcase (Direct Product Browsing) */}
      <HomeFeaturedShowcase products={products} categories={categories} />

      {/* 4. Editorial Spotlight: Physical Authenticity & Priority Courier */}
      <section className="py-20 bg-[#f7f6f2] border-b border-[#ece8e1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-16/10 rounded-xs overflow-hidden border border-[#dedad2] shadow-sm">
              <Image
                src="/images/editorial_collection_curation.jpg"
                alt="Specialist verifying authentic designer leatherwork and tailoring details"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                quality={95}
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#8c887e] mb-2">
                The Northstar Standard
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight mb-5">
                Authentic Craftsmanship. Zero Waiting.
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                We believe acquiring authentic designer fashion should be instantaneous and transparent. Every piece in our archive is held physically in our facility, verified for stitch precision, RFID microchips, and factory markings, and stored in climate-controlled conditions.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                The moment your cryptocurrency transaction settles, your order is packed in tamper-evident presentation containers and dispatched for guaranteed 24-hour delivery anywhere in the USA.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="px-6 py-3 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors rounded-xs"
                  style={{ color: "#ffffff" }}
                >
                  <span style={{ color: "#ffffff" }}>About Our Process</span>
                </Link>
                <Link
                  href="/shipping"
                  className="px-6 py-3 bg-white text-neutral-900 border border-[#d6d2c8] text-xs font-semibold uppercase tracking-wider hover:bg-neutral-50 transition-colors rounded-xs"
                >
                  24-Hour Delivery Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The Houses: Typographic Brand Roster */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8c887e] block mb-3">
            Featured Houses
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal tracking-tight mb-8">
            Master Leather & Fashion Ateliers
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 max-w-4xl mx-auto">
            {LUXURY_BRANDS.map((brand) => (
              <Link
                key={brand}
                href={`/shop?brand=${encodeURIComponent(brand)}`}
                className="font-serif text-xl sm:text-2xl text-neutral-400 hover:text-black transition-colors px-2 py-1 tracking-tight"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
