"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { SiteShell } from "@/components/SiteShell";
import { formatPrice } from "@/lib/api";
import { INITIAL_PRODUCTS } from "@/lib/catalogData";

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
  refundWallet?: string;
  txHash?: string;
  confirmations?: number;
  explorerUrl?: string;
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
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [walletEmail, setWalletEmail] = useState("");
  const [walletAddressInput, setWalletAddressInput] = useState("");
  const [walletStatus, setWalletStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSavingWallet, setIsSavingWallet] = useState(false);
  const [isCheckingChain, setIsCheckingChain] = useState(false);
  const [chainCheckNotice, setChainCheckNotice] = useState<string | null>(null);

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
    setWalletStatus(null);
    setShowWalletForm(false);
    void executeSearch(searchTerm);
  }

  async function handleSaveRefundWallet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeOrder) return;
    setIsSavingWallet(true);
    setWalletStatus(null);

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(activeOrder.orderNumber)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: walletEmail.trim() || activeOrder.email,
          refundWallet: walletAddressInput.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update Refund Return Wallet.");
      }
      setActiveOrder({ ...activeOrder, refundWallet: data.refundWallet });
      setWalletStatus({ type: "success", message: `Refund Return Wallet saved for ${activeOrder.orderNumber}.` });
      setShowWalletForm(false);
    } catch (err) {
      setWalletStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Could not save Refund Return Wallet.",
      });
    } finally {
      setIsSavingWallet(false);
    }
  }

  async function handleCheckChainPayment() {
    if (!activeOrder) return;
    setIsCheckingChain(true);
    setChainCheckNotice(null);
    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(activeOrder.orderNumber)}/verify-payment`,
        { cache: "no-store" }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to verify on-chain status.");
      }
      if (data.order) {
        setActiveOrder(data.order);
      } else {
        setActiveOrder({
          ...activeOrder,
          paymentStatus: data.status || activeOrder.paymentStatus,
          txHash: data.txHash || activeOrder.txHash,
          confirmations: data.confirmations ?? activeOrder.confirmations,
          explorerUrl: data.explorerUrl || activeOrder.explorerUrl,
        });
      }
      setChainCheckNotice(data.message || "Checked blockchain status.");
    } catch (err) {
      setChainCheckNotice(err instanceof Error ? err.message : "Could not check blockchain right now.");
    } finally {
      setIsCheckingChain(false);
    }
  }

  const isPaid = activeOrder?.paymentStatus === "paid";
  const isConfirming = activeOrder?.paymentStatus === "confirming";
  const isDispatched =
    activeOrder?.fulfillmentStatus === "shipped" || activeOrder?.fulfillmentStatus === "delivered";
  const isDelivered = activeOrder?.fulfillmentStatus === "delivered";

  return (
    <SiteShell>
      <section className="account-panel">
        {/* Header Hero */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px", alignItems: "center", marginBottom: "35px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", color: "#10b981", fontWeight: 600, marginBottom: "12px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
              Insured Express Courier Tracking
            </div>
            <h1 style={{ margin: "0 0 10px", fontSize: "36px", letterSpacing: "-0.03em" }}>Track Your Order</h1>
            <p style={{ color: "var(--muted)", fontSize: "16px", margin: 0, lineHeight: "1.6" }}>
              Enter your <strong>order number</strong> (e.g. <code>NS-00000001</code>) or the <strong>email address</strong> used at checkout to check payment confirmation, pre-shipment inspection, and courier delivery milestones.
            </p>
          </div>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", overflow: "hidden", borderRadius: "2px", border: "1px solid var(--line)" }}>
            <Image
              src="/images/editorial_white_glove_courier.jpg"
              alt="Insured express luxury courier dispatch and packaging"
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
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <button className="button button-dark text-white" type="submit" disabled={isPending} style={{ color: "#ffffff" }}>
              {isPending ? "Retrieving Status…" : "Locate Order"}
            </button>
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>
              Tip: Try sample order <code>NS-00000001</code>
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
                    <span style={{ fontSize: "12px", color: "var(--accent)" }}>View Tracking →</span>
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

            {/* Payment / Dispatch Notice */}
            {isPaid ? (
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: "2px", marginBottom: "28px" }}>
                <div style={{ fontSize: "13px", lineHeight: "1.5" }}>
                  <strong>Payment Confirmed:</strong>{" "}
                  {isDispatched
                    ? `Your order has been collected by ${activeOrder.carrier || "our insured courier"} and is in transit. Updates are sent to `
                    : "On-chain payment is verified. Our specialists are completing pre-shipment inspection and packaging before courier collection. Updates go to "}
                  <strong>{activeOrder.email}</strong>.
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "14px", padding: "16px 20px", background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.35)", borderRadius: "2px", marginBottom: "28px" }}>
                <div style={{ fontSize: "13px", lineHeight: "1.5", flex: "1 1 280px" }}>
                  <strong>
                    {isConfirming
                      ? "Transfer Detected in Mempool — Confirming:"
                      : "Awaiting On-Chain Payment:"}
                  </strong>{" "}
                  {isConfirming
                    ? `We detected your ${activeOrder.cryptoCurrency || "crypto"} transfer on-chain. Pre-shipment inspection activates once confirmation completes.`
                    : `Order ${activeOrder.orderNumber} is reserved. Send ${activeOrder.cryptoAmount || ""} ${activeOrder.cryptoCurrency || "BTC"} to the deposit address below to begin fulfillment.`}
                  {chainCheckNotice && (
                    <span style={{ display: "block", marginTop: "6px", color: "#92400e", fontSize: "12px" }}>
                      {chainCheckNotice}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void handleCheckChainPayment()}
                  disabled={isCheckingChain}
                  className="button button-dark text-white"
                  style={{ color: "#ffffff", padding: "10px 16px", fontSize: "12px" }}
                >
                  {isCheckingChain ? "Checking Blockchain…" : "Check On-Chain Payment"}
                </button>
              </div>
            )}

            {/* Telemetry Overview Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "35px" }}>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "2px" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Order Number</span>
                <strong style={{ fontSize: "18px" }}>{activeOrder.orderNumber}</strong>
              </div>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "2px" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Courier Tracking Number</span>
                <strong style={{ fontSize: "16px", fontFamily: "monospace", letterSpacing: "0.04em" }}>
                  {isDispatched
                    ? activeOrder.trackingNumber || `TRK-NS-${activeOrder.orderNumber.replace(/\D/g, "")}`
                    : "Assigned upon courier pickup"}
                </strong>
              </div>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "2px" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Courier &amp; Service</span>
                <strong style={{ fontSize: "14px" }}>
                  {activeOrder.carrier || "FedEx Priority Overnight / UPS Next Day Air (Insured)"}
                </strong>
              </div>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "2px" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Estimated Delivery</span>
                <strong style={{ fontSize: "15px", color: isPaid ? "#10b981" : "#b45309" }}>
                  {isPaid
                    ? activeOrder.estimatedDelivery || "1–2 Business Days via Insured Express Courier (USA)"
                    : "Pending Payment Verification"}
                </strong>
              </div>
            </div>

            {/* Honest 5-Step Progress Milestones */}
            <div style={{ marginBottom: "35px" }}>
              <p className="eyebrow" style={{ marginBottom: "16px" }}>Order &amp; Fulfillment Milestones</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
                <div
                  style={{
                    padding: "14px",
                    border: isPaid ? "1px solid #10b981" : "1px solid #d97706",
                    background: isPaid ? "rgba(16, 185, 129, 0.05)" : "rgba(245, 158, 11, 0.06)",
                    borderRadius: "2px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: isPaid ? "#10b981" : "#b45309",
                      fontWeight: 700,
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {isPaid ? "✓ COMPLETED" : isConfirming ? "● CONFIRMING" : "● AWAITING"}
                  </span>
                  <strong style={{ fontSize: "13px", display: "block" }}>
                    {isPaid ? "Order Confirmed" : `${activeOrder.cryptoCurrency || "Crypto"} Listener`}
                  </strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                    {isPaid ? "Payment received" : isConfirming ? "Mempool detected" : "Awaiting incoming funds"}
                  </span>
                </div>

                <div
                  style={{
                    padding: "14px",
                    border: isPaid ? (isDispatched ? "1px solid #10b981" : "1px solid var(--foreground)") : "1px solid var(--line)",
                    background: isDispatched ? "rgba(16, 185, 129, 0.05)" : "var(--paper)",
                    opacity: isPaid ? 1 : 0.65,
                    borderRadius: "2px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: isDispatched ? "#10b981" : isPaid ? "var(--foreground)" : "var(--muted)",
                      fontWeight: 700,
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {isDispatched ? "✓ COMPLETED" : isPaid ? "● IN PROGRESS" : "○ PENDING"}
                  </span>
                  <strong style={{ fontSize: "13px", display: "block" }}>Quality Inspection</strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Inspected &amp; prepared</span>
                </div>

                <div
                  style={{
                    padding: "14px",
                    border: isDispatched ? "1px solid #10b981" : "1px solid var(--line)",
                    background: isDispatched ? "rgba(16, 185, 129, 0.05)" : "var(--paper)",
                    opacity: isDispatched ? 1 : 0.65,
                    borderRadius: "2px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: isDispatched ? "#10b981" : "var(--muted)",
                      fontWeight: 700,
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {isDispatched ? "✓ DISPATCHED" : "○ AWAITING PICKUP"}
                  </span>
                  <strong style={{ fontSize: "13px", display: "block" }}>Dispatched</strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                    {isDispatched ? "Courier collected parcel" : "Not yet handed to courier"}
                  </span>
                </div>

                <div
                  style={{
                    padding: "14px",
                    border: isDelivered ? "1px solid #10b981" : isDispatched ? "1px solid var(--foreground)" : "1px solid var(--line)",
                    background: isDelivered ? "rgba(16, 185, 129, 0.05)" : "var(--paper)",
                    opacity: isDispatched ? 1 : 0.65,
                    borderRadius: "2px",
                  }}
                >
                  <span style={{ fontSize: "11px", color: isDelivered ? "#10b981" : isDispatched ? "var(--foreground)" : "var(--muted)", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    {isDelivered ? "✓ COMPLETED" : isDispatched ? "● IN TRANSIT" : "○ NEXT"}
                  </span>
                  <strong style={{ fontSize: "13px", display: "block" }}>In Transit</strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Shipment tracking active</span>
                </div>

                <div
                  style={{
                    padding: "14px",
                    border: isDelivered ? "1px solid #10b981" : "1px solid var(--line)",
                    background: isDelivered ? "rgba(16, 185, 129, 0.05)" : "var(--paper)",
                    opacity: isDelivered ? 1 : 0.65,
                    borderRadius: "2px",
                  }}
                >
                  <span style={{ fontSize: "11px", color: isDelivered ? "#10b981" : "var(--muted)", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    {isDelivered ? "✓ DELIVERED" : "○ FINAL"}
                  </span>
                  <strong style={{ fontSize: "13px", display: "block" }}>Delivered</strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Adult signature confirmation</span>
                </div>
              </div>
            </div>

            {/* Shipping Insurance, Signature & Delay Disclosure Box */}
            <div style={{ background: "#fafafa", border: "1px solid #dcdcdc", padding: "16px 20px", borderRadius: "2px", marginBottom: "35px", fontSize: "12px", color: "#444", lineHeight: 1.6 }}>
              <strong style={{ display: "block", color: "#111", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "11px" }}>
                Shipping Insurance, Signature Requirement &amp; Carrier Delays
              </strong>
              <p style={{ margin: "0 0 6px" }}>
                All high-value shipments carry <strong>100% declared-value insurance</strong> and require a <strong>direct adult signature</strong> upon delivery. Packages are never released without signature.
              </p>
              <p style={{ margin: 0 }}>
                Orders are marked Dispatched only after courier collection. Severe weather, hub sorting holds, or federal holidays can affect transit schedules; if a delay occurs, contact{" "}
                <a href="mailto:support@shopnorthstar.store" style={{ color: "#111", textDecoration: "underline" }}>
                  support@shopnorthstar.store
                </a>{" "}
                or review{" "}
                <Link href="/buyer-protection" style={{ color: "#047857", textDecoration: "underline", fontWeight: 600 }}>
                  Northstar Buyer Protection
                </Link>
                .
              </p>
            </div>

            {/* Crypto Settlement Telemetry */}
            <div style={{ background: "#ffffff", border: "1px solid #cccccc", padding: "18px 20px", borderRadius: "2px", marginBottom: "35px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                    color: isPaid ? "#10b981" : "#b45309",
                  }}
                >
                  {isPaid
                    ? "✓ On-Chain Settlement Verified"
                    : isConfirming
                    ? "● Mempool Transfer Detected · Confirming"
                    : "○ Awaiting On-Chain Crypto Transfer"}
                </span>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                  14-Day Return Protection
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", fontSize: "12px" }}>
                <div>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "11px", marginBottom: "2px" }}>
                    Settlement Asset
                  </span>
                  <strong style={{ fontFamily: "monospace", fontSize: "13.5px" }}>
                    {activeOrder.cryptoAmount || "0.00839553"} {activeOrder.cryptoCurrency || "BTC"}
                  </strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "11px", marginBottom: "2px" }}>Receiving Address</span>
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
                    {activeOrder.explorerUrl && (
                      <a
                        href={activeOrder.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "11px", color: "#047857", textDecoration: "underline", display: "inline-block", marginTop: "4px" }}
                      >
                        View on Explorer ↗
                      </a>
                    )}
                  </div>
                )}
                {activeOrder.refundWallet && (
                  <div>
                    <span style={{ color: "var(--muted)", display: "block", fontSize: "11px", marginBottom: "2px" }}>Registered Refund Return Wallet</span>
                    <code style={{ fontSize: "11px", wordBreak: "break-all", background: "var(--paper)", padding: "2px 5px", borderRadius: "2px", display: "block", color: "#047857" }}>
                      {activeOrder.refundWallet}
                    </code>
                  </div>
                )}
              </div>

              <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #eeeeee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                    {activeOrder.refundWallet
                      ? "Approved 14-day returns settle directly to your registered Refund Return Wallet."
                      : "Paid from an exchange? Register a personal Refund Return Wallet for 14-day return payouts."}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setWalletEmail(activeOrder.email || "");
                      setWalletAddressInput(activeOrder.refundWallet || "");
                      setWalletStatus(null);
                      setShowWalletForm((prev) => !prev);
                    }}
                    style={{ fontSize: "11px", fontWeight: 600, color: "#047857", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                  >
                    {showWalletForm ? "Cancel" : activeOrder.refundWallet ? "Update Return Wallet" : "+ Register Return Wallet"}
                  </button>
                </div>

                {walletStatus && (
                  <div
                    role="status"
                    style={{
                      marginTop: "10px",
                      padding: "8px 10px",
                      fontSize: "12px",
                      borderRadius: "2px",
                      background: walletStatus.type === "success" ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                      border: `1px solid ${walletStatus.type === "success" ? "rgba(16, 185, 129, 0.35)" : "rgba(239, 68, 68, 0.35)"}`,
                      color: walletStatus.type === "success" ? "#047857" : "#b91c1c",
                    }}
                  >
                    {walletStatus.message}
                  </div>
                )}

                {showWalletForm && (
                  <form onSubmit={handleSaveRefundWallet} style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", alignItems: "end" }}>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>
                      Confirm Order Email
                      <input
                        type="email"
                        required
                        value={walletEmail}
                        onChange={(e) => setWalletEmail(e.target.value)}
                        placeholder={activeOrder.email}
                        style={{ width: "100%", marginTop: "4px", padding: "8px 10px", fontSize: "12px", border: "1px solid #cccccc", background: "#fafafa" }}
                      />
                    </label>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>
                      Personal {activeOrder.cryptoCurrency || "BTC"} Return Wallet Address
                      <input
                        type="text"
                        required
                        value={walletAddressInput}
                        onChange={(e) => setWalletAddressInput(e.target.value)}
                        placeholder={`Your personal ${activeOrder.cryptoCurrency || "BTC"} address`}
                        style={{ width: "100%", marginTop: "4px", padding: "8px 10px", fontSize: "12px", fontFamily: "monospace", border: "1px solid #cccccc", background: "#fafafa" }}
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={isSavingWallet}
                      className="button button-dark text-white"
                      style={{ color: "#ffffff", padding: "9px 14px", fontSize: "11px" }}
                    >
                      {isSavingWallet ? "Saving…" : "Save Return Wallet"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Manifest / Order Items */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "28px" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "18px" }}>Order Items ({activeOrder.items?.length || 0} Items)</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {activeOrder.items?.map((item) => {
                  const catalogProd = INITIAL_PRODUCTS.find((p) => p._id === item.productId || p.sku === item.sku);
                  return (
                    <div
                      key={item.productId || item.name}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", padding: "16px 20px", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "2px" }}
                    >
                      <div>
                        <strong style={{ fontSize: "15px", display: "block", marginBottom: "3px" }}>{item.name}</strong>
                        <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                          Quantity: {item.qty} · SKU: {item.sku} · Northstar Verified
                        </span>
                        {isPaid && catalogProd && (
                          <div style={{ marginTop: "6px" }}>
                            <Link
                              href={`/product/${catalogProd.slug}#verified-reviews`}
                              style={{ fontSize: "12px", color: "#047857", fontWeight: 600, textDecoration: "underline" }}
                            >
                              Write a Verified Product Review →
                            </Link>
                          </div>
                        )}
                      </div>
                      <strong style={{ fontSize: "15px" }}>{formatPrice(item.lineTotalCents)}</strong>
                    </div>
                  );
                })}
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
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Financial &amp; Coverage Record</span>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
                  Total Declared Value: <strong>{formatPrice(activeOrder.totalCents)}</strong><br />
                  Payment Status:{" "}
                  <strong style={{ color: isPaid ? "#10b981" : "#b45309" }}>
                    {isPaid
                      ? `Confirmed (${activeOrder.paymentStatus})`
                      : isConfirming
                      ? "Confirming on-chain (confirming)"
                      : "Awaiting On-Chain Payment (awaiting_payment)"}
                  </strong>
                  <br />
                  Transit Insurance: <strong>100% Full-Value Insured Coverage</strong>
                </p>
              </div>
            </div>

            <div style={{ marginTop: "32px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link href={`/orders/${activeOrder.orderNumber}`} className="button button-light">
                View Full Order Receipt
              </Link>
              <Link href="/buyer-protection" className="button button-light">
                Buyer Protection Policy
              </Link>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
