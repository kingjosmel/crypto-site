import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { ShieldCheck, PackageCheck, RotateCcw, Coins, AlertCircle } from "lucide-react";

const PROTECTION_TABLE = [
  {
    area: "Authenticity Guarantee",
    summary:
      "Every piece undergoes a multi-point physical inspection and carries a Northstar Verified ID. If any item is ever proven non-authentic by a recognized independent authenticator, Northstar issues a full refund including return shipping.",
  },
  {
    area: "Shipping Protection",
    summary:
      "Every parcel ships insured for 100% of its order value via FedEx Priority Overnight or UPS Next Day Air with adult signature required. Northstar handles any lost or damaged carrier claim directly.",
  },
  {
    area: "Damaged or Not As Described",
    summary:
      "Notify support@shopnorthstar.store within 48 hours of delivery with photos of the exterior parcel and item. We issue a prepaid insured return label and verify condition immediately upon arrival.",
  },
  {
    area: "Eligible Returns",
    summary:
      "Items remain eligible for return within 14 calendar days of delivery when unworn, unused, and returned with all original designer packaging, dust bags, cards, and intact Northstar security tags.",
  },
  {
    area: "Refunds & Timelines",
    summary:
      "Approved returns are processed within 2 to 3 business days after inspection. Card/PayPal refunds settle to the original method; cryptocurrency refunds settle in USD invoice value at live spot rate to your registered Refund Return Wallet.",
  },
  {
    area: "Disputes & Client Support",
    summary:
      "Reach Northstar Client Services at support@shopnorthstar.store (Mon–Sat, 9:00 AM to 7:00 PM EST) with your order number for rapid resolution.",
  },
];

export default function BuyerProtectionPage() {
  return (
    <SiteShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="border-b border-[#dcdcdc] pb-8 mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#047857] mb-2">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            Northstar Buyer Protection
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-950 font-normal tracking-tight mb-4">
            Clear Protection Before &amp; After Checkout.
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed">
            Purchasing high-value luxury pieces online—especially with cryptocurrency—requires transparent rules. Below is exactly how Northstar Supply LLC protects your order from payment through delivery and returns.
          </p>
        </div>

        {/* Protection Summary Table */}
        <div className="bg-white border border-[#dcdcdc] rounded-xs overflow-hidden mb-12">
          <div className="px-5 py-3.5 bg-[#0f0f0f] text-white grid grid-cols-1 sm:grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider">
            <div className="sm:col-span-4">Protection Area</div>
            <div className="sm:col-span-8">What Customers Should Know</div>
          </div>
          <div className="divide-y divide-[#e5e5e5]">
            {PROTECTION_TABLE.map((row) => (
              <div key={row.area} className="p-5 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                <div className="sm:col-span-4 font-bold text-neutral-950 uppercase tracking-wider text-[11px]">
                  {row.area}
                </div>
                <div className="sm:col-span-8 text-neutral-700 leading-relaxed">
                  {row.summary}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Policy Sections */}
        <div className="space-y-8">
          <section className="p-6 bg-white border border-[#dcdcdc] rounded-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-950">
              <PackageCheck className="w-4 h-4 text-[#047857]" aria-hidden="true" />
              1. Lost, Undelivered, or Transit-Damaged Orders
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              All Northstar shipments require an adult signature and carry 100% declared-value carrier insurance. If tracking stalls or a package is lost in transit before delivery confirmation, we open a formal carrier investigation immediately and either dispatch a verified replacement (if available) or refund your full order total once the carrier loss confirmation is issued.
            </p>
            <p className="text-xs text-neutral-600 leading-relaxed">
              If a package arrives with visible outer box damage, please photograph the sealed parcel and contents within <strong>48 hours of signature</strong> and email{" "}
              <a href="mailto:support@shopnorthstar.store" className="underline text-neutral-950">
                support@shopnorthstar.store
              </a>
              .
            </p>
          </section>

          <section className="p-6 bg-white border border-[#dcdcdc] rounded-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-950">
              <RotateCcw className="w-4 h-4 text-[#a3702b]" aria-hidden="true" />
              2. 14-Day Eligible Returns &amp; Condition Rules
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              You have 14 calendar days from courier delivery confirmation to request a return on eligible items. Returned items must remain in identical condition as documented on their{" "}
              <Link href="/verify" className="underline text-neutral-950">
                Northstar Verified Inspection Record
              </Link>
              , with the serialized security tag attached and all designer dust bags, boxes, and authenticity cards included.
            </p>
          </section>

          <section className="p-6 bg-[#fafafa] border border-[#cccccc] rounded-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-950">
              <Coins className="w-4 h-4 text-[#047857]" aria-hidden="true" />
              3. Cryptocurrency Payments &amp; Refund Settlement Rules
            </div>
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xs flex items-start gap-2.5 text-xs text-amber-950">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" aria-hidden="true" />
              <p className="leading-relaxed">
                <strong>Important On-Chain Disclosure:</strong> Blockchain transactions (BTC, ETH, SOL) are peer-to-peer and irreversible once broadcast—they do not have credit card chargeback mechanisms. All refunds for cryptocurrency orders are executed directly by Northstar Supply LLC under our written refund policy below.
              </p>
            </div>
            <ul className="list-disc pl-5 text-xs text-neutral-700 space-y-2 leading-relaxed">
              <li>
                <strong>Refund Calculation:</strong> Eligible refunds are calculated based on the full <strong>USD order invoice total</strong> converted at the live Coinpaprika spot rate at the moment the refund payout is processed (never deducting artificial restocking fees on valid return claims).
              </li>
              <li>
                <strong>Refund Return Wallet Requirement:</strong> Before sending crypto from an exchange account (such as Coinbase, Kraken, or Cash App), always register a personal non-custodial <strong>Refund Return Wallet</strong> at checkout or via our{" "}
                <Link href="/track" className="underline text-neutral-950">
                  Order Tracker
                </Link>
                , because exchange deposit addresses frequently rotate.
              </li>
              <li>
                <strong>Processing Timeline:</strong> Approved crypto refunds are broadcast on-chain within <strong>2 to 3 business days</strong> after our studio inspects the returned parcel, and we email you the on-chain transaction hash immediately.
              </li>
            </ul>
          </section>
        </div>

        {/* Bottom CTAs */}
        <div className="mt-10 pt-8 border-t border-[#dcdcdc] flex flex-wrap gap-4">
          <Link
            href="/verify"
            className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xs"
            style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
          >
            <span style={{ color: "#ffffff" }}>Lookup Verification ID</span>
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white hover:bg-neutral-50 text-neutral-950 border border-[#cccccc] text-xs font-semibold uppercase tracking-wider rounded-xs"
          >
            Contact Client Support
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
