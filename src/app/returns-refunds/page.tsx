import { LegalPage } from "@/components/LegalPage";

export default function ReturnsRefundsPage() {
  return (
    <LegalPage
      title="Returns & Refunds"
      intro="Our 14-day inspection periods, returns eligibility, and client refund procedures."
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
          heading: "Original Method & Refund Return Wallet Payouts",
          body: "Approved returns are refunded directly to your original payment method. Clients paying with Bitcoin, Ethereum, or Solana can also register a personal Refund Return Wallet right at checkout so refunds settle directly to a wallet they control—based on the full USD invoice total at the live spot rate upon return approval—rather than a shared exchange hot wallet."
        }
      ]}
    />
  );
}
