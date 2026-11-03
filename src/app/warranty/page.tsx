import { LegalPage } from "@/components/LegalPage";

export default function WarrantyPage() {
  return (
    <LegalPage
      title="Warranty & Guarantees"
      intro="Our comprehensive guarantee on horological authenticity, precision, and craftsmanship."
      heroImage={{
        url: "/images/editorial_horology_vault.jpg",
        alt: "Swiss watchmaker workbench with precision loupe and horological movement calibration tools"
      }}
      sections={[
        {
          heading: "Certified Watchmaker Guarantee",
          body: "All pre-owned timepieces from Rolex, Audemars Piguet, and Richard Mille are backed by Northstar's 2-Year Comprehensive Mechanical Warranty. Each watch is timing-tested on an electronic Witschi chronocomparator and pressure-tested for water resistance."
        },
        {
          heading: "Designer Ready-to-Wear & Leather Goods",
          body: "Brand-new garments and leather goods retain full boutique provenance, including original designer tags, house dust bags, and authentication microchips."
        },
        {
          heading: "Filing a Claim",
          body: "To initiate warranty service, simply contact your private client advisor with your order number. We arrange complimentary insured transit to our Geneva or New York service atelier."
        }
      ]}
    />
  );
}
