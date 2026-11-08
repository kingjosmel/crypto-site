import { LegalPage } from "@/components/LegalPage";

export default function ReturnsRefundsPage() {
  return (
    <LegalPage
      title="Returns & Refunds"
      intro="Our inspection periods, returns eligibility, and cryptocurrency refund procedures."
      heroImage={{
        url: "/images/editorial_collection_curation.jpg",
        alt: "Northstar quality verification and inspection station"
      }}
      sections={[
        {
          heading: "14-Day Client Inspection Period",
          body: "For all designer bags, footwear, garments, and fine leather goods, clients receive a 14-day inspection window. Items must remain in unused condition with all security tags, original dust bags, and presentation boxes intact."
        },
        {
          heading: "Condition & Packaging Guidelines",
          body: "Bags must show no creasing or signs of wear. Footwear must have protective sole coverings untampered. All designer cards, certificates, and accessories must be returned in the original delivery box."
        },
        {
          heading: "Cryptocurrency Refund Calculation",
          body: "Refunds for orders settled in Bitcoin, Ethereum, or Solana are remitted directly to your originating wallet address. In accordance with anti-fraud safeguards, refunds are calculated based on the USD invoice total and converted at the live spot rate upon return approval."
        }
      ]}
    />
  );
}
