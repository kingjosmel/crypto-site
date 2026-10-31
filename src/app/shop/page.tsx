import type { Metadata } from "next";
import { CatalogError } from "@/components/CatalogStates";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductGrid } from "@/components/ProductGrid";
import { SiteShell } from "@/components/SiteShell";
import { getCategories, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Luxury collection | Northstar / Supply", description: "Designer clothing, premium footwear, accessories, and luxury watches." };
async function loadShop(brand?: string) { try { const [{ items: categories }, products] = await Promise.all([getCategories(), getProducts(`limit=100&sort=name${brand ? `&brand=${encodeURIComponent(brand)}` : ""}`)]); return { categories, products }; } catch { return null; } }
export default async function ShopPage({ searchParams }: { searchParams: Promise<{ brand?: string }> }) { const { brand } = await searchParams; const result = await loadShop(brand); if (!result) return <SiteShell><CatalogError /></SiteShell>; return <SiteShell><section className="listing-page"><div className="listing-intro"><p className="eyebrow">The collection</p><h1>{brand || "The edit"}</h1><p>Designer clothing, considered accessories, refined footwear, and exceptional watches.</p></div><CatalogFilters categories={result.categories} activeBrand={brand} /><ProductGrid products={result.products.items} /></section></SiteShell>; }
