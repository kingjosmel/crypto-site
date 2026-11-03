"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { formatPrice } from "@/lib/api";
import { CART_KEY, parseCart, type CartItem } from "@/lib/cart";

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
    address: "bc1q7x9w4k8zlp2mn00u9jrh3tyv5as8d7x8f9g4kp",
    rateUsd: 85000,
    decimals: 8,
    confirmations: "2 Block Confirmations (~20 min)",
    accentColor: "#f7931a",
    badgeBg: "rgba(247, 147, 26, 0.12)",
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    icon: "Ξ",
    network: "Ethereum Mainnet (ERC-20)",
    address: "0x71C8A6924dF17FEd1aA328906322B69041b31526",
    rateUsd: 2600,
    decimals: 6,
    confirmations: "12 Block Confirmations (~3 min)",
    accentColor: "#627eea",
    badgeBg: "rgba(98, 126, 234, 0.12)",
  },
  SOL: {
    symbol: "SOL",
    name: "Solana",
    icon: "◎",
    network: "Solana Mainnet (SPL)",
    address: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
    rateUsd: 180,
    decimals: 4,
    confirmations: "32 Confirmations (~15 sec)",
    accentColor: "#14f195",
    badgeBg: "rgba(20, 241, 149, 0.12)",
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
  window.addEventListener("northstar-cart-change", callback);
  return () => window.removeEventListener("northstar-cart-change", callback);
};
const getSnapshot = () => localStorage.getItem(CART_KEY) ?? "[]";

// Clean SVG QR matrix styled for vault crypto deposit
function VaultCryptoQR({ symbol, color }: { symbol: CryptoCurrency; color: string }) {
  return (
    <div className="relative w-36 h-36 bg-white p-2 border border-[#d6d2c8] rounded-xs shadow-inner shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="#111111">
        {/* Top-Left Finder Square */}
        <rect x="6" y="6" width="24" height="24" fill="#111" rx="2" />
        <rect x="10" y="10" width="16" height="16" fill="#fff" />
        <rect x="14" y="14" width="8" height="8" fill={color} />

        {/* Top-Right Finder Square */}
        <rect x="70" y="6" width="24" height="24" fill="#111" rx="2" />
        <rect x="74" y="10" width="16" height="16" fill="#fff" />
        <rect x="78" y="14" width="8" height="8" fill={color} />

        {/* Bottom-Left Finder Square */}
        <rect x="6" y="70" width="24" height="24" fill="#111" rx="2" />
        <rect x="10" y="74" width="16" height="16" fill="#fff" />
        <rect x="14" y="78" width="8" height="8" fill={color} />

        {/* Timing Pattern Lines */}
        <line x1="34" y1="18" x2="66" y2="18" stroke="#333" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="18" y1="34" x2="18" y2="66" stroke="#333" strokeWidth="2" strokeDasharray="3,3" />

        {/* Data Pattern Representation */}
        <rect x="36" y="24" width="4" height="4" />
        <rect x="44" y="24" width="4" height="4" />
        <rect x="52" y="24" width="4" height="4" />
        <rect x="60" y="24" width="4" height="4" />

        <rect x="24" y="36" width="4" height="4" />
        <rect x="24" y="44" width="4" height="4" />
        <rect x="24" y="52" width="4" height="4" />
        <rect x="24" y="60" width="4" height="4" />

        <rect x="72" y="36" width="4" height="4" />
        <rect x="80" y="36" width="4" height="4" />
        <rect x="76" y="44" width="4" height="4" />
        <rect x="84" y="52" width="4" height="4" />
        <rect x="72" y="60" width="4" height="4" />

        <rect x="36" y="72" width="4" height="4" />
        <rect x="44" y="76" width="4" height="4" />
        <rect x="52" y="72" width="4" height="4" />
        <rect x="60" y="80" width="4" height="4" />
        <rect x="64" y="72" width="4" height="4" />

        <rect x="72" y="72" width="4" height="4" />
        <rect x="80" y="76" width="4" height="4" />
        <rect x="76" y="84" width="4" height="4" />
        <rect x="84" y="84" width="4" height="4" />
      </svg>
      {/* Center Crypto Icon Badge */}
      <div
        className="absolute inset-0 m-auto w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center font-bold text-xs"
        style={{ backgroundColor: color, color: "#ffffff" }}
      >
        {symbol === "BTC" ? "₿" : symbol === "ETH" ? "Ξ" : "◎"}
      </div>
    </div>
  );
}

