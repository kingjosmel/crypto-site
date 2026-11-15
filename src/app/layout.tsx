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
  metadataBase: new URL("https://shopnorthstar.store"),
  title: {
    default: "Northstar | Authentic Designer Bags, Apparel & Footwear · 24-Hour USA Delivery",
    template: "%s | Northstar",
  },
  description: "Authenticated designer bags, apparel, and luxury footwear with guaranteed 24-hour express delivery anywhere in the USA.",
  openGraph: {
    title: "Northstar | Authentic Designer Bags, Apparel & Footwear · 24-Hour USA Delivery",
    description: "Authenticated designer bags, apparel, and luxury footwear with guaranteed 24-hour express delivery anywhere in the USA.",
    url: "https://shopnorthstar.store",
    siteName: "Northstar",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Northstar | Authentic Designer Bags, Apparel & Footwear · 24-Hour USA Delivery",
    description: "Authenticated designer bags, apparel, and luxury footwear with guaranteed 24-hour express delivery anywhere in the USA.",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-[#0f0f0f] selection:bg-[#0f0f0f] selection:text-white">
        {children}
      </body>
    </html>
  );
}
