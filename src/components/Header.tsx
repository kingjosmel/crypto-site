"use client";

import Link from "next/link";
import { useState } from "react";
import { CartLink } from "./CartLink";

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md w-full gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        disabled={status === "success"}
        className="bg-[#1a1a1a] text-white border border-[#333] px-4 py-2.5 text-xs rounded-xs flex-1 focus:outline-none focus:border-white placeholder:text-neutral-500 transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="px-5 py-2.5 bg-white text-black hover:bg-neutral-200 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shrink-0 disabled:opacity-80"
        style={{ color: "#000000" }}
      >
        <span style={{ color: "#000000" }}>{status === "success" ? "Subscribed" : "Subscribe"}</span>
      </button>
    </form>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#f5f5f5]/95 backdrop-blur-md border-b border-[#dcdcdc] transition-all">
      {/* 1. Clean Minimal Announcement Bar */}
      <div className="bg-[#0f0f0f] text-[#f5f5f5] text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-medium tracking-wide">
          <span className="hidden sm:inline text-neutral-400">Guaranteed 24-Hour USA Delivery</span>
          <span className="mx-auto sm:mx-0 tracking-wider uppercase font-semibold text-neutral-200">
            Free Express Shipping Across All 50 States · Pay with BTC, ETH, or SOL
          </span>
          <Link href="/track" className="hidden md:inline text-neutral-400 hover:text-white transition-colors shrink-0">
            Track Order →
          </Link>
        </div>
      </div>

      {/* 2. Main Luxury Top Bar (3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Mobile hamburger trigger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-neutral-800 hover:text-black cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Zone 1: Wordmark Logo */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="font-serif text-2xl sm:text-3xl tracking-[0.18em] uppercase font-normal text-neutral-950 hover:text-neutral-700 transition-colors"
              aria-label="Northstar Home"
            >
              NORTHSTAR
            </Link>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-[0.14em] uppercase text-neutral-700" aria-label="Primary navigation">
            <Link href="/shop" className="hover:text-black transition-colors py-1">
              Shop All
            </Link>
            <Link href="/category/designer-bags" className="hover:text-black transition-colors py-1">
              Bags
            </Link>
            <Link href="/category/designer-clothing" className="hover:text-black transition-colors py-1">
              Apparel
            </Link>
            <Link href="/category/luxury-shoes-sneakers" className="hover:text-black transition-colors py-1">
              Footwear
            </Link>
            <Link href="/category/belts-wallets-accessories" className="hover:text-black transition-colors py-1">
              Leather Goods
            </Link>
            <Link href="/about" className="hover:text-black transition-colors py-1">
              About
            </Link>
            <Link href="/contact" className="hover:text-black transition-colors py-1">
              Contact
            </Link>
          </nav>

          {/* Zone 3: Search + Track + Shopping Bag */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Search Input Bar */}
            <form action="/search" method="GET" className="relative hidden md:block">
              <label htmlFor="header-search-bar" className="sr-only">Search catalog</label>
              <div className="flex items-center border border-[#cccccc] rounded-xs px-3 py-1.5 bg-[#f5f5f5] hover:border-neutral-500 focus-within:border-black transition-colors">
                <input
                  id="header-search-bar"
                  name="q"
                  type="search"
                  placeholder="Search designer pieces..."
                  className="bg-transparent border-none text-xs text-neutral-900 focus:outline-none w-28 lg:w-44 placeholder:text-neutral-400"
                />
                <button type="submit" aria-label="Submit search" className="text-neutral-500 hover:text-black pl-1 cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Quick Track Link */}
            <Link
              href="/track"
              className="hidden sm:inline-block text-xs font-semibold tracking-wider uppercase text-neutral-700 hover:text-black transition-colors"
            >
              Track Order
            </Link>

            {/* Shopping Bag Trigger */}
            <CartLink />
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#dcdcdc] py-4 space-y-4 bg-white">
            <form action="/search" method="GET" className="mb-3">
              <input
                name="q"
                type="search"
                placeholder="Search collection..."
                className="w-full border border-[#cccccc] px-3.5 py-2 text-xs rounded-xs bg-[#f5f5f5]"
              />
            </form>
            <div className="flex flex-col space-y-3 text-xs font-semibold uppercase tracking-wider text-neutral-800">
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="hover:text-black py-1">
                Shop All
              </Link>
              <Link href="/category/designer-bags" onClick={() => setMobileMenuOpen(false)} className="hover:text-black py-1">
                Designer Bags
              </Link>
              <Link href="/category/designer-clothing" onClick={() => setMobileMenuOpen(false)} className="hover:text-black py-1">
                Designer Apparel
              </Link>
              <Link href="/category/luxury-shoes-sneakers" onClick={() => setMobileMenuOpen(false)} className="hover:text-black py-1">
                Footwear
              </Link>
              <Link href="/category/belts-wallets-accessories" onClick={() => setMobileMenuOpen(false)} className="hover:text-black py-1">
                Small Leather Goods
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-black py-1">
                About Northstar
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-black py-1">
                Contact Customer Support
              </Link>
              <Link href="/track" onClick={() => setMobileMenuOpen(false)} className="text-neutral-900 font-semibold py-1">
                Track Order →
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#111111] text-[#999999] border-t border-[#262626] pt-14 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12 border-b border-[#262626] items-center">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d4af37]">Stay Connected</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mt-1.5 tracking-tight">
              Curated releases and new additions.
            </h3>
            <p className="text-xs text-[#8c8c8c] mt-1.5 max-w-md leading-relaxed">
              Receive updates when rare designer bags, luxury footwear, and seasonal garments are added to the collection.
            </p>
          </div>
          <div>
            <FooterNewsletter />
          </div>
        </div>

        {/* 4 Clean Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#262626] text-xs">
          <div>
            <h4 className="text-white font-semibold uppercase tracking-[0.14em] text-[11px] mb-4">Collection</h4>
            <ul className="space-y-2.5">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Pieces</Link></li>
              <li><Link href="/category/designer-bags" className="hover:text-white transition-colors">Designer Bags</Link></li>
              <li><Link href="/category/belts-wallets-accessories" className="hover:text-white transition-colors">Small Leather Goods</Link></li>
              <li><Link href="/category/designer-clothing" className="hover:text-white transition-colors">Apparel & Jackets</Link></li>
              <li><Link href="/category/luxury-shoes-sneakers" className="hover:text-white transition-colors">Footwear & Sneakers</Link></li>
              <li><Link href="/shop?brand=Goyard" className="hover:text-white transition-colors">Goyard</Link></li>
              <li><Link href="/shop?brand=Prada" className="hover:text-white transition-colors">Prada</Link></li>
              <li><Link href="/shop?brand=Celine" className="hover:text-white transition-colors">Celine</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-[0.14em] text-[11px] mb-4">Client Care</h4>
            <ul className="space-y-2.5">
              <li><Link href="/track" className="hover:text-white transition-colors text-white font-medium">Track Your Order</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">24-Hour Delivery Policy</Link></li>
              <li><Link href="/warranty" className="hover:text-white transition-colors">Authenticity Guarantee</Link></li>
              <li><Link href="/returns-refunds" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-[0.14em] text-[11px] mb-4">About Northstar</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story & Standards</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Guaranteed 24-Hour USA Delivery</Link></li>
              <li><Link href="/warranty" className="hover:text-white transition-colors">Physical Inspection & Provenance</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-[0.14em] text-[11px] mb-4">Crypto Checkout</h4>
            <p className="text-[#8c8c8c] leading-relaxed mb-4 text-[11px]">
              Orders are settled directly on-chain via Bitcoin, Ethereum, and Solana. Private, instant checkout with zero credit card holds or wire processing delays.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="bg-[#1a1a1a] text-[#f7931a] px-2.5 py-1 rounded-xs border border-[#333] font-semibold">BITCOIN (BTC)</span>
              <span className="bg-[#1a1a1a] text-[#627eea] px-2.5 py-1 rounded-xs border border-[#333] font-semibold">ETHEREUM (ETH)</span>
              <span className="bg-[#1a1a1a] text-[#14f195] px-2.5 py-1 rounded-xs border border-[#333] font-semibold">SOLANA (SOL)</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#6b6b6b] gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-white font-semibold tracking-wider text-sm">NORTHSTAR / SUPPLY</span>
            <span>·</span>
            <span>(c) 2026 Northstar / Supply. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link>
            <Link href="/track" className="hover:text-white transition-colors">Tracking</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
