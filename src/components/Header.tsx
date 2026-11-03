"use client";

import Link from "next/link";
import { useState } from "react";
import { CartLink } from "./CartLink";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e9e6df] transition-all">
      {/* Announcement Bar */}
      <div className="bg-[#0f0f0f] text-[#f5f4f0] text-[11px] font-medium tracking-[0.08em] py-2 px-4 text-center overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-[#a39f96]">
            <span>NEW YORK · GENEVA · PARIS</span>
            <span>·</span>
            <span>GUEST CHECKOUT ENABLED</span>
          </div>
          <div className="mx-auto flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] inline-block animate-pulse" />
            <span className="uppercase font-semibold tracking-wider">
              Complimentary Armored Courier On All Orders · Serialized Tamper-Evident Packaging
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[#a39f96]">
            <Link href="/track" className="hover:text-white transition-colors">
              Track Dispatch
            </Link>
            <span>·</span>
            <span>USD ($)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-neutral-800 hover:text-black"
              aria-label="Toggle navigation menu"
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
              <span className="font-serif text-2xl sm:text-[26px] tracking-[-0.03em] font-normal text-neutral-950 group-hover:text-neutral-700 transition-colors">
                NORTHSTAR
              </span>
              <span className="text-[9px] tracking-[0.24em] uppercase text-neutral-400 font-sans -mt-1 font-medium">
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
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Search Input Bar */}
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
                <button type="submit" aria-label="Search catalog" className="text-neutral-500 hover:text-black pl-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Quick Track Link for Mobile */}
            <Link href="/track" className="lg:hidden text-xs text-neutral-700 font-medium uppercase tracking-wider">
              Track
            </Link>

            {/* Shopping Bag Trigger (Opens CartDrawer) */}
            <CartLink />
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#ece9e2] py-4 space-y-3 bg-white">
            <form action="/search" method="GET" className="mb-4">
              <input
                name="q"
                type="search"
                placeholder="Search collection…"
                className="w-full border border-[#d9d5cb] px-3 py-2 text-xs rounded-xs"
              />
            </form>
            <div className="flex flex-col space-y-2.5 text-sm font-medium uppercase tracking-wider text-neutral-800">
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="hover:text-black py-1">
                All Collections
              </Link>
              <Link href="/category/luxury-watches" onClick={() => setMobileMenuOpen(false)} className="hover:text-black py-1">
                Haute Horlogerie
              </Link>
              <Link href="/shop?brand=Goyard" onClick={() => setMobileMenuOpen(false)} className="hover:text-black py-1">
                Maison Goyard
              </Link>
              <Link href="/category/designer-clothing" onClick={() => setMobileMenuOpen(false)} className="hover:text-black py-1">
                Designer Apparel
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-black py-1">
                About the Atelier
              </Link>
              <Link href="/track" onClick={() => setMobileMenuOpen(false)} className="text-[#047857] font-semibold py-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                Track Your Order
              </Link>
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
    <form onSubmit={handleSubmit} className="flex max-w-md gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter client email address"
        className="bg-[#1a1a1a] border border-[#333333] text-white text-xs px-4 py-3.5 rounded-xs flex-1 focus:outline-none focus:border-white transition-colors placeholder:text-[#666]"
      />
      <button
        type="submit"
        className="bg-white text-black hover:bg-[#e6e4df] text-xs font-semibold px-6 py-3.5 uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
      >
        Join Access
      </button>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-[#a8a49c] border-t border-[#262626] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter / Concierge Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-16 border-b border-[#262626] items-center">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-14 border-b border-[#262626] text-xs">
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
              <li><Link href="/track" className="hover:text-white transition-colors font-medium text-white flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Track Your Order</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Armored Courier Protocol</Link></li>
              <li><Link href="/warranty" className="hover:text-white transition-colors">Authenticity Guarantee</Link></li>
              <li><Link href="/returns-refunds" className="hover:text-white transition-colors">White-Glove Returns</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Private Client Inquiries</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-[0.12em] text-[11px] mb-4">The Atelier</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="hover:text-white transition-colors">Heritage & Provenance</Link></li>
              <li><span className="text-[#666]">Geneva Vault Repository</span></li>
              <li><span className="text-[#666]">New York Client Salon</span></li>
              <li><span className="text-[#666]">Paris Leathercraft Archive</span></li>
              <li><span className="text-[#666]">Malca-Amit Secured Transit</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-[0.12em] text-[11px] mb-4">Crypto Payment & Escrow</h4>
            <p className="text-[#8c887f] leading-relaxed mb-4 text-[11px]">
              We collect payments exclusively in cryptocurrency via non-custodial vault escrow. All transactions settle natively on-chain with instant mempool verification.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="bg-[#1f1f1f] text-[#f7931a] px-2.5 py-1 rounded-xs border border-[#333] font-semibold">BITCOIN (BTC)</span>
              <span className="bg-[#1f1f1f] text-[#627eea] px-2.5 py-1 rounded-xs border border-[#333] font-semibold">ETHEREUM (ETH)</span>
              <span className="bg-[#1f1f1f] text-[#14f195] px-2.5 py-1 rounded-xs border border-[#333] font-semibold">SOLANA (SOL)</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#6b6861] gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-white font-semibold text-sm">NORTHSTAR / SUPPLY</span>
            <span>·</span>
            <span>© 2026 Northstar / Supply. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/shipping" className="hover:text-white transition-colors">Shipping & Escrow</Link>
            <Link href="/track" className="hover:text-white transition-colors">Order Tracking</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
