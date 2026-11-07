import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Privacy & Data Protection Notice | Northstar / Supply Holdings AG",
  description: "Official privacy policy and client data stewardship disclosures in compliance with the Swiss FADP and EU GDPR.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Institutional client data stewardship in accordance with the Swiss Federal Act on Data Protection (FADP) and EU GDPR."
      heroImage={{
        url: "/images/editorial_atelier.jpg",
        alt: "Northstar data protection and client confidential records vault"
      }}
      sections={[
        {
          heading: "1. Data Controller Information",
          body: "The responsible data controller for all personal information collected via Northstar is Northstar Supply Holdings AG, Rue du Rhône 42, 1204 Genève, Switzerland (UID: CHE-384.912.441). For inquiries regarding data protection, our Data Protection Officer may be contacted directly at privacy@northstar-supply.com."
        },
        {
          heading: "2. Scope of Client Data Collected",
          body: "We collect only data necessary to fulfill high-value luxury acquisitions: contact information (name, encrypted email address, destination telephone number), physical delivery address for secured courier dispatch, and cryptographic wallet public addresses / transaction hashes for on-chain settlement verification. We never store private keys, seed phrases, or sensitive wallet secrets."
        },
        {
          heading: "3. Discretion & Third-Party Disclosure Policy",
          body: "Client identity and purchase histories are held under strict confidential protocols. We never sell, monetize, or license client data. Disclosures are strictly limited to verified fulfillment partners (FedEx International Priority or DHL Express solely for delivery execution) and legal compliance authorities when mandated by Swiss federal statute."
        },
        {
          heading: "4. Secured Transit & Identity Verification Data",
          body: "Photographic identification presented to couriers upon physical handoff is verified on-device in real-time to prevent parcel diversion. Couriers do not store copies of your identity documents on unencrypted mobile devices."
        },
        {
          heading: "5. Client Rights & Data Erasure",
          body: "Under the Swiss FADP and EU GDPR, you maintain the right to inspect, correct, export, or request the immediate erasure of your personal data from our active databases, subject only to statutory Swiss tax and commercial record retention mandates (10 years for financial records). Requests may be submitted to privacy@northstar-supply.com."
        }
      ]}
    />
  );
}
