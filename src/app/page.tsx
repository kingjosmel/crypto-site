import Image from "next/image";
import Link from "next/link";
import { CatalogError } from "@/components/CatalogStates";
import { ProductGrid } from "@/components/ProductGrid";
import { SiteShell } from "@/components/SiteShell";
import { getCategories, getProducts, LUXURY_BRANDS } from "@/lib/api";

export const dynamic = "force-dynamic";

async function loadHome() {
  try {
    return await Promise.all([getProducts("limit=8&sort=newest"), getCategories()]);
  } catch {
    return null;
  }
}

export default async function Home() {
  const result = await loadHome();
  if (!result) return <SiteShell><CatalogError /></SiteShell>;
  const [{ items: products }] = result;

  return (
    <SiteShell>
      {/* 1. Flagship Hero Campaign */}
      <section className="relative bg-[#f8f7f4] border-b border-[#ece8e1] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b]">
                  2026 Archive Edition
                </span>
                <span className="text-neutral-400">·</span>
                <span className="text-[10px] sm:text-[11px] uppercase font-medium tracking-[0.1em] text-neutral-500">
                  Private Vault Releases
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-neutral-950 font-normal leading-[1.12] sm:leading-[1.08] tracking-[-0.03em] mb-4 sm:mb-6 text-balance">
                The Architecture of Rare Provenance.
              </h1>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg mb-6 sm:mb-8">
                An edited sanctuary of certified Patek Philippe complications, rare Maison Goyard trunks, and fine Italian cashmere—authenticated and dispatched with armored white-glove security.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto text-center px-7 py-3.5 sm:py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-all shadow-sm"
                  style={{ color: "#ffffff" }}
                >
                  <span style={{ color: "#ffffff" }}>Explore Collection</span>
                </Link>
                <Link
                  href="/track"
                  className="w-full sm:w-auto text-center justify-center px-6 py-3.5 sm:py-4 bg-white hover:bg-neutral-100 text-neutral-900 border border-[#d8d4cc] text-xs font-semibold uppercase tracking-[0.14em] transition-all flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  Track Live Order
                </Link>
              </div>

              {/* Bottom Feature Badges */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#e8e4dc] grid grid-cols-3 gap-2 sm:gap-4 text-left">
                <div>
                  <span className="block text-[11px] sm:text-xs font-semibold text-neutral-900 uppercase tracking-wider truncate">Geneva Vault</span>
                  <span className="text-[10px] sm:text-[11px] text-neutral-500 truncate block">Horology Archives</span>
                </div>
                <div>
                  <span className="block text-[11px] sm:text-xs font-semibold text-neutral-900 uppercase tracking-wider truncate">Paris Atelier</span>
                  <span className="text-[10px] sm:text-[11px] text-neutral-500 truncate block">Goyard Leather</span>
                </div>
                <div>
                  <span className="block text-[11px] sm:text-xs font-semibold text-neutral-900 uppercase tracking-wider truncate">Armored Courier</span>
                  <span className="text-[10px] sm:text-[11px] text-neutral-500 truncate block">100% Insured</span>
                </div>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-6">
              <div className="relative aspect-4/3 w-full bg-[#edebe4] rounded-xs overflow-hidden border border-[#e2ded6] shadow-xl group">
                <Image
                  src="/images/hero_luxury_editorial.jpg"
                  alt="Editorial campaign still life showcasing luxury Swiss watch, tailored garments, and fine leather goods"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 650px"
                  quality={95}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Showcase Pill (Shopify style) */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xs border border-[#e0ddd5] shadow-lg flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.15em] text-[#a3702b] block truncate">Featured In Archive</span>
                    <span className="text-xs sm:text-sm font-semibold text-neutral-900 truncate block">Patek Philippe & Goyard</span>
                  </div>
                  <Link
                    href="/shop"
                    className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-[#a3702b] flex items-center gap-1 shrink-0"
                  >
                    View <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shopify Plus 4-Column Trust Strip (2x2 on mobile, 4 columns on desktop) */}
      <section className="bg-white border-b border-[#ece8e1] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xs bg-[#f4f3ef] border border-[#e5e2da] flex items-center justify-center shrink-0 text-sm sm:text-base">
                🛡️
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 leading-tight">100% Provenance</h4>
                <p className="text-[11px] sm:text-[12px] text-neutral-500 mt-0.5 leading-normal line-clamp-2">
                  Microchipped with archive paperwork.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xs bg-[#f4f3ef] border border-[#e5e2da] flex items-center justify-center shrink-0 text-sm sm:text-base">
                🔒
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 leading-tight">Armored Courier</h4>
                <p className="text-[11px] sm:text-[12px] text-neutral-500 mt-0.5 leading-normal line-clamp-2">
                  Tamper-evident insured delivery.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xs bg-[#f4f3ef] border border-[#e5e2da] flex items-center justify-center shrink-0 text-sm sm:text-base">
                ⚡
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 leading-tight">Immediate Escrow</h4>
                <p className="text-[11px] sm:text-[12px] text-neutral-500 mt-0.5 leading-normal line-clamp-2">
                  Settles in BTC, ETH, or SOL.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xs bg-[#f4f3ef] border border-[#e5e2da] flex items-center justify-center shrink-0 text-sm sm:text-base">
                ✉️
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 leading-tight">Guest Checkout</h4>
                <p className="text-[11px] sm:text-[12px] text-neutral-500 mt-0.5 leading-normal line-clamp-2">
                  Tracking dispatched to email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curated Category Tiles (Visual Editorial Banners) */}
      <section className="py-16 bg-[#fbfaf8] border-b border-[#ece8e1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b]">
                Curated Archives
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal mt-1 tracking-tight">
                Explore by Discipline
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-800 hover:text-black border-b border-black pb-0.5 transition-colors"
            >
              Browse All Categories →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Watches */}
            <Link
              href="/category/luxury-watches"
              className="group relative aspect-4/3 sm:aspect-3/4 rounded-xs overflow-hidden border border-[#e4e1d8] shadow-sm block"
            >
              <Image
                src="/images/editorial_atelier.jpg"
                alt="Haute Horlogerie Workshop"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                quality={95}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] block mb-1">
                  Geneva Repository
                </span>
                <h3 className="font-serif text-2xl font-normal tracking-tight">Haute Horlogerie</h3>
                <p className="text-xs text-neutral-300 mt-1">Patek Philippe, Rolex Daytona, Audemars Piguet, Richard Mille</p>
                <span className="inline-block mt-3 text-xs uppercase font-semibold tracking-wider text-white group-hover:translate-x-1 transition-transform">
                  Explore Watches →
                </span>
              </div>
            </Link>

            {/* Card 2: Goyard & Trunks */}
            <Link
              href="/shop?brand=Goyard"
              className="group relative aspect-4/3 sm:aspect-3/4 rounded-xs overflow-hidden border border-[#e4e1d8] shadow-sm block"
            >
              <Image
                src="/images/editorial_collection_curation.jpg"
                alt="Maison Goyard Leathercraft"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                quality={95}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] block mb-1">
                  Parisian Heritage
                </span>
                <h3 className="font-serif text-2xl font-normal tracking-tight">Maison Goyard</h3>
                <p className="text-xs text-neutral-300 mt-1">Saint Louis PM, Saïgon Mini Trunk, Anjou Reversible Tote</p>
                <span className="inline-block mt-3 text-xs uppercase font-semibold tracking-wider text-white group-hover:translate-x-1 transition-transform">
                  Explore Goyard →
                </span>
              </div>
            </Link>

            {/* Card 3: Designer Outerwear */}
            <Link
              href="/category/designer-clothing"
              className="group relative aspect-4/3 sm:aspect-3/4 rounded-xs overflow-hidden border border-[#e4e1d8] shadow-sm block"
            >
              <Image
                src="/images/editorial_white_glove_courier.jpg"
                alt="Luxury Designer Apparel and Cashmere"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                quality={95}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] block mb-1">
                  Milan & Paris Runways
                </span>
                <h3 className="font-serif text-2xl font-normal tracking-tight">Artisanal Outerwear</h3>
                <p className="text-xs text-neutral-300 mt-1">Loro Piana Cashmere, Dior Homme Overcoat, Saint Laurent Leather</p>
                <span className="inline-block mt-3 text-xs uppercase font-semibold tracking-wider text-white group-hover:translate-x-1 transition-transform">
                  Explore Apparel →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Acquisitions Collection Grid */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b]">
                Seasonal Allocations
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal mt-1 tracking-tight">
                Featured Acquisitions
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-900 hover:text-[#a3702b] border-b border-black pb-0.5 transition-colors"
            >
              View All 13 Pieces →
            </Link>
          </div>

          <ProductGrid products={products} />

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-block px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
              style={{ color: "#ffffff" }}
            >
              <span style={{ color: "#ffffff" }}>Explore Full Catalog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Editorial Lookbook & Provenance Spotlight */}
      <section className="py-20 bg-[#f7f6f2] border-t border-b border-[#ece8e1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-16/10 rounded-xs overflow-hidden border border-[#e2ded6] shadow-md">
              <Image
                src="/images/editorial_atelier.jpg"
                alt="Horologist inspecting timepiece movement under loupe"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                quality={95}
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] mb-2">
                The Northstar Protocol
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight mb-5">
                Physical Authenticity. Absolute Discretion.
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                In an era of mass-market reproductions, Northstar maintains private vaults in New York and Geneva. Each mechanical timepiece undergoes a comprehensive 48-hour chronometric rate test, and every Maison Goyard trunk is verified via chevron canvas alignment and microchip scanning.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                When you acquire a piece, it is sealed in tamper-evident armored packaging and dispatched directly to your residence via Malca-Amit or priority armored courier.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/about"
                  className="px-6 py-3 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  style={{ color: "#ffffff" }}
                >
                  <span style={{ color: "#ffffff" }}>Our Verification Standard</span>
                </Link>
                <Link
                  href="/shipping"
                  className="px-6 py-3 bg-white text-neutral-900 border border-[#d6d2c8] text-xs font-semibold uppercase tracking-wider hover:bg-neutral-50 transition-colors"
                >
                  Armored Courier Protocol
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. The Houses / Brand Roster */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8c887e] block mb-3">
            Master Artisan Houses
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal tracking-tight mb-10">
            Represented in the Archive
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 max-w-4xl mx-auto">
            {LUXURY_BRANDS.map((brand) => (
              <Link
                key={brand}
                href={`/shop?brand=${encodeURIComponent(brand)}`}
                className="font-serif text-xl sm:text-2xl text-neutral-400 hover:text-black transition-colors px-2 py-1"
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
