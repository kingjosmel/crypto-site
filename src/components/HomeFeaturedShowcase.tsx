"use client";

import { useState } from "react";
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

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.categoryId === selectedCategory);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#ece8e1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#8c887e] block mb-2">
              Current Allocation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight">
              Featured Pieces
            </h2>
          </div>

          {/* Interactive Segmented Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-xs cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "bg-[#f5f4ef] text-neutral-700 hover:bg-[#eae8e1]"
              }`}
              style={selectedCategory === "all" ? { color: "#ffffff" } : undefined}
            >
              <span style={selectedCategory === "all" ? { color: "#ffffff" } : undefined}>All Pieces ({products.length})</span>
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat._id).length;
              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-xs cursor-pointer ${
                    selectedCategory === cat._id
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "bg-[#f5f4ef] text-neutral-700 hover:bg-[#eae8e1]"
                  }`}
                  style={selectedCategory === cat._id ? { color: "#ffffff" } : undefined}
                >
                  <span style={selectedCategory === cat._id ? { color: "#ffffff" } : undefined}>
                    {cat.name} ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Bottom CTA to Shop */}
        <div className="text-center mt-12 pt-6 border-t border-[#f2f0ec]">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors shadow-sm rounded-xs"
            style={{ color: "#ffffff" }}
          >
            <span style={{ color: "#ffffff" }}>Explore Complete Archive ({products.length} Items)</span>
            <span aria-hidden="true" style={{ color: "#ffffff" }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
