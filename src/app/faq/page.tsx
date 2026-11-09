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
          heading: "How does crypto payment + 24-hour shipping work step-by-step?",
          body: "1. Select your piece and proceed to checkout.\n2. Choose Bitcoin (BTC), Ethereum (ETH), or Solana (SOL). The exact coin amount and deposit address are generated automatically.\n3. Send payment from your wallet or mobile exchange app by scanning the QR code or copying the address.\n4. Within minutes of blockchain confirmation, you receive an automated confirmation email with your order receipt and live tracking number.\n5. Your piece is packaged in its original designer box and shipped via FedEx Priority Overnight or UPS Next Day Air, arriving at your US doorstep within 24 hours with signature verification."
        },
        {
          heading: "What cryptocurrencies are accepted?",
          body: "We accept Bitcoin (BTC on Native SegWit), Ethereum (ETH on ERC-20), and Solana (SOL on SPL). You can pay directly from any self-custodial wallet (Phantom, Coinbase Wallet, MetaMask, Ledger) or exchange account."
        },
        {
          heading: "Is there any fee or price markup for paying with crypto?",
          body: "Zero. Northstar does not charge card processing fees, wire fees, or foreign exchange surcharges. You pay only the exact crypto amount calculated at checkout."
        },
        {
          heading: "Can I checkout as a guest without creating an account?",
          body: "Yes. You only need to provide your recipient name, US shipping address, and email for live courier tracking and receipt delivery. No passwords or account setup required."
        },
        {
          heading: "How is authenticity guaranteed?",
          body: "Every handbag, pair of footwear, and garment is physically inspected by our New York team for stitch precision, serial numbers, date codes, and embedded RFID/NFC microchips. All pieces include their original boutique box, dust covers, and documentation. We back every sale with a 100% lifetime authenticity money-back guarantee."
        },
        {
          heading: "What happens if I need to return an item?",
          body: "We offer a 14-day return window for items returned in their original, unused condition with all designer tags and packaging intact. Refunds are settled in the cryptocurrency of purchase at the USD purchase value."
        }
      ]}
    />
  );
}
