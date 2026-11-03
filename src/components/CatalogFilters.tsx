"use client";

import Link from "next/link";
import type { Category } from "@/lib/api";
import { LUXURY_BRANDS } from "@/lib/api";

export function CatalogFilters({
  categories,
  activeCategory,
  activeBrand,
}: {
  categories: Category[];
  activeCategory?: string;
  activeBrand?: string;
}) {
  const hasActiveFilters = Boolean(activeCategory || activeBrand);

  return (
    <div className="mb-10 pb-6 border-b border-[#ece8e1]">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 mr-2 shrink-0">
          Discipline:
        </span>
        <Link
          href="/shop"
          className={`px-3.5 py-1.5 text-xs font-medium rounded-xs uppercase tracking-wider shrink-0 transition-colors ${
            !activeCategory
              ? "bg-neutral-950 text-white"
              : "bg-[#f5f4ef] text-neutral-700 hover:bg-[#eae8e1]"
          }`}
          style={!activeCategory ? { color: "#ffffff" } : undefined}
        >
          <span style={!activeCategory ? { color: "#ffffff" } : undefined}>All Pieces</span>
        </Link>
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/category/${category.slug}${activeBrand ? `?brand=${encodeURIComponent(activeBrand)}` : ""}`}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xs uppercase tracking-wider shrink-0 transition-colors ${
              activeCategory === category.slug
                ? "bg-neutral-950 text-white"
                : "bg-[#f5f4ef] text-neutral-700 hover:bg-[#eae8e1]"
            }`}
            style={activeCategory === category.slug ? { color: "#ffffff" } : undefined}
          >
            <span style={activeCategory === category.slug ? { color: "#ffffff" } : undefined}>{category.name}</span>
          </Link>
        ))}
      </div>

      {/* Brand Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 mr-2 shrink-0">
          House:
        </span>
        <Link
          href={activeCategory ? `/category/${activeCategory}` : "/shop"}
          className={`px-3 py-1 text-xs shrink-0 transition-colors ${
            !activeBrand
              ? "text-black font-bold underline underline-offset-4"
              : "text-neutral-500 hover:text-black"
          }`}
        >
          All Houses
        </Link>
        {LUXURY_BRANDS.map((brand) => (
          <Link
            key={brand}
            href={`${activeCategory ? `/category/${activeCategory}` : "/shop"}?brand=${encodeURIComponent(brand)}`}
            className={`px-3 py-1 text-xs shrink-0 transition-colors ${
              activeBrand === brand
                ? "text-black font-bold underline underline-offset-4"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            {brand}
          </Link>
        ))}

        {hasActiveFilters && (
          <Link
            href="/shop"
            className="ml-auto text-xs text-red-600 hover:text-red-700 font-medium shrink-0 pl-4"
          >
            Reset Filters ✕
          </Link>
        )}
      </div>
    </div>
  );
}
