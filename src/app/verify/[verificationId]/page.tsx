import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { getVerificationRecordById } from "@/lib/verificationRecords";
import { formatPrice } from "@/lib/api";
import { CheckCircle2, ShieldCheck, ArrowLeft, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VerificationCertificatePage({
  params,
}: {
  params: Promise<{ verificationId: string }>;
}) {
  const { verificationId } = await params;
  const decodedId = decodeURIComponent(verificationId).trim();
  const record = getVerificationRecordById(decodedId);

  if (!record) {
    return (
      <SiteShell>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block">
            Northstar Verified Registry
          </span>
          <h1 className="font-serif text-3xl text-neutral-950 font-normal">
            No Verification Record Found for &ldquo;{decodedId}&rdquo;
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Double-check the Verification ID on your product tag or certificate (format: <code className="font-mono">NS-2026-067</code>) or search again below.
          </p>
          <form action="/verify" method="GET" className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              name="id"
              type="text"
              required
              placeholder="NS-2026-067"
              className="flex-1 px-4 py-3 bg-[#fafafa] border border-[#cccccc] text-xs font-mono"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-1.5"
              style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span style={{ color: "#ffffff" }}>Lookup</span>
            </button>
          </form>
        </div>
      </SiteShell>
    );
  }

  const rows = [
    { label: "Physical inspection", value: record.physicalInspectionStatus },
    { label: "Materials and stitching", value: record.materialsAndStitchingStatus },
    { label: "Hardware and details", value: record.hardwareAndDetailsStatus },
    { label: "Condition report", value: record.conditionGrade },
    { label: "Accessories", value: "Recorded" },
  ];

  return (
    <SiteShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          href="/verify"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-500 hover:text-black mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          All Verification Records
        </Link>

        {/* Certificate Container */}
        <article className="bg-white border border-[#cccccc] rounded-xs shadow-xs overflow-hidden">
          <div className="px-6 py-5 bg-[#0f0f0f] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#10b981] mb-1">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                Northstar Verified
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                {record.productName}
              </h1>
            </div>
            <div className="text-left sm:text-right font-mono">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                Verification ID
              </span>
              <strong className="text-base text-white">{record.verificationId}</strong>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-[#fafafa] border border-[#e5e5e5] rounded-xs text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  Designer House
                </span>
                <strong className="text-neutral-950">{record.brand}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  Catalog SKU
                </span>
                <strong className="font-mono text-neutral-950">{record.sku}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  Inspection Date
                </span>
                <strong className="font-mono text-neutral-950">{record.inspectionDate}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  Archive Valuation
                </span>
                <strong className="font-mono text-neutral-950">{formatPrice(record.priceCents)}</strong>
              </div>
            </div>

            {/* Verification Table */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-900 mb-3">
                Authenticity Inspection Record
              </h2>
              <div className="border border-[#dcdcdc] rounded-xs divide-y divide-[#e5e5e5] text-xs">
                <div className="px-4 py-2.5 bg-[#fafafa] flex justify-between font-bold uppercase tracking-wider text-[10px] text-neutral-500">
                  <span>Verification Detail</span>
                  <span>Status</span>
                </div>
                {rows.map((row) => (
                  <div key={row.label} className="px-4 py-3 flex items-center justify-between gap-4">
                    <span className="text-neutral-800 font-medium">{row.label}</span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#047857]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspector, Condition Report, Accessories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-[#fafafa] border border-[#e5e5e5] rounded-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                  Condition Report &amp; Lead Inspector
                </span>
                <p className="font-semibold text-neutral-950">{record.inspectorName}</p>
                <p className="text-neutral-600 leading-relaxed">{record.conditionReport}</p>
              </div>
              <div className="p-4 bg-[#fafafa] border border-[#e5e5e5] rounded-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                  Recorded Accessories &amp; Packaging
                </span>
                <p className="text-neutral-700 leading-relaxed">{record.accessoriesRecorded}</p>
                <p className="text-[11px] text-neutral-500">
                  All accompanying accessories are photographed and packed inside tamper-evident packaging prior to courier dispatch.
                </p>
              </div>
            </div>

            {/* Inspection Photos */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-900 mb-3">
                Supporting Inspection Photographs ({record.inspectionPhotos.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {record.inspectionPhotos.map((photo, idx) => (
                  <div
                    key={`${photo.url}-${idx}`}
                    className="relative aspect-square bg-[#fafafa] border border-[#dcdcdc] rounded-xs overflow-hidden"
                  >
                    <Image
                      src={photo.url}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 280px"
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Scope Disclosure & Actions */}
            <div className="pt-6 border-t border-[#dcdcdc] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[11px] text-neutral-500 max-w-lg leading-relaxed">
                This record documents the pre-shipment physical inspection performed by Northstar Supply specialists. Every sale is protected by our{" "}
                <Link href="/buyer-protection" className="underline text-neutral-900">
                  Buyer Protection &amp; Authenticity Guarantee
                </Link>
                .
              </p>
              <Link
                href={`/product/${record.productSlug}`}
                className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xs shrink-0 text-center"
                style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
              >
                <span style={{ color: "#ffffff" }}>View Product Listing →</span>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </SiteShell>
  );
}
