import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { listAllVerificationRecords } from "@/lib/verificationRecords";
import { ShieldCheck, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VerifyIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (id && id.trim()) {
    redirect(`/verify/${encodeURIComponent(id.trim().toUpperCase())}`);
  }

  const allRecords = listAllVerificationRecords();

  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="border-b border-[#dcdcdc] pb-8 mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#047857] mb-2">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            Northstar Verified Registry
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-950 font-normal tracking-tight mb-3">
            Authenticity Verification Lookup
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed mb-6">
            Every piece offered by Northstar carries a serialized Verification ID recorded by our inspection specialists prior to listing. Enter a Verification ID (for example, <code className="font-mono text-neutral-900">NS-2026-067</code>) or stock SKU to view its inspection record, recorded accessories, and reference photographs.
          </p>

          <form action="/verify" method="GET" className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <label htmlFor="verification-lookup-input" className="sr-only">
              Verification ID or SKU
            </label>
            <input
              id="verification-lookup-input"
              name="id"
              type="text"
              required
              placeholder="Enter Verification ID (e.g. NS-2026-067) or SKU"
              className="flex-1 px-4 py-3 bg-[#fafafa] border border-[#cccccc] focus:border-black focus:bg-white focus:outline-none text-xs font-mono text-neutral-900"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer"
              style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span style={{ color: "#ffffff" }}>Verify Record</span>
            </button>
          </form>
        </div>

        {/* Sample / Indexed Archive Certificates */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-900 mb-4">
            Recently Inspected Archive Pieces ({allRecords.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allRecords.slice(0, 12).map((rec) => (
              <Link
                key={rec.verificationId}
                href={`/verify/${rec.verificationId}`}
                className="group bg-white border border-[#dcdcdc] hover:border-neutral-950 rounded-xs p-4 flex items-center gap-4 transition-colors"
              >
                <div className="relative w-16 h-16 shrink-0 bg-[#fafafa] border border-[#e5e5e5] overflow-hidden rounded-xs">
                  <Image
                    src={rec.inspectionPhotos[0]?.url || "/images/editorial_collection_curation.jpg"}
                    alt={rec.productName}
                    fill
                    sizes="64px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[11px] font-bold text-[#047857] block">
                    {rec.verificationId}
                  </span>
                  <strong className="text-xs text-neutral-950 font-medium block truncate group-hover:underline">
                    {rec.productName}
                  </strong>
                  <span className="text-[11px] text-neutral-500 block truncate">
                    {rec.brand} · {rec.inspectionDate}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
