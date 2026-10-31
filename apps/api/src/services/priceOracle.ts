import { Decimal } from "decimal.js";
import type { PriceOracle } from "./paymentTypes.js";

export class CachedPriceOracle implements PriceOracle {
  private readonly cache = new Map<string, { rate: string; at: number }>();
  constructor(private readonly provider: PriceOracle, private readonly now = () => Date.now()) {}
  async getUsdRate(asset: string) {
    const key = asset.toUpperCase();
    const cached = this.cache.get(key);
    const age = cached ? this.now() - cached.at : Infinity;
    if (cached && age <= 30_000) return cached.rate;
    try {
      const rate = await this.provider.getUsdRate(key);
      if (!new Decimal(rate).isFinite() || new Decimal(rate).lte(0)) throw new Error("Price oracle returned an invalid rate");
      this.cache.set(key, { rate, at: this.now() });
      return rate;
    } catch (error) {
      if (cached && age <= 60_000) return cached.rate;
      throw error instanceof Error ? error : new Error("Price oracle unavailable");
    }
  }
}
