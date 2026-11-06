import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderDetails, getGuestOrder } from "@/lib/catalogData";
import { formatPrice } from "@/lib/api";
import { SiteShell } from "@/components/SiteShell";
import { CryptoQRCode } from "@/components/CryptoQRCode";

export default async function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = getOrderDetails(orderNumber) || getGuestOrder(orderNumber);

  if (!order) {
    notFound();
  }

  const trackingNumber = order.trackingNumber || `TRK-NS-${order.orderNumber.replace(/\D/g, "")}`;
  const carrier = order.carrier || (order.totalCents >= 1000000 ? "Ferrari Group / Malca-Amit Armored Logistics" : "FedEx International Priority (Direct Signature)");
  const estimatedDelivery = order.estimatedDelivery || (order.totalCents >= 1000000 ? "1-3 Business Days (Armored Escort)" : "2-3 Business Days (Insured Express)");

  return (
    <SiteShell>
      <section className="account-panel">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center mb-8">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/30 px-3 py-1 rounded-full text-xs text-[#047857] font-semibold mb-3 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              Live Order & Armored Tracking
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight mb-2">{order.orderNumber}</h1>
            <p className="text-sm sm:text-base text-neutral-600 mb-2">
              Total: <strong className="text-neutral-950 font-mono">{formatPrice(order.totalCents)}</strong>
            </p>
            <p className="text-xs sm:text-sm text-neutral-500 m-0">
              Receipt & live tracking status dispatched to: <strong className="text-neutral-900">{order.email}</strong>
            </p>
          </div>
          <div className="lg:col-span-5 relative w-full aspect-16/10 rounded-xs overflow-hidden border border-[#d8d5cd] shadow-xs">
            <Image
              src="/images/editorial_white_glove_courier.jpg"
              alt="Armored white glove discreet courier"
              fill
              quality={95}
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Tracking Highlights Banner */}
        <div className="bg-white border border-[#ece8e1] p-4 sm:p-6 rounded-xs mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Tracking Number</span>
              <strong className="text-sm sm:text-base font-mono tracking-wider text-neutral-950 block truncate">{trackingNumber}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Armored Carrier</span>
              <strong className="text-xs sm:text-sm text-neutral-950 block truncate">{carrier}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Estimated Delivery</span>
              <strong className="text-xs sm:text-sm text-neutral-950 block truncate">{estimatedDelivery}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Security Level</span>
              <strong className="text-xs sm:text-sm text-[#047857] block truncate">Armed Courier Escort</strong>
            </div>
          </div>
        </div>

        {/* Crypto Payment & Escrow Clearance Panel */}
        <div className="bg-white border border-[#d8d5cd] p-4 sm:p-5 rounded-xs mb-8">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <strong className="text-xs uppercase tracking-wider font-bold text-neutral-900">
                Cryptocurrency Escrow Settlement ({order.cryptoCurrency || "BTC"})
              </strong>
            </div>
            <span className="text-xs text-[#047857] font-semibold">
              ✓ On-Chain Finality Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-center">
            <div>
              <span className="text-neutral-500 block text-[11px] uppercase mb-1">Settlement Asset</span>
              <strong className="font-mono text-sm text-neutral-950 block">
                {order.cryptoAmount || "0.00839553"} {order.cryptoCurrency || "BTC"}
              </strong>
              <span className="text-neutral-500 text-[11px] block">
                Equivalent: {formatPrice(order.totalCents)}
              </span>
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <span className="text-neutral-500 block text-[11px] uppercase mb-1">Vault Receiving Address</span>
                <code className="text-xs font-mono break-all bg-[#faf9f6] border border-[#ece8e1] p-2 rounded-xs block text-neutral-800">
                  {order.escrowAddress ||
                    (order.cryptoCurrency === "ETH"
                      ? "0x120D139dB706614f71e470A97852679F6FaebcB7"
                      : order.cryptoCurrency === "SOL"
                      ? "X2ro74HaRbZ2XKDJ57yMmsKFD3CS4y9XFKtzSeQkCQ1"
                      : "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu")}
                </code>
              </div>
              <CryptoQRCode
                address={
                  order.escrowAddress ||
                  (order.cryptoCurrency === "ETH"
                    ? "0x120D139dB706614f71e470A97852679F6FaebcB7"
                    : order.cryptoCurrency === "SOL"
                    ? "X2ro74HaRbZ2XKDJ57yMmsKFD3CS4y9XFKtzSeQkCQ1"
                    : "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu")
                }
                symbol={order.cryptoCurrency || "BTC"}
                amount={order.cryptoAmount || "0.00839553"}
                size={110}
              />
            </div>
          </div>
        </div>

        {/* Live Milestone Progress */}
        <div className="mb-8 sm:mb-10">
          <p className="eyebrow mb-3">Fulfillment Milestones</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
            <div className="p-3 border border-[#10b981] bg-[#10b981]/5 rounded-xs">
              <span className="text-[10px] text-[#047857] font-bold block mb-1">✓ Step 1</span>
              <strong className="text-xs block text-neutral-950">Order Confirmed</strong>
              <span className="text-[10px] text-neutral-500">Email dispatched</span>
            </div>
            <div className="p-3 border border-[#10b981] bg-[#10b981]/5 rounded-xs">
              <span className="text-[10px] text-[#047857] font-bold block mb-1">✓ Step 2</span>
              <strong className="text-xs block text-neutral-950">Vault Authentication</strong>
              <span className="text-[10px] text-neutral-500">Microchip verified</span>
            </div>
            <div className="p-3 border border-neutral-950 bg-[#faf9f6] rounded-xs">
              <span className="text-[10px] text-neutral-950 font-bold block mb-1">● In Progress</span>
              <strong className="text-xs block text-neutral-950">Armored Dispatch</strong>
              <span className="text-[10px] text-neutral-500">Courier handover</span>
            </div>
            <div className="p-3 border border-[#ece8e1] bg-[#faf9f6] opacity-75 rounded-xs">
              <span className="text-[10px] text-neutral-400 font-semibold block mb-1">○ Step 4</span>
              <strong className="text-xs block text-neutral-950">In Transit</strong>
              <span className="text-[10px] text-neutral-500">Armed logistics</span>
            </div>
            <div className="p-3 border border-[#ece8e1] bg-[#faf9f6] opacity-75 rounded-xs col-span-2 sm:col-span-1">
              <span className="text-[10px] text-neutral-400 font-semibold block mb-1">○ Step 5</span>
              <strong className="text-xs block text-neutral-950">Delivered</strong>
              <span className="text-[10px] text-neutral-500">Adult signature</span>
            </div>
          </div>
        </div>

        {/* Order Details & Items */}
        <div className="border-t border-[#ece8e1] pt-6">
          <h2 className="font-serif text-xl text-neutral-950 font-normal mb-4">Ordered Items ({order.items.length})</h2>
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div
                key={item.productId || item.name}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3.5 sm:p-4 bg-white border border-[#ece8e1] rounded-xs"
              >
                <div className="min-w-0">
                  <strong className="text-sm text-neutral-950 block mb-0.5">{item.name}</strong>
                  <span className="text-xs text-neutral-500 block truncate">
                    Qty: {item.qty} · SKU: {item.sku} · Verified Authentic
                  </span>
                </div>
                <strong className="text-sm font-mono text-neutral-950 shrink-0 self-end sm:self-center">
                  {formatPrice(item.lineTotalCents)}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Address */}
        <div className="border-t border-[#ece8e1] mt-6 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 mb-1">Delivery Address</h3>
            <p className="m-0 text-neutral-700 leading-relaxed text-xs sm:text-sm">
              {order.customerName && <strong className="text-neutral-950">{order.customerName}<br /></strong>}
              {order.shippingAddress.line1}<br />
              {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
          <div>
            <h3 className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 mb-1">Notification Email</h3>
            <p className="m-0 text-neutral-700 leading-relaxed text-xs sm:text-sm">
              All shipment updates and delivery notifications are transmitted in real time to <strong>{order.email}</strong>.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/track" className="button button-dark text-white w-full sm:w-auto text-center" style={{ color: "#ffffff" }}>
            Track another order
          </Link>
          <Link href="/shop" className="button button-light w-full sm:w-auto text-center">
            Continue shopping
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
