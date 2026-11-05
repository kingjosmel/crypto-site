import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Warranty & Authenticity Guarantee | Northstar Supply Holdings AG",
  description: "Comprehensive 2-year mechanical warranty, condition tier guarantees, and Geneva atelier service coverage.",
};

export default function WarrantyPage() {
  return (
    <LegalPage
      title="Warranty & Guarantees"
      intro="Our comprehensive guarantee on horological authenticity, mechanical precision, and archival condition."
      heroImage={{
        url: "/images/editorial_horology_vault.jpg",
        alt: "Swiss watchmaker workbench with precision loupe and horological movement calibration tools"
      }}
      sections={[
        {
          heading: "Tier 1: Unworn Archive Pieces (Complete Set)",
          body: "Brand-new acquisitions are guaranteed unworn and complete with original manufacturer international warranty papers, serialized hangtags, and presentation box sets. Factory warranties remain valid internationally at authorized boutiques."
        },
        {
          heading: "Tier 2: Pristine Pre-Owned Timepieces (9.5/10 Collector Grade)",
          body: "Every pre-owned timepiece from Patek Philippe, Audemars Piguet, Rolex, and Richard Mille is backed by Northstar's 2-Year Certified Mechanical Warranty. Watches are timing-tested across 5 positions on an electronic Witschi chronocomparator to ensure COSC rate accuracy and pressure-tested for water resistance."
        },
        {
          heading: "Tier 3: Certified Restored / Overhauled References",
          body: "Overhauled vintage and historic references undergo complete ultrasonic movement disassembly, synthetic oil lubrication, genuine component replacement, and case refinishing strictly to original bevel angles. Backed by our Northstar 2-Year Full Atelier Restoration Guarantee."
        },
        {
          heading: "Designer Ready-to-Wear, Footwear & Leather Goods",
          body: "All archival leather goods from Maison Goyard, Hermès, and luxury fashion houses are guaranteed 100% authentic for life. Every piece is examined for chevron pattern alignment, hand-stitching tension, serial debossing, and hardware plating fidelity."
        },
        {
          heading: "Warranty Service Logistics",
          body: "In the unlikely event your timepiece requires regulation or service during the warranty window, Northstar provides complimentary armored round-trip transit via Ferrari Group or Malca-Amit to our Geneva or New York service atelier."
        }
      ]}
    />
  );
}
