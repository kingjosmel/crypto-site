import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CatalogError } from "@/components/CatalogStates";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductGrid } from "@/components/ProductGrid";
import { SiteShell } from "@/components/SiteShell";
import { getCategories, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

const categoryImages: Record<string, { url: string; alt: string }> = {
  "designer-clothing": {
    url: "/images/product_dior_overcoat.jpg",
    alt: "Designer luxury tailored coats, knitwear, and evening apparel",
  },
  "luxury-shoes-and-sneakers": {
    url: "/images/product_lv_trainer.jpg",
    alt: "Luxury footwear, formal shoes, and designer sneakers",
  },
  "bags-and-leather-goods": {
    url: "/images/product_goyard_saint_louis.jpg",
    alt: "Designer Goyard totes, Louis Vuitton luggage, and fine leather goods",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { items } = await getCategories();
    const category = items.find((item) => item.slug === slug);
    return category
      ? {
          title: `${category.name} | Northstar / Supply`,
          description: category.description,
          alternates: { canonical: `/category/${slug}` },
        }
      : {};
  } catch {
    return {};
  }
}

async function loadCategory(slug: string, brand?: string, condition?: "NEW" | "PRE_OWNED" | "REFURBISHED") {
  try {
    const { items: categories } = await getCategories();
    const category = categories.find((item) => item.slug === slug);
    if (!category) return { kind: "missing" as const };
    const query = new URLSearchParams({ limit: "100", category: category._id, sort: "name" });
    if (brand) query.set("brand", brand);
    if (condition) query.set("condition", condition);

    const { items: products } = await getProducts(query.toString());
    return { kind: "data" as const, category, categories, products };
  } catch {
    return { kind: "error" as const };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ brand?: string; condition?: "NEW" | "PRE_OWNED" | "REFURBISHED" }>;
}) {
  const { slug } = await params;
  const { brand, condition } = await searchParams;
  const result = await loadCategory(slug, brand, condition);
  if (result.kind === "error") return <SiteShell><CatalogError /></SiteShell>;
  if (result.kind === "missing") notFound();

  const heroVisual = categoryImages[slug] ?? {
    url: "/images/hero_luxury_editorial.jpg",
    alt: `${result.category.name} collection`,
  };

  const totalCount = result.products.length;

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Category Hero Banner */}
        <div className="mb-10 pb-8 border-b border-[#ece8e1]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
                Department Archive
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-950 font-normal tracking-tight mb-3">
                {result.category.name}
              </h1>
              <p className="text-sm text-neutral-600 max-w-xl leading-relaxed">
                {result.category.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500 font-mono">
                <span>{totalCount} {totalCount === 1 ? "Acquisition" : "Acquisitions"} Available</span>
                <span>·</span>
                <span className="text-[#047857] font-sans font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  White-Glove Insured Courier
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-16/9 rounded-xs overflow-hidden border border-[#e2ded6] shadow-sm">
              <Image
                src={heroVisual.url}
                alt={heroVisual.alt}
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
          activeCategory={slug}
          activeBrand={brand}
          activeCondition={condition}
        />

        {/* Product Grid */}
        <ProductGrid products={result.products} />
      </div>
    </SiteShell>
  );
}
