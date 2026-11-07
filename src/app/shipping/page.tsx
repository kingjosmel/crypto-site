import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "Secured Shipping & Courier Logistics | Northstar / Supply",
  description: "Comprehensive logistics matrix detailing FedEx International Priority and DHL Express delivery protocols.",
};

export default function ShippingPage() {
  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header Breadcrumb */}
        <div className="mb-4">
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
            Logistics & Atelier Fulfillment
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-950 font-normal tracking-tight mb-4">
            Secured Shipping & Courier Matrix
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed">
            Every piece acquired through Northstar is cataloged, inspected, and dispatched under strict chain-of-custody protocols. Below is our transparent carrier assignment matrix specifying how orders are routed.
          </p>
        </div>

        {/* Hero Visual */}
        <div className="relative aspect-16/9 w-full rounded-xs overflow-hidden border border-[#ece8e1] shadow-sm my-8">
          <Image
            src="/images/editorial_white_glove_courier.jpg"
            alt="Discreet priority courier presentation and serialized transit packaging"
            fill
            sizes="(max-width: 1024px) 100vw, 1000px"
            quality={95}
            priority
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        </div>

        {/* Carrier Matrix Table */}
        <div className="my-12">
          <h2 className="font-serif text-2xl text-neutral-950 font-normal mb-6">
            Transparent Carrier Assignment Matrix
          </h2>

          <div className="border border-[#dedad0] rounded-xs overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f6f5f0] border-b border-[#dedad0] text-neutral-900 uppercase font-semibold text-[11px] tracking-wider">
                    <th className="p-4 sm:p-5">Order Classification</th>
                    <th className="p-4 sm:p-5">Assigned Courier Partner</th>
                    <th className="p-4 sm:p-5">Transit Window</th>
                    <th className="p-4 sm:p-5">Security Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ece8e1] text-neutral-700">
                  <tr className="hover:bg-[#faf9f6] transition-colors">
                    <td className="p-4 sm:p-5">
                      <strong className="text-neutral-950 block text-sm font-serif">Archival Designer Outerwear &amp; Tailoring</strong>
                      <span className="text-[11px] text-neutral-500 font-mono">Dior, Louis Vuitton, Loro Piana</span>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="font-semibold text-neutral-950 block">FedEx International Priority</span>
                      <span className="text-[11px] text-neutral-500">Secured Express Service</span>
                    </td>
                    <td className="p-4 sm:p-5 font-mono">
                      2 to 3 Business Days
                    </td>
                    <td className="p-4 sm:p-5 text-[11px] leading-relaxed">
                      Discreet unbranded tamper-evident container, real-time GPS telemetry checkpoints, direct adult signature required, full declared-value cargo insurance coverage included at no added cost.
                    </td>
                  </tr>

                  <tr className="hover:bg-[#faf9f6] transition-colors">
                    <td className="p-4 sm:p-5">
                      <strong className="text-neutral-950 block text-sm font-serif">Maison Goyard Leather Goods &amp; Footwear</strong>
                      <span className="text-[11px] text-neutral-500 font-mono">Totes, Bags, Wallets &amp; Sneakers</span>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="font-semibold text-neutral-950 block">DHL Express Worldwide</span>
                      <span className="text-[11px] text-neutral-500">Secured Air Cargo Priority</span>
                    </td>
                    <td className="p-4 sm:p-5 font-mono">
                      2 to 3 Business Days
                    </td>
                    <td className="p-4 sm:p-5 text-[11px] leading-relaxed">
                      Heavy-duty protective archive packaging, serialized barcode seals, direct photo-verified adult signature, zero unattended drop-off.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="divide-y divide-[#ece8e1] border-t border-b border-[#ece8e1] my-10">
          <div className="py-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Packaging & Discretion Protocol
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              To eliminate targeting during transit, all parcels are packaged in discreet, unbranded industrial outer containers with zero external mentions of luxury houses. Inside, pieces are secured within climate-sealed archival boxes with serialized tamper-evident tape and an encrypted RFID tag for identity verification.
            </p>
          </div>

          <div className="py-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Adult Signature & Identity Verification
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              Under no circumstances will parcels be left unattended at doorsteps, in mailrooms, or with unverified third parties. All deliveries require physical handoff with an adult signature and government-issued photographic identification matching the order invoice.
            </p>
          </div>

          <div className="py-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Customs, Duties & International Bonded Transit
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              Cross-border deliveries originate from our bonded repositories in Geneva (Rue du Rhône) or Paris (Place Vendôme). All customs clearance formalities, import tariffs, and VAT declarations are handled prior to dispatch by our licensed customs brokers, ensuring seamless delivery without local bureaucratic delays.
            </p>
          </div>

          <div className="py-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Live Order Telemetry & Milestone Monitoring
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl mb-4">
              Upon on-chain settlement, your tracking identifier is registered with the assigned courier partner and milestone updates are available via our self-service portal.
            </p>
            <Link
              href="/track"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-neutral-950 border border-neutral-950 px-5 py-2.5 hover:bg-neutral-950 hover:text-white transition-colors"
            >
              <span>Access Live Order Tracking Portal →</span>
            </Link>
          </div>
        </div>

        {/* Inquiries Footnote */}
        <div className="bg-[#faf9f6] border border-[#ece8e1] p-6 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">Custom Courier Inquiries & Questions</h4>
            <p className="text-xs text-neutral-500 mt-1">
              Have specific delivery instructions or need timed delivery coordination? Contact our private client desk.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
            style={{ color: "#ffffff" }}
          >
            <span style={{ color: "#ffffff" }}>Contact Concierge</span>
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
