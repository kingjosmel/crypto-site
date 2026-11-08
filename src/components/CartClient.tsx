"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { formatPrice } from "@/lib/api";
import { parseCart, writeCart, getCartSnapshot } from "@/lib/cart";

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("northstar-cart-change", callback);
  return () => window.removeEventListener("northstar-cart-change", callback);
};

const getSnapshot = getCartSnapshot;

export function CartClient() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const items = parseCart(snapshot);

  const updateQuantity = (productId: string, newQty: number, size?: string) => {
    if (newQty <= 0) {
      writeCart(items.filter((item) => !(item.productId === productId && item.size === size)));
    } else {
      writeCart(
        items.map((entry) =>
          entry.productId === productId && entry.size === size ? { ...entry, qty: newQty } : entry
        )
      );
    }
  };

  const removeItem = (productId: string, size?: string) => {
    writeCart(items.filter((entry) => !(entry.productId === productId && entry.size === size)));
  };

  if (!items.length) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="relative w-48 h-32 mx-auto mb-6 rounded-xs overflow-hidden border border-[#ece8e1] shadow-xs">
          <Image
            src="/images/editorial_collection_curation.jpg"
            alt="The Northstar / Supply curated edit"
            fill
            priority
            sizes="200px"
            quality={95}
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        </div>
        <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
          Your Shopping Bag
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal mb-3">
          Your bag is currently empty.
        </h1>
        <p className="text-sm text-neutral-600 max-w-md mx-auto mb-8 leading-relaxed">
          When you select a designer bag, footwear, or tailored garment from our collection, it will appear here ready for guest checkout.
        </p>
        <Link
          className="inline-block px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
          style={{ color: "#ffffff" }}
          href="/shop"
        >
          <span style={{ color: "#ffffff" }}>Explore Collection →</span>
        </Link>
      </div>
    );
  }

  const subtotalCents = items.reduce((total, item) => total + item.priceCents * item.qty, 0);
  const taxCents = Math.round((subtotalCents * 825) / 10000);
  const totalCents = subtotalCents + taxCents;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8 pb-4 border-b border-[#ece8e1]">
        <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-1">
          Review Allocations
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal">
          Shopping Bag ({items.reduce((acc, i) => acc + i.qty, 0)})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Items Table / List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Complimentary Shipping Banner */}
          <div className="bg-[#f5fbf7] border border-[#a7f3d0] p-4 rounded-xs flex items-center justify-between text-xs text-[#065f46]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <strong>Guaranteed 24-Hour USA Delivery:</strong> Hand-delivered anywhere in the USA within 24 hours via dedicated armored courier.
            </div>
            <span className="font-mono font-bold">$0.00</span>
          </div>

          <div className="border border-[#ece8e1] bg-white rounded-xs divide-y divide-[#ece8e1]">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size || "std"}`} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center min-w-0">
                  <div className="relative w-20 h-24 bg-[#f6f5f2] shrink-0 rounded-xs overflow-hidden border border-[#ece8e1]">
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
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-medium text-neutral-950 leading-snug">
                      <Link href={`/product/${item.slug}`} className="hover:underline">
                        {item.name}
                      </Link>
                    </h3>
                    {item.size && (
                      <span className="inline-block text-[10px] uppercase font-semibold tracking-wider bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-xs mt-1">
                        Size: {item.size}
                      </span>
                    )}
                    <p className="text-xs text-neutral-500 font-mono mt-1">
                      {formatPrice(item.priceCents)} each
                    </p>
                    <span className="text-[11px] text-[#047857] flex items-center gap-1 mt-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      RFID Microchip Authenticated
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#d6d3cb] rounded-xs bg-[#faf9f6]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.qty - 1, item.size)}
                      className="px-3 py-1.5 text-xs text-neutral-700 hover:text-black transition-colors cursor-pointer"
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
                      className="px-3 py-1.5 text-xs text-neutral-700 hover:text-black transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[100px]">
                    <span className="font-mono text-base font-semibold text-neutral-950 block">
                      {formatPrice(item.priceCents * item.qty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-xs text-neutral-400 hover:text-red-600 transition-colors underline mt-1 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-neutral-500 pt-2">
            <Link href="/shop" className="hover:text-black transition-colors flex items-center gap-1">
              ← Continue browsing archive
            </Link>
            <span>All pieces reserved for 30 minutes in vault packing.</span>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 bg-white border border-[#ece8e1] rounded-xs p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 pb-4 border-b border-[#ece8e1]">
            Order Summary
          </h2>

          <div className="py-4 space-y-3 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-mono font-medium text-neutral-950">{formatPrice(subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-neutral-600 text-xs">
              <span>Guaranteed 24-Hour US Handover</span>
              <span className="text-[#047857] font-semibold">COMPLIMENTARY</span>
            </div>
            <div className="flex justify-between text-neutral-600 text-xs">
              <span>Estimated Sales Tax (8.25%)</span>
              <span className="font-mono">{formatPrice(taxCents)}</span>
            </div>
            <div className="pt-4 border-t border-[#ece8e1] flex justify-between items-baseline">
              <span className="font-semibold text-neutral-950">Estimated Total</span>
              <span className="font-mono text-2xl font-bold text-neutral-950">{formatPrice(totalCents)}</span>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 leading-normal mb-5">
            Non-custodial crypto checkout. Settled on-chain in BTC, ETH, or SOL via private vault escrow.
          </p>

          <Link
            href="/checkout"
            className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors shadow-sm flex items-center justify-center gap-2 mb-4"
            style={{ color: "#ffffff" }}
          >
            <span style={{ color: "#ffffff" }}>Proceed to Crypto Checkout</span>
            <span style={{ color: "#ffffff" }} aria-hidden="true">→</span>
          </Link>

          <div className="pt-4 border-t border-[#f0eee9] text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
              Cryptocurrency Exclusive Settlement
            </span>
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono">
              <span className="bg-[#f5f4f0] text-[#f7931a] px-2 py-0.5 border border-[#e5e2da] rounded-xs font-semibold">BTC</span>
              <span className="bg-[#f5f4f0] text-[#627eea] px-2 py-0.5 border border-[#e5e2da] rounded-xs font-semibold">ETH</span>
              <span className="bg-[#f5f4f0] text-[#14f195] px-2 py-0.5 border border-[#e5e2da] rounded-xs font-semibold">SOL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
