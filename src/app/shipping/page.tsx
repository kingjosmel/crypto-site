import { LegalPage } from "@/components/LegalPage";

export default function ShippingPage() {
  return (
    <LegalPage
      title="Insured Express Shipping & Courier Policy"
      intro="Complimentary insured US delivery via FedEx Priority Overnight or UPS Next Day Air with adult signature verification and honest milestone tracking."
      heroImage={{
        url: "/images/editorial_white_glove_courier.jpg",
        alt: "Insured express courier packaging and dispatch"
      }}
      sections={[
        {
          heading: "Dispatch Timing & Realistic Transit Windows",
          body: "Orders with verified payment completed before 3:00 PM EST Monday through Friday complete final Northstar inspection and packaging the same business day. Delivery takes 1 to 2 business days across the continental United States via FedEx Priority Overnight or UPS Next Day Air. Orders are marked Dispatched only after physical courier collection."
        },
        {
          heading: "Direct Adult Signature on Delivery",
          body: "For security, all Northstar shipments require a direct in-person adult signature upon arrival. Parcels are never left unattended on doorsteps or in mailrooms. Upon request before dispatch, we can hold packages for pickup at an official FedEx or UPS depot."
        },
        {
          heading: "100% Insured Transit Protection",
          body: "Every shipment is insured for 100% of its full order value from courier pickup until signed delivery. This coverage is included at zero cost to the customer. If a parcel is lost or damaged in transit, Northstar manages the carrier claim directly."
        },
        {
          heading: "Discreet Tamper-Evident Packaging",
          body: "Your piece is packed inside its original boutique dust bag, box, and accessories, then placed in an unmarked exterior shipping carton sealed with serialized security tape so exterior labels never reveal luxury contents."
        },
        {
          heading: "Carrier & Weather Delay Transparency",
          body: "Severe weather events, air-freight hub holds, federal holidays, or incomplete address details can occasionally delay overnight carrier schedules. If carrier telemetry flags a delay, our support team monitors the shipment proactively and keeps you updated until confirmed delivery."
        }
      ]}
    />
  );
}
