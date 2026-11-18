import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <SiteShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#047857] block mb-2">
          Northstar Client Services
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-neutral-950 font-normal tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-base text-neutral-600 max-w-2xl leading-relaxed mb-8">
          Northstar Supply LLC provides direct email assistance for order tracking, product inspection questions, returns, and cryptocurrency settlement inquiries.
        </p>

        {/* Client Services Availability & Direct Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-white border border-[#dcdcdc] rounded-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Email Support</span>
            <a
              href="mailto:support@shopnorthstar.store"
              className="text-xs font-bold text-neutral-950 hover:text-[#047857] transition-colors block break-all"
            >
              support@shopnorthstar.store
            </a>
            <span className="text-[11px] text-[#047857] font-medium mt-1.5 block">
              ● Available · Reply under 2h
            </span>
          </div>

          <div className="p-5 bg-white border border-[#dcdcdc] rounded-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Support Hours</span>
            <strong className="text-xs text-neutral-950 block">Mon – Sat: 9:00 AM – 7:00 PM EST</strong>
            <span className="text-[11px] text-neutral-500 mt-1.5 block">
              Dedicated email support 6 days a week
            </span>
          </div>

          <div className="p-5 bg-white border border-[#dcdcdc] rounded-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Registered Office</span>
            <strong className="text-xs text-neutral-950 block">Northstar Supply LLC</strong>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              548 Market St, Ste 41200, San Francisco, CA 94104
            </span>
          </div>

          <div className="p-5 bg-white border border-[#dcdcdc] rounded-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Self-Service Tools</span>
            <Link href="/track" className="text-xs text-[#047857] font-semibold hover:underline block">
              Track Order Status →
            </Link>
            <Link href="/verify" className="text-xs text-neutral-900 font-semibold hover:underline block mt-1">
              Verify Authenticity ID →
            </Link>
          </div>
        </div>

        {/* Interactive Contact Form */}
        <ContactForm />

        {/* Hero Visual */}
        <div className="relative aspect-16/9 w-full rounded-xs overflow-hidden border border-[#dcdcdc] shadow-sm my-12">
          <Image
            src="/images/editorial_white_glove_courier.jpg"
            alt="Northstar direct customer support and insured courier dispatch"
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            quality={95}
            priority
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        </div>

        {/* Information Sections */}
        <div className="divide-y divide-[#dcdcdc] border-t border-b border-[#dcdcdc]">
          <div className="py-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Order Assistance &amp; Tracking Inquiries
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              If you have already placed an order, please include your order number (for example: NS-00000001) in your message. Courier tracking updates activate once your piece passes final inspection and is collected by FedEx or UPS. You can view live milestones anytime on our{" "}
              <Link href="/track" className="underline text-neutral-900">
                Order Tracking page
              </Link>
              .
            </p>
          </div>

          <div className="py-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Cryptocurrency Orders &amp; Refund Return Wallets
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              We accept Visa, Mastercard, American Express, PayPal, as well as verified on-chain Bitcoin (BTC), Ethereum (ETH), and Solana (SOL). If you need assistance confirming a transaction hash or registering a personal Refund Return Wallet for 14-day return eligibility, email{" "}
              <a href="mailto:support@shopnorthstar.store" className="underline text-neutral-900">
                support@shopnorthstar.store
              </a>{" "}
              or review our{" "}
              <Link href="/buyer-protection" className="underline text-neutral-900">
                Buyer Protection Policy
              </Link>
              .
            </p>
          </div>

          <div className="py-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Authenticity &amp; Product Inspection Requests
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              Every piece carries a public{" "}
              <Link href="/verify" className="underline text-neutral-900">
                Northstar Verified Inspection Record
              </Link>
              . Before ordering, you may request additional close-up inspection photos, hardware macro shots, or exact measurements through the form above.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
