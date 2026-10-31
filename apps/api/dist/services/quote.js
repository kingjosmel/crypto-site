import { Types } from "mongoose";
import { Product } from "../models/index.js";
const shippingByState = { AK: 2499, HI: 1999 };
export const shippingService = {
    getShippingCost: (address) => shippingByState[address.state] ?? 999
};
const TAX_RATE_BASIS_POINTS = 825;
export const taxService = {
    getTaxCents: (_address, taxableCents) => Math.round(taxableCents * TAX_RATE_BASIS_POINTS / 10_000)
};
export class QuoteError extends Error {
    status;
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}
export async function createQuote(items, address, services = { shippingService, taxService }, session) {
    const productIds = items.map((item) => new Types.ObjectId(item.productId));
    const products = await Product.find({ _id: { $in: productIds } }).select("_id name sku priceCents status stockStatus condition").session(session ?? null).lean();
    const byId = new Map(products.map((product) => [String(product._id), product]));
    const quoteItems = [];
    for (const item of items) {
        const product = byId.get(item.productId);
        if (!product || product.status !== "ACTIVE" || product.stockStatus === "OUT_OF_STOCK") {
            throw new QuoteError(`Product ${item.productId} is unavailable`, 409);
        }
        quoteItems.push({
            productId: item.productId,
            name: product.name,
            sku: product.sku,
            condition: product.condition,
            qty: item.qty,
            unitPriceCents: product.priceCents,
            lineTotalCents: product.priceCents * item.qty
        });
    }
    const subtotalCents = quoteItems.reduce((total, item) => total + item.lineTotalCents, 0);
    const shippingCents = services.shippingService.getShippingCost(address, subtotalCents);
    const taxCents = services.taxService.getTaxCents(address, subtotalCents);
    return { currency: "USD", items: quoteItems, subtotalCents, shippingCents, taxCents, totalCents: subtotalCents + shippingCents + taxCents };
}
