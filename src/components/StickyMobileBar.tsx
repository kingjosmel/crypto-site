"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/api";
import { addToCart } from "@/lib/cart";
import { useRouter } from "next/navigation";

interface StickyMobileBarProps {
  productName: string;
  priceCents: number;
  productId: string;
  slug: string;
  imageUrl?: string;
  brand: string;
}

export function StickyMobileBar({
  productName,
  priceCents,
  productId,
  slug,
  imageUrl,
  brand,
}: StickyMobileBarProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find the main CTA button on the page
      const mainCta = document.getElementById("main-purchase-cta");
      if (mainCta) {
        const rect = mainCta.getBoundingClientRect();
        // If bottom of main CTA is above the top of viewport or top is above viewport
        if (rect.bottom < 100) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuickBuy = () => {
    try {
      addToCart({
        productId,
        slug,
        name: productName,
        priceCents,
        imageUrl,
      });
    } catch (e) {
      console.error(e);
    }
    router.push(`/checkout?buyNow=${encodeURIComponent(slug || productId)}`);
  };

  if (!visible) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#dcdcdc] px-4 py-3 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block truncate">
            {brand}
          </span>
          <div className="flex items-baseline gap-2 truncate">
            <span className="text-xs font-semibold text-neutral-950 truncate block">
              {productName}
            </span>
            <span className="text-xs font-mono font-bold text-neutral-900 shrink-0">
              {formatPrice(priceCents)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleQuickBuy}
          className="shrink-0 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
          style={{ color: "#ffffff" }}
        >
          <span className="text-[#f7931a] font-mono">₿</span>
          <span style={{ color: "#ffffff" }}>Buy with Crypto</span>
        </button>
      </div>
    </div>
  );
}
