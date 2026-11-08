import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://northstarsupply.example"),
  title: {
    default: "Northstar | Authentic Designer Bags, Apparel & Footwear · 24-Hour USA Delivery",
    template: "%s | Northstar",
  },
  description: "Buy authentic designer bags, apparel, and luxury footwear with Bitcoin, Ethereum, and Solana. Guaranteed 24-hour delivery anywhere in the USA.",
  openGraph: {
    title: "Northstar | Authentic Designer Bags, Apparel & Footwear · 24-Hour USA Delivery",
    description: "Buy authentic designer bags, apparel, and luxury footwear with Bitcoin, Ethereum, and Solana. Guaranteed 24-hour delivery anywhere in the USA.",
    url: "https://northstarsupply.example",
    siteName: "Northstar",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Northstar | Authentic Designer Bags, Apparel & Footwear · 24-Hour USA Delivery",
    description: "Buy authentic designer bags, apparel, and luxury footwear with Bitcoin, Ethereum, and Solana. Guaranteed 24-hour delivery anywhere in the USA.",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#faf9f6] text-[#0f0f0f] selection:bg-[#0f0f0f] selection:text-white">
        {children}
      </body>
    </html>
  );
}
