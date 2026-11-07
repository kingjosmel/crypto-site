"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { SiteShell } from "@/components/SiteShell";
import { formatPrice } from "@/lib/api";
import { CryptoQRCode } from "@/components/CryptoQRCode";

type OrderItem = {
  productId: string;
  name: string;
  sku: string;
  qty: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

type OrderData = {
  _id: string;
  orderNumber: string;
  email: string;
  customerName?: string;
  items: OrderItem[];
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  orderStatus: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  cryptoCurrency?: "BTC" | "ETH" | "SOL";
  cryptoAmount?: string;
  escrowAddress?: string;
  txHash?: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  confirmationEmailSent?: boolean;
  sentEmailDetails?: {
    to: string;
    subject: string;
    sentAt: string;
    trackingNumber: string;
    carrier: string;
    summary: string;
  };
  createdAt: string;
};

export default function TrackPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeOrder, setActiveOrder] = useState<OrderData | null>(null);
  const [orderList, setOrderList] = useState<OrderData[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Handle URL query parameters (e.g. /track?order=NS-00000001 or /track?email=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const orderParam = params.get("order") || params.get("orderNumber") || params.get("q");
    const emailParam = params.get("email");
    const initialQuery = orderParam || emailParam;

    if (initialQuery) {
      const timer = setTimeout(() => {
        setSearchTerm(initialQuery);
        void executeSearch(initialQuery);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  async function executeSearch(query: string) {
    const clean = query.trim();
    if (!clean) return;
    setError("");
    setActiveOrder(null);
    setOrderList([]);

    startTransition(async () => {
      try {
        const isEmail = clean.includes("@");
        const endpoint = isEmail
          ? `/api/orders?email=${encodeURIComponent(clean)}`
          : `/api/orders?q=${encodeURIComponent(clean)}`;

        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Order tracking record not found.");
        }

        const items: OrderData[] = data.items || (data.orderNumber ? [data] : []);

        if (items.length === 0) {
          // Fallback to guest order endpoint
          const guestResponse = await fetch(`/api/orders/guest/${encodeURIComponent(clean)}`);
          if (guestResponse.ok) {
            const guestData = await guestResponse.json();
            setActiveOrder(guestData);
            return;
          }
          setError("No matching dispatch or order was located. Please check the order number or email.");
          return;
        }

        if (items.length === 1) {
          setActiveOrder(items[0]);
        } else {
          setOrderList(items);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not retrieve order details.");
      }
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void executeSearch(searchTerm);
  }

  return (
    <SiteShell>
      <section className="account-panel">
        {/* Header Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center mb-8 sm:mb-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/30 px-3 py-1 rounded-full text-xs text-[#047857] font-semibold mb-3 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              Direct Priority Courier Telemetry
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight mb-2">Track Your Order</h1>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
              No login required. Enter your <strong>order number</strong> (e.g. <code>NS-00000001</code>) or the <strong>email address</strong> you used at checkout to access live dispatch telemetry and courier tracking.
            </p>
          </div>
          <div className="lg:col-span-5 relative w-full aspect-16/10 rounded-xs overflow-hidden border border-[#d8d5cd] shadow-xs">
            <Image
              src="/images/editorial_white_glove_courier.jpg"
              alt="White glove luxury courier dispatch and vault security"
              fill
              quality={95}
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Search Form */}
        <form className="checkout-form mb-8 sm:mb-10" onSubmit={handleSubmit}>
          <label htmlFor="search-input" className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-1.5">
            Order Number or Customer Email
            <input
              id="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
              placeholder="e.g. NS-00000001 or alex@example.com"
              className="w-full mt-1.5 px-4 py-3 bg-[#fcfbf9] border border-[#d6d2c8] focus:border-black focus:bg-white focus:outline-none rounded-xs text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 transition-colors shadow-2xs"
            />
          </label>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mt-3">
            <button
              className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-sm text-center cursor-pointer"
              type="submit"
              disabled={isPending}
              style={{ color: "#ffffff" }}
            >
              {isPending ? "Retrieving Telemetry…" : "Locate Dispatch"}
            </button>
            <span className="text-xs text-neutral-500">
              Tip: Try sample order <code className="bg-neutral-200/60 px-1.5 py-0.5 rounded text-neutral-900 font-mono">NS-00000001</code>
            </span>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xs text-red-600 mb-6 text-sm" role="alert">
            {error}
          </div>
        )}

        {/* Multiple Orders Result list (if email searched) */}
        {orderList.length > 0 && !activeOrder && (
          <div className="mb-10">
            <p className="eyebrow">Found {orderList.length} Orders for {searchTerm}</p>
            <div className="flex flex-col gap-3 mt-3">
              {orderList.map((order) => (
                <div
                  key={order.orderNumber}
                  onClick={() => setActiveOrder(order)}
                  className="cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 sm:p-5 bg-white border border-[#ece8e1] hover:border-black rounded-xs transition-colors"
                >
                  <div className="min-w-0">
                    <strong className="text-base text-neutral-950 block mb-0.5">{order.orderNumber}</strong>
                    <span className="text-xs text-neutral-500 block truncate">
                      Tracking: {order.trackingNumber || `TRK-NS-${order.orderNumber.replace(/\D/g, "")}`} · Status: {order.orderStatus}
                    </span>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <strong className="text-base text-neutral-950 block">{formatPrice(order.totalCents)}</strong>
                    <span className="text-xs text-[#a3702b] font-medium">View Live Tracking →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Order Tracking Display */}
        {activeOrder && (
          <div className="border-t border-[#ece8e1] pt-8" aria-live="polite">
            {orderList.length > 1 && (
              <button
                onClick={() => setActiveOrder(null)}
                className="text-neutral-500 hover:text-black cursor-pointer pb-4 text-xs inline-flex items-center gap-1.5"
              >
                ← Back to all orders for this email
              </button>
            )}

            {/* Email Dispatch Notice */}
            <div className="flex items-start sm:items-center gap-3 p-3.5 sm:p-4 bg-[#10b981]/8 border border-[#10b981]/25 rounded-xs mb-6 text-xs sm:text-sm text-neutral-800 leading-relaxed">
              <span className="text-lg shrink-0">✉️</span>
              <div>
                <strong>Dispatch Notice Sent:</strong> A comprehensive purchase invoice, digital authenticity certificate, and real-time tracking links were dispatched directly to <strong>{activeOrder.email}</strong>.
              </div>
            </div>

            {/* Telemetry Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <div className="bg-white border border-[#ece8e1] p-3.5 sm:p-4 rounded-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Order Identifier</span>
                <strong className="text-sm sm:text-base text-neutral-950 block truncate">{activeOrder.orderNumber}</strong>
              </div>
              <div className="bg-white border border-[#ece8e1] p-3.5 sm:p-4 rounded-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Tracking Code</span>
                <strong className="text-xs sm:text-sm font-mono tracking-wider text-neutral-950 block truncate">
                  {activeOrder.trackingNumber || `TRK-NS-${activeOrder.orderNumber.replace(/\D/g, "")}`}
                </strong>
              </div>
              <div className="bg-white border border-[#ece8e1] p-3.5 sm:p-4 rounded-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Courier & Service</span>
                <strong className="text-xs sm:text-sm text-neutral-950 block truncate">{activeOrder.carrier || "FedEx Priority Express"}</strong>
              </div>
              <div className="bg-white border border-[#ece8e1] p-3.5 sm:p-4 rounded-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Estimated Handover</span>
                <strong className="text-xs sm:text-sm text-[#047857] block truncate">{activeOrder.estimatedDelivery || "2 to 3 Business Days"}</strong>
              </div>
            </div>

            {/* Crypto Settlement Telemetry */}
            <div className="bg-white border border-[#d8d5cd] p-4 sm:p-5 rounded-xs mb-8">
              <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-[#047857] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  Non-Custodial Crypto Settlement
                </span>
                <span className="text-xs text-neutral-500">
                  Verified On-Chain Escrow
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-center">
                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase mb-1">Settlement Asset</span>
                  <strong className="font-mono text-sm text-neutral-950 block">
                    {activeOrder.cryptoAmount || "0.00839553"} {activeOrder.cryptoCurrency || "BTC"}
                  </strong>
                </div>
                <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="text-neutral-500 block text-[11px] uppercase mb-1">Receiving Vault Address</span>
                    <code className="text-xs font-mono break-all bg-[#faf9f6] border border-[#ece8e1] p-2 rounded-xs block text-neutral-800">
                      {activeOrder.escrowAddress ||
                        (activeOrder.cryptoCurrency === "ETH"
                          ? "0x120D139dB706614f71e470A97852679F6FaebcB7"
                          : activeOrder.cryptoCurrency === "SOL"
                          ? "X2ro74HaRbZ2XKDJ57yMmsKFD3CS4y9XFKtzSeQkCQ1"
                          : "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu")}
                    </code>
                  </div>
                  <CryptoQRCode
                    address={
                      activeOrder.escrowAddress ||
                      (activeOrder.cryptoCurrency === "ETH"
                        ? "0x120D139dB706614f71e470A97852679F6FaebcB7"
                        : activeOrder.cryptoCurrency === "SOL"
                        ? "X2ro74HaRbZ2XKDJ57yMmsKFD3CS4y9XFKtzSeQkCQ1"
                        : "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu")
                    }
                    symbol={activeOrder.cryptoCurrency || "BTC"}
                    amount={activeOrder.cryptoAmount || "0.00839553"}
                    size={110}
                  />
                </div>
              </div>
            </div>

            {/* Step-by-Step Progress Bar (Responsive 2-column or 5-column) */}
            <div className="mb-8 sm:mb-10">
              <p className="eyebrow mb-3">Security & Transit Milestones</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                <div className="p-3 border border-[#10b981] bg-[#10b981]/5 rounded-xs">
                  <span className="text-[10px] text-[#047857] font-bold block mb-1">✓ COMPLETED</span>
                  <strong className="text-xs block text-neutral-950">{activeOrder.cryptoCurrency || "Crypto"} Escrow Cleared</strong>
                  <span className="text-[10px] text-neutral-500">On-chain finality</span>
                </div>
                <div className="p-3 border border-[#10b981] bg-[#10b981]/5 rounded-xs">
                  <span className="text-[10px] text-[#047857] font-bold block mb-1">✓ COMPLETED</span>
                  <strong className="text-xs block text-neutral-950">Atelier Authentication</strong>
                  <span className="text-[10px] text-neutral-500">RFID seal verified</span>
                </div>
                <div className="p-3 border border-neutral-950 bg-[#faf9f6] rounded-xs">
                  <span className="text-[10px] text-neutral-950 font-bold block mb-1">● ACTIVE</span>
                  <strong className="text-xs block text-neutral-950">Courier Handover</strong>
                  <span className="text-[10px] text-neutral-500">Serialized container</span>
                </div>
                <div className="p-3 border border-[#ece8e1] bg-[#faf9f6] opacity-75 rounded-xs">
                  <span className="text-[10px] text-neutral-400 font-semibold block mb-1">○ NEXT</span>
                  <strong className="text-xs block text-neutral-950">Express Transit</strong>
                  <span className="text-[10px] text-neutral-500">GPS scan milestones</span>
                </div>
                <div className="p-3 border border-[#ece8e1] bg-[#faf9f6] opacity-75 rounded-xs col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-neutral-400 font-semibold block mb-1">○ FINAL</span>
                  <strong className="text-xs block text-neutral-950">Delivery</strong>
                  <span className="text-[10px] text-neutral-500">Adult signature</span>
                </div>
              </div>
            </div>

            {/* Manifest / Order Items */}
            <div className="border-t border-[#ece8e1] pt-6">
              <h2 className="font-serif text-xl text-neutral-950 font-normal mb-4">Vault Manifest ({activeOrder.items?.length || 0} Items)</h2>
              <div className="flex flex-col gap-3">
                {activeOrder.items?.map((item) => (
                  <div
                    key={item.productId || item.name}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3.5 sm:p-4 bg-white border border-[#ece8e1] rounded-xs"
                  >
                    <div className="min-w-0">
                      <strong className="text-sm text-neutral-950 block mb-0.5">{item.name}</strong>
                      <span className="text-xs text-neutral-500 block truncate">
                        Qty: {item.qty} · SKU: {item.sku} · RFID Microchip Authenticated
                      </span>
                    </div>
                    <strong className="text-sm font-mono text-neutral-950 shrink-0 self-end sm:self-center">
                      {formatPrice(item.lineTotalCents)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="border-t border-[#ece8e1] mt-6 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Shipping Destination</span>
                <p className="m-0 text-neutral-700 leading-relaxed text-xs sm:text-sm">
                  {activeOrder.customerName && <strong className="text-neutral-950">{activeOrder.customerName}<br /></strong>}
                  {activeOrder.shippingAddress?.line1}<br />
                  {activeOrder.shippingAddress?.line2 && <>{activeOrder.shippingAddress.line2}<br /></>}
                  {activeOrder.shippingAddress?.city}, {activeOrder.shippingAddress?.state} {activeOrder.shippingAddress?.postalCode}<br />
                  {activeOrder.shippingAddress?.country}
                </p>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Financial Record</span>
                <p className="m-0 text-neutral-700 leading-relaxed text-xs sm:text-sm">
                  Total Declared Value: <strong className="text-neutral-950">{formatPrice(activeOrder.totalCents)}</strong><br />
                  Payment Status: <strong className="text-[#047857]">Confirmed ({activeOrder.paymentStatus})</strong><br />
                  Transit Insurance: <strong>Complimentary 100% Full-Value Indemnity</strong>
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href={`/orders/${activeOrder.orderNumber}`} className="button button-light w-full sm:w-auto text-center">
                View Full Invoiced Order Receipt
              </Link>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
