import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { beforeAll, afterAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { Category, Product, SupplierProduct } from "../src/models/index.js";
let replicaSet;
beforeAll(async () => {
    replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    await mongoose.connect(replicaSet.getUri());
    await Promise.all([Category.syncIndexes(), Product.syncIndexes(), SupplierProduct.syncIndexes()]);
});
afterAll(async () => {
    await mongoose.disconnect();
    await replicaSet.stop();
});
beforeEach(async () => {
    await Promise.all([Category.deleteMany({}), Product.deleteMany({}), SupplierProduct.deleteMany({})]);
    const category = await Category.create({ name: "Mining Hardware", slug: "mining-hardware", description: "Hardware" });
    await Product.create([
        { name: "Alpha Miner", slug: "alpha-miner", brand: "Alpha", categoryId: category._id, condition: "NEW", priceCents: 10000, currency: "USD", sku: "ALPHA-1", status: "ACTIVE", stockStatus: "IN_STOCK", description: "Quiet bitcoin miner", specs: [], images: [] },
        { name: "Beta Wallet", slug: "beta-wallet", brand: "Beta", categoryId: category._id, condition: "REFURBISHED", priceCents: 20000, currency: "USD", sku: "BETA-1", status: "ACTIVE", stockStatus: "LOW_STOCK", description: "Secure hardware wallet", specs: [], images: [] },
        { name: "Draft Device", slug: "draft-device", brand: "Draft", categoryId: category._id, condition: "NEW", priceCents: 1, currency: "USD", sku: "DRAFT-1", status: "DRAFT", stockStatus: "IN_STOCK", description: "Hidden", specs: [], images: [] }
    ]);
    await SupplierProduct.create({ supplierId: new mongoose.Types.ObjectId(), productId: (await Product.findOne({ sku: "ALPHA-1" }))._id, supplierSku: "SUP-1", costCents: 5000, stockStatus: "IN_STOCK", lastCheckedAt: new Date() });
});
describe("public catalog routes", () => {
    it("paginates active products with a cursor", async () => {
        const first = await request(app).get("/products?limit=1").expect(200);
        expect(first.body.items).toHaveLength(1);
        expect(first.body.pagination.hasMore).toBe(true);
        const second = await request(app).get(`/products?limit=1&cursor=${first.body.pagination.nextCursor}`).expect(200);
        expect(second.body.items).toHaveLength(1);
        expect(second.body.items[0]._id).not.toBe(first.body.items[0]._id);
    });
    it("filters by category and searches name, brand, and description", async () => {
        const category = await Category.findOne({ slug: "mining-hardware" }).lean();
        const filtered = await request(app).get(`/products?category=${category._id}`).expect(200);
        expect(filtered.body.items).toHaveLength(2);
        const searched = await request(app).get("/products?q=wallet").expect(200);
        expect(searched.body.items.map((item) => item.slug)).toEqual(["beta-wallet"]);
    });
    it("rejects operator-shaped query values and never leaks supplier cost", async () => {
        const response = await request(app).get("/products?q=%24ne%3Anull").expect(400);
        expect(response.body.error).toBe("Invalid query parameters");
        const product = await request(app).get("/products/alpha-miner").expect(200);
        expect(product.body).not.toHaveProperty("costCents");
        const list = await request(app).get("/products").expect(200);
        expect(JSON.stringify(list.body)).not.toContain("costCents");
    });
});
