import Image from "next/image";
import type { Metadata } from "next";
import { CatalogError } from "@/components/CatalogStates";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductGrid } from "@/components/ProductGrid";
import { SiteShell } from "@/components/SiteShell";
import { getCategories, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "The Archive Collection | Northstar / Supply",
  description: "Certified haute horlogerie, Maison Goyard trunks, and luxury designer apparel.",
};

async function loadShop(brand?: string, condition?: string) {
  try {
    const query = new URLSearchParams({ limit: "100", sort: "name" });
    if (brand) query.set("brand", brand);
    if (condition) query.set("condition", condition);

    const [{ items: categories }, products] = await Promise.all([
      getCategories(),
      getProducts(query.toString()),
    ]);
    return { categories, products };
  } catch {
    return null;
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; condition?: "NEW" | "PRE_OWNED" | "REFURBISHED" }>;
}) {
  const { brand, condition } = await searchParams;
  const result = await loadShop(brand, condition);
  if (!result) return <SiteShell><CatalogError /></SiteShell>;

  const totalCount = result.products.items.length;

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Collection Hero Header */}
        <div className="mb-10 pb-8 border-b border-[#ece8e1]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
                Curated Vault Inventory
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl text-neutral-950 font-normal tracking-tight mb-3">
                {brand ? `${brand} Collection` : condition === "NEW" ? "Unworn Archive (Box & Papers)" : condition === "PRE_OWNED" ? "Pristine Pre-Owned (9.5/10)" : condition === "REFURBISHED" ? "Certified Restored / Overhauled" : "The Complete Archive"}
              </h1>
              <p className="text-sm text-neutral-600 max-w-xl leading-relaxed">
                {brand
                  ? `Authenticated archive acquisitions from ${brand}, including original provenance, dust covers, and factory paperwork.`
                  : "Certified timepieces from Patek Philippe, Rolex, Audemars Piguet, and Richard Mille alongside rare Maison Goyard trunks and tailored Italian cashmere."}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500 font-mono">
                <span>Showing {totalCount} {totalCount === 1 ? "Piece" : "Pieces"}</span>
                <span>·</span>
                <span className="text-[#047857] font-sans font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  All In Stock & Ready for Armored Dispatch
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-16/9 rounded-xs overflow-hidden border border-[#e2ded6] shadow-sm">
              <Image
                src="/images/editorial_collection_curation.jpg"
                alt="Northstar Collection Curation"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
                quality={95}
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <CatalogFilters
          categories={result.categories}
          activeBrand={brand}
          activeCondition={condition}
        />

        {/* Products Grid */}
        <ProductGrid products={result.products.items} />
      </div>
    </SiteShell>
  );
}
