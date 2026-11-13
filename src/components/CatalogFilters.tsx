"use client";

import Link from "next/link";
import type { Category } from "@/lib/api";
import { LUXURY_BRANDS } from "@/lib/api";

type ConditionType = "NEW" | "PRE_OWNED" | "REFURBISHED";

export function CatalogFilters({
  categories,
  activeCategory,
  activeBrand,
  activeCondition,
}: {
  categories: Category[];
  activeCategory?: string;
  activeBrand?: string;
  activeCondition?: ConditionType;
}) {
  const hasActiveFilters = Boolean(activeCategory || activeBrand || activeCondition);

  const buildQuery = (newParams: { brand?: string | null; condition?: string | null }) => {
    const params = new URLSearchParams();
    const brand = newParams.brand !== undefined ? newParams.brand : activeBrand;
    const condition = newParams.condition !== undefined ? newParams.condition : activeCondition;
    if (brand) params.set("brand", brand);
    if (condition) params.set("condition", condition);
    const query = params.toString();
    const basePath = activeCategory ? `/category/${activeCategory}` : "/shop";
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <div className="mb-6 sm:mb-10 pb-5 sm:pb-6 border-b border-[#dcdcdc] space-y-3 sm:space-y-4">
      {/* 1. Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-neutral-600 mr-1 shrink-0">
          Discipline:
        </span>
        <Link
          href={buildQuery({ brand: activeBrand, condition: activeCondition }).replace(/\/category\/[^?]+/, "/shop")}
          className={`px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-xs uppercase tracking-wider shrink-0 transition-colors min-h-[36px] flex items-center ${
            !activeCategory
              ? "bg-neutral-950 text-white"
              : "bg-[#e3e3e3] text-neutral-700 hover:bg-[#d8d8d8]"
          }`}
          style={!activeCategory ? { color: "#ffffff" } : undefined}
        >
          <span style={!activeCategory ? { color: "#ffffff" } : undefined}>All Disciplines</span>
        </Link>
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/category/${category.slug}${activeBrand || activeCondition ? `?${new URLSearchParams({ ...(activeBrand ? { brand: activeBrand } : {}), ...(activeCondition ? { condition: activeCondition } : {}) }).toString()}` : ""}`}
            className={`px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-xs uppercase tracking-wider shrink-0 transition-colors min-h-[36px] flex items-center ${
              activeCategory === category.slug
                ? "bg-neutral-950 text-white"
                : "bg-[#e3e3e3] text-neutral-700 hover:bg-[#d8d8d8]"
            }`}
            style={activeCategory === category.slug ? { color: "#ffffff" } : undefined}
          >
            <span style={activeCategory === category.slug ? { color: "#ffffff" } : undefined}>{category.name}</span>
          </Link>
        ))}
      </div>

      {/* 2. Condition Standard Filter */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-neutral-600 mr-1 shrink-0">
          Condition:
        </span>
        <Link
          href={buildQuery({ condition: null })}
          className={`px-2.5 sm:px-3 py-1 text-xs shrink-0 rounded-xs transition-colors min-h-[32px] flex items-center ${
            !activeCondition
              ? "bg-neutral-900 text-white font-medium"
              : "bg-white border border-[#d4d4d4] text-neutral-600 hover:text-black"
          }`}
          style={!activeCondition ? { color: "#ffffff" } : undefined}
        >
          <span style={!activeCondition ? { color: "#ffffff" } : undefined}>All Grades</span>
        </Link>
        <Link
          href={buildQuery({ condition: "NEW" })}
          className={`px-2.5 sm:px-3 py-1 text-xs shrink-0 rounded-xs transition-colors min-h-[32px] flex items-center gap-1.5 ${
            activeCondition === "NEW"
              ? "bg-neutral-900 text-white font-medium"
              : "bg-white border border-[#d4d4d4] text-neutral-600 hover:text-black"
          }`}
          style={activeCondition === "NEW" ? { color: "#ffffff" } : undefined}
        >
          <span style={activeCondition === "NEW" ? { color: "#ffffff" } : undefined}>Unworn · Complete Set</span>
        </Link>
        <Link
          href={buildQuery({ condition: "PRE_OWNED" })}
          className={`px-2.5 sm:px-3 py-1 text-xs shrink-0 rounded-xs transition-colors min-h-[32px] flex items-center gap-1.5 ${
            activeCondition === "PRE_OWNED"
              ? "bg-neutral-900 text-white font-medium"
              : "bg-white border border-[#d4d4d4] text-neutral-600 hover:text-black"
          }`}
          style={activeCondition === "PRE_OWNED" ? { color: "#ffffff" } : undefined}
        >
          <span style={activeCondition === "PRE_OWNED" ? { color: "#ffffff" } : undefined}>Pristine Pre-Owned (9.5/10)</span>
        </Link>
        <Link
          href={buildQuery({ condition: "REFURBISHED" })}
          className={`px-2.5 sm:px-3 py-1 text-xs shrink-0 rounded-xs transition-colors min-h-[32px] flex items-center gap-1.5 ${
            activeCondition === "REFURBISHED"
              ? "bg-neutral-900 text-white font-medium"
              : "bg-white border border-[#d4d4d4] text-neutral-600 hover:text-black"
          }`}
          style={activeCondition === "REFURBISHED" ? { color: "#ffffff" } : undefined}
        >
          <span style={activeCondition === "REFURBISHED" ? { color: "#ffffff" } : undefined}>Certified Restored / Overhauled</span>
        </Link>
      </div>

      {/* 3. House Filter Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-neutral-600 mr-1 shrink-0">
          House:
        </span>
        <Link
          href={buildQuery({ brand: null })}
          className={`px-2.5 sm:px-3 py-1 text-xs shrink-0 transition-colors min-h-[32px] flex items-center ${
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
            href={buildQuery({ brand })}
            className={`px-2.5 sm:px-3 py-1 text-xs shrink-0 transition-colors min-h-[32px] flex items-center ${
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
            className="ml-auto text-xs text-red-600 hover:text-red-700 font-medium shrink-0 pl-3 py-1 min-h-[32px] flex items-center"
          >
            Reset Filters ✕
          </Link>
        )}
      </div>
    </div>
  );
}
