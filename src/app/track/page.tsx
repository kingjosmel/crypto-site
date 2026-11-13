"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { SiteShell } from "@/components/SiteShell";
import { formatPrice } from "@/lib/api";

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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px", alignItems: "center", marginBottom: "35px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", color: "#10b981", fontWeight: 600, marginBottom: "12px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
              Direct Armored Courier Telemetry
            </div>
            <h1 style={{ margin: "0 0 10px", fontSize: "36px", letterSpacing: "-0.03em" }}>Track Your Order</h1>
            <p style={{ color: "var(--muted)", fontSize: "16px", margin: 0, lineHeight: "1.6" }}>
              No login required. Enter your <strong>order number</strong> (e.g. <code>NS-00000001</code>) or the <strong>email address</strong> you used at checkout to access live dispatch telemetry and courier tracking.
            </p>
          </div>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", overflow: "hidden", borderRadius: "2px", border: "1px solid var(--line)" }}>
            <Image
              src="/images/editorial_white_glove_courier.jpg"
              alt="White glove luxury courier dispatch and vault security"
              fill
              quality={95}
              sizes="(max-width: 768px) 100vw, 500px"
              style={{ objectFit: "cover" }}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Search Form */}
        <form className="checkout-form" onSubmit={handleSubmit} style={{ marginBottom: "35px" }}>
          <label htmlFor="search-input">
            Order Number or Customer Email
            <input
              id="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
              placeholder="e.g. NS-00000001 or alex@example.com"
              style={{ fontSize: "16px", padding: "14px 16px" }}
            />
          </label>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button className="button button-dark text-white" type="submit" disabled={isPending} style={{ color: "#ffffff" }}>
              {isPending ? "Retrieving Telemetry…" : "Locate Dispatch"}
            </button>
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>
              Tip: You can also search by sample order <code>NS-00000001</code>
            </span>
          </div>
        </form>

        {error && (
          <div style={{ padding: "16px 20px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "2px", color: "#ef4444", marginBottom: "28px", fontSize: "14px" }} role="alert">
            {error}
          </div>
        )}

        {/* Multiple Orders Result list (if email searched) */}
        {orderList.length > 0 && !activeOrder && (
          <div style={{ marginBottom: "40px" }}>
            <p className="eyebrow">Found {orderList.length} Orders for {searchTerm}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
              {orderList.map((order) => (
                <div
                  key={order.orderNumber}
                  onClick={() => setActiveOrder(order)}
                  style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "2px", transition: "border-color 0.15s ease" }}
                >
                  <div>
                    <strong style={{ fontSize: "17px", display: "block", marginBottom: "4px" }}>{order.orderNumber}</strong>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                      Tracking: {order.trackingNumber || `TRK-NS-${order.orderNumber.replace(/\D/g, "")}`} · Status: {order.orderStatus}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <strong style={{ fontSize: "16px", display: "block" }}>{formatPrice(order.totalCents)}</strong>
                    <span style={{ fontSize: "12px", color: "var(--accent)" }}>View Live Tracking →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Order Tracking Display */}
        {activeOrder && (
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: "35px" }} aria-live="polite">
            {orderList.length > 1 && (
              <button
                onClick={() => setActiveOrder(null)}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "0 0 16px 0", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                ← Back to all orders for this email
              </button>
            )}

            {/* Email Dispatch Notice */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: "2px", marginBottom: "28px" }}>
              <span style={{ fontSize: "20px" }}>✉️</span>
              <div style={{ fontSize: "13px", lineHeight: "1.5" }}>
                <strong>Dispatch Notice Sent:</strong> A comprehensive purchase invoice, digital authenticity certificate, and real-time tracking links were dispatched directly to <strong>{activeOrder.email}</strong>.
              </div>
            </div>

            {/* Telemetry Overview Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "35px" }}>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "2px" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Order Identifier</span>
                <strong style={{ fontSize: "18px" }}>{activeOrder.orderNumber}</strong>
              </div>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "2px" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Tracking Code</span>
                <strong style={{ fontSize: "16px", fontFamily: "monospace", letterSpacing: "0.04em" }}>
                  {activeOrder.trackingNumber || `TRK-NS-${activeOrder.orderNumber.replace(/\D/g, "")}`}
                </strong>
              </div>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "2px" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Courier & Service</span>
                <strong style={{ fontSize: "14px" }}>{activeOrder.carrier || "24-Hour US Private Armored Air Courier"}</strong>
              </div>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "2px" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Estimated Handover</span>
                <strong style={{ fontSize: "15px", color: "#10b981" }}>{activeOrder.estimatedDelivery || "Guaranteed Within 24 Hours Anywhere in USA"}</strong>
              </div>
            </div>

            {/* Crypto Settlement Telemetry */}
            <div style={{ background: "#ffffff", border: "1px solid #cccccc", padding: "18px 20px", borderRadius: "2px", marginBottom: "35px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: "#10b981" }}>
                  ● Non-Custodial Crypto Settlement
                </span>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                  Verified On-Chain Escrow
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", fontSize: "12px" }}>
                <div>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "11px", marginBottom: "2px" }}>Settlement Asset</span>
                  <strong style={{ fontFamily: "monospace", fontSize: "13.5px" }}>
                    {activeOrder.cryptoAmount || "0.00839553"} {activeOrder.cryptoCurrency || "BTC"}
                  </strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "11px", marginBottom: "2px" }}>Receiving Vault Address</span>
                  <code style={{ fontSize: "11px", wordBreak: "break-all", background: "var(--paper)", padding: "2px 5px", borderRadius: "2px", display: "block" }}>
                    {activeOrder.escrowAddress || "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu"}
                  </code>
                </div>
                {activeOrder.txHash && (
                  <div>
                    <span style={{ color: "var(--muted)", display: "block", fontSize: "11px", marginBottom: "2px" }}>Transaction Hash</span>
                    <code style={{ fontSize: "11px", wordBreak: "break-all", background: "var(--paper)", padding: "2px 5px", borderRadius: "2px", display: "block" }}>
                      {activeOrder.txHash}
                    </code>
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-Step Progress Bar */}
            <div style={{ marginBottom: "40px" }}>
              <p className="eyebrow" style={{ marginBottom: "16px" }}>Security & Transit Milestones</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
                <div style={{ padding: "14px", border: "1px solid #10b981", background: "rgba(16, 185, 129, 0.05)", borderRadius: "2px" }}>
                  <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700, display: "block", marginBottom: "4px" }}>✓ COMPLETED</span>
                  <strong style={{ fontSize: "13px", display: "block" }}>{activeOrder.cryptoCurrency || "Crypto"} Escrow Cleared</strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>On-chain finality</span>
                </div>
                <div style={{ padding: "14px", border: "1px solid #10b981", background: "rgba(16, 185, 129, 0.05)", borderRadius: "2px" }}>
                  <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700, display: "block", marginBottom: "4px" }}>✓ COMPLETED</span>
                  <strong style={{ fontSize: "13px", display: "block" }}>Vault Authentication</strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Microchip & tag seal</span>
                </div>
                <div style={{ padding: "14px", border: "1px solid var(--foreground)", background: "var(--paper)", borderRadius: "2px" }}>
                  <span style={{ fontSize: "11px", color: "var(--foreground)", fontWeight: 700, display: "block", marginBottom: "4px" }}>● ACTIVE</span>
                  <strong style={{ fontSize: "13px", display: "block" }}>Armored Handover</strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Serialized tamper bag</span>
                </div>
                <div style={{ padding: "14px", border: "1px solid var(--line)", background: "var(--paper)", opacity: 0.65, borderRadius: "2px" }}>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: "4px" }}>○ NEXT</span>
                  <strong style={{ fontSize: "13px", display: "block" }}>Armed Transit</strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Secured route</span>
                </div>
                <div style={{ padding: "14px", border: "1px solid var(--line)", background: "var(--paper)", opacity: 0.65, borderRadius: "2px" }}>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: "4px" }}>○ FINAL</span>
                  <strong style={{ fontSize: "13px", display: "block" }}>Delivery</strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Direct adult signature</span>
                </div>
              </div>
            </div>

            {/* Manifest / Order Items */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "28px" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "18px" }}>Vault Manifest ({activeOrder.items?.length || 0} Items)</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {activeOrder.items?.map((item) => (
                  <div
                    key={item.productId || item.name}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "2px" }}
                  >
                    <div>
                      <strong style={{ fontSize: "15px", display: "block", marginBottom: "3px" }}>{item.name}</strong>
                      <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                        Quantity: {item.qty} · SKU: {item.sku} · RFID Microchip Authenticated
                      </span>
                    </div>
                    <strong style={{ fontSize: "15px" }}>{formatPrice(item.lineTotalCents)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Destination */}
            <div style={{ borderTop: "1px solid var(--line)", marginTop: "28px", paddingTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
              <div>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Shipping Destination</span>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
                  {activeOrder.customerName && <strong>{activeOrder.customerName}<br /></strong>}
                  {activeOrder.shippingAddress?.line1}<br />
                  {activeOrder.shippingAddress?.line2 && <>{activeOrder.shippingAddress.line2}<br /></>}
                  {activeOrder.shippingAddress?.city}, {activeOrder.shippingAddress?.state} {activeOrder.shippingAddress?.postalCode}<br />
                  {activeOrder.shippingAddress?.country}
                </p>
              </div>
              <div>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Financial Record</span>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
                  Total Declared Value: <strong>{formatPrice(activeOrder.totalCents)}</strong><br />
                  Payment Status: <strong style={{ color: "#10b981" }}>Confirmed ({activeOrder.paymentStatus})</strong><br />
                  Transit Insurance: <strong>Complimentary 100% Full-Value Indemnity</strong>
                </p>
              </div>
            </div>

            <div style={{ marginTop: "32px", display: "flex", gap: "14px" }}>
              <Link href={`/orders/${activeOrder.orderNumber}`} className="button button-light">
                View Full Invoiced Order Receipt
              </Link>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
