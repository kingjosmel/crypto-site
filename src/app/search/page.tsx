import Image from "next/image";
import type { Metadata } from "next";
import { CatalogError, EmptyState } from "@/components/CatalogStates";
import { ProductGrid } from "@/components/ProductGrid";
import { SiteShell } from "@/components/SiteShell";
import { getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Search the Archive | Northstar / Supply",
  description: "Search designer outerwear, Goyard leathercraft, and luxury footwear.",
};

async function loadSearch(q: string) {
  try {
    return await getProducts(`limit=100&q=${encodeURIComponent(q)}`);
  } catch {
    return null;
  }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const result = await loadSearch(q);
  if (!result) return <SiteShell><CatalogError /></SiteShell>;

  const totalCount = result.items.length;

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Search Header Banner */}
        <div className="mb-10 pb-8 border-b border-[#ece8e1]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
                Catalog Archive Search
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight mb-3">
                {q ? `Search: “${q}”` : "Search The Archive"}
              </h1>
              <p className="text-sm text-neutral-600 max-w-xl leading-relaxed mb-6">
                {q
                  ? `Found ${totalCount} ${totalCount === 1 ? "acquisition matching" : "acquisitions matching"} your query across outerwear, leather goods, and footwear.`
                  : "Search our archive inventory by brand (e.g. Goyard, Dior, Gucci, Louis Vuitton) or garment style."}
              </p>

              {/* In-page Search Bar */}
              <form action="/search" method="GET" className="flex flex-col sm:flex-row max-w-md gap-2">
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search Goyard, Dior, Louis Vuitton, Cashmere…"
                  className="bg-white border border-[#d6d2c8] px-4 py-3 text-base sm:text-xs rounded-xs flex-1 focus:outline-none focus:border-black transition-colors min-h-[44px]"
                />
                <button
                  type="submit"
                  className="bg-neutral-950 text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors min-h-[44px] flex items-center justify-center"
                  style={{ color: "#ffffff" }}
                >
                  <span style={{ color: "#ffffff" }}>Search</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 relative aspect-16/9 rounded-xs overflow-hidden border border-[#e2ded6] shadow-sm">
              <Image
                src="/images/editorial_collection_curation.jpg"
                alt="Search the luxury fashion, leather goods and footwear collection"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
                quality={95}
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {q ? (
          result.items.length > 0 ? (
            <ProductGrid products={result.items} />
          ) : (
            <EmptyState label={`No archive pieces matched “${q}”. Try searching for “Goyard”, “Dior”, “Louis Vuitton”, or “Cashmere”.`} />
          )
        ) : (
          <EmptyState label="Enter a designer house, leather style, or footwear name above." />
        )}
      </div>
    </SiteShell>
  );
}
