import Link from "next/link";
import type { Category } from "@/lib/api";
import { LUXURY_BRANDS } from "@/lib/api";

export function CatalogFilters({ categories, activeCategory, activeBrand }: { categories: Category[]; activeCategory?: string; activeBrand?: string }) {
  return <div className="catalog-filters"><div><span className="filter-label">Category</span><div className="filter-options"><Link className={!activeCategory ? "active" : ""} href="/shop">All</Link>{categories.map((category) => <Link className={activeCategory === category.slug ? "active" : ""} href={`/category/${category.slug}`} key={category._id}>{category.name}</Link>)}</div></div><div><span className="filter-label">Brand</span><div className="filter-options"><Link className={!activeBrand ? "active" : ""} href={activeCategory ? `/category/${activeCategory}` : "/shop"}>All</Link>{LUXURY_BRANDS.map((brand) => <Link className={activeBrand === brand ? "active" : ""} href={`${activeCategory ? `/category/${activeCategory}` : "/shop"}?brand=${encodeURIComponent(brand)}`} key={brand}>{brand}</Link>)}</div></div></div>;
}
