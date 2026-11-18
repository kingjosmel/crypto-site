"use client";

import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { CheckCircle2, QrCode, ShieldCheck, ExternalLink } from "lucide-react";
import type { NorthstarVerificationRecord } from "@/lib/verificationRecords";

export function NorthstarVerifiedCard({
  record,
}: {
  record: NorthstarVerificationRecord;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    let active = true;
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://shopnorthstar.store";
    const verifyUrl = `${origin}/verify/${encodeURIComponent(record.verificationId)}`;

    void QRCode.toDataURL(verifyUrl, {
      width: 144,
      margin: 1,
      color: { dark: "#0f0f0f", light: "#ffffff" },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        // Non-blocking QR fallback
      });

    return () => {
      active = false;
    };
  }, [record.verificationId]);

  const rows = [
    { label: "Physical inspection", value: record.physicalInspectionStatus },
    { label: "Materials and stitching", value: record.materialsAndStitchingStatus },
    { label: "Hardware and details", value: record.hardwareAndDetailsStatus },
    { label: "Condition report", value: record.conditionGrade },
    { label: "Accessories", value: "Recorded" },
  ];

  return (
    <section
      aria-label="Northstar Verified Authenticity Record"
      className="border border-[#dcdcdc] rounded-xs bg-white overflow-hidden my-4"
    >
      {/* Header Strip */}
      <div className="px-4 py-3.5 bg-[#0f0f0f] text-white flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10b981]" aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            Northstar Verified
          </span>
        </div>
        <span className="text-[11px] font-mono text-neutral-300">
          Verification ID: {record.verificationId}
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a3702b] block">
              Authenticity Inspection Record
            </span>
            <h3 className="font-serif text-lg text-neutral-950 font-normal">
              {record.productName}
            </h3>
            <p className="text-[11px] text-neutral-500 font-mono">
              Inspected {record.inspectionDate} · {record.inspectorName}
            </p>
          </div>

          {/* Scannable Verification QR */}
          <Link
            href={`/verify/${record.verificationId}`}
            className="shrink-0 flex flex-col items-center gap-1 p-2 border border-[#e5e5e5] bg-[#fafafa] hover:border-neutral-950 rounded-xs transition-colors"
            title="Scan or click to view public verification record"
          >
            {qrDataUrl ? (
              <Image
                src={qrDataUrl}
                alt={`QR code for verification record ${record.verificationId}`}
                width={76}
                height={76}
                unoptimized
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-[76px] h-[76px] flex items-center justify-center bg-white border border-[#e5e5e5]">
                <QrCode className="w-6 h-6 text-neutral-400" aria-hidden="true" />
              </div>
            )}
            <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-600">
              Scan Verify QR
            </span>
          </Link>
        </div>

        {/* Status Table */}
        <div className="border border-[#e5e5e5] rounded-xs divide-y divide-[#e5e5e5] text-xs">
          <div className="px-3 py-2 bg-[#fafafa] flex justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            <span>Verification Detail</span>
            <span>Status</span>
          </div>
          {rows.map((row) => (
            <div key={row.label} className="px-3 py-2 flex items-center justify-between gap-3">
              <span className="text-neutral-700">{row.label}</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-[#047857]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Accessories & Notes */}
        <div className="bg-[#fafafa] border border-[#e5e5e5] p-3 rounded-xs text-[11px] text-neutral-600 space-y-1.5 leading-relaxed">
          <p>
            <strong className="text-neutral-900">Recorded Accessories:</strong> {record.accessoriesRecorded}
          </p>
          <p>
            <strong className="text-neutral-900">Inspection Notes:</strong> {record.conditionReport}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
          <span className="text-neutral-500">
            Backed by our{" "}
            <Link href="/buyer-protection" className="underline hover:text-black">
              Lifetime Authenticity Guarantee
            </Link>
            .
          </span>
          <Link
            href={`/verify/${record.verificationId}`}
            className="inline-flex items-center gap-1 font-semibold text-neutral-950 hover:text-[#a3702b] transition-colors"
          >
            Open Full Certificate <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
