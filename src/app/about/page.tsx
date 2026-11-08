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
          <div className="p-6 bg-white border border-[#ece8e1] rounded-xs shadow-2xs">
            <span className="text-xs font-mono font-bold text-[#a3702b] block mb-3">01</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1.5">
              Guaranteed 24-Hour USA Delivery
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              No long waits or backorders. Everything listed is in our hands and delivered to any US location within 24 hours.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#ece8e1] rounded-xs shadow-2xs">
            <span className="text-xs font-mono font-bold text-[#a3702b] block mb-3">02</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-1.5">
              100% Verified Authentic
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every designer bag, footwear piece, and garment is physically inspected, serialized, and authenticated with complete documentation.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#ece8e1] rounded-xs shadow-2xs">
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
        <div className="relative aspect-16/9 w-full rounded-xs overflow-hidden border border-[#ece8e1] shadow-sm mb-12">
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
        <div className="divide-y divide-[#ece8e1] border-t border-b border-[#ece8e1]">
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

          <div className="py-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Rigorous Authenticity Standards
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl mb-3">
              We believe trust is built on proof, not promises. Every handbag from Goyard, Prada, and Celine is examined for precision stitch alignment, leather grain authenticity, and RFID microchips. Designer footwear and tailoring from Louis Vuitton, Dior, and Gucci are inspected for complete boutique provenance.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              All items include their original manufacturer packaging, serial tags, and official paperwork. We back every single sale with a 100% money-back authenticity guarantee.
            </p>
          </div>

          <div className="py-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Built for Modern Digital Commerce
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              By collecting payments directly in Bitcoin, Ethereum, and Solana, we eliminate banking wire limits, credit card fraud holds, and international transaction fees. It is fast, transparent, and settled directly between you and Northstar.
            </p>
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
            className="px-6 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-[#d6d2c8] text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
