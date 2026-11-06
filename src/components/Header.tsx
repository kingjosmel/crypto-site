"use client";

import Link from "next/link";
import { useState } from "react";
import { CartLink } from "./CartLink";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e9e6df] transition-all">
      {/* Announcement Bar */}
      <div className="bg-[#0f0f0f] text-[#f5f4f0] text-[10px] sm:text-[11px] font-medium tracking-[0.06em] sm:tracking-[0.08em] py-2 px-3 sm:px-4 text-center overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-[#a39f96]">
            <span>NEW YORK · GENEVA · PARIS</span>
            <span>·</span>
            <span>GUEST CHECKOUT</span>
          </div>
          <div className="mx-auto flex items-center justify-center gap-1.5 sm:gap-2 truncate max-w-full">
            <span className="sm:hidden font-medium tracking-wide truncate">
              Northstar / Supply · Geneva · New York · Paris
            </span>
            <span className="hidden sm:inline font-medium tracking-wide text-neutral-300">
              Northstar Supply Holdings AG · Secured Courier Delivery on All Archival Allocations
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[#a39f96]">
            <Link href="/about" className="hover:text-white transition-colors">
              Corporate Governance
            </Link>
            <span>·</span>
            <Link href="/track" className="hover:text-white transition-colors">
              Order Telemetry
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-8">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-1 text-neutral-800 hover:text-black min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Wordmark / Brand Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="group flex flex-col" aria-label="Northstar / Supply home">
              <span className="font-serif text-xl sm:text-2xl lg:text-[26px] tracking-[-0.03em] font-normal text-neutral-950 group-hover:text-neutral-700 transition-colors">
                NORTHSTAR
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.24em] uppercase text-neutral-400 font-sans -mt-1 font-medium">
                Vault & Atelier
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-[0.06em] uppercase text-neutral-700" aria-label="Primary navigation">
            <Link href="/shop" className="hover:text-black transition-colors relative py-2 group">
              Collection
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black transition-all group-hover:w-full" />
            </Link>
            <Link href="/category/luxury-watches" className="hover:text-black transition-colors relative py-2 group">
              Watches
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black transition-all group-hover:w-full" />
            </Link>
            <Link href="/shop?brand=Goyard" className="hover:text-black transition-colors relative py-2 group">
              Goyard Trunks
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black transition-all group-hover:w-full" />
            </Link>
            <Link href="/category/designer-clothing" className="hover:text-black transition-colors relative py-2 group">
              Apparel
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black transition-all group-hover:w-full" />
            </Link>
            <Link href="/about" className="hover:text-black transition-colors relative py-2 group">
              Atelier
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black transition-all group-hover:w-full" />
            </Link>
            <Link href="/track" className="hover:text-[#047857] transition-colors relative py-2 group text-neutral-800 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              Track Order
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#10b981] transition-all group-hover:w-full" />
            </Link>
          </nav>

          {/* Right Actions: Search + Cart */}
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            {/* Search Input Bar (Desktop) */}
            <form action="/search" method="GET" className="relative hidden sm:block">
              <label htmlFor="header-search-bar" className="sr-only">Search the archive</label>
              <div className="flex items-center border border-[#d9d5cb] rounded-xs px-3 py-1.5 bg-[#fbfaf8] hover:border-neutral-500 focus-within:border-black transition-colors">
                <input
                  id="header-search-bar"
                  name="q"
                  type="search"
                  placeholder="Search timepieces, bags…"
                  className="bg-transparent border-none text-xs text-neutral-900 focus:outline-none w-36 lg:w-48 placeholder:text-neutral-400"
                />
                <button type="submit" aria-label="Search catalog" className="text-neutral-500 hover:text-black pl-1 cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Quick Track Link for Mobile */}
            <Link
              href="/track"
              className="lg:hidden text-xs text-neutral-700 font-semibold uppercase tracking-wider px-2 py-1.5 rounded-xs hover:bg-neutral-100 min-h-[44px] flex items-center"
              aria-label="Track live dispatch"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mr-1.5" />
              Track
            </Link>

            {/* Shopping Bag Trigger (Opens CartDrawer) */}
            <CartLink />
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#ece9e2] py-5 px-1 space-y-5 bg-white animate-fadeIn">
            {/* Mobile Search */}
            <form action="/search" method="GET" className="relative">
              <input
                name="q"
                type="search"
                placeholder="Search watches, trunks, cashmere…"
                className="w-full bg-[#fbfaf8] border border-[#d6d2c8] px-3.5 py-2.5 text-sm rounded-xs focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Curated Categories */}
            <div className="flex flex-col divide-y divide-[#f2efe9] text-sm font-medium uppercase tracking-wider text-neutral-900">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3.5 flex items-center justify-between hover:text-[#a3702b] transition-colors"
              >
                <span>The Full Archive</span>
                <span className="text-xs text-neutral-400 font-normal">13 Pieces →</span>
              </Link>
              <Link
                href="/category/luxury-watches"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3.5 flex items-center justify-between hover:text-[#a3702b] transition-colors"
              >
                <span>Haute Horlogerie</span>
                <span className="text-xs text-neutral-400 font-normal">Patek, Rolex, AP →</span>
              </Link>
              <Link
                href="/shop?brand=Goyard"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3.5 flex items-center justify-between hover:text-[#a3702b] transition-colors"
              >
                <span>Maison Goyard</span>
                <span className="text-xs text-neutral-400 font-normal">Trunks & Totes →</span>
              </Link>
              <Link
                href="/category/designer-clothing"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3.5 flex items-center justify-between hover:text-[#a3702b] transition-colors"
              >
                <span>Designer Apparel</span>
                <span className="text-xs text-neutral-400 font-normal">Overcoats & Cashmere →</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3.5 flex items-center justify-between hover:text-[#a3702b] transition-colors"
              >
                <span>The Atelier & Vault</span>
                <span className="text-xs text-neutral-400 font-normal">Provenance →</span>
              </Link>
              <Link
                href="/track"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3.5 flex items-center justify-between text-[#047857] font-semibold"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  Track Live Order Telemetry
                </span>
                <span className="text-xs font-mono">Real-time →</span>
              </Link>
            </div>

            {/* Mobile Footer Trust / Payment info */}
            <div className="pt-4 border-t border-[#ece9e2] flex flex-col gap-3 text-xs text-neutral-500">
              <div className="flex items-center justify-between">
                <span>Direct Crypto Escrow</span>
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold">
                  <span className="bg-[#f5f4ef] px-1.5 py-0.5 rounded-xs text-[#f7931a] border border-[#e5e2da]">BTC</span>
                  <span className="bg-[#f5f4ef] px-1.5 py-0.5 rounded-xs text-[#627eea] border border-[#e5e2da]">ETH</span>
                  <span className="bg-[#f5f4ef] px-1.5 py-0.5 rounded-xs text-[#14f195] border border-[#e5e2da]">SOL</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>Concierge Desk: 9am to 7pm EST</span>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-neutral-900 underline font-medium">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function FooterNewsletter() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="bg-[#1a1a1a] border border-[#333333] text-emerald-400 text-xs px-4 py-3.5 rounded-xs flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>Your allocation invitation has been registered to the vault desk.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-md gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter client email address"
        className="bg-[#1a1a1a] border border-[#333333] text-white text-base sm:text-xs px-4 py-3.5 rounded-xs flex-1 focus:outline-none focus:border-white transition-colors placeholder:text-[#666] min-h-[44px]"
      />
      <button
        type="submit"
        className="bg-white text-black hover:bg-[#e6e4df] text-xs font-semibold px-6 py-3.5 uppercase tracking-wider transition-colors shrink-0 cursor-pointer min-h-[44px] flex items-center justify-center"
      >
        Join Access
      </button>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-[#a8a49c] border-t border-[#262626] pt-12 sm:pt-16 pb-12 mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter / Concierge Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 pb-12 sm:pb-16 border-b border-[#262626] items-center">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d4af37]">Private Client Allocations</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mt-2 tracking-tight">
              Access rare complications & private vault arrivals.
            </h3>
            <p className="text-xs text-[#8c887f] mt-2 max-w-md leading-relaxed">
              Curated previews of Patek Philippe, Goyard trunks, and limited artisan pieces directly to your inbox before general release.
            </p>
          </div>
          <div>
            <FooterNewsletter />
          </div>
        </div>

        {/* 4 Column Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 sm:py-14 border-b border-[#262626] text-xs">
          <div>
            <h4 className="text-white font-semibold uppercase tracking-[0.12em] text-[11px] mb-4">The Collections</h4>
            <ul className="space-y-2.5">
              <li><Link href="/category/luxury-watches" className="hover:text-white transition-colors">Haute Horlogerie</Link></li>
              <li><Link href="/shop?brand=Goyard" className="hover:text-white transition-colors">Maison Goyard Trunks</Link></li>
              <li><Link href="/shop?brand=Patek%20Philippe" className="hover:text-white transition-colors">Patek Philippe Vault</Link></li>
              <li><Link href="/shop?brand=Rolex" className="hover:text-white transition-colors">Rolex Professional Timepieces</Link></li>
              <li><Link href="/category/designer-clothing" className="hover:text-white transition-colors">Cashmere & Outerwear</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Full Seasonal Archive</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-[0.12em] text-[11px] mb-4">Client Concierge</h4>
            <ul className="space-y-2.5">
              <li><Link href="/track" className="hover:text-white transition-colors font-medium text-white flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Track Live Order</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Carrier Assignment Matrix</Link></li>
              <li><Link href="/warranty" className="hover:text-white transition-colors">Condition Standards &amp; Warranty</Link></li>
              <li><Link href="/returns-refunds" className="hover:text-white transition-colors">Inspection &amp; Returns</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Private Client Concierge</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-[0.12em] text-[11px] mb-4">Corporate &amp; Atelier</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="hover:text-white transition-colors font-medium text-white">Corporate Governance &amp; Filings</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Geneva Horology Vault</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">New York Client Salon</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Paris Leathercraft Hub</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Armored Escort Protocol</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-[0.12em] text-[11px] mb-4">Crypto Payment &amp; Escrow</h4>
            <p className="text-[#8c887f] leading-relaxed mb-4 text-[11px]">
              We settle transactions in cryptocurrency via non-custodial vault escrow. All orders clear on-chain with instant mempool confirmation and zero intermediary custody.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="bg-[#1f1f1f] text-[#f7931a] px-2.5 py-1 rounded-xs border border-[#333] font-semibold">BITCOIN (BTC)</span>
              <span className="bg-[#1f1f1f] text-[#627eea] px-2.5 py-1 rounded-xs border border-[#333] font-semibold">ETHEREUM (ETH)</span>
              <span className="bg-[#1f1f1f] text-[#14f195] px-2.5 py-1 rounded-xs border border-[#333] font-semibold">SOLANA (SOL)</span>
            </div>
          </div>
        </div>

        {/* Institutional Corporate Impressum */}
        <div className="py-6 border-b border-[#222222] text-[11px] text-[#78756e] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <strong className="text-white block font-medium">Northstar Supply Holdings AG</strong>
            <span>Registre du Commerce de Genève · IDE / UID: CHE-384.912.441 · Rue du Rhône 42, 1204 Genève, Switzerland</span>
          </div>
          <div className="text-neutral-500 font-mono text-[10px]">
            <span>US Operating Unit: Northstar Luxury Supply LLC (DE File #7391024, 590 Madison Ave, New York)</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#6b6861] gap-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
            <span className="font-serif text-white font-semibold text-sm">NORTHSTAR / SUPPLY</span>
            <span>·</span>
            <span>© 2026 Northstar Supply Holdings AG. All Rights Reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/about" className="hover:text-white transition-colors">Governance &amp; Impressum</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/shipping" className="hover:text-white transition-colors">Shipping Matrix</Link>
            <Link href="/track" className="hover:text-white transition-colors">Order Tracking</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
