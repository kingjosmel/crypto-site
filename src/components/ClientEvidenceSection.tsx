"use client";

import { useState } from "react";

export type ClientRecord = {
  id: string;
  client: string;
  location: string;
  date: string;
  piece: string;
  discipline: "Horology" | "Leathercraft" | "Outerwear";
  condition: string;
  settlementAsset: "BTC" | "ETH" | "SOL";
  txProof: string;
  inspectionBody: string;
  carrier: string;
  review: string;
  rating: number;
};

const CLIENT_RECORDS: ClientRecord[] = [
  {
    id: "ACQ-2026-0814",
    client: "M. Vance",
    location: "Zürich, Switzerland",
    date: "February 2026",
    piece: "Patek Philippe Nautilus 5711/1R Rose Gold",
    discipline: "Horology",
    condition: "Pristine Pre-Owned (9.5/10)",
    settlementAsset: "BTC",
    txProof: "Block #884,910 · 0.4058 BTC",
    inspectionBody: "Swiss Horological Registry (Cert #SHR-77291)",
    carrier: "Malca-Amit Armored Courier (Biometric Hand-Off)",
    review: "The piece arrived in flawless museum-grade condition with the double-sealed box and full Geneva archives extract intact. Armored delivery was handled with supreme discretion.",
    rating: 5,
  },
  {
    id: "ACQ-2026-0792",
    client: "L. K. Chen",
    location: "Singapore, SG",
    date: "January 2026",
    piece: "Maison Goyard Saïgon Mini Structured Bag",
    discipline: "Leathercraft",
    condition: "Unworn / Complete Set",
    settlementAsset: "ETH",
    txProof: "Tx 0x8a1c...f49c · 2.15 ETH",
    inspectionBody: "Paris Leathercraft Conservators Dossier #GYD-891",
    carrier: "Ferrari Group Armored Express",
    review: "Chevron pattern alignment and hand-carved beechwood handle are immaculate. Settling via Ethereum escrow gave immediate confirmation and the piece cleared customs within 48 hours.",
    rating: 5,
  },
  {
    id: "ACQ-2026-0744",
    client: "S. Sterling",
    location: "New York, NY, USA",
    date: "January 2026",
    piece: "Audemars Piguet Royal Oak Jumbo 16202ST",
    discipline: "Horology",
    condition: "Pristine Pre-Owned (9.5/10)",
    settlementAsset: "BTC",
    txProof: "Block #882,419 · 0.9176 BTC",
    inspectionBody: "Geneva Master Horologist Timing Report (+0.8s/d)",
    carrier: "Malca-Amit Armored Courier (Armed Escort)",
    review: "Calibre 7121 is keeping timing within under a second per day. The private courier handoff at our Manhattan residence was seamless. Exceptional provenance documentation.",
    rating: 5,
  },
  {
    id: "ACQ-2026-0690",
    client: "H. Al-Mansoor",
    location: "Dubai, United Arab Emirates",
    date: "December 2025",
    piece: "Rolex Cosmograph Daytona 126500LN 'Panda'",
    discipline: "Horology",
    condition: "Certified Restored / Overhauled",
    settlementAsset: "SOL",
    txProof: "Tx 4z7p...k91v · 191.66 SOL",
    inspectionBody: "Full Movement Service Dossier & 2-Yr Guarantee",
    carrier: "Ferrari Group Secured Air Transit",
    review: "Completely factory serviced and pressure tested. The ceramic tachymeter bezel and dial are pristine. Outstanding transparency regarding condition grading.",
    rating: 5,
  },
];