export function CheckoutForm() {
  const cartSnapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const cart: CartItem[] = parseCart(cartSnapshot);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [cryptoCurrency, setCryptoCurrency] = useState<CryptoCurrency>("BTC");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Cart summary calculations
  const subtotalCents = cart.reduce((acc, item) => acc + item.priceCents * item.qty, 0);
  const shippingCents = 0; // Complimentary White Glove Insured Courier
  const taxCents = Math.round((subtotalCents * 825) / 10000);
  const totalCents = subtotalCents + shippingCents + taxCents;

  const currentCrypto = CRYPTO_CONFIG[cryptoCurrency];
  const calculatedCryptoAmount = ((totalCents / 100) / currentCrypto.rateUsd).toFixed(currentCrypto.decimals);

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

      // Order created and tracking dispatched to email!
      setCompletedOrder({
        orderNumber: data.orderNumber,
        trackingNumber: data.trackingNumber,
        carrier: data.carrier || "Armored White-Glove Logistics & Priority Courier",
        estimatedDelivery: data.estimatedDelivery || "2-3 Business Days",
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

      // Clear the shopping cart
      localStorage.setItem(CART_KEY, "[]");
      window.dispatchEvent(new Event("northstar-cart-change"));
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

  // If order was placed successfully, display Confirmation & Live Tracking View
  if (completedOrder) {
    const coinConfig = CRYPTO_CONFIG[completedOrder.cryptoCurrency];

    return (
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "10px 0 50px" }}>
        {/* Success Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.12)", border: "2px solid #10b981", color: "#10b981", fontSize: "28px", margin: "0 auto 16px" }}>
            ✓
          </div>
          <p className="eyebrow" style={{ color: "#10b981", margin: "0 0 6px" }}>
            Crypto Payment Settled · Live Tracking Dispatched
          </p>
          <h1 style={{ fontSize: "36px", letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            Acquisition Confirmed
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "16px", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Your cryptocurrency transfer has been registered by the vault node. A detailed receipt, certificate of provenance, and real-time courier tracking were dispatched directly to your email.
          </p>
        </div>

        {/* Prominent Email Dispatch Banner */}
        <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "20px 24px", borderRadius: "2px", marginBottom: "30px", display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "28px" }}>✉️</span>
          <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
            <strong style={{ color: "var(--foreground)" }}>Tracking Details Dispatched:</strong> We have sent your order invoice, authenticity verification passport, and live tracking code to <strong style={{ color: "#10b981" }}>{completedOrder.email}</strong>. No account login is needed to monitor your package.
          </div>
        </div>

        {/* Crypto Settlement Receipt Panel */}
        <div style={{ border: `1px solid ${coinConfig.accentColor}`, background: coinConfig.badgeBg, padding: "22px 24px", borderRadius: "2px", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: coinConfig.accentColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "16px" }}>
                {coinConfig.icon}
              </span>
              <div>
                <strong style={{ fontSize: "15px", display: "block" }}>
                  {coinConfig.name} ({coinConfig.symbol}) Settlement Escrow
                </strong>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>{coinConfig.network}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block" }}>Total Settled</span>
              <strong style={{ fontSize: "17px", fontFamily: "monospace", color: coinConfig.accentColor }}>
                {completedOrder.cryptoAmount} {completedOrder.cryptoCurrency}
              </strong>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", background: "#ffffff", padding: "16px", borderRadius: "2px", border: "1px solid var(--line)" }}>
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>
                Vault Escrow Address
              </span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <code style={{ fontSize: "11.5px", wordBreak: "break-all", background: "var(--paper)", padding: "4px 6px", borderRadius: "2px" }}>
                  {completedOrder.escrowAddress}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(completedOrder.escrowAddress, "escrow")}
                  style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "12px", textDecoration: "underline", flexShrink: 0 }}
                >
                  {copiedField === "escrow" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>
                On-Chain Transaction Hash
              </span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <code style={{ fontSize: "11.5px", wordBreak: "break-all", background: "var(--paper)", padding: "4px 6px", borderRadius: "2px" }}>
                  {completedOrder.txHash}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(completedOrder.txHash, "txHash")}
                  style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "12px", textDecoration: "underline", flexShrink: 0 }}
                >
                  {copiedField === "txHash" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "2px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Order Reference</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <strong style={{ fontSize: "17px", letterSpacing: "0.02em" }}>{completedOrder.orderNumber}</strong>
              <button
                type="button"
                onClick={() => copyToClipboard(completedOrder.orderNumber, "order")}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "12px", textDecoration: "underline" }}
              >
                {copiedField === "order" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "2px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Armored Tracking Code</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <strong style={{ fontSize: "15px", fontFamily: "monospace", letterSpacing: "0.04em" }}>{completedOrder.trackingNumber}</strong>
              <button
                type="button"
                onClick={() => copyToClipboard(completedOrder.trackingNumber, "track")}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "12px", textDecoration: "underline" }}
              >
                {copiedField === "track" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "2px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Carrier Service</span>
            <strong style={{ fontSize: "14px", display: "block" }}>{completedOrder.carrier}</strong>
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "2px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Estimated Handover</span>
            <strong style={{ fontSize: "14px", color: "#10b981", display: "block" }}>{completedOrder.estimatedDelivery}</strong>
          </div>
        </div>

        {/* Milestone Steps */}
        <div style={{ border: "1px solid var(--line)", background: "var(--paper)", padding: "24px", borderRadius: "2px", marginBottom: "32px" }}>
          <p className="eyebrow" style={{ marginBottom: "16px" }}>Transit Milestones</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
            <div style={{ padding: "12px", border: "1px solid #10b981", background: "rgba(16, 185, 129, 0.05)", borderRadius: "2px" }}>
              <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700, display: "block", marginBottom: "2px" }}>✓ COMPLETED</span>
              <strong style={{ fontSize: "13px", display: "block" }}>{completedOrder.cryptoCurrency} Escrow Cleared</strong>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>On-chain finality</span>
            </div>
            <div style={{ padding: "12px", border: "1px solid #10b981", background: "rgba(16, 185, 129, 0.05)", borderRadius: "2px" }}>
              <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700, display: "block", marginBottom: "2px" }}>✓ COMPLETED</span>
              <strong style={{ fontSize: "13px", display: "block" }}>RFID Sealed</strong>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>Provenance locked</span>
            </div>
            <div style={{ padding: "12px", border: "1px solid var(--foreground)", background: "var(--card)", borderRadius: "2px" }}>
              <span style={{ fontSize: "11px", color: "var(--foreground)", fontWeight: 700, display: "block", marginBottom: "2px" }}>● ACTIVE</span>
              <strong style={{ fontSize: "13px", display: "block" }}>Vault Dispatch</strong>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>Tamper-evident wrap</span>
            </div>
            <div style={{ padding: "12px", border: "1px solid var(--line)", opacity: 0.6, borderRadius: "2px" }}>
              <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: "2px" }}>○ NEXT</span>
              <strong style={{ fontSize: "13px", display: "block" }}>Armored Transit</strong>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>Secured escort</span>
            </div>
            <div style={{ padding: "12px", border: "1px solid var(--line)", opacity: 0.6, borderRadius: "2px" }}>
              <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: "2px" }}>○ FINAL</span>
              <strong style={{ fontSize: "13px", display: "block" }}>Signature Delivery</strong>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>Recipient verified</span>
            </div>
          </div>
        </div>

        {/* Ordered Items Manifest */}
        <div style={{ border: "1px solid var(--line)", background: "var(--paper)", padding: "24px", borderRadius: "2px", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Acquisition Manifest ({completedOrder.items?.length || 0} Items)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {completedOrder.items?.map((item) => (
              <div key={item.productId || item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
                <div>
                  <strong style={{ fontSize: "15px", display: "block" }}>{item.name}</strong>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                    Quantity: {item.qty} · SKU: {item.sku}
                  </span>
                </div>
                <strong style={{ fontSize: "15px" }}>{formatPrice(item.lineTotalCents)}</strong>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", fontSize: "16px" }}>
              <span>Total Declared Value:</span>
              <div style={{ textAlign: "right" }}>
                <strong style={{ fontSize: "18px", display: "block" }}>{formatPrice(completedOrder.totalCents)}</strong>
                <span style={{ fontSize: "13px", color: coinConfig.accentColor, fontFamily: "monospace", fontWeight: "bold" }}>
                  ≈ {completedOrder.cryptoAmount} {completedOrder.cryptoCurrency}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={`/track?order=${encodeURIComponent(completedOrder.orderNumber)}`} className="button button-dark text-white" style={{ padding: "14px 28px", color: "#ffffff" }}>
            <span style={{ color: "#ffffff" }}>Track Live Order Telemetry →</span>
          </Link>
          <Link href={`/orders/${encodeURIComponent(completedOrder.orderNumber)}`} className="button button-light" style={{ padding: "14px 24px" }}>
            View Full Printable Receipt
          </Link>
          <Link href="/shop" className="button button-light" style={{ padding: "14px 24px" }}>
            Explore More Pieces
          </Link>
        </div>
      </div>
    );
  }

  // If cart is empty, show empty state
  if (!cart.length) {
    return (
      <div className="state-panel" style={{ maxWidth: "700px" }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: "2px", marginBottom: "28px", border: "1px solid var(--line)" }}>
          <Image
            src="/images/editorial_collection_curation.jpg"
            alt="Northstar Curated Archive"
            fill
            quality={95}
            sizes="(max-width: 768px) 100vw, 700px"
            style={{ objectFit: "cover" }}
            referrerPolicy="no-referrer"
          />
        </div>
        <p className="eyebrow">Checkout</p>
        <h1>Your bag is currently empty.</h1>
        <p>Explore our seasonal collection of luxury apparel, Goyard trunks, and haute horlogerie.</p>
        <Link className="button button-dark text-white" href="/shop" style={{ color: "#ffffff" }}>
          <span style={{ color: "#ffffff" }}>Browse the collection</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-layout">
      {/* Checkout Form */}
      <form className="checkout-form" onSubmit={handleSubmitOrder}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "3px 10px", borderRadius: "100px", fontSize: "11px", color: "#10b981", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Guest Checkout · No Login Required
          </div>
          <h1 style={{ margin: "4px 0 8px", fontSize: "32px", letterSpacing: "-0.02em" }}>Shipping & Delivery</h1>
          <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>
            Enter your email to receive immediate order confirmation, invoice, and live courier tracking.
          </p>
        </div>

        {/* Contact Fieldset */}
        <fieldset>
          <legend>Client Contact</legend>
          <label htmlFor="email">
            Email Address <span style={{ color: "#10b981", fontWeight: 600 }}>(Receipt & tracking sent here)</span>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="e.g. alexander@client.com"
            />
          </label>
          <div className="form-grid">
            <label htmlFor="fullName">
              Full Name
              <input id="fullName" name="fullName" required autoComplete="name" placeholder="Full legal name" />
            </label>
            <label htmlFor="phone">
              Mobile Phone
              <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="For courier arrival" />
            </label>
          </div>
        </fieldset>

        {/* Shipping Address */}
        <fieldset>
          <legend>Delivery Address (US Direct Escort)</legend>
          <label htmlFor="line1">
            Street Address
            <input id="line1" name="line1" required autoComplete="shipping street-address" placeholder="123 Luxury Way" />
          </label>
          <label htmlFor="line2">
            Apartment, Suite, Penthouse <span>(optional)</span>
            <input id="line2" name="line2" autoComplete="shipping address-line2" placeholder="Suite 4200" />
          </label>
          <div className="form-grid">
            <label htmlFor="city">
              City
              <input id="city" name="city" required autoComplete="shipping address-level2" placeholder="New York" />
            </label>
            <label htmlFor="state">
              State
              <input id="state" name="state" required minLength={2} maxLength={2} autoComplete="shipping address-level1" placeholder="NY" />
            </label>
            <label htmlFor="postalCode">
              ZIP Code
              <input id="postalCode" name="postalCode" required pattern="[0-9]{5}(-[0-9]{4})?" autoComplete="shipping postal-code" placeholder="10021" />
            </label>
          </div>
        </fieldset>

        {/* Delivery Method */}
        <fieldset>
          <legend>White-Glove Delivery Method</legend>
          <div style={{ padding: "16px", border: "1px solid #10b981", background: "rgba(16, 185, 129, 0.05)", borderRadius: "2px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong style={{ display: "block", fontSize: "14px", marginBottom: "2px" }}>Armored Courier & Signed Handover</strong>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>2-3 Business Days · 100% Insured Value · Tamper-Evident Packaging</span>
            </div>
            <strong style={{ color: "#10b981", fontSize: "14px" }}>COMPLIMENTARY</strong>
          </div>
        </fieldset>

        {/* Cryptocurrency Exclusive Payment Selection */}
        <fieldset>
          <legend>Cryptocurrency Vault Escrow</legend>
          <div style={{ marginBottom: "14px" }}>
            <span style={{ fontSize: "12.5px", color: "var(--muted)", display: "block", lineHeight: "1.5" }}>
              Payments are collected <strong>exclusively via cryptocurrency</strong>. Select your preferred asset to generate a dedicated vault escrow deposit address:
            </span>
          </div>

          {/* 3 Supported Coins: BTC, ETH, SOL */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
            {(Object.keys(CRYPTO_CONFIG) as CryptoCurrency[]).map((coinKey) => {
              const coin = CRYPTO_CONFIG[coinKey];
              const isSelected = cryptoCurrency === coinKey;
              const coinAmount = ((totalCents / 100) / coin.rateUsd).toFixed(coin.decimals);

              return (
                <button
                  key={coinKey}
                  type="button"
                  onClick={() => setCryptoCurrency(coinKey)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px 10px",
                    border: isSelected ? `2px solid ${coin.accentColor}` : "1px solid var(--line)",
                    background: isSelected ? coin.badgeBg : "var(--paper)",
                    borderRadius: "3px",
                    cursor: "pointer",
                    transition: "all 0.15s ease-in-out",
                    position: "relative",
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "6px",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: coin.accentColor,
                      }}
                    />
                  )}
                  <span
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: coin.accentColor,
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                  >
                    {coin.icon}
                  </span>
                  <strong style={{ fontSize: "13px", color: "var(--foreground)" }}>{coin.name}</strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {coin.symbol}
                  </span>
                  <span
                    style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: isSelected ? coin.accentColor : "var(--muted)",
                    }}
                  >
                    {coinAmount} {coin.symbol}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Vault Escrow Transfer Box for Selected Asset */}
          <div
            style={{
              border: `1px solid ${currentCrypto.accentColor}`,
              background: "#ffffff",
              borderRadius: "3px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                    color: currentCrypto.accentColor,
                    marginBottom: "3px",
                  }}
                >
                  Direct Vault Deposit · {currentCrypto.name}
                </span>
                <strong style={{ fontSize: "16px", display: "block" }}>
                  Transfer exactly {calculatedCryptoAmount} {currentCrypto.symbol}
                </strong>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                  Network: <strong>{currentCrypto.network}</strong> · Settlement: {currentCrypto.confirmations}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }} />
                <span style={{ fontSize: "11px", color: "#047857", fontWeight: 600 }}>Vault Node Listening</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              {/* QR Code */}
              <VaultCryptoQR symbol={cryptoCurrency} color={currentCrypto.accentColor} />

              {/* Address and Amount copy block */}
              <div style={{ flex: 1, minWidth: "220px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Deposit Address */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)" }}>
                      Vault {currentCrypto.symbol} Address
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentCrypto.address, "addr")}
                      style={{
                        background: "none",
                        border: "none",
                        color: currentCrypto.accentColor,
                        fontWeight: 600,
                        fontSize: "11px",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {copiedField === "addr" ? "✓ Copied" : "Copy Address"}
                    </button>
                  </div>
                  <div
                    style={{
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      padding: "8px 10px",
                      borderRadius: "2px",
                      fontSize: "12px",
                      fontFamily: "monospace",
                      wordBreak: "break-all",
                      color: "var(--foreground)",
                    }}
                  >
                    {currentCrypto.address}
                  </div>
                </div>

                {/* Crypto Amount */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)" }}>
                      Exact Transfer Amount
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(calculatedCryptoAmount, "amt")}
                      style={{
                        background: "none",
                        border: "none",
                        color: currentCrypto.accentColor,
                        fontWeight: 600,
                        fontSize: "11px",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {copiedField === "amt" ? "✓ Copied" : "Copy Amount"}
                    </button>
                  </div>
                  <div
                    style={{
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      padding: "8px 10px",
                      borderRadius: "2px",
                      fontSize: "13px",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: "var(--foreground)",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{calculatedCryptoAmount} {currentCrypto.symbol}</span>
                    <span style={{ color: "var(--muted)", fontWeight: "normal", fontSize: "11px" }}>
                      ≈ {formatPrice(totalCents)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(0,0,0,0.03)", padding: "10px 12px", borderRadius: "2px", fontSize: "11.5px", color: "var(--muted)", lineHeight: "1.5" }}>
              ⚠️ <strong>Strict Network Requirement:</strong> Send only {currentCrypto.name} ({currentCrypto.symbol}) to this address via the <strong>{currentCrypto.network}</strong>. Sending any other asset or via incorrect bridges will cause irreversible loss.
            </div>
          </div>
        </fieldset>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button
          className="button button-dark text-white cursor-pointer"
          type="submit"
          disabled={loading}
          style={{ padding: "16px", fontSize: "15px", letterSpacing: "0.02em", color: "#ffffff", backgroundColor: "#0f0f0f" }}
        >
          <span style={{ color: "#ffffff" }}>
            {loading
              ? `Confirming ${currentCrypto.symbol} Escrow & Dispatching Tracking…`
              : `Complete Order with ${currentCrypto.symbol} · ${calculatedCryptoAmount} ${currentCrypto.symbol}`}
          </span>
        </button>

        <p style={{ fontSize: "12px", color: "var(--muted)", textAlign: "center", margin: "4px 0 0", lineHeight: "1.5" }}>
          🔒 Non-custodial escrow: tracking coordinates and verification hashes will be dispatched to your email address upon transaction broadcast.
        </p>
      </form>

      {/* Right Column: Order Items Summary & Courier Overview */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Armored Courier Badge */}
        <div style={{ border: "1px solid var(--line)", background: "var(--paper)", padding: "20px", borderRadius: "2px" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", overflow: "hidden", borderRadius: "2px", marginBottom: "14px" }}>
            <Image
              src="/images/editorial_white_glove_courier.jpg"
              alt="White glove courier presentation"
              fill
              quality={95}
              sizes="360px"
              style={{ objectFit: "cover" }}
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="eyebrow" style={{ margin: "0 0 6px" }}>Armored Courier Protocol</p>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", lineHeight: "1.5" }}>
            Every shipment is serialized, backed by full declared value insurance, and dispatched in tamper-evident security bags.
          </p>
        </div>

        {/* Live Order Summary Panel */}
        <aside className="quote-panel" aria-live="polite">
          <p className="eyebrow">Order Summary</p>
          <h2>{cart.length} {cart.length === 1 ? "Acquisition" : "Acquisitions"}</h2>

          <div style={{ maxHeight: "280px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", margin: "14px 0" }}>
            {cart.map((item) => (
              <div className="quote-line" key={item.productId} style={{ alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontWeight: 600, display: "block", color: "var(--foreground)" }}>{item.name}</span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>Qty: {item.qty} · Authenticated</span>
                </div>
                <strong>{formatPrice(item.priceCents * item.qty)}</strong>
              </div>
            ))}
          </div>

          <div className="quote-line">
            <span>Subtotal</span>
            <span>{formatPrice(subtotalCents)}</span>
          </div>
          <div className="quote-line">
            <span>Armored Courier</span>
            <span style={{ color: "#10b981", fontWeight: 600 }}>Complimentary ($0.00)</span>
          </div>
          <div className="quote-line">
            <span>Estimated Sales Tax (8.25%)</span>
            <span>{formatPrice(taxCents)}</span>
          </div>
          <div className="quote-total" style={{ borderTop: "1px solid var(--line)", paddingTop: "12px" }}>
            <div>
              <span style={{ display: "block", fontSize: "13px", color: "var(--muted)" }}>Total Declared Value</span>
              <strong style={{ fontSize: "20px" }}>{formatPrice(totalCents)}</strong>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>
                Crypto Equivalent
              </span>
              <strong style={{ fontSize: "15px", color: currentCrypto.accentColor, fontFamily: "monospace" }}>
                {calculatedCryptoAmount} {currentCrypto.symbol}
              </strong>
            </div>
          </div>

          {/* Crypto Exclusivity Badge */}
          <div style={{ marginTop: "14px", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--line)", borderRadius: "2px", textAlign: "center" }}>
            <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", fontWeight: 700, display: "block", marginBottom: "4px" }}>
              Exclusive Settlement Assets
            </span>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", fontSize: "11px", fontWeight: "bold" }}>
              <span style={{ color: "#f7931a" }}>₿ Bitcoin</span>
              <span style={{ color: "#627eea" }}>Ξ Ethereum</span>
              <span style={{ color: "#14f195" }}>◎ Solana</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
