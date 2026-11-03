"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";

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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);

    if (openDrawerOnAdd) {
      window.dispatchEvent(new Event("northstar-cart-open"));
    }
  };

  return (
    <button
      className={`add-to-bag-btn transition-all duration-200 cursor-pointer ${className || "button button-dark text-white w-full py-3.5 px-6 font-semibold uppercase tracking-wider text-xs"}`}
      style={{ color: "#ffffff" }}
      type="button"
      onClick={handleClick}
    >
      {added ? "✓ Added to Bag" : "Add to Bag"}
    </button>
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
    setNavigating(true);
    addToCart(item);
    router.push("/checkout");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={navigating}
      className={
        className ||
        "w-full py-3.5 px-4 bg-[#f4f3ef] hover:bg-[#e8e6e0] text-neutral-900 border border-[#d8d5cd] text-xs font-semibold uppercase tracking-[0.12em] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
      }
    >
      <span>
        {navigating
          ? "Securing Allocation & Opening Vault…"
          : "Instant Crypto Checkout (BTC · ETH · SOL)"}
      </span>
      <span aria-hidden="true">→</span>
    </button>
  );
}
