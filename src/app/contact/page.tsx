import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <SiteShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#047857] block mb-2">
          Customer Support
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-neutral-950 font-normal tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-base text-neutral-600 max-w-2xl leading-relaxed mb-8">
          Have a question about a product, delivery, or cryptocurrency payment? We are here to help and reply promptly.
        </p>

        {/* Interactive Contact Form */}
        <ContactForm />

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-5 bg-white border border-[#ece8e1] rounded-xs">
            <span className="text-xs uppercase font-bold text-neutral-400 block mb-1">Email Support</span>
            <strong className="text-sm text-neutral-950 block">support@northstarsupply.com</strong>
            <span className="text-xs text-neutral-500 mt-1 block">Quick replies within 1 to 2 hours</span>
          </div>
          <div className="p-5 bg-white border border-[#ece8e1] rounded-xs">
            <span className="text-xs uppercase font-bold text-neutral-400 block mb-1">Support Hours</span>
            <strong className="text-sm text-neutral-950 block">Mon - Sat: 9:00 AM to 7:00 PM EST</strong>
            <span className="text-xs text-neutral-500 mt-1 block">Assistance 6 days a week</span>
          </div>
          <div className="p-5 bg-white border border-[#ece8e1] rounded-xs">
            <span className="text-xs uppercase font-bold text-neutral-400 block mb-1">Order Tracking</span>
            <Link href="/track" className="text-sm text-[#047857] font-semibold hover:underline block">
              Track Active Order →
            </Link>
            <span className="text-xs text-neutral-500 mt-1 block">Live 24-hour delivery updates</span>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative aspect-16/9 w-full rounded-xs overflow-hidden border border-[#ece8e1] shadow-sm mb-12">
          <Image
            src="/images/editorial_white_glove_courier.jpg"
            alt="Northstar direct customer support and delivery"
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            quality={95}
            priority
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        </div>

        {/* Information Sections */}
        <div className="divide-y divide-[#ece8e1] border-t border-b border-[#ece8e1]">
          <div className="py-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Order Inquiries and Delivery Updates
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              If you have already placed an order, please include your order number (for example: NS-00000001) in your message. Your tracking number is also emailed immediately once your transaction confirms on the blockchain. You can track your courier progress anytime using our live tracking tool.
            </p>
          </div>

          <div className="py-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Guaranteed 24-Hour USA Delivery Questions
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              Every item listed on our site is in our possession and ready to ship. We guarantee delivery anywhere in the United States within 24 hours of payment confirmation. If you need your order delivered to a specific home address, business suite, or hotel, simply let us know and we will coordinate the scheduled arrival.
            </p>
          </div>

          <div className="py-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Cryptocurrency Payment Assistance
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              We accept Bitcoin (BTC), Ethereum (ETH), and Solana (SOL). If you need help calculating exchange rates, verifying network deposit addresses, or checking blockchain confirmations, our support team is happy to assist you through every step of checkout.
            </p>
          </div>

          <div className="py-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
              Authenticity and Product Verification
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              All designer bags, footwear, and apparel on Northstar are 100% authentic and verified before listing. Every piece comes with its original designer box, dust bag, tags, and authenticity documentation. If you would like additional high-resolution photos or detailed measurements of any piece in our catalog, reach out and we will gladly provide them.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
