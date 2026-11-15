import { LegalPage } from "@/components/LegalPage";

export default function FaqPage() {
  return (
    <LegalPage
      title="Frequently Asked Questions"
      intro="Essential answers concerning our curated edit, checkout options, 24-hour delivery, and provenance verification."
      heroImage={{
        url: "/images/editorial_collection_curation.jpg",
        alt: "Curated luxury garments and designer footwear gallery"
      }}
      sections={[
        {
          heading: "How does ordering and 24-hour shipping work?",
          body: "1. Add your desired bag, footwear, or garment to your bag or click Buy It Now.\n2. Enter your contact and shipping information and complete checkout using your preferred payment method.\n3. Within minutes of confirmation, you receive an automated receipt, order summary, and live courier tracking.\n4. Your piece is shipped via FedEx Priority Overnight or UPS Next Day Air, arriving within 24 hours with signature verification."
        },
        {
          heading: "What payment methods are accepted?",
          body: "We accept Visa, Mastercard, American Express, PayPal Express Checkout, as well as Bitcoin (BTC), Ethereum (ETH), and Solana (SOL). Clients paying with digital currency can also optionally register a personal Refund Return Wallet at checkout."
        },
        {
          heading: "What is a Refund Return Wallet?",
          body: "Clients who choose to pay with Bitcoin, Ethereum, or Solana from an exchange account (such as Coinbase, Kraken, or Cash App) can optionally enter a personal Refund Return Wallet at checkout so any eligible 14-day return settles directly to a wallet they control."
        },
        {
          heading: "How is authenticity guaranteed?",
          body: "Every handbag, pair of footwear, and garment is physically inspected by our New York team for stitch precision, serial numbers, date codes, and embedded RFID/NFC microchips. All pieces include their original boutique box, dust covers, and documentation. We back every sale with a 100% lifetime authenticity money-back guarantee."
        },
        {
          heading: "What happens if I need to return an item?",
          body: "We offer a 14-day inspection and return window for items in their original, unused condition with all designer tags and packaging intact. Eligible returns are refunded back to your original payment method or registered return wallet."
        }
      ]}
    />
  );
}
