"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export type CryptoCurrency = "BTC" | "ETH" | "SOL";

export interface CryptoRateInfo {
  price: number;
  change24h: number;
}

export type CryptoRatesMap = Record<CryptoCurrency, CryptoRateInfo>;

export const DEFAULT_CRYPTO_RATES: CryptoRatesMap = {
  BTC: { price: 75808.81, change24h: 0 },
  ETH: { price: 2235.61, change24h: 0 },
  SOL: { price: 89.21, change24h: 0 },
};

export const CRYPTO_DECIMALS: Record<CryptoCurrency, number> = {
  BTC: 8,
  ETH: 6,
  SOL: 4,
};

/**
 * Calculates the crypto amount from USD cents and live USD price.
 * As Bitcoin/ETH/SOL prices rise or fall, the required coin amount updates dynamically.
 */
export function calculateCryptoAmount(
  cents: number,
  rateUsd: number,
  decimals: number = 8
): string {
  if (!rateUsd || rateUsd <= 0 || cents <= 0) return "0.00";
  const usd = cents / 100;
  const amount = usd / rateUsd;
  return amount.toFixed(decimals);
}

/**
 * Formats a live USD price for display (e.g. "$75,808.81")
 */
export function formatCryptoUsdPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: price < 100 ? 2 : 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * React hook to keep crypto prices live via Coinpaprika tickers.
 * Polls every 30 seconds and refreshes automatically on window focus.
 */
export function useLiveCryptoRates(pollingIntervalMs: number = 30000) {
  const [rates, setRates] = useState<CryptoRatesMap>(DEFAULT_CRYPTO_RATES);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef<boolean>(true);

  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch("/api/crypto-rates", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch crypto rates: ${res.statusText}`);
      }

      const data = await res.json();
      if (isMounted.current && data?.rates) {
        setRates({
          BTC: {
            price: data.rates.BTC?.price ?? DEFAULT_CRYPTO_RATES.BTC.price,
            change24h: data.rates.BTC?.change24h ?? 0,
          },
          ETH: {
            price: data.rates.ETH?.price ?? DEFAULT_CRYPTO_RATES.ETH.price,
            change24h: data.rates.ETH?.change24h ?? 0,
          },
          SOL: {
            price: data.rates.SOL?.price ?? DEFAULT_CRYPTO_RATES.SOL.price,
            change24h: data.rates.SOL?.change24h ?? 0,
          },
        });
        setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated) : new Date());
        setError(null);
      }
    } catch (err: unknown) {
      if (isMounted.current) {
        console.warn("Crypto rates polling error:", err);
        setError("Using cached rates");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const timer = setTimeout(() => {
      fetchRates();
    }, 0);

    const interval = setInterval(() => {
      // Avoid polling when tab is inactive to save bandwidth
      if (typeof document !== "undefined" && document.hidden) return;
      fetchRates();
    }, pollingIntervalMs);

    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && !document.hidden) {
        fetchRates();
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
      clearInterval(interval);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, [fetchRates, pollingIntervalMs]);

  return {
    rates,
    loading,
    lastUpdated,
    error,
    refresh: fetchRates,
  };
}
