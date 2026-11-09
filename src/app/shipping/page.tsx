import { LegalPage } from "@/components/LegalPage";

export default function ShippingPage() {
  return (
    <LegalPage
      title="Guaranteed 24-Hour Express Shipping Nationwide"
      intro="Every acquired designer piece is delivered to your address in 24 hours or less, anywhere in the United States, via insured priority express courier with signature verification."
      heroImage={{
        url: "/images/editorial_white_glove_courier.jpg",
        alt: "Luxury presentation box and express courier packaging"
      }}
      sections={[
        {
          heading: "The 24-Hour Delivery Guarantee Across All 50 States",
          body: "Every item in our catalog is physically in our facility and pre-packaged for immediate dispatch. Once your cryptocurrency transaction confirms on the Bitcoin, Ethereum, or Solana blockchain, your order is dispatched immediately via FedEx Priority Overnight or UPS Next Day Air. We deliver to all 50 states within 24 hours."
        },
        {
          heading: "Direct Signature on Delivery",
          body: "For security and peace of mind, all parcels require a direct in-person signature upon delivery. Packages are never left unattended on porches or in common entryways. If you prefer delivery to an office or scheduled collection at a local courier depot, we can arrange this upon request."
        },
        {
          heading: "100% Insured Transit Protection",
          body: "Every shipment is insured for 100% of its full purchase value from pickup to final delivery. This comprehensive insurance coverage is included complimentary on all orders at zero surcharge to you."
        },
        {
          heading: "Discreet Tamper-Evident Packaging",
          body: "Your item is carefully nestled in its original designer dust bag and retail box, then double-boxed in discreet, unbranded exterior packaging sealed with tamper-evident security tape. The exterior gives no indication of the valuable designer contents inside."
        },
        {
          heading: "Real-Time Tracking & SMS Updates",
          body: "As soon as your crypto payment confirms on-chain, you receive an automated confirmation email with your order number and live courier tracking link. You can follow your package from dispatch to final delivery."
        }
      ]}
    />
  );
}
