import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { SiteShell } from "@/components/SiteShell";
export const metadata: Metadata = { title: "Checkout | Northstar / Supply", robots: { index: false, follow: false } };
export default function CheckoutPage() { return <SiteShell><CheckoutForm /></SiteShell>; }