import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Commercial Terms of Service | Northstar / Supply Holdings AG",
  description: "Official legal terms, purchase conditions, cryptocurrency escrow finality, and governing law for Northstar Supply Holdings AG.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="Commercial agreement between Northstar Supply Holdings AG (CHE-384.912.441) and private acquiring clients."
      heroImage={{
        url: "/images/editorial_horology_vault.jpg",
        alt: "Northstar horology vault and client legal documentation archive"
      }}
      sections={[
        {
          heading: "1. Corporate Entity & Scope of Agreement",
          body: "These Commercial Terms govern all transactions, bids, orders, and services provided by Northstar Supply Holdings AG (Registration UID: CHE-384.912.441, Geneva Commercial Register, Rue du Rhône 42, 1204 Genève, Switzerland) and its North American affiliate Northstar Luxury Supply LLC (590 Madison Ave, New York, NY 10022). By placing an order, the acquiring client accepts these terms in full."
        },
        {
          heading: "2. Product Authenticity, Condition Grading & Provenance",
          body: "All catalog acquisitions are explicitly classified under our three established standards: (1) Unworn / Complete Set, (2) Pristine Pre-Owned (Collector Grade 9.5/10), or (3) Certified Restored / Overhauled. Each piece is independently verified by our in-house master horologists or archival textile specialists. Serial numbers and movement calibres are cross-referenced with manufacturer archives and third-party watch registries prior to dispatch."
        },
        {
          heading: "3. Non-Custodial Cryptocurrency Settlement & Escrow",
          body: "Settlement occurs natively on-chain in Bitcoin (BTC), Ethereum (ETH), or Solana (SOL). Conversion exchange rates are calculated at quote generation and locked for the duration of the payment timer. Transactions require standard network confirmations before vault release. Clients acknowledge that on-chain blockchain transactions are irreversible once confirmed by network consensus."
        },
        {
          heading: "4. Armored Transit, Title Transfer & Insurance",
          body: "Title and risk of loss pass to the client upon physical delivery and receipt of verified adult signature. High-value pieces (> $10,000 USD) are transported via Ferrari Group or Malca-Amit armored courier vehicles. Full declared-value transit insurance is underwritten by our corporate cargo syndicate at no surcharge to the client."
        },
        {
          heading: "5. Inspection Window & White-Glove Returns",
          body: "Clients enjoy a 7-day inspection window from the date of physical receipt. Timepieces and sealed luxury goods must retain all original tamper-evident security tags, box collateral, and certificates of origin intact. Any piece exhibiting signs of unauthorized opening, case back removal, or alteration is void of return eligibility."
        },
        {
          heading: "6. Governing Law & Jurisdiction",
          body: "This agreement and any dispute arising from or related to the acquisition of pieces shall be governed exclusively by Swiss substantive law, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). The exclusive place of jurisdiction for all proceedings is Geneva, Switzerland."
        }
      ]}
    />
  );
}
