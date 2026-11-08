import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface CoinpaprikaQuote {
  quotes?: {
    USD?: {
      price?: number;
      percent_change_24h?: number;
    };
  };
}

// Fallback rates if external API is unreachable or rate limited
const FALLBACK_RATES: Record<string, { price: number; change24h: number }> = {
  BTC: { price: 75800, change24h: 0 },
  ETH: { price: 2235, change24h: 0 },
  SOL: { price: 89.2, change24h: 0 },
};

const ENDPOINTS: Record<string, string> = {
  BTC: "https://api.coinpaprika.com/v1/tickers/btc-bitcoin",
  ETH: "https://api.coinpaprika.com/v1/tickers/eth-ethereum",
  SOL: "https://api.coinpaprika.com/v1/tickers/sol-solana",
};

// In-memory cache for fast response and avoiding rate limits
let cachedData: {
  rates: Record<string, { price: number; change24h: number }>;
  lastUpdated: string;
} | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 20000; // 20 seconds cache

export async function GET() {
  const now = Date.now();

  // Return cached rates if fresh
  if (cachedData && now - lastFetchTime < CACHE_TTL_MS) {
    return NextResponse.json({
      ...cachedData,
      cached: true,
      source: "coinpaprika",
    });
  }

  const results: Record<string, { price: number; change24h: number }> = {
    ...FALLBACK_RATES,
  };

  try {
    const fetchPromises = Object.entries(ENDPOINTS).map(async ([symbol, url]) => {
      try {
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "NorthstarSupplyLuxury/1.0",
          },
          // 5-second fetch timeout
          signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
          const data = (await res.json()) as CoinpaprikaQuote;
          const price = data.quotes?.USD?.price;
          const change24h = data.quotes?.USD?.percent_change_24h ?? 0;
          if (price && typeof price === "number" && price > 0) {
            results[symbol] = {
              price,
              change24h,
            };
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch Coinpaprika ticker for ${symbol}:`, err);
        // Retain cached or fallback
        if (cachedData?.rates[symbol]) {
          results[symbol] = cachedData.rates[symbol];
        }
      }
    });

    await Promise.allSettled(fetchPromises);

    cachedData = {
      rates: results,
      lastUpdated: new Date().toISOString(),
    };
    lastFetchTime = now;

    return NextResponse.json({
      rates: results,
      lastUpdated: cachedData.lastUpdated,
      cached: false,
      source: "coinpaprika",
    });
  } catch (error) {
    console.error("Error in crypto-rates endpoint:", error);
    return NextResponse.json(
      cachedData || {
        rates: FALLBACK_RATES,
        lastUpdated: new Date().toISOString(),
        cached: false,
        source: "fallback",
      }
    );
  }
}
