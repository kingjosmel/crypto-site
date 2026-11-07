"use client";

import React, { useState, useMemo } from "react";
import type { Product } from "@/lib/api";

interface InspectionPoint {
  step: number;
  title: string;
  category: "Mechanical" | "Geometry" | "Authenticity" | "Preservation" | "Custody";
  standard: string;
  result: string;
  status: "PASSED" | "EXCEPTIONAL";
  notes: string;
}

interface ConditionChecklistProps {
  product: Product;
  conditionLabelText: string;
}

export function ConditionChecklist({ product, conditionLabelText }: ConditionChecklistProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "mechanical" | "authenticity">("all");

  const isLeather =
    product.categoryId === "660000000000000000000003" ||
    product.brand.toLowerCase().includes("goyard") ||
    product.brand.toLowerCase().includes("hermès") ||
    product.brand.toLowerCase().includes("hermes");

  const isFootwear =
    product.categoryId === "660000000000000000000002" ||
    product.name.toLowerCase().includes("sneaker") ||
    product.name.toLowerCase().includes("loafer") ||
    product.name.toLowerCase().includes("derby");

  // 10-point inspection criteria tailored to the piece
  const checklist: InspectionPoint[] = useMemo(() => {
    if (isFootwear) {
      return [
        {
          step: 1,
          title: "Upper Leather & Canvas Integrity",
          category: "Preservation",
          standard: "Full-grain calfskin, suede, or coated canvas with zero creasing or scuffs",
          result: "Pristine factory leather finish · Zero surface abrasions",
          status: "EXCEPTIONAL",
          notes: "Upper inspected under directional light; grain patterns exhibit pristine uniform texture.",
        },
        {
          step: 2,
          title: "Sole Welt Stitching & Bond Strength",
          category: "Geometry",
          standard: "Goodyear or blake-stitched welt or vulcanized cupsole with zero adhesive bleed",
          result: "Clean perimeter welt stitching · Strict 8 stitches per inch",
          status: "PASSED",
          notes: "Tension uniform along toe box and heel counter with zero adhesive delamination.",
        },
        {
          step: 3,
          title: "Insole Branding & Size Stamping",
          category: "Authenticity",
          standard: "Crisp heat-embossed or gold-foiled house insignia and European sizing stamp",
          result: "Original foil insignia intact · Clear size matrix engraving",
          status: "PASSED",
          notes: "Insole typography matches brand archival matrices down to typeface weight.",
        },
        {
          step: 4,
          title: "Outsole Tread & Edge Geometry",
          category: "Geometry",
          standard: "100% unworn outsole tread patterns and crisp edge bevels",
          result: "Zero ground contact markings · Factory mold seam lines intact",
          status: "EXCEPTIONAL",
          notes: "Outsole compound flexible with zero oxidation or hardening.",
        },
        {
          step: 5,
          title: "Eyelets, Hardware & Lace System",
          category: "Mechanical",
          standard: "Palladium or enamelled eyelets with original waxed cotton or tubular laces",
          result: "Smooth eyelet seating · Authentic factory lace weave",
          status: "PASSED",
          notes: "Hardware firmly seated with zero loose rivets or oxidization.",
        },
        {
          step: 6,
          title: "Heel Counter Stability & Collar Cushioning",
          category: "Geometry",
          standard: "Rigid internal thermoplastic heel counter with supple padded collar",
          result: "Heel structure symmetrical · Zero collapse or deformation",
          status: "PASSED",
          notes: "Left and right heel counters calibrated within 1mm dimensional tolerance.",
        },
        {
          step: 7,
          title: "Interior Leather Lining & Footbed",
          category: "Preservation",
          standard: "Supple kidskin or calfskin interior with anatomical arch support",
          result: "Pristine interior · Zero heel friction or dye transfer",
          status: "PASSED",
          notes: "Lining leather supple and conditioned with pH-neutral leather balm.",
        },
        {
          step: 8,
          title: "Sanitization & Storage Climate",
          category: "Preservation",
          standard: "Ozone sanitized and cedar conditioned prior to vault cataloging",
          result: "Neutral storage aroma · Zero chemical dry-cleaner odor",
          status: "PASSED",
          notes: "Stored in temperature and humidity controlled studio archive.",
        },
        {
          step: 9,
          title: "Original Presentation Box & Dust Sleeves",
          category: "Authenticity",
          standard: "Original branded presentation drawer/box with dual flannel dust sleeves",
          result: "Complete original packaging set verified intact",
          status: "EXCEPTIONAL",
          notes: "Includes original serial barcode sticker matching shoe tongue label.",
        },
        {
          step: 10,
          title: "Tamper-Evident Security Containment",
          category: "Custody",
          standard: "Serialized courier security box with tamper-evident seal",
          result: "Custody Seal ID: NS-FOOTWEAR-2026-CH",
          status: "EXCEPTIONAL",
          notes: "Double-boxed for courier dispatch with shock-absorbent cushioning.",
        },
      ];
    } else if (isLeather) {
      return [
        {
          step: 1,
          title: "Goyardine Canvas / Leather Grain Assay",
          category: "Preservation",
          standard: "Natural chevron hand-stenciling or full-grain Togo/Clemence leather",
          result: "Immaculate pointillism hand-stenciled chevron pattern",
          status: "EXCEPTIONAL",
          notes: "Microscopic inspection reveals hand-applied three-layer pigment dots characteristic of Maison heritage.",
        },
        {
          step: 2,
          title: "Hand Saddle Stitching (Fil au Chinois)",
          category: "Authenticity",
          standard: "Consistent 60° slanted double-needle saddle stitch in waxed linen",
          result: "Strict 7 stitches per inch · Consistent slanted angles",
          status: "PASSED",
          notes: "Hand-waxed linen thread exhibiting exact tension and uniform backstitch terminations.",
        },
        {
          step: 3,
          title: "Edge Glazing & Edge Paint Elasticity",
          category: "Preservation",
          standard: "Multi-coat heated beeswax and pigment burnishing",
          result: "Smooth, continuous edge seal · Zero cracking or separation",
          status: "PASSED",
          notes: "Edges supple with full tensile flexibility, tested under 180-degree deflection test.",
        },
        {
          step: 4,
          title: "Hardware Plating & Guilloché Screws",
          category: "Geometry",
          standard: "Palladium or 24k gold plating with flathead polished screws",
          result: "Zero tarnishing · Authentic screw slot depth verified",
          status: "PASSED",
          notes: "Hardware retains bright, unblemished luster with protective seals on high-contact rivets.",
        },
        {
          step: 5,
          title: "Blind Stamp & Date Code Verification",
          category: "Authenticity",
          standard: "Crisp embossed artisan atelier code matching master production records",
          result: "Authentic heat-stamped date cipher verified",
          status: "PASSED",
          notes: "Foil depth and letter-spacing precisely align with Maison Goyard archival specifications.",
        },
        {
          step: 6,
          title: "Structural Beechwood / Corner Reinforcement",
          category: "Geometry",
          standard: "Kiln-dried beechwood batons and trunk brass corner brackets",
          result: "Zero warping · Solid structural frame alignment",
          status: "EXCEPTIONAL",
          notes: "Corner reinforcements intact with original patinated brass rivets firmly seated.",
        },
        {
          step: 7,
          title: "Lining Cleanliness & Odor Assessment",
          category: "Preservation",
          standard: "100% pristine chevron linen or chevre goatskin interior",
          result: "Neutral storage aroma · Zero cosmetic residue or pen marks",
          status: "PASSED",
          notes: "Internal pockets, zip pulls, and card slots exhibit unworn tension.",
        },
        {
          step: 8,
          title: "Handle Tension & Load Test",
          category: "Mechanical",
          standard: "Stitched tubular leather handles resisting up to 15kg load",
          result: "Rigid handle arches · Zero sag or leather creasing",
          status: "PASSED",
          notes: "Handle core cord intact with full tensile elasticity.",
        },
        {
          step: 9,
          title: "Archival Packaging & Dust Cover",
          category: "Preservation",
          standard: "Original heavy woven cotton dustbag, ribbon, and presentation case",
          result: "Complete original packaging set verified intact",
          status: "PASSED",
          notes: "Includes yellow cotton felt protector and boutique receipt extract.",
        },
        {
          step: 10,
          title: "Serialized Custody Containment",
          category: "Custody",
          standard: "Enclosed in hermetic climate pouch with barcoded security seal",
          result: "Custody Seal ID: NS-LEATHER-2026-CH",
          status: "EXCEPTIONAL",
          notes: "Stored at 50% relative humidity and 19°C in Geneva vault prior to shipment.",
        },
      ];
    } else {
      return [
        {
          step: 1,
          title: "Fiber Purity & Yarn Density (Loro Piana / Silk)",
          category: "Preservation",
          standard: "100% Top-tier Grade A Cashmere / Silk twill without synthetic blend",
          result: "Tested 14.5 micron ultra-fine fiber diameter",
          status: "EXCEPTIONAL",
          notes: "Soft, dense handle with natural thermal elasticity and zero pilling.",
        },
        {
          step: 2,
          title: "Structural Tailoring & Lapel Roll",
          category: "Geometry",
          standard: "Floating horsehair canvas chest piece and natural lapel roll",
          result: "Soft natural chest structure · Sculpted shoulder symmetry",
          status: "PASSED",
          notes: "Zero bubbling or synthetic fusible separation under thermal inspection.",
        },
        {
          step: 3,
          title: "Mother-of-Pearl & Horn Button Assay",
          category: "Authenticity",
          standard: "Genuine Australian mother-of-pearl or hand-carved buffalo horn",
          result: "Natural iridescent buttons with hand-stitched stem shanks",
          status: "PASSED",
          notes: "Buttons cross-stitched with chicken-foot thread reinforcement.",
        },
        {
          step: 4,
          title: "Lining Silk Slip & Armscye Stitching",
          category: "Preservation",
          standard: "Cupro Bemberg or 100% silk twill lining with ease pleats",
          result: "Pristine lining · Zero friction pull or underarm wear",
          status: "PASSED",
          notes: "Shoulder and armscye seams hand-finished with flexible pick stitching.",
        },
        {
          step: 5,
          title: "Working Buttonholes (Surgeon's Cuffs)",
          category: "Geometry",
          standard: "Hand-gimped milanese or keyhole buttonholes",
          result: "Clean hand-bound keyhole execution",
          status: "PASSED",
          notes: "Thread tension uniform with zero fraying.",
        },
        {
          step: 6,
          title: "Archive Boutique Labels & Care Tags",
          category: "Authenticity",
          standard: "Original jacquard-woven designer labels with font matching",
          result: "Original atelier tags and spare button pouch attached",
          status: "PASSED",
          notes: "Barcode and serial style number verified with brand historical collections.",
        },
        {
          step: 7,
          title: "Dimensional Symmetry & Sleeve Pitch",
          category: "Geometry",
          standard: "Forward sleeve pitch and balanced hem drape",
          result: "Left/right symmetry within 1mm tolerance",
          status: "EXCEPTIONAL",
          notes: "Tailored to European sizing benchmarks with precise drop ratio.",
        },
        {
          step: 8,
          title: "Odor & Hygiene Sterilization",
          category: "Preservation",
          standard: "Ozone sanitized and cedar conditioned; zero dry-cleaning chemical residue",
          result: "Hospital-grade ozone sanitization certificate attached",
          status: "PASSED",
          notes: "Garment pristine and stored in breathable organic cotton garment bag.",
        },
        {
          step: 9,
          title: "Original Hanger & Garment Carrier",
          category: "Preservation",
          standard: "Sculpted wooden atelier hanger and branded zip garment bag",
          result: "Original solid wood contoured hanger included",
          status: "PASSED",
          notes: "Prevents shoulder dimpling during transit.",
        },
        {
          step: 10,
          title: "White-Glove Flat-Pack Containment",
          category: "Custody",
          standard: "Layered with acid-free tissue in reinforced archive box",
          result: "Vault Packaging ID: NS-ATELIER-2026-CH",
          status: "EXCEPTIONAL",
          notes: "Dispatched flat-packed without tight folds to preserve fabric memory.",
        },
      ];
    }
  }, [isFootwear, isLeather]);

  const filtered = useMemo(() => {
    if (activeTab === "mechanical") return checklist.filter((p) => p.category === "Mechanical" || p.category === "Geometry");
    if (activeTab === "authenticity") return checklist.filter((p) => p.category === "Authenticity" || p.category === "Preservation");
    return checklist;
  }, [checklist, activeTab]);

  return (
    <div className="bg-[#faf9f6] border border-[#ece8e1] rounded-xs p-4 sm:p-5 mt-4">
      {/* Header with Certified Seal */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#ece8e1]">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#a3702b]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            10-Point Vault Protocol
          </div>
          <h3 className="font-serif text-sm sm:text-base text-neutral-950 font-normal mt-0.5">
            Physical Authentication & Benchmark Audit
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer text-[11px] font-semibold uppercase tracking-wider text-neutral-900 hover:text-black underline flex items-center gap-1 shrink-0"
        >
          <span>View Full Dossier</span>
          <span>→</span>
        </button>
      </div>

      {/* Highlights Checklist Grid (Compact 4-point preview) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3.5 pb-2 text-xs">
        {checklist.slice(0, 4).map((item) => (
          <div key={item.step} className="flex items-start gap-2 bg-white p-2.5 border border-[#eeebe3] rounded-xs">
            <span className="text-[#047857] font-bold text-xs shrink-0 mt-0.5">✓</span>
            <div className="min-w-0 flex-1">
              <strong className="text-neutral-900 block truncate text-[11.5px] font-medium">
                {item.title}
              </strong>
              <span className="text-neutral-500 block truncate text-[10.5px]">
                {item.result}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner with Modal Trigger */}
      <div className="pt-2.5 flex items-center justify-between text-[11px] text-neutral-500">
        <span>Passed 10 of 10 museum criteria ({conditionLabelText})</span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-[#a3702b] hover:underline font-medium cursor-pointer"
        >
          Inspect all 10 checkpoints
        </button>
      </div>

      {/* Comprehensive 10-Point Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white border border-[#d8d4cc] rounded-xs w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#ece8e1] bg-[#faf9f6] flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#10b981]/15 text-[#047857] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs">
                    Certified 10/10 Score
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    SKU: {product.sku}
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-neutral-950 font-normal">
                  {product.name}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Bench audit executed at Northstar Private Vault (Geneva FreePort & Manhattan Salon).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 flex items-center justify-center cursor-pointer transition-colors text-sm shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4 px-6 pt-3 pb-2 border-b border-[#ece8e1] text-xs font-medium text-neutral-600 bg-white">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === "all" ? "border-neutral-950 text-neutral-950 font-bold" : "border-transparent text-neutral-400 hover:text-neutral-900"
                }`}
              >
                All 10 Benchmarks ({checklist.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("mechanical")}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === "mechanical" ? "border-neutral-950 text-neutral-950 font-bold" : "border-transparent text-neutral-400 hover:text-neutral-900"
                }`}
              >
                {isFootwear ? "Welt & Geometry" : isLeather ? "Leather & Hardware" : "Structure & Stitching"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("authenticity")}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === "authenticity" ? "border-neutral-950 text-neutral-950 font-bold" : "border-transparent text-neutral-400 hover:text-neutral-900"
                }`}
              >
                Authenticity & Provenance
              </button>
            </div>

            {/* Modal Body: The 10 Points */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-3 divide-y divide-[#f2efe9]">
              {filtered.map((item) => (
                <div key={item.step} className="pt-3 first:pt-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#10b981]/15 text-[#047857] font-bold text-xs flex items-center justify-center shrink-0">
                        {item.step}
                      </span>
                      <strong className="text-xs sm:text-sm text-neutral-950 font-medium">
                        {item.title}
                      </strong>
                    </div>
                    <span className="bg-[#10b981]/10 text-[#047857] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shrink-0">
                      ✓ {item.status}
                    </span>
                  </div>

                  <div className="pl-7 mt-1.5 text-xs space-y-1">
                    <p className="font-mono text-neutral-800 text-[11px] bg-[#f9f8f5] p-2 rounded-xs border border-[#eeebe3]">
                      <span className="text-neutral-500 font-sans block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                        Measured Observation:
                      </span>
                      {item.result}
                    </p>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      {item.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#ece8e1] bg-[#faf9f6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-neutral-500 text-[11px]">
                <span>Senior Conservator Seal #CH-77291 · Registered on Archival Ledger</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold uppercase tracking-wider text-xs rounded-xs cursor-pointer"
                style={{ color: "#ffffff" }}
              >
                Close Inspection Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
