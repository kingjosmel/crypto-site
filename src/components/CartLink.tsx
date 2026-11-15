"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { openCartDrawer, readCart } from "@/lib/cart";

export function CartLink() {
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const update = () => {
      const nextCount = readCart().reduce((total, item) => total + item.qty, 0);
      setCount((prev) => {
        if (nextCount > prev) {
          setPulse(true);
          setTimeout(() => setPulse(false), 1200);
        }
        return nextCount;
      });
    };
    update();
    window.addEventListener("northstar-cart-change", update);
    return () => window.removeEventListener("northstar-cart-change", update);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openCartDrawer();
  };

  return (
    <Link
      href="/cart"
      onClick={handleClick}
      className="cart-trigger-button flex items-center gap-2 px-3 py-1.5 text-xs font-medium tracking-wide uppercase text-neutral-800 hover:text-black hover:bg-neutral-100 transition-all cursor-pointer rounded-xs"
      aria-label={`Shopping Bag, ${count} item${count === 1 ? "" : "s"}`}
    >
      <svg className="w-4 h-4 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <span className="hidden sm:inline">Bag</span>
      <span
        className={`inline-flex items-center justify-center w-5 h-5 text-[11px] font-semibold font-mono text-white rounded-full transition-all duration-300 ${
          pulse ? "bg-[#047857] scale-125" : "bg-neutral-900 scale-100"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}
