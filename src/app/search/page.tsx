import type { Metadata } from "next";
import { CatalogError, EmptyState } from "@/components/CatalogStates";
import { ProductGrid } from "@/components/ProductGrid";
import { SiteShell } from "@/components/SiteShell";
import { getProducts } from "@/lib/api";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Search the luxury collection | Northstar / Supply", description: "Search designer brands, fashion, accessories, footwear, and watches." };
async function loadSearch(q: string) { try { return await getProducts(`limit=100&q=${encodeURIComponent(q)}`); } catch { return null; } }
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) { const { q = "" } = await searchParams; const result = await loadSearch(q); if (!result) return <SiteShell><CatalogError /></SiteShell>; return <SiteShell><section className="listing-page"><div className="listing-intro"><p className="eyebrow">Catalog search</p><h1>{q ? `Results for “${q}”` : "Search"}</h1><p>{q ? `${result.items.length} pieces found.` : "Look for a piece by name, brand, or category."}</p></div>{q ? <ProductGrid products={result.items} /> : <EmptyState label="Enter a search above" />}</section></SiteShell>; }