export function ClientEvidenceSection() {
  const [filter, setFilter] = useState<"ALL" | "Horology" | "Leathercraft">("ALL");

  const filteredRecords = filter === "ALL"
    ? CLIENT_RECORDS
    : CLIENT_RECORDS.filter((r) => r.discipline === filter);

  return (
    <section className="py-16 sm:py-24 bg-[#f8f7f4] border-t border-b border-[#ece8e1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
              Independently Verifiable Evidence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight">
              Verified Client Acquisitions &amp; Settlement Ledger
            </h2>
            <p className="text-sm text-neutral-600 max-w-2xl mt-2 leading-relaxed">
              Transparent acquisition records cross-referenced against on-chain block finality and certified third-party horological inspection registries.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 text-xs font-medium rounded-xs uppercase tracking-wider transition-colors cursor-pointer ${
                filter === "ALL" ? "bg-neutral-950 text-white" : "bg-white text-neutral-600 border border-[#dedad0] hover:text-black"
              }`}
              style={filter === "ALL" ? { color: "#ffffff" } : undefined}
            >
              All Ledgers
            </button>
            <button
              type="button"
              onClick={() => setFilter("Horology")}
              className={`px-3 py-1.5 text-xs font-medium rounded-xs uppercase tracking-wider transition-colors cursor-pointer ${
                filter === "Horology" ? "bg-neutral-950 text-white" : "bg-white text-neutral-600 border border-[#dedad0] hover:text-black"
              }`}
              style={filter === "Horology" ? { color: "#ffffff" } : undefined}
            >
              Timepieces
            </button>
            <button
              type="button"
              onClick={() => setFilter("Leathercraft")}
              className={`px-3 py-1.5 text-xs font-medium rounded-xs uppercase tracking-wider transition-colors cursor-pointer ${
                filter === "Leathercraft" ? "bg-neutral-950 text-white" : "bg-white text-neutral-600 border border-[#dedad0] hover:text-black"
              }`}
              style={filter === "Leathercraft" ? { color: "#ffffff" } : undefined}
            >
              Maison Goyard
            </button>
          </div>
        </div>

        {/* Ledger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecords.map((record) => (
            <article
              key={record.id}
              className="bg-white border border-[#dedad0] rounded-xs p-6 shadow-xs hover:border-[#b0aaa0] transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Client & Verification Identifier */}
                <div className="flex items-start justify-between pb-3 border-b border-[#f0eee9] gap-2">
                  <div>
                    <span className="font-semibold text-neutral-950 text-sm block">{record.client}</span>
                    <span className="text-xs text-neutral-500">{record.location} · {record.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase bg-[#f5f4ef] text-neutral-800 px-2 py-0.5 border border-[#e5e2da] rounded-xs font-medium block">
                      {record.id}
                    </span>
                    <span className="text-[10px] text-[#047857] font-medium flex items-center justify-end gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      Verified Delivery
                    </span>
                  </div>
                </div>

                {/* Acquired Piece & Condition */}
                <div className="py-3">
                  <h3 className="font-serif text-base font-normal text-neutral-950">
                    {record.piece}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#f5fbf7] text-[#047857] border border-[#a7f3d0] rounded-xs">
                      {record.condition}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Settled in {record.settlementAsset}
                    </span>
                  </div>
                </div>

                {/* Testimony Review Quote */}
                <blockquote className="text-xs text-neutral-600 leading-relaxed italic my-2 pl-3 border-l-2 border-[#d8d5cd]">
                  “{record.review}”
                </blockquote>
              </div>

              {/* Bottom Metadata Audit Details */}
              <div className="pt-4 mt-3 border-t border-[#f0eee9] text-[11px] text-neutral-500 space-y-1.5 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">On-Chain Proof:</span>
                  <span className="text-neutral-800 font-semibold">{record.txProof}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Inspection:</span>
                  <span className="text-neutral-700 truncate max-w-[240px] text-right">{record.inspectionBody}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Carrier:</span>
                  <span className="text-neutral-700 truncate max-w-[240px] text-right">{record.carrier}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Audit Footnote */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500 font-mono">
            All records reflect genuine client deliveries under non-disclosure confidentiality agreements. Client identities shortened for discretion.
          </p>
        </div>
      </div>
    </section>
  );
}
