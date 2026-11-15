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
          heading: "How does protected crypto payment + 24-hour shipping work?",
          body: "1. Select Crypto at checkout and choose USD Coin (USDC), Bitcoin (BTC), Ethereum (ETH), or Solana (SOL).\n2. Optionally enter your personal Refund Return Wallet address so any 14-day return settles directly to your wallet rather than an exchange hot wallet.\n3. Send payment from your wallet or exchange app via QR code or deposit address.\n4. Within minutes of confirmation, you receive an automated receipt, return protection summary, and live courier tracking.\n5. Your piece is shipped via FedEx Priority Overnight or UPS Next Day Air, arriving within 24 hours with signature verification."
        },
        {
          heading: "What cryptocurrencies and stablecoins are accepted?",
          body: "We accept USD Coin (USDC on ERC-20) for 1:1 dollar-pegged price stability, alongside Bitcoin (BTC on Native SegWit), Ethereum (ETH on ERC-20), and Solana (SOL on SPL). You can pay directly from any self-custodial wallet or exchange account."
        },
        {
          heading: "What is a Refund Return Wallet and why should I add it?",
          body: "Many shoppers pay from exchange accounts (such as Coinbase, Kraken, or Cash App) whose outgoing transactions come from pooled hot wallets. Adding your personal Refund Return Wallet at checkout guarantees that any 14-day return or cancellation refund goes directly to a wallet you control."
        },
        {
          heading: "How is authenticity guaranteed?",
          body: "Every handbag, pair of footwear, and garment is physically inspected by our New York team for stitch precision, serial numbers, date codes, and embedded RFID/NFC microchips. All pieces include their original boutique box, dust covers, and documentation. We back every sale with a 100% lifetime authenticity money-back guarantee."
        },
        {
          heading: "What happens if I need to return an item?",
          body: "We offer a 14-day inspection and return window for items in their original, unused condition with all designer tags and packaging intact. Refunds are remitted directly to your registered Refund Return Wallet based on the exact USD purchase value (or 1:1 in USDC)."
        }
      ]}
    />
  );
}
