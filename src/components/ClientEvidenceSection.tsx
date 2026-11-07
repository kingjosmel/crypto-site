"use client";

import React, { useState } from "react";
import Link from "next/link";

export type ClientTestimonial = {
  id: string;
  clientRef: string;
  region: string;
  period: string;
  piece: string;
  category: "Apparel" | "Leathercraft" | "Footwear";
  settlementMethod: string;
  conditionGrade: string;
  quote: string;
};

const TESTIMONIALS: ClientTestimonial[] = [
  {
    id: "REF-2026-PAR",
    clientRef: "Private Collector",
    region: "Paris / London",
    period: "Early 2026",
    piece: "Dior Homme Tailored Cashmere Overcoat",
    category: "Apparel",
    settlementMethod: "Ethereum Vault Escrow",
    conditionGrade: "Unworn / Garment Bag & Tags",
    quote:
      "The wool-cashmere drape and shoulder structure are immaculate. The high-resolution fabric texture photos matched the delivered garment exactly. Settlement via crypto cleared cleanly within minutes.",
  },
  {
    id: "REF-2026-NYC",
    clientRef: "Private Client",
    region: "New York, NY",
    period: "Early 2026",
    piece: "Goyard Saint Louis PM Coated Canvas Tote",
    category: "Leathercraft",
    settlementMethod: "Bitcoin Vault Escrow",
    conditionGrade: "Pristine / Dust Bag & Collateral",
    quote:
      "The Goyardine chevron stenciling and leather trim arrived in flawless museum preservation state. Tracking updates were immediate and delivery was prompt and discreet.",
  },
  {
    id: "REF-2025-ZUR",
    clientRef: "Private Collector",
    region: "Zürich",
    period: "Late 2025",
    piece: "Loro Piana Storm System Cashmere Cardigan",
    category: "Apparel",
    settlementMethod: "Cryptocurrency Escrow",
    conditionGrade: "Unworn / Complete Packaging",
    quote:
      "Rare archive knitwear sourced in unworn condition. Straightforward checkout, swift confirmation on-chain, and secured priority dispatch right to our door.",
  },
  {
    id: "REF-2025-TYO",
    clientRef: "Private Client",
    region: "Tokyo",
    period: "Late 2025",
    piece: "Louis Vuitton Trainer Monogram Sneaker",
    category: "Footwear",
    settlementMethod: "Solana Vault Escrow",
    conditionGrade: "Unworn / Complete Presentation Box",
    quote:
      "Arrived in pristine double-boxed packaging with factory laces, dust covers, and documentation. Authentic, understated service with complete transactional transparency.",
  },
];

