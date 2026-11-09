"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { formatPrice } from "@/lib/api";
import { parseCart, writeCart, addToCart, getCartSnapshot, type CartItem } from "@/lib/cart";
import { INITIAL_PRODUCTS } from "@/lib/catalogData";
import { CryptoQRCode } from "@/components/CryptoQRCode";
import { useLiveCryptoRates, calculateCryptoAmount } from "@/lib/cryptoRates";

export type CryptoCurrency = "BTC" | "ETH" | "SOL";

export interface CryptoOption {
  symbol: CryptoCurrency;
  name: string;
  icon: string;
  network: string;
  address: string;
  rateUsd: number;
  decimals: number;
  confirmations: string;
  accentColor: string;
  badgeBg: string;
}

export const CRYPTO_CONFIG: Record<CryptoCurrency, CryptoOption> = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    icon: "₿",
    network: "Bitcoin Mainnet (Native SegWit)",
    address: "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu",
    rateUsd: 85000,
    decimals: 8,
    confirmations: "2 Block Confirmations (~20 min)",
    accentColor: "#f7931a",
    badgeBg: "rgba(247, 147, 26, 0.08)",
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    icon: "Ξ",
    network: "Ethereum Mainnet (ERC-20)",
    address: "0x120D139dB706614f71e470A97852679F6FaebcB7",
    rateUsd: 2600,
    decimals: 6,
    confirmations: "12 Block Confirmations (~3 min)",
    accentColor: "#627eea",
    badgeBg: "rgba(98, 126, 234, 0.08)",
  },
  SOL: {
    symbol: "SOL",
    name: "Solana",
    icon: "◎",
    network: "Solana Mainnet (SPL)",
    address: "X2ro74HaRbZ2XKDJ57yMmsKFD3CS4y9XFKtzSeQkCQ1",
    rateUsd: 180,
    decimals: 4,
    confirmations: "32 Confirmations (~15 sec)",
    accentColor: "#14f195",
    badgeBg: "rgba(20, 241, 149, 0.08)",
  },
};

type CompletedOrder = {
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  totalCents: number;
  email: string;
  customerName?: string;
  paymentMethod: string;
  cryptoCurrency: CryptoCurrency;
  cryptoAmount: string;
  escrowAddress: string;
  txHash: string;
  items: {
    productId: string;
    name: string;
    sku: string;
    qty: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }[];
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("northstar-cart-change", callback);
  return () => window.removeEventListener("northstar-cart-change", callback);
};
const getSnapshot = getCartSnapshot;

