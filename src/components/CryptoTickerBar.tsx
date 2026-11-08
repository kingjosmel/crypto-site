"use client";

import React from "react";
import { useLiveCryptoRates, formatCryptoUsdPrice } from "@/lib/cryptoRates";

export function CryptoTickerBar() {
  const { rates } = useLiveCryptoRates(30000);

  return (
    <div className="hidden md:flex items-center gap-3 text-[10px] font-mono tracking-wider text-neutral-400">
      <span className="flex items-center gap-1.5 text-neutral-300">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
        <span className="text-[9px] uppercase tracking-widest text-[#10b981] font-sans font-bold">
          Live Rates
        </span>
      </span>
      <span>•</span>
      <span className="hover:text-white transition-colors">
        BTC: <strong className="text-white font-medium">{formatCryptoUsdPrice(rates.BTC.price)}</strong>
      </span>
      <span>•</span>
      <span className="hover:text-white transition-colors">
        ETH: <strong className="text-white font-medium">{formatCryptoUsdPrice(rates.ETH.price)}</strong>
      </span>
      <span>•</span>
      <span className="hover:text-white transition-colors">
        SOL: <strong className="text-white font-medium">{formatCryptoUsdPrice(rates.SOL.price)}</strong>
      </span>
    </div>
  );
}