export function ClientEvidenceSection() {
  const [filter, setFilter] = useState<"ALL" | "Apparel" | "Leathercraft" | "Footwear">("ALL");

  const filtered = filter === "ALL" ? TESTIMONIALS : TESTIMONIALS.filter((t) => t.category === filter);

  return (
    <section className="py-16 sm:py-24 bg-[#f8f7f4] border-t border-b border-[#ece8e1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
              Client Perspectives &amp; Private Acquisitions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight">
              Verified Acquisitions &amp; Atelier Quality
            </h2>
            <p className="text-sm text-neutral-600 mt-2.5 leading-relaxed">
              Perspectives from private buyers acquiring archival designer outerwear, Goyard leathercraft, and luxury footwear through direct crypto settlement.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xs uppercase tracking-wider transition-colors cursor-pointer ${
                filter === "ALL"
                  ? "bg-neutral-950 text-white"
                  : "bg-white text-neutral-600 border border-[#dedad0] hover:text-black hover:border-neutral-400"
              }`}
              style={filter === "ALL" ? { color: "#ffffff" } : undefined}
            >
              All Pieces
            </button>
            <button
              type="button"
              onClick={() => setFilter("Apparel")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xs uppercase tracking-wider transition-colors cursor-pointer ${
                filter === "Apparel"
                  ? "bg-neutral-950 text-white"
                  : "bg-white text-neutral-600 border border-[#dedad0] hover:text-black hover:border-neutral-400"
              }`}
              style={filter === "Apparel" ? { color: "#ffffff" } : undefined}
            >
              Apparel
            </button>
            <button
              type="button"
              onClick={() => setFilter("Leathercraft")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xs uppercase tracking-wider transition-colors cursor-pointer ${
                filter === "Leathercraft"
                  ? "bg-neutral-950 text-white"
                  : "bg-white text-neutral-600 border border-[#dedad0] hover:text-black hover:border-neutral-400"
              }`}
              style={filter === "Leathercraft" ? { color: "#ffffff" } : undefined}
            >
              Leather Goods
            </button>
            <button
              type="button"
              onClick={() => setFilter("Footwear")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xs uppercase tracking-wider transition-colors cursor-pointer ${
                filter === "Footwear"
                  ? "bg-neutral-950 text-white"
                  : "bg-white text-neutral-600 border border-[#dedad0] hover:text-black hover:border-neutral-400"
              }`}
              style={filter === "Footwear" ? { color: "#ffffff" } : undefined}
            >
              Footwear
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-[#dedad0] rounded-xs p-6 sm:p-7 shadow-xs hover:border-[#b0aaa0] transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Client Ref & Location */}
                <div className="flex items-start justify-between pb-3.5 border-b border-[#f0eee9] gap-3">
                  <div>
                    <span className="font-semibold text-neutral-950 text-sm block">{item.clientRef}</span>
                    <span className="text-xs text-neutral-500">{item.region} · {item.period}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase bg-[#f6f5f0] text-neutral-700 px-2 py-0.5 border border-[#e5e2da] rounded-xs font-medium inline-block">
                      {item.id}
                    </span>
                    <span className="text-[10px] text-[#047857] font-semibold flex items-center justify-end gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      Verified Delivery
                    </span>
                  </div>
                </div>

                {/* Acquired Piece & Condition */}
                <div className="py-3.5">
                  <h3 className="font-serif text-base sm:text-lg font-normal text-neutral-950">
                    {item.piece}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[10.5px]">
                    <span className="px-2 py-0.5 bg-[#faf9f5] text-neutral-800 border border-[#e5e1d8] rounded-xs font-mono">
                      {item.conditionGrade}
                    </span>
                    <span className="text-neutral-500 font-mono">
                      Settled via {item.settlementMethod}
                    </span>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <blockquote className="text-xs sm:text-[13px] text-neutral-700 leading-relaxed italic my-2 pl-3.5 border-l-2 border-[#a3702b]/60">
                  “{item.quote}”
                </blockquote>
              </div>

              {/* Bottom Assurance Note */}
              <div className="pt-3.5 mt-3 border-t border-[#f0eee9] flex items-center justify-between text-[11px] text-neutral-500">
                <span>Inspected &amp; Delivered via Priority Courier</span>
                <span className="text-[10px] font-mono text-neutral-400">Atelier Certification Logged</span>
              </div>
            </article>
          ))}
        </div>

        {/* Client Assurance Note (Understated, No NDA) */}
        <div className="mt-10 sm:mt-12 bg-white border border-[#dedad0] rounded-xs p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#a3702b]" />
              <strong className="text-xs uppercase font-bold tracking-wider text-neutral-950">
                Atelier Guarantee &amp; Secure Custody
              </strong>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every garment, leather bag, and pair of footwear is independently authenticated and graded prior to catalog inclusion. All crypto transactions receive immediate on-chain settlement receipts and dedicated courier dispatch tracking.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
            <Link
              href="/contact"
              className="text-center px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.12em] transition-colors shadow-xs"
              style={{ color: "#ffffff" }}
            >
              Contact Concierge Desk →
            </Link>
            <span className="text-[11px] text-neutral-500 text-center font-mono">
              Inquiries answered Monday through Friday, 9am to 7pm EST
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