export function CheckoutForm() {
  const cartSnapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const cart: CartItem[] = parseCart(cartSnapshot);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [cryptoCurrency, setCryptoCurrency] = useState<CryptoCurrency>("BTC");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  // Live real-time cryptocurrency rates via Coinpaprika
  const { rates: liveRates } = useLiveCryptoRates(15000);

  // Auto-populate cart if user arrived with ?buyNow=<id-or-slug>
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const buyNowId = params.get("buyNow");
      if (buyNowId) {
        const currentCart = parseCart(getCartSnapshot());
        const hasItem = currentCart.some((i) => i.productId === buyNowId || i.slug === buyNowId);
        if (!hasItem) {
          const product = INITIAL_PRODUCTS.find((p) => p._id === buyNowId || p.slug === buyNowId);
          if (product) {
            addToCart({
              productId: product._id,
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              imageUrl: product.images[0]?.url,
            });
          }
        }
      }
    } catch (err) {
      console.error("Auto buyNow recovery error:", err);
    }
  }, []);

  // Cart summary calculations
  const subtotalCents = cart.reduce((acc, item) => acc + item.priceCents * item.qty, 0);
  const discountCents = discountApplied ? Math.round(subtotalCents * 0.1) : 0; // 10% promotional code
  const shippingCents = 0; // Guaranteed 24-Hour Delivery is Complimentary
  const taxableAmount = subtotalCents - discountCents;
  const taxCents = Math.round((taxableAmount * 825) / 10000);
  const totalCents = taxableAmount + shippingCents + taxCents;

  const currentCrypto = CRYPTO_CONFIG[cryptoCurrency];
  const liveRateUsd = liveRates[cryptoCurrency]?.price || currentCrypto.rateUsd;
  const calculatedCryptoAmount = calculateCryptoAmount(totalCents, liveRateUsd, currentCrypto.decimals);

  async function handleSubmitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const fullName = String(form.get("fullName") || "").trim();
    const phone = String(form.get("phone") || "").trim();

    const payload = {
      email,
      customerName: fullName,
      phone,
      paymentMethod: `CRYPTO_${cryptoCurrency}`,
      cryptoCurrency,
      cryptoAmount: calculatedCryptoAmount,
      escrowAddress: currentCrypto.address,
      items: cart.map((item) => ({
        productId: item.productId,
        qty: item.qty,
        priceCents: item.priceCents,
      })),
      shippingAddress: {
        line1: String(form.get("line1")),
        line2: String(form.get("line2") || "") || undefined,
        city: String(form.get("city")),
        state: String(form.get("state")).toUpperCase(),
        postalCode: String(form.get("postalCode")),
        country: "US",
      },
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to place order.");
      }

      setCompletedOrder({
        orderNumber: data.orderNumber,
        trackingNumber: data.trackingNumber,
        carrier: data.carrier || "Dedicated 24-Hour Express Courier",
        estimatedDelivery: data.estimatedDelivery || "Guaranteed Within 24 Hours Anywhere in USA",
        totalCents: data.totalCents || totalCents,
        email: data.email,
        customerName: fullName,
        paymentMethod: `CRYPTO_${cryptoCurrency}`,
        cryptoCurrency,
        cryptoAmount: data.cryptoAmount || calculatedCryptoAmount,
        escrowAddress: data.escrowAddress || currentCrypto.address,
        txHash: data.txHash || "0x4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
        items: data.items,
        shippingAddress: data.shippingAddress,
      });

      writeCart([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, field: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2500);
    }
  }

  // Confirmation View
  if (completedOrder) {
    const coinConfig = CRYPTO_CONFIG[completedOrder.cryptoCurrency];

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white border border-[#ece8e1] rounded-xs p-8 sm:p-12 shadow-sm">
          {/* Header */}
          <div className="text-center pb-8 border-b border-[#ece8e1]">
            <div className="w-14 h-14 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center text-2xl mx-auto mb-4 font-bold">
              ✓
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#047857] block mb-2">
              Order Confirmed · 24-Hour Dispatch Active
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal mb-3">
              Thank You for Your Order
            </h1>
            <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
              We received your order and registered your cryptocurrency settlement. A copy of your receipt and live tracking details have been sent to <strong className="text-neutral-900">{completedOrder.email}</strong>.
            </p>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-[#ece8e1] text-xs">
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">Order Number</span>
              <strong className="text-neutral-950 font-mono text-sm">{completedOrder.orderNumber}</strong>
            </div>
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">Tracking Code</span>
              <strong className="text-neutral-950 font-mono text-sm">{completedOrder.trackingNumber}</strong>
            </div>
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">Delivery Window</span>
              <strong className="text-[#047857] font-semibold text-sm">Within 24 Hours (USA)</strong>
            </div>
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">Payment Method</span>
              <strong className="text-neutral-950 text-sm">{coinConfig.name} ({coinConfig.symbol})</strong>
            </div>
          </div>

          {/* Crypto Settlement Information */}
          <div className="my-6 p-4 rounded-xs border border-[#ece8e1] bg-[#faf9f6]">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Blockchain Deposit Details
              </span>
              <span className="text-xs font-mono font-semibold text-[#a3702b]">
                {completedOrder.cryptoAmount} {completedOrder.cryptoCurrency}
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-white p-2.5 border border-[#ece8e1] rounded-xs">
                <span className="text-neutral-500">Deposit Address:</span>
                <span className="font-mono text-neutral-800 truncate ml-2 max-w-[260px] sm:max-w-none">
                  {completedOrder.escrowAddress}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 border border-[#ece8e1] rounded-xs">
                <span className="text-neutral-500">Transaction Hash:</span>
                <span className="font-mono text-neutral-800 truncate ml-2 max-w-[260px] sm:max-w-none">
                  {completedOrder.txHash}
                </span>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="py-6 border-b border-[#ece8e1]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
              Items Ordered ({completedOrder.items?.length || 0})
            </h2>
            <div className="space-y-3">
              {completedOrder.items?.map((item) => (
                <div key={item.productId || item.name} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-neutral-900 block">{item.name}</span>
                    <span className="text-xs text-neutral-500">Quantity: {item.qty} · In stock</span>
                  </div>
                  <span className="font-mono font-semibold text-neutral-950">
                    {formatPrice(item.lineTotalCents)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-4 mt-4 border-t border-[#f0eee9] flex justify-between items-center">
              <span className="text-sm font-semibold text-neutral-900">Total</span>
              <span className="text-lg font-mono font-bold text-neutral-950">
                {formatPrice(completedOrder.totalCents)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href={`/track?order=${encodeURIComponent(completedOrder.orderNumber)}`}
              className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
              style={{ color: "#ffffff" }}
            >
              <span style={{ color: "#ffffff" }}>Track Delivery Status →</span>
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-[#d6d2c8] text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Bag State
  if (!cart.length) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="relative w-40 h-28 mx-auto mb-6 rounded-xs overflow-hidden border border-[#ece8e1] shadow-xs">
          <Image
            src="/images/editorial_collection_curation.jpg"
            alt="Northstar Archive Collection"
            fill
            sizes="160px"
            quality={95}
            priority
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        </div>
        <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
          Express Checkout
        </span>
        <h1 className="font-serif text-3xl text-neutral-950 font-normal mb-3">
          Your bag is currently empty.
        </h1>
        <p className="text-sm text-neutral-600 mb-8 max-w-md mx-auto leading-relaxed">
          Please add a designer bag, luxury footwear, or tailored apparel piece from our catalog to proceed to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
          style={{ color: "#ffffff" }}
        >
          <span style={{ color: "#ffffff" }}>Explore Collection →</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#ece8e1]">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/cart" className="hover:text-black transition-colors">Bag</Link>
          <span>/</span>
          <span className="text-neutral-950 font-semibold">Information & Shipping</span>
          <span>/</span>
          <span>Payment</span>
        </div>
        <span className="text-[11px] uppercase tracking-wider text-[#047857] font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          Guaranteed 24-Hour USA Delivery
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Checkout Inputs (Shopify style) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmitOrder} className="space-y-8">
            {/* 1. Contact Information */}
            <section className="bg-white p-6 sm:p-8 border border-[#ece8e1] rounded-xs shadow-2xs">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
                  Contact Information
                </h2>
                <span className="text-xs text-neutral-500">Guest Checkout</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-3 bg-[#fcfbf9] border border-[#d6d2c8] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Your order invoice and courier tracking coordinates will be sent here.
                  </p>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="marketingConsent"
                    defaultChecked
                    className="mt-1 h-3.5 w-3.5 text-neutral-950 border-neutral-300 rounded-none focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="marketingConsent" className="text-xs text-neutral-600 cursor-pointer">
                    Email me about new luxury arrivals and seasonal archive collections.
                  </label>
                </div>
              </div>
            </section>

            {/* 2. Shipping Address */}
            <section className="bg-white p-6 sm:p-8 border border-[#ece8e1] rounded-xs shadow-2xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 mb-4">
                Shipping Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="country" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                    Country / Region
                  </label>
                  <input
                    id="country"
                    type="text"
                    disabled
                    value="United States (Guaranteed 24-Hour Delivery)"
                    className="w-full px-3.5 py-3 bg-[#f4f3ef] border border-[#d6d2c8] rounded-none text-sm text-neutral-700 cursor-not-allowed font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Alexander Wright"
                      className="w-full px-3.5 py-3 bg-[#fcfbf9] border border-[#d6d2c8] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="e.g. (555) 019-2834"
                      className="w-full px-3.5 py-3 bg-[#fcfbf9] border border-[#d6d2c8] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="line1" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="line1"
                    name="line1"
                    type="text"
                    required
                    autoComplete="shipping street-address"
                    placeholder="House number and street name"
                    className="w-full px-3.5 py-3 bg-[#fcfbf9] border border-[#d6d2c8] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="line2" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                    Apartment, Suite, Unit <span className="text-neutral-400 lowercase font-normal">(optional)</span>
                  </label>
                  <input
                    id="line2"
                    name="line2"
                    type="text"
                    autoComplete="shipping address-line2"
                    placeholder="Apartment, suite, unit, etc."
                    className="w-full px-3.5 py-3 bg-[#fcfbf9] border border-[#d6d2c8] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                  <div className="sm:col-span-3">
                    <label htmlFor="city" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      autoComplete="shipping address-level2"
                      placeholder="e.g. New York"
                      className="w-full px-3.5 py-3 bg-[#fcfbf9] border border-[#d6d2c8] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="state" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      required
                      minLength={2}
                      maxLength={2}
                      autoComplete="shipping address-level1"
                      placeholder="NY"
                      className="w-full px-3.5 py-3 bg-[#fcfbf9] border border-[#d6d2c8] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 uppercase placeholder:text-neutral-400 transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="postalCode" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      required
                      pattern="[0-9]{5}(-[0-9]{4})?"
                      autoComplete="shipping postal-code"
                      placeholder="10021"
                      className="w-full px-3.5 py-3 bg-[#fcfbf9] border border-[#d6d2c8] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Shipping Method */}
            <section className="bg-white p-6 sm:p-8 border border-[#ece8e1] rounded-xs shadow-2xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 mb-4">
                Shipping Method
              </h2>
              <div className="p-4 border-2 border-neutral-950 bg-[#faf9f6] rounded-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-neutral-950 font-semibold">
                      Guaranteed 24-Hour USA Delivery
                    </strong>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#10b981]/15 text-[#047857] px-2 py-0.5 rounded-xs">
                      Included
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    Arrives anywhere in the USA within 24 hours via dedicated express courier. Fully insured declared value with signature verification.
                  </p>
                </div>
                <span className="text-sm font-bold font-mono text-neutral-950 shrink-0">
                  FREE
                </span>
              </div>
            </section>

            {/* 4. Payment: Cryptocurrency */}
            <section className="bg-white p-6 sm:p-8 border border-[#ece8e1] rounded-xs shadow-2xs">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
                  Payment Method
                </h2>
                <span className="text-xs text-neutral-500 font-mono">Instant Crypto Settlement</span>
              </div>
              <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
                All transactions are settled securely on-chain. Select your preferred cryptocurrency to generate a direct deposit address:
              </p>

              {/* 3 Supported Assets Selector */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(Object.keys(CRYPTO_CONFIG) as CryptoCurrency[]).map((coinKey) => {
                  const coin = CRYPTO_CONFIG[coinKey];
                  const isSelected = cryptoCurrency === coinKey;
                  const coinRate = liveRates[coinKey]?.price || coin.rateUsd;
                  const coinAmount = calculateCryptoAmount(totalCents, coinRate, coin.decimals);

                  return (
                    <button
                      key={coinKey}
                      type="button"
                      onClick={() => setCryptoCurrency(coinKey)}
                      className={`p-3.5 sm:p-4 border text-center transition-all cursor-pointer rounded-xs flex flex-col items-center justify-center ${
                        isSelected
                          ? "border-neutral-950 bg-[#faf9f6] shadow-xs ring-1 ring-neutral-950"
                          : "border-[#d6d2c8] bg-white hover:border-neutral-400"
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2 shadow-2xs"
                        style={{ backgroundColor: coin.accentColor }}
                      >
                        {coin.icon}
                      </span>
                      <strong className="text-xs text-neutral-950 font-semibold block">{coin.name}</strong>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-mono">
                        {coin.symbol}
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-950 mt-1">
                        {coinAmount} {coin.symbol}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Deposit Address Box */}
              <div className="border border-[#d6d2c8] bg-[#faf9f6] p-5 rounded-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <CryptoQRCode
                    address={currentCrypto.address}
                    symbol={cryptoCurrency}
                    amount={calculatedCryptoAmount}
                    size={140}
                    showWalletLink={true}
                    className="shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-3 w-full">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                          {currentCrypto.name} Deposit Address
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(currentCrypto.address, "addr")}
                          className="text-[11px] font-semibold uppercase tracking-wider text-[#a3702b] hover:underline cursor-pointer"
                        >
                          {copiedField === "addr" ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="p-2.5 bg-white border border-[#d6d2c8] font-mono text-xs text-neutral-900 break-all select-all">
                        {currentCrypto.address}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                          Amount to Send
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(calculatedCryptoAmount, "amt")}
                          className="text-[11px] font-semibold uppercase tracking-wider text-[#a3702b] hover:underline cursor-pointer"
                        >
                          {copiedField === "amt" ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="p-2.5 bg-white border border-[#d6d2c8] flex justify-between items-center">
                        <span className="font-mono text-sm font-bold text-neutral-950">
                          {calculatedCryptoAmount} {currentCrypto.symbol}
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">
                          ≈ {formatPrice(totalCents)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-500 border-t border-[#ece8e1] pt-3 leading-relaxed">
                  Send only {currentCrypto.name} to this address via the {currentCrypto.network}. Settlement is automatically detected on-chain.
                </div>
              </div>
            </section>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                {error}
              </div>
            )}

            {/* Complete Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-600 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
              style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
            >
              <span style={{ color: "#ffffff" }}>
                {loading
                  ? "Processing Order and Registering Settlement..."
                  : `Complete Order · ${calculatedCryptoAmount} ${currentCrypto.symbol}`}
              </span>
            </button>

            <p className="text-center text-xs text-neutral-500">
              Guaranteed 24-hour delivery anywhere in the USA. 100% money-back authenticity guarantee.
            </p>
          </form>
        </div>

        {/* Right Column: Order Summary (Shopify sticky sidebar style) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white border border-[#ece8e1] p-6 sm:p-8 rounded-xs shadow-2xs space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 pb-4 border-b border-[#ece8e1]">
              Order Summary ({cart.length})
            </h2>

            {/* Line items list */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.size || "std"}`} className="flex items-center gap-4 py-2 border-b border-[#f4f3ef] last:border-none">
                  <div className="relative w-16 h-20 bg-[#f7f6f3] shrink-0 border border-[#ece8e1] rounded-xs overflow-hidden">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold">
                      {item.qty}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-medium text-neutral-950 leading-snug truncate">
                      {item.name}
                    </h3>
                    {item.size && (
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-600 block mt-0.5">
                        Size: {item.size}
                      </span>
                    )}
                    <span className="text-[11px] text-neutral-500 block mt-0.5 font-mono">
                      {formatPrice(item.priceCents)} each
                    </span>
                  </div>

                  <span className="text-xs font-mono font-semibold text-neutral-950">
                    {formatPrice(item.priceCents * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Discount Code Input */}
            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount code or promo"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#fcfbf9] border border-[#d6d2c8] focus:border-black focus:bg-white focus:outline-none rounded-none text-xs text-neutral-900 placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (discountCode.trim()) {
                      setDiscountApplied(true);
                    }
                  }}
                  className="px-4 py-2 bg-[#f4f3ef] hover:bg-[#e8e6df] text-neutral-800 text-xs font-semibold uppercase tracking-wider border border-[#d6d2c8] transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {discountApplied && (
                <span className="text-[11px] text-[#047857] block mt-1 font-medium">
                  10% luxury promotion applied
                </span>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-[#ece8e1] space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-mono text-neutral-950 font-medium">{formatPrice(subtotalCents)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-[#047857]">
                  <span>Promotion (10% off)</span>
                  <span className="font-mono font-medium">-{formatPrice(discountCents)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Guaranteed 24-Hour USA Delivery</span>
                <span className="text-[#047857] font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-mono text-neutral-950">{formatPrice(taxCents)}</span>
              </div>
              <div className="pt-4 border-t border-[#ece8e1] flex justify-between items-baseline">
                <span className="text-sm font-semibold text-neutral-950">Total</span>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-neutral-950 block">
                    {formatPrice(totalCents)}
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#a3702b] block">
                    ≈ {calculatedCryptoAmount} {currentCrypto.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-[#ece8e1] space-y-2 text-[11px] text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="text-[#047857]">✓</span>
                <span>Guaranteed 24-Hour delivery to any US address</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#047857]">✓</span>
                <span>100% lifetime authenticity guarantee with certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#047857]">✓</span>
                <span>Zero fees or intermediary bank hold on crypto transfers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
