"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart, openCartDrawer, readCart } from "@/lib/cart";

export function AddToCartButton({
  item,
  openDrawerOnAdd = true,
  className = "",
}: {
  item: { productId: string; slug: string; name: string; priceCents: number; imageUrl?: string };
  openDrawerOnAdd?: boolean;
  className?: string;
}) {
  const [added, setAdded] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const updateCount = () => {
      const cart = readCart();
      setBagCount(cart.reduce((sum, i) => sum + i.qty, 0));
    };
    updateCount();
    window.addEventListener("northstar-cart-change", updateCount);
    return () => window.removeEventListener("northstar-cart-change", updateCount);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // 1. Add item to cart state across localStorage, cookies, sessionStorage, and memory
      const updated = addToCart(item);
      const newTotal = updated.reduce((sum, i) => sum + i.qty, 0);
      setBagCount(newTotal);

      // 2. Provide immediate visual button state
      setAdded(true);
      setShowToast(true);

      // 3. Open the shopping bag drawer
      if (openDrawerOnAdd) {
        openCartDrawer();
      }

      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        setAdded(false);
        setShowToast(false);
      }, 4000);
    } catch (err) {
      console.error("Cart error:", err);
      // Fallback
      setAdded(true);
      setShowToast(true);
      openCartDrawer();
      setTimeout(() => {
        setAdded(false);
        setShowToast(false);
      }, 4000);
    }
  };

  return (
    <div className="relative w-full">
      <button
        className={`add-to-bag-btn transition-all duration-200 cursor-pointer ${
          className ||
          "button button-dark text-white w-full py-4 px-6 font-semibold uppercase tracking-wider text-xs"
        }`}
        style={{
          color: "#ffffff",
          backgroundColor: added ? "#047857" : "#0f0f0f",
          borderColor: added ? "#047857" : "#0f0f0f",
        }}
        type="button"
        onClick={handleClick}
        aria-live="polite"
      >
        <span className="flex items-center justify-center gap-2" style={{ color: "#ffffff" }}>
          {added ? (
            <>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Added to Bag ({bagCount})</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Add to Bag</span>
            </>
          )}
        </span>
      </button>

      {/* Instant Feedback Toast Pill if user closed drawer or wants immediate shortcut */}
      {showToast && (
        <div className="mt-2.5 p-3 bg-[#0f0f0f] text-white border border-[#333] rounded-xs shadow-xl flex items-center justify-between text-xs animate-slide-left z-20">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" />
            <span className="truncate text-neutral-200">
              <strong className="text-white">{item.name}</strong> added
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
              onClick={() => router.push(`/checkout?buyNow=${encodeURIComponent(item.productId)}`)}
              className="px-2.5 py-1 bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-semibold uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
              style={{ color: "#ffffff" }}
            >
              Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function InstantCryptoCheckoutButton({
  item,
  className = "",
}: {
  item: { productId: string; slug: string; name: string; priceCents: number; imageUrl?: string };
  className?: string;
}) {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigating) return;
    setNavigating(true);

    try {
      addToCart(item);
    } catch (err) {
      console.error("Instant checkout cart error:", err);
    }

    const targetUrl = `/checkout?buyNow=${encodeURIComponent(item.productId)}`;
    router.push(targetUrl);

    // Safety timeout in case user returns via browser back button (bfcache)
    setTimeout(() => {
      setNavigating(false);
    }, 3500);

  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={navigating}
      className={
        className ||
        "w-full py-3.5 px-4 bg-[#f4f3ef] hover:bg-[#e8e6e0] text-neutral-900 border border-[#d8d5cd] text-xs font-semibold uppercase tracking-[0.12em] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-75"
      }
      aria-label="Instant Crypto Checkout via BTC, ETH, or SOL"
    >
      <span>
        {navigating
          ? "Securing Allocation & Proceeding to Checkout..."
          : "Instant Crypto Checkout (BTC · ETH · SOL)"}
      </span>
      <span aria-hidden="true">→</span>
    </button>
  );
}
