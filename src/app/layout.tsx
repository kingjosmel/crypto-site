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
    default: "Northstar / Supply | Luxury Fashion, Designer Trunks & Haute Horlogerie",
    template: "%s | Northstar / Supply",
  },
  description: "An edited collection of luxury fashion, designer accessories, premium footwear, and exceptional watches with crypto checkout.",
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
