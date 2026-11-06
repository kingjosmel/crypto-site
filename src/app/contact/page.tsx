import { LegalPage } from "@/components/LegalPage";

export default function ContactPage() {
  return (
    <LegalPage
      title="Private Client Concierge"
      intro="Direct communication for acquisitions, bespoke sourcing, and order stewardship."
      heroImage={{
        url: "/images/editorial_atelier.jpg",
        alt: "Northstar / Supply private salon and client reception"
      }}
      sections={[
        {
          heading: "Private Client Sourcing",
          body: "Seeking an off-market reference, bespoke complication, or rare archival runway piece? Our concierge team maintains direct relationships with heritage houses and private vault collectors across Milan, Paris, and Geneva."
        },
        {
          heading: "Order & Fulfillment Inquiries",
          body: "For questions regarding active cryptocurrency transactions, wallet confirmations, or white-glove courier dispatch, please reference your order number (e.g. NS-00000001) in your inquiry."
        },
        {
          heading: "Hours of Stewardship",
          body: "Our private advisory desk is available Monday through Saturday, 9:00 AM to 7:00 PM EST. Inquiries submitted via your verified account receive priority routing."
        }
      ]}
    />
  );
}
