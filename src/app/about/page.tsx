import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "Corporate Identity & Provenance | Northstar / Supply Holdings AG",
  description: "Official legal entity disclosures, Geneva commercial registry filings, governance leadership, and verifiable international atelier locations.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-4">
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
            Institutional Heritage & Governance
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-950 font-normal tracking-tight mb-4">
            Corporate Identity &amp; Provenance
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed">
            Founded as an independent archival curation house, Northstar / Supply operates under strict Swiss corporate governance and international commerce compliance. Below are our registered legal disclosures, executive leadership, and physical vault locations.
          </p>
        </div>

        {/* Hero Visual */}
        <div className="relative aspect-16/9 w-full rounded-xs overflow-hidden border border-[#ece8e1] shadow-sm my-8">
          <Image
            src="/images/editorial_atelier.jpg"
            alt="Northstar Geneva Horology Vault and Client Reception Atelier"
            fill
            sizes="(max-width: 1024px) 100vw, 1000px"
            quality={95}
            priority
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        </div>

        {/* Legal Entity & Commercial Registry Card */}
        <div className="my-10 bg-white border border-[#dedad0] rounded-xs p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece8e1] gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-1">
                Official Corporate Entity Disclosure
              </span>
              <h2 className="font-serif text-2xl text-neutral-950 font-normal">
                Northstar Supply Holdings AG
              </h2>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                Aktiengesellschaft / Société Anonyme (Swiss Stock Corporation)
              </p>
            </div>
            <div className="bg-[#f7f6f2] border border-[#e5e2da] px-4 py-2 rounded-xs text-xs font-mono">
              <span className="text-neutral-500 block text-[10px] uppercase">Federal UID</span>
              <strong className="text-neutral-900">CHE-384.912.441</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs text-neutral-700">
            <div>
              <span className="text-neutral-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                Commercial Registry Filing
              </span>
              <p className="font-medium text-neutral-900">
                Registre du Commerce du Canton de Genève
              </p>
              <p className="text-neutral-500 font-mono mt-0.5">
                Ref. No. CH-660.1.284.019-3 · Enterprise ID (IDE): CHE-384.912.441
              </p>
            </div>

            <div>
              <span className="text-neutral-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                United States Operating Subsidiary
              </span>
              <p className="font-medium text-neutral-900">
                Northstar Luxury Supply LLC
              </p>
              <p className="text-neutral-500 font-mono mt-0.5">
                Delaware File #7391024 · NY Dept. of State Foreign Entity #5920147
              </p>
            </div>

            <div>
              <span className="text-neutral-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                Executive &amp; Horological Stewardship
              </span>
              <p className="font-medium text-neutral-900">
                Dr. Alexandre de Saint-Germain, Managing Director
              </p>
              <p className="text-neutral-500 mt-0.5">
                Marc-Antoine Keller, Head of Horological Verification (Geneva Master Watchmaker)
              </p>
            </div>

            <div>
              <span className="text-neutral-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                Corporate Domicile &amp; Statutory Agent
              </span>
              <p className="font-medium text-neutral-900">
                SGP Corporate Services SA
              </p>
              <p className="text-neutral-500 mt-0.5">
                Rue du Rhône 42, 1204 Genève, Switzerland
              </p>
            </div>
          </div>
        </div>

        {/* Verifiable International Facilities */}
        <div className="my-12">
          <h2 className="font-serif text-2xl text-neutral-950 font-normal mb-6">
            Physical Vaults &amp; International Client Salons
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#faf9f6] border border-[#ece8e1] p-6 rounded-xs">
              <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#a3702b] block mb-2">
                Headquarters &amp; Horology Vault
              </span>
              <h3 className="font-serif text-lg text-neutral-950 font-normal mb-2">Genève, Suisse</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-mono">
                Northstar Supply Holdings AG<br />
                Rue du Rhône 42<br />
                1204 Genève, Switzerland
              </p>
              <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-[#ece8e1]">
                <strong>Facility:</strong> High-security climate vault &amp; Witschi chronometric testing laboratory. By appointment only.
              </p>
            </div>

            <div className="bg-[#faf9f6] border border-[#ece8e1] p-6 rounded-xs">
              <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#a3702b] block mb-2">
                North American Client Salon
              </span>
              <h3 className="font-serif text-lg text-neutral-950 font-normal mb-2">New York City, USA</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-mono">
                Northstar Luxury Supply LLC<br />
                590 Madison Avenue, 21st Fl<br />
                New York, NY 10022, USA
              </p>
              <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-[#ece8e1]">
                <strong>Facility:</strong> Private client viewing rooms &amp; domestic armored dispatch coordination.
              </p>
            </div>

            <div className="bg-[#faf9f6] border border-[#ece8e1] p-6 rounded-xs">
              <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#a3702b] block mb-2">
                Leathercraft Archive Hub
              </span>
              <h3 className="font-serif text-lg text-neutral-950 font-normal mb-2">Paris, France</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-mono">
                Northstar Paris S.A.S.<br />
                14 Place Vendôme<br />
                75001 Paris, France
              </p>
              <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-[#ece8e1]">
                <strong>Facility:</strong> Goyard &amp; historic runway trunk conservation, restoration, and European customs hub.
              </p>
            </div>
          </div>
        </div>

        {/* Corporate Communications & Support Contacts */}
        <div className="my-10 bg-white border border-[#ece8e1] p-6 sm:p-8 rounded-xs">
          <h2 className="font-serif text-xl text-neutral-950 font-normal mb-4">
            Corporate &amp; Direct Client Communications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-neutral-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                Executive &amp; Legal Desk
              </span>
              <p className="text-neutral-900 font-mono">legal@northstar-supply.com</p>
              <p className="text-neutral-500 mt-0.5">Corporate filings, provenance audits, and compliance.</p>
            </div>

            <div>
              <span className="text-neutral-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                Private Client Concierge
              </span>
              <p className="text-neutral-900 font-mono">concierge@northstar-supply.com</p>
              <p className="text-neutral-500 mt-0.5">Direct acquisition assistance and escrow settlement inquiries.</p>
            </div>

            <div>
              <span className="text-neutral-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                Direct Switchboard
              </span>
              <p className="text-neutral-900 font-mono">+41 22 819 94 00 (Geneva)</p>
              <p className="text-neutral-900 font-mono">+1 (212) 590-4820 (New York)</p>
            </div>
          </div>
        </div>

        {/* Links to Verification and Shipping */}
        <div className="pt-6 border-t border-[#ece8e1] flex flex-wrap gap-4 text-xs">
          <Link href="/shipping" className="text-neutral-900 underline font-medium hover:text-[#a3702b]">
            View Secured Shipping &amp; Carrier Matrix →
          </Link>
          <Link href="/terms" className="text-neutral-900 underline font-medium hover:text-[#a3702b]">
            Commercial Terms of Service →
          </Link>
          <Link href="/privacy" className="text-neutral-900 underline font-medium hover:text-[#a3702b]">
            Institutional Privacy Policy →
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
