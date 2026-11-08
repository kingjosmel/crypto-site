"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { formatPrice } from "@/lib/api";
import { parseCart, writeCart, getCartSnapshot, type CartItem } from "@/lib/cart";

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("northstar-cart-change", callback);
  return () => window.removeEventListener("northstar-cart-change", callback);
};
const getSnapshot = getCartSnapshot;

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const cartSnapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const cart: CartItem[] = parseCart(cartSnapshot);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.__openNorthstarCart = handleOpen;
    window.__closeNorthstarCart = handleClose;

    window.addEventListener("northstar-cart-open", handleOpen);
    window.addEventListener("northstar-cart-close", handleClose);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("northstar-cart-open", handleOpen);
      window.removeEventListener("northstar-cart-close", handleClose);
      window.removeEventListener("keydown", handleKeyDown);
      delete window.__openNorthstarCart;
      delete window.__closeNorthstarCart;
    };
  }, []);

  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotalCents = cart.reduce((acc, item) => acc + item.priceCents * item.qty, 0);

  const updateQuantity = (productId: string, newQty: number, size?: string) => {
    if (newQty <= 0) {
      writeCart(cart.filter((item) => !(item.productId === productId && item.size === size)));
    } else {
      writeCart(
        cart.map((item) =>
          item.productId === productId && item.size === size ? { ...item, qty: newQty } : item
        )
      );
    }
  };

  const removeItem = (productId: string, size?: string) => {
    writeCart(cart.filter((item) => !(item.productId === productId && item.size === size)));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart Drawer">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 z-40"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Container Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10 z-50 pointer-events-auto">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#e8e6e1] animate-slide-left h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#ece9e2]">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight text-neutral-900 uppercase text-[13px] tracking-[0.1em]">
                Your Bag
              </h2>
              <span className="text-xs text-neutral-500 font-medium">
                ({totalCount} {totalCount === 1 ? "item" : "items"})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Complimentary 24-Hour USA Shipping Bar */}
          <div className="bg-[#f9f8f5] px-6 py-3 border-b border-[#ece9e2] flex items-center justify-between text-xs text-neutral-700">
            <span className="font-medium text-[#047857]">Guaranteed 24-Hour USA Delivery</span>
            <span className="text-neutral-500 text-[11px] font-semibold">Complimentary ($0.00)</span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#ece9e2]">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="relative w-40 h-28 mx-auto mb-4 opacity-75">
                  <Image
                    src="/images/editorial_collection_curation.jpg"
                    alt="Empty cart curation"
                    fill
                    className="object-cover rounded-xs"
                    sizes="160px"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">Your bag is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-5">
                  Explore our collection of designer bags, luxury footwear, and tailored apparel.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="inline-block px-5 py-2.5 bg-neutral-900 text-white text-xs font-medium uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  style={{ color: "#ffffff" }}
                >
                  Discover Collection
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.productId}-${item.size || "std"}`} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-[#f3f2ee] shrink-0 border border-[#ece9e2] rounded-xs overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                        No photo
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 leading-snug truncate">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="hover:underline"
                        >
                          {item.name}
                        </Link>
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {item.size && (
                          <span className="text-[10.5px] font-mono font-medium text-neutral-700 bg-[#f4f3ef] border border-[#e2dfd7] px-1.5 py-0.5 rounded-xs">
                            Size: {item.size}
                          </span>
                        )}
                        <span className="text-xs text-neutral-500 font-mono">
                          {formatPrice(item.priceCents)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper with touch-friendly size */}
                      <div className="flex items-center border border-[#d6d3cb] rounded-xs bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.qty - 1, item.size)}
                          className="w-8 h-8 flex items-center justify-center text-xs font-medium text-neutral-600 hover:text-black active:bg-neutral-100 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-2.5 text-xs font-mono font-medium min-w-[24px] text-center">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.qty + 1, item.size)}
                          className="w-8 h-8 flex items-center justify-center text-xs font-medium text-neutral-600 hover:text-black active:bg-neutral-100 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-xs text-neutral-400 hover:text-red-600 transition-colors underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="border-t border-[#ece9e2] px-6 py-5 bg-[#faf9f6]">
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-semibold text-neutral-900 font-mono text-base">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3 text-xs text-neutral-500">
                <span>Guaranteed 24-Hour US Handover</span>
                <span className="text-[#047857] font-semibold">Complimentary ($0.00)</span>
              </div>
              <p className="text-[11px] text-neutral-500 mb-4 leading-normal">
                Direct crypto escrow settlement via BTC, ETH, or SOL. Guaranteed delivery to any US address within 24 hours of confirmation.
              </p>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  style={{ color: "#ffffff" }}
                >
                  <span style={{ color: "#ffffff" }}>Proceed to Crypto Checkout</span>
                  <span aria-hidden="true" style={{ color: "#ffffff" }}>→</span>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="w-full block text-center py-2 text-xs text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  View Full Cart Bag
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
