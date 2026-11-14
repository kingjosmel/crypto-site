"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/api";
import { addToCart, openCartDrawer } from "@/lib/cart";

interface ProductPurchasePanelProps {
  product: Product;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const router = useRouter();

  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : [];
  // Default to the first available size if exists
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || "");
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Check product category / type for tailored sizing helpers
  const isBelt =
    product.name.toLowerCase().includes("belt") ||
    product.slug.includes("belt");

  const isFootwear =
    product.categoryId === "660000000000000000000002" ||
    product.name.toLowerCase().includes("loafer") ||
    product.name.toLowerCase().includes("sneaker") ||
    product.name.toLowerCase().includes("boot");

  const isApparel =
    product.categoryId === "660000000000000000000001" ||
    product.name.toLowerCase().includes("jacket") ||
    product.name.toLowerCase().includes("shirt") ||
    product.name.toLowerCase().includes("overcoat") ||
    product.name.toLowerCase().includes("crewneck");

  const mainImage = product.images[0]?.url;

  const handleSelectSize = (sz: string) => {
    setSelectedSize(sz);
  };

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const formattedName =
      selectedSize && selectedSize !== "One Size"
        ? `${product.name} · Size ${selectedSize}`
        : product.name;

    try {
      addToCart({
        productId: product._id,
        slug: product.slug,
        name: formattedName,
        priceCents: product.priceCents,
        imageUrl: mainImage,
        size: selectedSize || undefined,
      });

      setAdded(true);
      setShowToast(true);
      openCartDrawer();

      setTimeout(() => {
        setAdded(false);
        setShowToast(false);
      }, 4000);
    } catch (err) {
      console.error("Cart error:", err);
      setAdded(true);
      setShowToast(true);
      openCartDrawer();
    }
  };

  const handleInstantCryptoBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isNavigating) return;
    setIsNavigating(true);

    const formattedName =
      selectedSize && selectedSize !== "One Size"
        ? `${product.name} · Size ${selectedSize}`
        : product.name;

    try {
      addToCart({
        productId: product._id,
        slug: product.slug,
        name: formattedName,
        priceCents: product.priceCents,
        imageUrl: mainImage,
        size: selectedSize || undefined,
      });
    } catch (err) {
      console.error("Instant checkout cart error:", err);
    }

    const targetUrl = `/checkout?buyNow=${encodeURIComponent(product.slug || product._id)}`;
    router.push(targetUrl);

    setTimeout(() => {
      setIsNavigating(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Size Selection Module */}
      {availableSizes.length > 0 && (
        <div className="bg-[#fafafa] p-4 border border-[#e5e5e5] rounded-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <span>Available Sizing:</span>
              {selectedSize && (
                <span className="text-[#047857] font-semibold font-mono bg-white px-2 py-0.5 border border-[#cccccc] rounded-xs text-[11px]">
                  Selected: {selectedSize}
                </span>
              )}
            </label>

            {/* Size Guide Trigger */}
            <button
              type="button"
              onClick={() => setShowSizeGuide(true)}
              className="text-[11px] font-semibold text-neutral-600 hover:text-black underline cursor-pointer uppercase tracking-wider"
            >
              Size Guide & Fit
            </button>
          </div>

          {/* Sizing Buttons Grid */}
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Select product size">
            {availableSizes.map((sz) => {
              const isSelected = selectedSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleSelectSize(sz)}
                  aria-pressed={isSelected}
                  className={`min-w-[48px] h-11 px-3.5 flex items-center justify-center text-xs font-semibold rounded-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-neutral-950 text-white border-2 border-neutral-950 shadow-xs ring-1 ring-neutral-950"
                      : "bg-white text-neutral-800 border border-[#cccccc] hover:border-black hover:bg-[#f6f5f1]"
                  }`}
                  style={isSelected ? { color: "#ffffff", backgroundColor: "#0f0f0f" } : undefined}
                >
                  <span style={isSelected ? { color: "#ffffff" } : undefined}>{sz}</span>
                </button>
              );
            })}
          </div>

          {/* Contextual size helper hint */}
          <div className="text-[11px] text-neutral-500 pt-1 flex items-center gap-1.5">
            <span className="text-[#10b981] font-bold">✓</span>
            {isBelt && (
              <span>
                Standard European belt sizing in centimeters (e.g. 85 cm fits waist 32 to 34 inches).
              </span>
            )}
            {isFootwear && (
              <span>
                European footwear sizing (EU). True to size fit with calfskin interior lining.
              </span>
            )}
            {isApparel && (
              <span>
                European tailoring cut. Includes original designer size tags and documentation.
              </span>
            )}
            {!isBelt && !isFootwear && !isApparel && (
              <span>
                All pieces are in stock and ready for immediate priority 24-hour dispatch.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons: Add to Bag + Instant Crypto Checkout */}
      <div className="space-y-3" id="main-purchase-cta">
        <button
          type="button"
          onClick={handleAddToBag}
          className="w-full py-4 px-6 bg-neutral-950 hover:bg-neutral-800 active:bg-black text-white text-xs font-semibold uppercase tracking-[0.14em] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer rounded-xs"
          style={{ color: "#ffffff", backgroundColor: added ? "#047857" : "#0f0f0f" }}
          aria-live="polite"
        >
          {added ? (
            <span className="flex items-center gap-2" style={{ color: "#ffffff" }}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Added to Bag {selectedSize && selectedSize !== "One Size" ? `(Size ${selectedSize})` : ""}</span>
            </span>
          ) : (
            <span className="flex items-center gap-2" style={{ color: "#ffffff" }}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>
                Add to Bag {selectedSize && selectedSize !== "One Size" ? `· Size ${selectedSize}` : ""}
              </span>
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={handleInstantCryptoBuy}
          disabled={isNavigating}
          className="w-full py-3.5 px-4 bg-[#e3e3e3] hover:bg-[#d8d8d8] active:bg-[#d4d4d4] text-neutral-900 border border-[#cccccc] text-xs font-semibold uppercase tracking-[0.12em] transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-xs shadow-2xs disabled:opacity-75"
        >
          <span className="font-mono text-[#f7931a] font-bold">₿</span>
          <span className="font-mono text-[#627eea] font-bold">Ξ</span>
          <span className="font-mono text-[#14f195] font-bold">◎</span>
          <span>
            {isNavigating
              ? "Reserving Piece & Loading Checkout..."
              : `Instant Crypto Checkout ${selectedSize && selectedSize !== "One Size" ? `(Size ${selectedSize})` : "(BTC · ETH · SOL)"}`}
          </span>
          <span aria-hidden="true">→</span>
        </button>

        {/* Instant Notification Toast */}
        {showToast && (
          <div className="p-3 bg-[#0f0f0f] text-white border border-[#333] rounded-xs shadow-xl flex items-center justify-between text-xs animate-slide-left">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" />
              <span className="truncate text-neutral-200">
                Added <strong className="text-white">{product.name}</strong> {selectedSize ? `(Size ${selectedSize})` : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openCartDrawer()}
                className="px-2.5 py-1 bg-[#262626] hover:bg-[#333] text-white text-[11px] font-semibold uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                style={{ color: "#ffffff" }}
              >
                View Bag
              </button>
              <button
                type="button"
                onClick={() => router.push(`/checkout?buyNow=${encodeURIComponent(product.slug || product._id)}`)}
                className="px-2.5 py-1 bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-semibold uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                style={{ color: "#ffffff" }}
              >
                Checkout →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sizing Guide Modal */}
      {showSizeGuide && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="bg-white border border-[#d8d4cc] rounded-xs w-full max-w-lg p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#dcdcdc]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#a3702b]">
                  {product.brand} · Archival Sizing Reference
                </span>
                <h3 className="font-serif text-xl text-neutral-950 font-normal">
                  Sizing & Fit Specifications
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {/* Sizing Tables based on category */}
            {isBelt && (
              <div className="space-y-3 text-xs">
                <p className="text-neutral-600 leading-relaxed">
                  Belt size corresponds to the length in centimeters measured from the buckle prong to the middle adjustment hole:
                </p>
                <div className="border border-[#dcdcdc] rounded-xs overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#fafafa] border-b border-[#e5e5e5] text-[11px] font-bold uppercase text-neutral-700">
                      <tr>
                        <th className="p-2.5">Belt Size (cm)</th>
                        <th className="p-2.5">Waist (Inches)</th>
                        <th className="p-2.5">Pants Size (US)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dcdcdc]">
                      <tr><td className="p-2.5 font-mono font-medium">75</td><td className="p-2.5">28 to 30 in</td><td className="p-2.5">28 - 29</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">80</td><td className="p-2.5">30 to 32 in</td><td className="p-2.5">30 - 31</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">85</td><td className="p-2.5">32 to 34 in</td><td className="p-2.5">32 - 33</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">90</td><td className="p-2.5">34 to 36 in</td><td className="p-2.5">34 - 35</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">95</td><td className="p-2.5">36 to 38 in</td><td className="p-2.5">36 - 38</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {isFootwear && (
              <div className="space-y-3 text-xs">
                <p className="text-neutral-600 leading-relaxed">
                  Footwear sizes correspond to European standard sizing (EU). All pairs fit true to size:
                </p>
                <div className="border border-[#dcdcdc] rounded-xs overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#fafafa] border-b border-[#e5e5e5] text-[11px] font-bold uppercase text-neutral-700">
                      <tr>
                        <th className="p-2.5">EU Size</th>
                        <th className="p-2.5">US Men</th>
                        <th className="p-2.5">UK Size</th>
                        <th className="p-2.5">Foot Length</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dcdcdc]">
                      <tr><td className="p-2.5 font-mono font-medium">39</td><td className="p-2.5">6.5</td><td className="p-2.5">5.5</td><td className="p-2.5">25.0 cm</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">40</td><td className="p-2.5">7.5</td><td className="p-2.5">6.5</td><td className="p-2.5">25.5 cm</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">41</td><td className="p-2.5">8.0</td><td className="p-2.5">7.0</td><td className="p-2.5">26.0 cm</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">42</td><td className="p-2.5">9.0</td><td className="p-2.5">8.0</td><td className="p-2.5">27.0 cm</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">43</td><td className="p-2.5">10.0</td><td className="p-2.5">9.0</td><td className="p-2.5">27.5 cm</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">44</td><td className="p-2.5">11.0</td><td className="p-2.5">10.0</td><td className="p-2.5">28.5 cm</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">45</td><td className="p-2.5">12.0</td><td className="p-2.5">11.0</td><td className="p-2.5">29.0 cm</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {isApparel && (
              <div className="space-y-3 text-xs">
                <p className="text-neutral-600 leading-relaxed">
                  Garments follow traditional European sartorial proportions:
                </p>
                <div className="border border-[#dcdcdc] rounded-xs overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#fafafa] border-b border-[#e5e5e5] text-[11px] font-bold uppercase text-neutral-700">
                      <tr>
                        <th className="p-2.5">EU Size</th>
                        <th className="p-2.5">Standard</th>
                        <th className="p-2.5">Chest (Inches)</th>
                        <th className="p-2.5">Waist (Inches)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dcdcdc]">
                      <tr><td className="p-2.5 font-mono font-medium">46</td><td className="p-2.5">S</td><td className="p-2.5">36 in</td><td className="p-2.5">30 in</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">48</td><td className="p-2.5">M</td><td className="p-2.5">38 in</td><td className="p-2.5">32 in</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">50</td><td className="p-2.5">L</td><td className="p-2.5">40 in</td><td className="p-2.5">34 in</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">52</td><td className="p-2.5">XL</td><td className="p-2.5">42 in</td><td className="p-2.5">36 in</td></tr>
                      <tr><td className="p-2.5 font-mono font-medium">54</td><td className="p-2.5">XXL</td><td className="p-2.5">44 in</td><td className="p-2.5">38 in</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!isBelt && !isFootwear && !isApparel && (
              <p className="text-xs text-neutral-600 leading-relaxed">
                Standard dimension specifications are noted directly under the product reference details. All pieces are physical inventory held under controlled conditions.
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-3 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer hover:bg-neutral-800 transition-colors"
              style={{ color: "#ffffff" }}
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
