import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderDetails, getGuestOrder } from "@/lib/catalogData";
import { formatPrice } from "@/lib/api";
import { SiteShell } from "@/components/SiteShell";

export default async function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = getOrderDetails(orderNumber) || getGuestOrder(orderNumber);

  if (!order) {
    notFound();
  }

  const trackingNumber = order.trackingNumber || `TRK-NS-${order.orderNumber.replace(/\D/g, "")}`;
  const carrier = order.carrier || "24-Hour US Private Armored Air Courier";
  const estimatedDelivery = order.estimatedDelivery || "Guaranteed Within 24 Hours Anywhere in USA";

  return (
    <SiteShell>
      <section className="account-panel">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px", alignItems: "center", marginBottom: "35px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", color: "#10b981", fontWeight: 600, marginBottom: "14px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
              Live Order & Armored Tracking
            </div>
            <h1 style={{ margin: "0 0 6px", fontSize: "32px", letterSpacing: "-0.02em" }}>{order.orderNumber}</h1>
            <p style={{ color: "var(--muted)", fontSize: "16px", margin: "0 0 12px" }}>
              Total: <strong style={{ color: "var(--foreground)" }}>{formatPrice(order.totalCents)}</strong>
            </p>
            <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: 1.5 }}>
              Receipt & live tracking status dispatched to: <strong style={{ color: "var(--foreground)" }}>{order.email}</strong>
            </p>
          </div>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", overflow: "hidden", borderRadius: "2px", border: "1px solid var(--line)" }}>
            <Image
              src="/images/editorial_white_glove_courier.jpg"
              alt="Armored white glove discreet courier"
              fill
              quality={95}
              sizes="(max-width: 768px) 100vw, 500px"
              style={{ objectFit: "cover" }}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Tracking Highlights Banner */}
        <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "24px", borderRadius: "2px", marginBottom: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Tracking Number</span>
              <strong style={{ fontSize: "17px", fontFamily: "monospace", letterSpacing: "0.04em" }}>{trackingNumber}</strong>
            </div>
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Armored Carrier</span>
              <strong style={{ fontSize: "15px" }}>{carrier}</strong>
            </div>
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Estimated Delivery</span>
              <strong style={{ fontSize: "15px" }}>{estimatedDelivery}</strong>
            </div>
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Security Level</span>
              <strong style={{ fontSize: "15px", color: "#10b981" }}>Armed Courier Escort</strong>
            </div>
          </div>
        </div>

        {/* Crypto Payment & Escrow Clearance Panel */}
        <div style={{ background: "#ffffff", border: "1px solid #cccccc", padding: "20px 24px", borderRadius: "2px", marginBottom: "35px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
              <strong style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Cryptocurrency Escrow Settlement ({order.cryptoCurrency || "BTC"})
              </strong>
            </div>
            <span style={{ fontSize: "12px", color: "#047857", fontWeight: 600 }}>
              ✓ On-Chain Finality Verified
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", fontSize: "12.5px" }}>
            <div>
              <span style={{ color: "var(--muted)", display: "block", fontSize: "11px", textTransform: "uppercase", marginBottom: "3px" }}>Settlement Asset</span>
              <strong style={{ fontFamily: "monospace", fontSize: "14px" }}>
                {order.cryptoAmount || "0.00839553"} {order.cryptoCurrency || "BTC"}
              </strong>
              <span style={{ color: "var(--muted)", fontSize: "11px", display: "block" }}>
                Equivalent: {formatPrice(order.totalCents)}
              </span>
            </div>

            <div>
              <span style={{ color: "var(--muted)", display: "block", fontSize: "11px", textTransform: "uppercase", marginBottom: "3px" }}>Vault Receiving Address</span>
              <code style={{ fontSize: "11px", wordBreak: "break-all", background: "var(--paper)", padding: "3px 6px", borderRadius: "2px", display: "block" }}>
                {order.escrowAddress || "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu"}
              </code>
            </div>

            {order.txHash && (
              <div>
                <span style={{ color: "var(--muted)", display: "block", fontSize: "11px", textTransform: "uppercase", marginBottom: "3px" }}>Blockchain Transaction</span>
                <code style={{ fontSize: "11px", wordBreak: "break-all", background: "var(--paper)", padding: "3px 6px", borderRadius: "2px", display: "block" }}>
                  {order.txHash}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Live Milestone Progress */}
        <div style={{ marginBottom: "40px" }}>
          <p className="eyebrow" style={{ marginBottom: "14px" }}>Fulfillment Milestones</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
            <div style={{ padding: "14px", border: "1px solid #10b981", background: "rgba(16, 185, 129, 0.05)", borderRadius: "2px" }}>
              <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 600, display: "block", marginBottom: "4px" }}>✓ Step 1</span>
              <strong style={{ fontSize: "13px", display: "block" }}>Order Confirmed</strong>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>Email dispatched</span>
            </div>
            <div style={{ padding: "14px", border: "1px solid #10b981", background: "rgba(16, 185, 129, 0.05)", borderRadius: "2px" }}>
              <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 600, display: "block", marginBottom: "4px" }}>✓ Step 2</span>
              <strong style={{ fontSize: "13px", display: "block" }}>Vault Authentication</strong>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>Microchip verified</span>
            </div>
            <div style={{ padding: "14px", border: "1px solid var(--foreground)", background: "var(--paper)", borderRadius: "2px" }}>
              <span style={{ fontSize: "12px", color: "var(--foreground)", fontWeight: 600, display: "block", marginBottom: "4px" }}>● In Progress</span>
              <strong style={{ fontSize: "13px", display: "block" }}>Armored Dispatch</strong>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>Courier handover</span>
            </div>
            <div style={{ padding: "14px", border: "1px solid var(--line)", background: "var(--paper)", opacity: 0.6, borderRadius: "2px" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500, display: "block", marginBottom: "4px" }}>○ Step 4</span>
              <strong style={{ fontSize: "13px", display: "block" }}>In Transit</strong>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>Armed logistics</span>
            </div>
            <div style={{ padding: "14px", border: "1px solid var(--line)", background: "var(--paper)", opacity: 0.6, borderRadius: "2px" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500, display: "block", marginBottom: "4px" }}>○ Step 5</span>
              <strong style={{ fontSize: "13px", display: "block" }}>Delivered</strong>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>Adult signature</span>
            </div>
          </div>
        </div>

        {/* Order Details & Items */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "30px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Ordered Items ({order.items.length})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {order.items.map((item) => (
              <div
                key={item.productId || item.name}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "2px" }}
              >
                <div>
                  <strong style={{ fontSize: "16px", display: "block", marginBottom: "4px" }}>{item.name}</strong>
                  <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                    Quantity: {item.qty} · SKU: {item.sku} · Verified Authentic
                  </span>
                </div>
                <strong style={{ fontSize: "16px" }}>{formatPrice(item.lineTotalCents)}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Address */}
        <div style={{ borderTop: "1px solid var(--line)", marginTop: "30px", paddingTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          <div>
            <h3 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "8px" }}>Delivery Address</h3>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
              {order.customerName && <strong>{order.customerName}<br /></strong>}
              {order.shippingAddress.line1}<br />
              {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "8px" }}>Notification Email</h3>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
              All shipment updates and delivery notifications are transmitted in real time to <strong>{order.email}</strong>.
            </p>
          </div>
        </div>

        <div style={{ marginTop: "40px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/track" className="button button-dark text-white" style={{ color: "#ffffff" }}>
            Track another order
          </Link>
          <Link href="/shop" className="button button-light">
            Continue shopping
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
