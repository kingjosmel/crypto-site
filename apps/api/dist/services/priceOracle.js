import { Decimal } from "decimal.js";
export class CachedPriceOracle {
    provider;
    now;
    cache = new Map();
    constructor(provider, now = () => Date.now()) {
        this.provider = provider;
        this.now = now;
    }
    async getUsdRate(asset) {
        const key = asset.toUpperCase();
        const cached = this.cache.get(key);
        const age = cached ? this.now() - cached.at : Infinity;
        if (cached && age <= 30_000)
            return cached.rate;
        try {
            const rate = await this.provider.getUsdRate(key);
            if (!new Decimal(rate).isFinite() || new Decimal(rate).lte(0))
                throw new Error("Price oracle returned an invalid rate");
            this.cache.set(key, { rate, at: this.now() });
            return rate;
        }
        catch (error) {
            if (cached && age <= 60_000)
                return cached.rate;
            throw error instanceof Error ? error : new Error("Price oracle unavailable");
        }
    }
}
