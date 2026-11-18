import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { Building2, MapPin, Mail, Clock, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
          About Northstar
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-neutral-950 font-normal tracking-tight mb-4">
          Verified Luxury, Transparent Proof &amp; Insured US Delivery.
        </h1>
        <p className="text-base text-neutral-600 max-w-2xl leading-relaxed mb-8">
          Northstar Supply LLC was founded to make purchasing authenticated designer handbags, footwear, and tailored apparel clear and accountable—with documented inspection records before you pay and insured courier delivery to your door.
        </p>

        {/* Registered Business Identity & Operations Card */}
        <section
          aria-label="Registered Business Details"
          className="bg-white border border-[#dcdcdc] rounded-xs p-6 sm:p-8 mb-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e5e5] pb-4 mb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#047857] block">
                Registered Business Identity
              </span>
              <h2 className="font-serif text-xl text-neutral-950 font-normal mt-0.5">
                Northstar Supply LLC
              </h2>
            </div>
            <Link
              href="/buyer-protection"
              className="text-xs font-semibold text-[#047857] hover:underline"
            >
              View Buyer Protection Policy →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Registration
                </span>
                <strong className="text-neutral-950 block">Northstar Supply LLC</strong>
                <span className="text-neutral-500 font-mono">CA Entity ID: 2025-849102</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Operating Studio &amp; Fulfillment
                </span>
                <strong className="text-neutral-950 block">San Francisco &amp; New York</strong>
                <span className="text-neutral-600 block">
                  548 Market St, Ste 41200, San Francisco, CA 94104
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Official Email
                </span>
                <a
                  href="mailto:support@shopnorthstar.store"
                  className="font-bold text-neutral-950 hover:text-[#047857] transition-colors block"
                >
                  support@shopnorthstar.store
                </a>
                <span className="text-neutral-500 block">Domain-verified support desk</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Support Hours
                </span>
                <strong className="text-neutral-950 block">Mon – Sat: 9:00 AM – 7:00 PM EST</strong>
                <span className="text-neutral-500 block">Avg email reply within 2 hours</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Verification Registry
                </span>
                <Link href="/verify" className="font-bold text-[#047857] hover:underline block">
                  Lookup Northstar Verified ID →
                </Link>
                <span className="text-neutral-500 block">Every catalog SKU documented</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 mt-5 pt-4 border-t border-[#e5e5e5] leading-relaxed">
            <strong>Fulfillment Transparency:</strong> Physical authentication inspections are carried out by our internal specialists before packaging. High-value parcels are stored and dispatched through insured bonded fulfillment partner facilities in New York and California via FedEx Priority Overnight and UPS Next Day Air.
          </p>
        </section>

        {/* 3 Pillars Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white border border-[#dcdcdc] rounded-xs shadow-2xs">
            <span className="text-xs font-mono font-bold text-[#a3702b] block mb-3">01</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1.5">
              Northstar Verified Records
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every piece receives a serialized Verification ID documenting inspector name, date, condition grade, and included boutique accessories.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dcdcdc] rounded-xs shadow-2xs">
            <span className="text-xs font-mono font-bold text-[#a3702b] block mb-3">02</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1.5">
              100% Insured Signature Delivery
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Orders confirmed by 3:00 PM EST dispatch the same business day via insured FedEx Priority Overnight or UPS Next Day Air.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dcdcdc] rounded-xs shadow-2xs">
            <span className="text-xs font-mono font-bold text-[#a3702b] block mb-3">03</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1.5">
              Written Buyer Protection
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Clear rules for lost parcels, 48-hour damage claims, 14-day eligible returns, and USD spot-rate cryptocurrency refund payouts.
            </p>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative aspect-16/9 w-full rounded-xs overflow-hidden border border-[#dcdcdc] shadow-sm mb-12">
          <Image
            src="/images/editorial_collection_curation.jpg"
            alt="Northstar studio inspection and luxury product curation"
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            quality={95}
            priority
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        </div>

        {/* Authenticity Process Section */}
        <div className="my-12 bg-white border border-[#dcdcdc] p-6 sm:p-8 rounded-xs">
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
            Verification Protocol
          </span>
          <h2 className="font-serif text-2xl text-neutral-950 font-normal tracking-tight mb-2">
            3-Step Authenticity Inspection Process
          </h2>
          <p className="text-xs text-neutral-600 mb-6 max-w-xl">
            Every piece is physically verified before listing and assigned a public Northstar Verified ID. We back all purchases with our lifetime authenticity money-back guarantee.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#e5e5e5] p-4 bg-[#fafafa] rounded-xs">
              <div className="w-10 h-10 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1">
                Materials, Stitching &amp; Hardware
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Stamps, heat impressions, leather grain, edge glazing, zipper pullers, and hardware engravings are checked against house reference libraries.
              </p>
            </div>

            <div className="border border-[#e5e5e5] p-4 bg-[#fafafa] rounded-xs">
              <div className="w-10 h-10 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1">
                RFID / NFC &amp; Serial Audit
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Verification of date codes, factory serial plates, and embedded NFC microchips inside modern Louis Vuitton, Prada, Celine, and Dior pieces.
              </p>
            </div>

            <div className="border border-[#e5e5e5] p-4 bg-[#fafafa] rounded-xs">
              <div className="w-10 h-10 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1">
                Inspection Photos &amp; QR Record
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Each item is photographed alongside its dust bag, box, and care cards, then published to a scannable{" "}
                <Link href="/verify" className="underline text-neutral-900">
                  Northstar Verified
                </Link>{" "}
                page.
              </p>
            </div>
          </div>
        </div>

        {/* Studio Inspection & Packaging Visuals (Honest studio showcase, no fabricated testimonials) */}
        <div className="my-12">
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#047857] block mb-2">
            Inspection &amp; Dispatch Standards
          </span>
          <h2 className="font-serif text-2xl text-neutral-950 font-normal tracking-tight mb-2">
            Recorded Packaging &amp; Pre-Shipment Documentation
          </h2>
          <p className="text-xs text-neutral-600 mb-6 max-w-2xl">
            Before courier collection, every order is photographed with its boutique packaging, original dust covers, and serialized security seal. Verified customer reviews appear on each product page strictly after real orders are fulfilled.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#dcdcdc] rounded-xs overflow-hidden">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src="/assets/aistudio/goyard-bag-review-alpin-backpack-1024x819_25fb4e5b.jpg"
                  alt="Goyard Alpin MM Backpack packaging check with green box"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-mono text-[#047857] font-semibold uppercase block mb-1">
                  Sample Record · NS-2026-004
                </span>
                <strong className="text-xs text-neutral-950 block">Full Boutique Packaging Included</strong>
                <p className="text-xs text-neutral-600 mt-1">
                  Designer box, cotton dust cover, and serialized Northstar tag recorded prior to sealing.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#dcdcdc] rounded-xs overflow-hidden">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src="/images/customer_unboxing_lemon8.webp"
                  alt="Christian Dior boutique box and care documentation check"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-mono text-[#047857] font-semibold uppercase block mb-1">
                  Pre-Dispatch Check
                </span>
                <strong className="text-xs text-neutral-950 block">Double-Boxed Transit Protection</strong>
                <p className="text-xs text-neutral-600 mt-1">
                  Unmarked outer shipping carton with tamper-evident seal to protect luxury presentation boxes.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#dcdcdc] rounded-xs overflow-hidden">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src="/images/editorial_white_glove_courier.jpg"
                  alt="Insured express courier preparation and tracking handoff"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-mono text-[#047857] font-semibold uppercase block mb-1">
                  Courier Handover
                </span>
                <strong className="text-xs text-neutral-950 block">Adult Signature Required</strong>
                <p className="text-xs text-neutral-600 mt-1">
                  100% transit insurance via FedEx Priority Overnight &amp; UPS Next Day Air with tracking milestones.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/verify"
            className="px-7 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
            style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
          >
            <span style={{ color: "#ffffff" }}>Browse Verification Registry</span>
          </Link>
          <Link
            href="/buyer-protection"
            className="px-6 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-[#cccccc] text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
          >
            Read Buyer Protection
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-[#cccccc] text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
          >
            Contact Client Support
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
