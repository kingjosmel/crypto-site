"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import type { Category, Product } from "@/lib/api";

export function HomeFeaturedShowcase({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const railRef = useRef<HTMLDivElement>(null);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    if (railRef.current) {
      railRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.categoryId === selectedCategory);

  return (
    <section className="py-14 sm:py-24 bg-white border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-5">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#6b6b6b] block mb-2">
              Current Allocation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight">
              Featured Pieces
            </h2>
          </div>

          {/* Interactive Segmented Filter Controls (horizontal scroll on mobile, wrap on desktop) */}
          <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:flex-wrap">
            <button
              type="button"
              onClick={() => handleSelectCategory("all")}
              className={`shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-xs cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "bg-white border border-[#d4d4d4] text-neutral-700 hover:bg-[#fafafa]"
              }`}
              style={selectedCategory === "all" ? { color: "#ffffff" } : undefined}
            >
              <span style={selectedCategory === "all" ? { color: "#ffffff" } : undefined}>All Pieces</span>
            </button>
            {categories.map((cat) => {
              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => handleSelectCategory(cat._id)}
                  className={`shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-xs cursor-pointer ${
                    selectedCategory === cat._id
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "bg-white border border-[#d4d4d4] text-neutral-700 hover:bg-[#fafafa]"
                  }`}
                  style={selectedCategory === cat._id ? { color: "#ffffff" } : undefined}
                >
                  <span style={selectedCategory === cat._id ? { color: "#ffffff" } : undefined}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Horizontal Carousel (Farfetch style) + Desktop 3/4-Column Grid */}
        <div
          ref={railRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 md:overflow-visible no-scrollbar"
        >
          {filteredProducts.slice(0, 12).map((product) => (
            <div
              key={product._id}
              className="shrink-0 w-[64vw] max-w-[270px] sm:w-[42vw] md:w-auto md:max-w-none snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Bottom CTA to Shop */}
        <div className="text-center mt-10 md:mt-12 pt-6 border-t border-[#e2e2e2]">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors shadow-sm rounded-xs"
            style={{ color: "#ffffff" }}
          >
            <span style={{ color: "#ffffff" }}>Explore Complete Archive</span>
            <span aria-hidden="true" style={{ color: "#ffffff" }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
