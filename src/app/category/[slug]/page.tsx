import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CatalogError } from "@/components/CatalogStates";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductGrid } from "@/components/ProductGrid";
import { SiteShell } from "@/components/SiteShell";
import { getCategories, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; try { const { items } = await getCategories(); const category = items.find((item) => item.slug === slug); return category ? { title: `${category.name} | Northstar / Supply`, description: category.description, alternates: { canonical: `/category/${slug}` } } : {}; } catch { return {}; } }
async function loadCategory(slug: string, brand?: string) { try { const { items: categories } = await getCategories(); const category = categories.find((item) => item.slug === slug); if (!category) return { kind: "missing" as const }; const { items: products } = await getProducts(`limit=100&category=${category._id}&sort=name${brand ? `&brand=${encodeURIComponent(brand)}` : ""}`); return { kind: "data" as const, category, categories, products }; } catch { return { kind: "error" as const }; } }
export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ brand?: string }> }) { const { slug } = await params; const { brand } = await searchParams; const result = await loadCategory(slug, brand); if (result.kind === "error") return <SiteShell><CatalogError /></SiteShell>; if (result.kind === "missing") notFound(); return <SiteShell><section className="listing-page"><div className="listing-intro"><p className="eyebrow">Category</p><h1>{result.category.name}</h1><p>{result.category.description}</p></div><CatalogFilters categories={result.categories} activeCategory={slug} activeBrand={brand} /><ProductGrid products={result.products} /></section></SiteShell>; }
