import { LegalPage } from "@/components/LegalPage";

export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping"
      intro="White-glove fulfillment, insured transport, and international delivery protocols."
      heroImage={{
        url: "/images/editorial_white_glove_courier.jpg",
        alt: "Luxury presentation box and white-glove delivery courier documentation"
      }}
      sections={[
        {
          heading: "White-Glove Processing",
          body: "Every piece undergoes an exhaustive final inspection by our verification specialists before being packed into archival, tamper-evident presentation boxing."
        },
        {
          heading: "Fully Insured Armored Courier Transit",
          body: "High-value timepieces and luxury accessories ship with full transit insurance via priority express couriers (FedEx International Priority or Ferrari Group armored transport). An adult signature is required upon delivery."
        },
        {
          heading: "Live Tracking & Chain Finality",
          body: "When your order clears blockchain confirmation, you receive immediate access to real-time carrier tracking and milestone transit updates directly in your private client portal."
        }
      ]}
    />
  );
}
