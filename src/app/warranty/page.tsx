import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Condition Standards & Guarantee | Northstar Supply Holdings AG",
  description: "Comprehensive authenticity guarantee, condition tier taxonomy, and atelier inspection coverage.",
};

export default function WarrantyPage() {
  return (
    <LegalPage
      title="Condition Standards & Guarantee"
      intro="Our comprehensive guarantee on designer authenticity, material integrity, and archival condition standards."
      heroImage={{
        url: "/images/editorial_atelier.jpg",
        alt: "Atelier inspection studio for fine fabrics, designer tailoring, and luxury leather goods"
      }}
      sections={[
        {
          heading: "Tier 1: Unworn Archive Pieces (Complete Set)",
          body: "Brand-new acquisitions are guaranteed unworn and complete with original manufacturer garment bags or presentation boxes, serialized hangtags, and care collateral."
        },
        {
          heading: "Tier 2: Pristine Pre-Owned Pieces (9.5/10 Collector Grade)",
          body: "Every pre-owned piece from Dior, Gucci, Louis Vuitton, and Loro Piana is backed by Northstar's Atelier Inspection Certificate. Garments and footwear undergo 10-point structural audits to ensure pristine fabric drape, stitch tension, and sole geometry."
        },
        {
          heading: "Tier 3: Certified Restored / Studio Cleaned Items",
          body: "Restored archival references undergo gentle ozone sanitization, fiber conditioning with pH-balanced balms, and hardware restoration strictly to original house specifications."
        },
        {
          heading: "Designer Ready-to-Wear, Footwear & Leather Goods",
          body: "All archival leather goods from Maison Goyard and luxury fashion houses are guaranteed 100% authentic for life. Every piece is examined for chevron pattern alignment, hand-stitching tension, serial debossing, and hardware plating fidelity."
        },
        {
          heading: "Client Care & Inspection Logistics",
          body: "Every acquisition arrives with our 7-day inspection window. In the event an item does not meet catalog specifications, Northstar coordinates prepaid insured courier return transit via FedEx International Priority or DHL Express."
        }
      ]}
    />
  );
}
