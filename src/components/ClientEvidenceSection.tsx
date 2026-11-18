"use client";

import Link from "next/link";
import { ShieldCheck, CheckCircle2, FileCheck2 } from "lucide-react";
import { listAllVerificationRecords } from "@/lib/verificationRecords";

export function ClientEvidenceSection() {
  const sampleRecords = listAllVerificationRecords().slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#047857] block mb-2">
              Northstar Verified Registry
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal tracking-tight">
              Documented Inspections Before You Pay
            </h2>
            <p className="text-sm text-neutral-600 mt-2.5 leading-relaxed">
              Every piece listed by Northstar Supply LLC carries a public verification ID with inspector attribution, condition grading, and recorded boutique accessories—plus 100% insured US express shipping.
            </p>
          </div>

          <Link
            href="/verify"
            className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.12em] rounded-xs transition-colors shrink-0"
            style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
          >
            <FileCheck2 className="w-4 h-4" aria-hidden="true" />
            <span style={{ color: "#ffffff" }}>Open Verification Registry →</span>
          </Link>
        </div>

        {/* Sample Public Verification Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {sampleRecords.map((rec) => (
            <article
              key={rec.verificationId}
              className="bg-[#fafafa] border border-[#dcdcdc] rounded-xs p-6 sm:p-7 hover:border-neutral-950 transition-colors flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between pb-3.5 border-b border-[#e5e5e5] gap-3">
                  <div>
                    <span className="font-mono font-bold text-[#047857] text-xs block">
                      {rec.verificationId}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Inspected {rec.inspectionDate}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-white text-[#047857] px-2.5 py-1 border border-[#dcdcdc] rounded-xs">
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    Northstar Verified
                  </span>
                </div>

                <div className="py-3.5">
                  <h3 className="font-serif text-base sm:text-lg font-normal text-neutral-950">
                    {rec.brand} · {rec.productName}
                  </h3>
                  <p className="text-[11px] text-neutral-600 mt-1">{rec.inspectorName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white border border-[#e5e5e5] p-3 rounded-xs">
                  <span className="inline-flex items-center gap-1 text-neutral-800">
                    <CheckCircle2 className="w-3 h-3 text-[#047857] shrink-0" aria-hidden="true" />
                    Physical: {rec.physicalInspectionStatus}
                  </span>
                  <span className="inline-flex items-center gap-1 text-neutral-800">
                    <CheckCircle2 className="w-3 h-3 text-[#047857] shrink-0" aria-hidden="true" />
                    Stitching: {rec.materialsAndStitchingStatus}
                  </span>
                  <span className="inline-flex items-center gap-1 text-neutral-800">
                    <CheckCircle2 className="w-3 h-3 text-[#047857] shrink-0" aria-hidden="true" />
                    Hardware: {rec.hardwareAndDetailsStatus}
                  </span>
                  <span className="inline-flex items-center gap-1 text-neutral-800">
                    <CheckCircle2 className="w-3 h-3 text-[#047857] shrink-0" aria-hidden="true" />
                    Accessories: Recorded
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-neutral-500">SKU: {rec.sku}</span>
                <Link
                  href={`/verify/${rec.verificationId}`}
                  className="font-semibold text-neutral-950 hover:text-[#047857] underline"
                >
                  Inspect Record →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Client Protection & Support Bar */}
        <div className="mt-10 sm:mt-12 bg-white border border-[#d4d4d4] rounded-xs p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#047857]" />
              <strong className="text-xs uppercase font-bold tracking-wider text-neutral-950">
                Northstar Buyer Protection &amp; Support
              </strong>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Verified customer reviews appear strictly after real orders ship. Every transaction includes 100% insured FedEx Priority Overnight / UPS Next Day Air delivery, adult signature confirmation, and our 14-day return &amp; authenticity guarantee.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
            <Link
              href="/buyer-protection"
              className="text-center px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.12em] transition-colors shadow-xs"
              style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
            >
              <span style={{ color: "#ffffff" }}>Read Buyer Protection →</span>
            </Link>
            <span className="text-[11px] text-neutral-500 text-center font-mono">
              support@shopnorthstar.store · Mon–Sat 9 AM – 7 PM EST
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
