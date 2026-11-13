import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
          About Northstar
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-neutral-950 font-normal tracking-tight mb-4">
          Authentic Luxury Delivered in 24 Hours.
        </h1>
        <p className="text-base text-neutral-600 max-w-2xl leading-relaxed mb-8">
          We built Northstar to make buying authentic luxury straightforward, fast, and secure. Browse verified designer bags, luxury footwear, and premium apparel ready to ship immediately to your door.
        </p>

        {/* 3 Pillars Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white border border-[#dcdcdc] rounded-xs shadow-2xs">
            <span className="text-xs font-mono font-bold text-[#a3702b] block mb-3">01</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1.5">
              Guaranteed 24-Hour USA Delivery
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              No long waits or backorders. Everything listed is in our hands and delivered to any US location within 24 hours.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dcdcdc] rounded-xs shadow-2xs">
            <span className="text-xs font-mono font-bold text-[#a3702b] block mb-3">02</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1.5">
              100% Verified Authentic
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every designer bag, footwear piece, and garment is physically inspected, serialized, and authenticated with complete documentation.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dcdcdc] rounded-xs shadow-2xs">
            <span className="text-xs font-mono font-bold text-[#a3702b] block mb-3">03</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1.5">
              Instant Crypto Checkout
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Pay natively with Bitcoin, Ethereum, or Solana. Direct on-chain confirmation without bank holds or red tape.
            </p>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative aspect-16/9 w-full rounded-xs overflow-hidden border border-[#dcdcdc] shadow-sm mb-12">
          <Image
            src="/images/editorial_collection_curation.jpg"
            alt="Northstar product curation and verification"
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            quality={95}
            priority
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        </div>

        {/* Story & Philosophy Sections */}
        <div className="divide-y divide-[#dcdcdc] border-t border-b border-[#dcdcdc]">
          <div className="py-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Why We Started Northstar
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl mb-3">
              Traditional luxury shopping often comes with artificial friction: endless waitlists, pre-spend requirements, and stores that make customers jump through hoops just to buy a designer handbag or luxury footwear.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              We took a different approach: if an item is displayed on our website, it is physically in stock and ready to buy. When you place an order, it is dispatched immediately without games or delays.
            </p>
          </div>

          <div className="py-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              The 24-Hour Delivery Commitment
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl mb-3">
              We operate dedicated logistics to ensure that your purchase arrives anywhere in the United States in under 24 hours. Whether you are at home in New York, a vacation house in Aspen, or a hotel in Miami, your order is transported under full insurance and signed for in person.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              Every package is sealed with serialized tamper-evident security tape, and you receive live milestone tracking directly to your email as soon as the transaction is confirmed.
            </p>
          </div>
        </div>

        {/* Authenticity Process Section with Icons */}
        <div className="my-12 bg-white border border-[#dcdcdc] p-6 sm:p-8 rounded-xs">
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
            Verification Protocol
          </span>
          <h2 className="font-serif text-2xl text-neutral-950 font-normal tracking-tight mb-2">
            3-Step Authenticity Inspection Process
          </h2>
          <p className="text-xs text-neutral-600 mb-6 max-w-xl">
            Every piece is physically verified by our team before listing. We guarantee 100% lifetime authenticity or a full refund.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#dcdcdc] p-4 bg-[#ebebeb] rounded-xs">
              <div className="w-10 h-10 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1">
                Serial Number Audit
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Stamps, heat impressions, and factory date codes are checked against official house font libraries, seam count rules, and model registries.
              </p>
            </div>

            <div className="border border-[#dcdcdc] p-4 bg-[#ebebeb] rounded-xs">
              <div className="w-10 h-10 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1">
                RFID & NFC Scan
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Direct cryptographic verification of embedded microchips inside modern Louis Vuitton, Prada, Celine, and Gucci pieces to verify genuine boutique origins.
              </p>
            </div>

            <div className="border border-[#dcdcdc] p-4 bg-[#ebebeb] rounded-xs">
              <div className="w-10 h-10 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1">
                Original Packaging Photos
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Every item is photographed with its original dust covers, designer box, ribbon, and care booklets. High-res inspection photos are available upon request.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Deliveries & Unboxings Gallery */}
        <div className="my-12">
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#047857] block mb-2">
            Verified Deliveries
          </span>
          <h2 className="font-serif text-2xl text-neutral-950 font-normal tracking-tight mb-2">
            Customer Unboxings Across the USA
          </h2>
          <p className="text-xs text-neutral-600 mb-6">
            Real photos received from clients who received guaranteed 24-hour deliveries paid with Bitcoin, Ethereum, and Solana.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#dcdcdc] rounded-xs overflow-hidden">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src="/images/customer_unboxing_goyard.jpg"
                  alt="Customer holding Goyard tote bag"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1 font-mono">
                  <span>Austin, TX</span>
                  <span className="text-[#047857] font-semibold">Delivered in 21h</span>
                </div>
                <strong className="text-xs text-neutral-950 block">Goyard Saint Louis PM Tote</strong>
                <p className="text-xs text-neutral-600 mt-1 italic">
                  &ldquo;Paid with SOL. Tracking hit my inbox right after the tx confirmed, and the bag was on my doorstep the next afternoon.&rdquo;
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#dcdcdc] rounded-xs overflow-hidden">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src="/images/customer_holding_celine.jpg"
                  alt="Customer holding Celine bag"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1 font-mono">
                  <span>Miami, FL</span>
                  <span className="text-[#047857] font-semibold">Delivered in 19h</span>
                </div>
                <strong className="text-xs text-neutral-950 block">Celine Triomphe Shoulder Bag</strong>
                <p className="text-xs text-neutral-600 mt-1 italic">
                  &ldquo;Flawless leather and immaculate hardware. Came with the full boutique box and dust bag. Absolutely legit.&rdquo;
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#dcdcdc] rounded-xs overflow-hidden">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src="/images/customer_cardholder_delivery.jpg"
                  alt="Customer unboxing small leather goods package"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1 font-mono">
                  <span>New York, NY</span>
                  <span className="text-[#047857] font-semibold">Delivered in 16h</span>
                </div>
                <strong className="text-xs text-neutral-950 block">Goyard Saint Sulpice & LV Card Case</strong>
                <p className="text-xs text-neutral-600 mt-1 italic">
                  &ldquo;Smooth checkout with BTC. Package was double boxed with security tamper tape. 10/10 service.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/shop"
            className="px-7 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
            style={{ color: "#ffffff" }}
          >
            <span style={{ color: "#ffffff" }}>Explore Available Pieces</span>
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-[#cccccc] text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
