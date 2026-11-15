import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Payment Method Unavailable | Northstar",
  description: "Unable to process card or PayPal payment. Please return to checkout and select another payment method.",
  robots: { index: false, follow: false },
};

export default async function PaymentErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string }>;
}) {
  const { method } = await searchParams;
  const isPayPal = method?.toLowerCase() === "paypal";

  const title = isPayPal ? "PayPal Checkout Unavailable" : "Card Payment Could Not Be Processed";
  const errorCode = isPayPal ? "ERR_PAYPAL_GATEWAY_UNAVAILABLE" : "ERR_CARD_PROCESSOR_DECLINED";
  const methodLabel = isPayPal ? "PayPal Express" : "Credit / Debit Card";
  const detailMessage = isPayPal
    ? "PayPal Express Checkout could not be authorized for this luxury order. Your shopping bag is still saved—please return to checkout and try another payment method."
    : "We could not authorize your Credit or Debit Card payment at this time. Card processing for high-value designer items is currently unavailable on this gateway. Your shopping bag is still saved—please try another payment method.";

  return (
    <SiteShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="bg-white border border-[#dcdcdc] rounded-xs shadow-sm p-6 sm:p-10">
          {/* Error Header */}
          <div className="flex items-start gap-4 pb-6 border-b border-[#e5e5e5]">
            <div className="w-11 h-11 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-600 block mb-1">
                {methodLabel} Error · {errorCode}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal tracking-tight">
                {title}
              </h1>
            </div>
          </div>

          {/* Explanation */}
          <div className="py-6 space-y-5 border-b border-[#e5e5e5]">
            <div className="p-4 bg-red-50/70 border border-red-200 rounded-xs text-xs sm:text-sm text-red-900 leading-relaxed">
              {detailMessage}
            </div>

            <div className="p-5 bg-[#fafafa] border border-[#dcdcdc] rounded-xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#047857]" aria-hidden="true" />
                  <strong className="text-xs uppercase tracking-wider text-neutral-950">
                    Recommended: Pay with Cryptocurrency
                  </strong>
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#047857]">
                  Active · Instant Confirmation
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Complete your order immediately using <strong>Bitcoin (BTC)</strong>, <strong>Ethereum (ETH)</strong>, or <strong>Solana (SOL)</strong> with 14-day inspection protection.
              </p>
              <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-neutral-700">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#047857]" aria-hidden="true" />
                  14-Day Return Protection &amp; Refund Wallet
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
                  Card &amp; PayPal currently offline
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/checkout"
              className="flex-1 py-3.5 px-6 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors flex items-center justify-center gap-2"
              style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span style={{ color: "#ffffff" }}>Try Another Payment Method</span>
            </Link>
            <Link
              href="/contact"
              className="py-3.5 px-6 bg-white hover:bg-neutral-50 border border-[#cccccc] text-neutral-900 text-xs font-semibold uppercase tracking-[0.12em] transition-colors text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
