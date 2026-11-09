"use client";

import { useState } from "react";

const CHECKLIST_ITEMS = [
  { id: 1, title: "Stitching & Seam Alignment", detail: "Checked for consistent stitch per inch density, precise thread tension, and zero loose loops." },
  { id: 2, title: "Hardware & Engravings", detail: "Inspected for smooth snap action, correct weight, sharp typography, and lack of corrosion." },
  { id: 3, title: "Leather Grain & Edge Glazing", detail: "Evaluated for suppleness, natural grain texture, and uncracked artisan edge finish." },
  { id: 4, title: "Serial Stamp & Date Code", detail: "Audited against historical house font libraries and seasonal manufacturer registries." },
  { id: 5, title: "RFID & NFC Microchip Scan", detail: "Cryptographic confirmation of genuine house authorization tag embedded in the piece." },
  { id: 6, title: "Interior Lining & Hygiene", detail: "Spotless pockets, pristine microfibre or cupro linings, and zero residue or cosmetic marks." },
  { id: 7, title: "Structural Silhouette Hold", detail: "Examined on flat surface to verify unwarped symmetry and proper architected structure." },
  { id: 8, title: "Zippers & Clasp Mechanisms", detail: "Smooth glide test along all teeth under tension with verified branded pullers." },
  { id: 9, title: "Odor & Storage Environment", detail: "Certified stored in temperature- and humidity-controlled, smoke-free conditions." },
  { id: 10, title: "Original Packaging & Provenance", detail: "Includes original designer box, dust bag, tissue, and authenticity certificates." },
];

export function ConditionChecklist({ brand, sku }: { brand: string; sku: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#ece8e1] rounded-xs bg-white overflow-hidden my-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-[#faf9f6] transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#10b981]/15 text-[#047857] flex items-center justify-center font-bold text-xs">
            ✓
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              10-Point Condition & Authenticity Checklist
            </h3>
            <span className="text-[11px] text-neutral-500 font-mono">
              All 10 points passed verification · SKU: {sku}
            </span>
          </div>
        </div>
        <span className="text-xs text-[#a3702b] font-semibold uppercase tracking-wider flex items-center gap-1">
          <span>{isOpen ? "Hide Checklist" : "View Breakdown"}</span>
          <span className={`transform transition-transform text-neutral-400 ${isOpen ? "rotate-180" : ""}`}>↓</span>
        </span>
      </button>

      {isOpen && (
        <div className="p-4 pt-2 border-t border-[#ece8e1] bg-[#faf9f6] space-y-2.5">
          <p className="text-[11px] text-neutral-600 mb-3">
            Every {brand} item is physically graded and verified by our specialists in New York before listing. High-resolution inspection photos of any point can be provided upon request prior to checkout.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {CHECKLIST_ITEMS.map((item) => (
              <div key={item.id} className="p-2.5 bg-white border border-[#ece8e1] rounded-xs flex items-start gap-2">
                <span className="text-[#047857] font-bold text-xs shrink-0 mt-0.5">✓</span>
                <div>
                  <strong className="text-neutral-900 text-xs block font-medium">
                    {item.id}. {item.title}
                  </strong>
                  <span className="text-[11px] text-neutral-500 leading-tight block mt-0.5">
                    {item.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
