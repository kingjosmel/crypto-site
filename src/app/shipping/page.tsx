import { LegalPage } from "@/components/LegalPage";

export default function ShippingPage() {
  return (
    <LegalPage
      title="Guaranteed 24-Hour Delivery Nationwide"
      intro="Every acquired piece is delivered to your hands in 24 hours or less, anywhere in the United States, via dedicated chartered private armored courier."
      heroImage={{
        url: "/images/editorial_white_glove_courier.jpg",
        alt: "Luxury presentation box and white-glove delivery courier documentation"
      }}
      sections={[
        {
          heading: "The 24-Hour Delivery Guarantee Across All 50 US States",
          body: "No matter your location in the United States, whether a Manhattan penthouse, an Aspen chalet, a Miami waterfront villa, Beverly Hills, Austin, Chicago, or Honolulu, Hawaii: your shipment arrives within 24 hours of on-chain cryptocurrency payment confirmation. We operate dedicated private aviation logistics and armored vehicle handovers around the clock."
        },
        {
          heading: "Dedicated Armored Handover & Personal Escort",
          body: "Every luxury bag, designer footwear pair, and tailored garment is assigned a dedicated courier dispatch. Parcels never move through standard sorting hubs or unattended conveyor belts. Handover requires direct in-person recipient verification and sign-off."
        },
        {
          heading: "100% Declared Value Transit Insurance",
          body: "Every shipment is insured for 100% of its full replacement value from the moment it leaves our secure vault until it rests safely in your hands. This comprehensive protection is provided at zero surcharge to you as part of our signature white-glove protocol."
        },
        {
          heading: "Serialized Tamper-Evident Security Packaging",
          body: "Before departure, your piece is sealed inside archival museum-grade containers wrapped with serialized tamper-evident security tape. The matching serial barcode is transmitted directly to your confirmation email so you can personally verify that the seal remained uncompromised throughout transit."
        },
        {
          heading: "Live Telemetry & Real-Time Air Transit Updates",
          body: "The moment your cryptocurrency transaction confirms on Bitcoin, Ethereum, or Solana mainnets, an encrypted tracking link is generated and sent to your email. You can monitor every milestone from vault inspection to runway departure and final curbside escort arrival in real time."
        }
      ]}
    />
  );
}
