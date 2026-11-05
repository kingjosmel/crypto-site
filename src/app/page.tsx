import Image from "next/image";
import Link from "next/link";
import { CatalogError } from "@/components/CatalogStates";
import { ProductGrid } from "@/components/ProductGrid";
import { SiteShell } from "@/components/SiteShell";
import { ClientEvidenceSection } from "@/components/ClientEvidenceSection";
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
      {/* 1. Flagship Hero Campaign — Restrained Luxury & Confident Typography */}
      <section className="relative bg-[#f8f7f4] border-b border-[#ece8e1] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b]">
                  2026 Archive Edition
                </span>
                <span className="text-neutral-400">·</span>
                <span className="text-[10px] sm:text-[11px] uppercase font-medium tracking-[0.1em] text-neutral-500">
                  Geneva · New York · Paris
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-neutral-950 font-normal leading-[1.12] sm:leading-[1.08] tracking-[-0.03em] mb-4 sm:mb-6 text-balance">
                The Architecture of Rare Provenance.
              </h1>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg mb-8">
                An archival sanctuary of certified Swiss horology, historic Maison Goyard trunks, and tailored garments—authenticated under strict museum standards and dispatched under bonded white-glove custody.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-all shadow-sm"
                  style={{ color: "#ffffff" }}
                >
                  <span style={{ color: "#ffffff" }}>Explore Collection</span>
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto text-center px-7 py-4 bg-white hover:bg-neutral-50 text-neutral-900 border border-[#d8d4cc] text-xs font-semibold uppercase tracking-[0.14em] transition-all"
                >
                  Corporate Identity
                </Link>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-6">
              <div className="relative aspect-4/3 w-full bg-[#edebe4] rounded-xs overflow-hidden border border-[#e2ded6] shadow-xl group">
                <Image
                  src="/images/hero_luxury_editorial.jpg"
                  alt="Editorial still life showcasing luxury Swiss watch, tailored garments, and fine leather goods"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 650px"
                  quality={95}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Showcase Pill */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xs border border-[#e0ddd5] shadow-lg flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.15em] text-[#a3702b] block truncate">
                      Private Vault Selection
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-neutral-950 truncate block">
                      Patek Philippe Nautilus &amp; Maison Goyard
                    </span>
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

      {/* 2. Curated Disciplines */}
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
                <p className="text-xs text-neutral-300 mt-1">Patek Philippe, Rolex Cosmograph, Audemars Piguet, Richard Mille</p>
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
                  Milan &amp; Paris Runways
                </span>
                <h3 className="font-serif text-2xl font-normal tracking-tight">Artisanal Outerwear</h3>
                <p className="text-xs text-neutral-300 mt-1">Loro Piana Cashmere, Dior Homme Tailoring, Saint Laurent Leather</p>
                <span className="inline-block mt-3 text-xs uppercase font-semibold tracking-wider text-white group-hover:translate-x-1 transition-transform">
                  Explore Apparel →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Acquisitions Collection Grid */}
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
              View All Pieces →
            </Link>
          </div>

          <ProductGrid products={products} />

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-block px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
              style={{ color: "#ffffff" }}
            >
              <span style={{ color: "#ffffff" }}>Explore Complete Archive</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Single Consolidated Verification & Provenance Section (Luxury Restraint) */}
      <section className="py-16 sm:py-24 bg-[#faf9f6] border-t border-b border-[#ece8e1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
              The Northstar Protocol
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight mb-4">
              Provenance, Technical Verification &amp; Custody
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              We communicate confidence through institutional rigor rather than marketing claims. Every acquisition follows our documented three-pillar protocol governing condition taxonomy, horological diagnostics, and bonded courier transport.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white border border-[#dedad0] rounded-xs p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  Protocol Pillar I
                </span>
                <h3 className="font-serif text-xl text-neutral-950 font-normal mb-3">
                  Tri-Tier Condition Taxonomy
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  Every catalog piece is strictly designated as <strong>Unworn / Complete Set</strong>, <strong>Pristine Pre-Owned (9.5/10)</strong>, or <strong>Certified Restored / Overhauled</strong>. Box, papers, and factory serial matching are documented in an individual provenance dossier.
                </p>
              </div>
              <Link
                href="/warranty"
                className="text-xs font-semibold text-neutral-900 underline hover:text-[#a3702b] pt-3 border-t border-[#f0eee9]"
              >
                Review Condition Standards →
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white border border-[#dedad0] rounded-xs p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  Protocol Pillar II
                </span>
                <h3 className="font-serif text-xl text-neutral-950 font-normal mb-3">
                  Chronometric &amp; Material Analysis
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  Timepieces undergo 48-hour 5-position testing on electronic Witschi chronocomparators to verify COSC rate tolerances (+/- 2 sec/day). Archival leather is authenticated via chevron screen alignment, hand-stitching tension, and microchip interrogation.
                </p>
              </div>
              <Link
                href="/about"
                className="text-xs font-semibold text-neutral-900 underline hover:text-[#a3702b] pt-3 border-t border-[#f0eee9]"
              >
                Geneva Laboratory Details →
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white border border-[#dedad0] rounded-xs p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  Protocol Pillar III
                </span>
                <h3 className="font-serif text-xl text-neutral-950 font-normal mb-3">
                  Transparent Carrier Routing
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  Pieces &gt; $10k USD travel via <strong>Ferrari Group or Malca-Amit</strong> armored vehicles with dual armed security escorts and biometric handoff. Ready-to-wear &lt; $10k USD ships via <strong>FedEx International Priority</strong> in tamper-evident unbranded packaging.
                </p>
              </div>
              <Link
                href="/shipping"
                className="text-xs font-semibold text-neutral-900 underline hover:text-[#a3702b] pt-3 border-t border-[#f0eee9]"
              >
                Carrier Assignment Matrix →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Independently Verifiable Client Evidence & Settlement Ledger */}
      <ClientEvidenceSection />

      {/* 6. The Houses / Brand Roster */}
      <section className="py-16 sm:py-20 bg-white">
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
