import { LegalPage } from "@/components/LegalPage";

export default function ReturnsRefundsPage() {
  return (
    <LegalPage
      title="Returns & Refunds"
      intro="Our inspection periods, returns eligibility, and cryptocurrency refund procedures."
      heroImage={{
        url: "/images/editorial_atelier.jpg",
        alt: "Atelier inspection studio and authentication station"
      }}
      sections={[
        {
          heading: "7-Day Client Inspection Period",
          body: "For all archival luxury acquisitions, clients receive a 7-day inspection window. The piece must remain unworn with all tamper-proof tags and seals intact."
        },
        {
          heading: "Ready-to-Wear & Accessories",
          body: "Footwear, garments, and leather goods may be returned within 14 days of receipt in pristine, unused condition with all original packaging, tags, and dust bags."
        },
        {
          heading: "Cryptocurrency Refund Calculation",
          body: "Refunds for orders settled in Bitcoin or USDC are remitted to your originating wallet address. In accordance with anti-fraud safeguards, refunds are calculated based on the USD invoice total and converted at the live oracle spot rate upon approval."
        }
      ]}
    />
  );
}
