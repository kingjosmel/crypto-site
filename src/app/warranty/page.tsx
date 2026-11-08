import { LegalPage } from "@/components/LegalPage";

export default function WarrantyPage() {
  return (
    <LegalPage
      title="Warranty & Guarantees"
      intro="Our comprehensive guarantee on luxury designer authenticity, craftsmanship, and materials."
      heroImage={{
        url: "/images/editorial_collection_curation.jpg",
        alt: "Northstar quality verification and authentication inspection bench"
      }}
      sections={[
        {
          heading: "100% Lifetime Authenticity Guarantee",
          body: "Every luxury bag, accessory, pair of footwear, and garment in our archive is guaranteed authentic for life. Our specialists inspect hardware engravings, serial tags, RFID chips, stitch precision, and material grain before any item is listed."
        },
        {
          heading: "Designer Ready-to-Wear & Leather Goods Warranty",
          body: "Brand-new garments and leather goods retain full boutique provenance, including original designer tags, house dust bags, and authentication documentation. We stand behind the physical condition and artisan craftsmanship of every piece."
        },
        {
          heading: "Filing an Inquiry or Claim",
          body: "To initiate an authenticity review or service request, simply email our customer support team with your order number. We respond within a few business hours to assist you."
        }
      ]}
    />
  );
}
