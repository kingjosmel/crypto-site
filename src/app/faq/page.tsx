import { LegalPage } from "@/components/LegalPage";

export default function FaqPage() {
  return (
    <LegalPage
      title="Frequently Asked Questions"
      intro="Essential answers concerning our curated edit, cryptocurrency settlement, and provenance verification."
      heroImage={{
        url: "/images/editorial_collection_curation.jpg",
        alt: "Curated luxury garments and designer footwear gallery"
      }}
      sections={[
        {
          heading: "What payment methods are accepted?",
          body: "Northstar / Supply collects payment exclusively in cryptocurrency: Bitcoin (BTC), Ethereum (ETH), and Solana (SOL). Each order generates a dedicated vault escrow deposit address and QR code for direct on-chain settlement with zero third-party payment processors."
        },
        {
          heading: "How does cryptocurrency checkout work?",
          body: "When you proceed to checkout, our platform calculates the exact equivalent in BTC, ETH, or SOL and displays a dedicated multi-sig vault receiving address. Your transfer is detected via mempool listeners and verified on-chain, triggering immediate armored courier dispatch."
        },
        {
          heading: "Can I purchase as a guest without creating an account?",
          body: "Yes. Guest checkout requires only your email address for live order dispatch, certificate of authenticity, and armored courier tracking coordinates. No passwords or account registration are necessary."
        },
        {
          heading: "What networks and confirmation counts are required?",
          body: "Bitcoin transactions settle on the Bitcoin Mainnet (Native SegWit, 2 confirmations). Ethereum transactions settle on Ethereum Mainnet (12 confirmations). Solana transactions settle on Solana Mainnet (32 confirmations, ~15 seconds) before release to our white-glove fulfillment vault."
        }
      ]}
    />
  );
}
