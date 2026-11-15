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
          heading: "Refund Return Wallet & USD-Pegged Payouts",
          body: "Clients can register a personal Refund Return Wallet right at checkout so refunds never risk being routed back to a shared exchange hot wallet. Refunds for USDC, Bitcoin, Ethereum, or Solana orders are remitted directly to your registered return wallet based on the full USD invoice total (1:1 in USDC or converted at the live spot rate upon return approval)."
        }
      ]}
    />
  );
}
