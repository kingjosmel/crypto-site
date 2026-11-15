import { LegalPage } from "@/components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="Conditions governing purchases, authenticity guarantees, shipping, and returns at Northstar / Supply (shopnorthstar.store)."
      heroImage={{
        url: "/images/editorial_collection_curation.jpg",
        alt: "Northstar / Supply client services and authenticity archive"
      }}
      sections={[
        {
          heading: "Orders & Payment Verification",
          body: "All orders placed through shopnorthstar.store are subject to inventory availability, fraud screening, and payment authorization. Accepted checkout methods include major credit and debit cards, PayPal Express Checkout, and supported digital currencies (BTC, ETH, SOL)."
        },
        {
          heading: "Authenticity & Physical Inspection",
          body: "Every handbag, garment, pair of footwear, and leather accessory is physically inspected and authenticated in-house prior to dispatch. All items ship with full documentation and security tags."
        },
        {
          heading: "24-Hour Insured Delivery & Returns",
          body: "Complimentary 24-hour USA express delivery includes full-value transit insurance and adult signature verification upon arrival. Unworn items with intact security tags and original packaging may be returned within 14 days via support@shopnorthstar.store."
        }
      ]}
    />
  );
}
