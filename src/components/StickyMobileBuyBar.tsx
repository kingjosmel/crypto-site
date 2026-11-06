"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice, type Product } from "@/lib/api";
import { addToCart } from "@/lib/cart";

interface StickyMobileBuyBarProps {
  product: Product;
  triggerId?: string;
}

export function StickyMobileBuyBar({ product, triggerId = "main-purchase-cta" }: StickyMobileBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Track when user scrolls past the main purchase CTA in the page body
    const target = document.getElementById(triggerId);
    if (!target) {
      // Fallback: show after scrolling 400px
      const handleScroll = () => {
        setIsVisible(window.scrollY > 450);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // When the main button is NOT intersecting and is above the viewport (boundingClientRect.top < 0), show sticky bar
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0,
        rootMargin: "0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [triggerId]);

  const handleInstantCryptoBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isNavigating) return;
    setIsNavigating(true);

    try {
      addToCart({
        productId: product._id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        imageUrl: product.images[0]?.url,
      });
    } catch (err) {
      console.error("Cart error in mobile sticky buy bar:", err);
    }

    router.push(`/checkout?buyNow=${encodeURIComponent(product.slug || product._id)}`);

    setTimeout(() => {
      setIsNavigating(false);
    }, 3500);
  };

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#dedad0] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out px-4 pt-2.5 pb-[max(env(safe-area-inset-bottom),0.75rem)] ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isVisible}
    >
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        {/* Left: Thumbnail & Price Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {product.images[0]?.url && (
            <div className="relative w-10 h-10 rounded-xs overflow-hidden border border-[#ece8e1] shrink-0 bg-[#f7f6f2]">
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                sizes="40px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-[#a3702b] block truncate tracking-wider">
              {product.brand}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-sm font-bold text-neutral-950">
                {formatPrice(product.priceCents)}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">
                USD
              </span>
            </div>
          </div>
        </div>

        {/* Right: Buy with Crypto Primary CTA */}
        <button
          type="button"
          onClick={handleInstantCryptoBuy}
          disabled={isNavigating}
          className="shrink-0 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 active:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer shadow-sm flex items-center gap-2 transition-all disabled:opacity-75"
          style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
        >
          <span className="flex items-center gap-1 font-mono text-[11px] text-[#f7931a]">
            ₿
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-[#627eea]">
            Ξ
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-[#14f195]">
            ◎
          </span>
          <span style={{ color: "#ffffff" }}>
            {isNavigating ? "Securing…" : "Buy with Crypto"}
          </span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
