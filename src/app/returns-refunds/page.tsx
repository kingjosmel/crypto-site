import { LegalPage } from "@/components/LegalPage";

export default function ReturnsRefundsPage() {
  return (
    <LegalPage
      title="Returns & Refunds"
      intro="Our inspection periods, returns eligibility, and cryptocurrency refund procedures."
      heroImage={{
        url: "/images/editorial_horology_vault.jpg",
        alt: "Master horologist workshop and authentication inspection station"
      }}
      sections={[
        {
          heading: "7-Day Client Inspection Period",
          body: "For luxury timepieces and fine jewelry, clients receive a 7-day white-glove inspection window. The timepiece must remain unworn with all tamper-proof seals intact."
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
