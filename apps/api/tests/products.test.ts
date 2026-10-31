import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { beforeAll, afterAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { Category, Counter, Order, OrderStatusHistory, Product, SupplierProduct, User } from "../src/models/index.js";
import { createAccessToken, hashPassword } from "../src/services/auth.js";
import { transition } from "../src/services/stateMachine.js";

let replicaSet: MongoMemoryReplSet;
process.env.JWT_SECRET = "test-secret-that-is-long-enough-for-hs256";

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
  await Promise.all([Category.deleteMany({}), Product.deleteMany({}), SupplierProduct.deleteMany({}), Counter.deleteMany({}), Order.deleteMany({}), OrderStatusHistory.deleteMany({}), User.deleteMany({})]);
  const category = await Category.create({ name: "Mining Hardware", slug: "mining-hardware", description: "Hardware" });
  await Product.create([
    { name: "Alpha Miner", slug: "alpha-miner", brand: "Alpha", categoryId: category._id, condition: "NEW", priceCents: 10000, currency: "USD", sku: "ALPHA-1", status: "ACTIVE", stockStatus: "IN_STOCK", description: "Quiet bitcoin miner", specs: [], images: [] },
    { name: "Beta Wallet", slug: "beta-wallet", brand: "Beta", categoryId: category._id, condition: "REFURBISHED", priceCents: 20000, currency: "USD", sku: "BETA-1", status: "ACTIVE", stockStatus: "LOW_STOCK", description: "Secure hardware wallet", specs: [], images: [] },
    { name: "Draft Device", slug: "draft-device", brand: "Draft", categoryId: category._id, condition: "NEW", priceCents: 1, currency: "USD", sku: "DRAFT-1", status: "DRAFT", stockStatus: "IN_STOCK", description: "Hidden", specs: [], images: [] }
  ]);
  await SupplierProduct.create({ supplierId: new mongoose.Types.ObjectId(), productId: (await Product.findOne({ sku: "ALPHA-1" }))!._id, supplierSku: "SUP-1", costCents: 5000, stockStatus: "IN_STOCK", lastCheckedAt: new Date() });
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
    const filtered = await request(app).get(`/products?category=${category!._id}`).expect(200);
    expect(filtered.body.items).toHaveLength(2);
    const searched = await request(app).get("/products?q=wallet").expect(200);
    expect(searched.body.items.map((item: { slug: string }) => item.slug)).toEqual(["beta-wallet"]);
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

describe("checkout quote route", () => {
  const shippingAddress = { line1: "1 Main Street", city: "Austin", state: "TX", postalCode: "78701", country: "US" };

  it("revalidates prices and ignores client price fields", async () => {
    const product = await Product.findOne({ sku: "ALPHA-1" }).lean();
    const response = await request(app).post("/checkout/quote").send({
      email: "buyer@example.com",
      items: [{ productId: String(product!._id), qty: 2, priceCents: 1 }],
      shippingAddress
    }).expect(200);
    expect(response.body.items[0].unitPriceCents).toBe(10000);
    expect(response.body.subtotalCents).toBe(20000);
  });

  it("rejects inactive and out-of-stock products", async () => {
    const product = await Product.findOne({ sku: "ALPHA-1" });
    await Product.updateOne({ _id: product!._id }, { $set: { stockStatus: "OUT_OF_STOCK" } });
    await request(app).post("/checkout/quote").send({ email: "buyer@example.com", items: [{ productId: String(product!._id), qty: 1 }], shippingAddress }).expect(409);
  });

  it("rejects quantities above the per-line limit", async () => {
    const product = await Product.findOne({ sku: "ALPHA-1" }).lean();
    const response = await request(app).post("/checkout/quote").send({ email: "buyer@example.com", items: [{ productId: String(product!._id), qty: 11 }], shippingAddress }).expect(400);
    expect(response.body.error).toBe("Invalid checkout request");
  });

  it("creates a guest order with a one-time access token and hashed storage", async () => {
    const product = await Product.findOne({ sku: "ALPHA-1" }).lean();
    const response = await request(app).post("/orders").send({ email: "guest@example.com", items: [{ productId: String(product!._id), qty: 1 }], shippingAddress }).expect(201);
    expect(response.body.orderNumber).toMatch(/^NS-\d{8}$/);
    expect(response.body.accessToken).toEqual(expect.any(String));
    const order = await Order.findOne({ orderNumber: response.body.orderNumber }).select("+guestTokenHash").lean();
    expect(order?.guestTokenHash).toBeTruthy();
    expect(order?.guestTokenHash).not.toBe(response.body.accessToken);
    expect(order?.items[0].condition).toBe("NEW");
  });

  it("rejects invalid transitions and guards fulfillment", async () => {
    const product = await Product.findOne({ sku: "ALPHA-1" }).lean();
    const orderResponse = await request(app).post("/orders").send({ email: "guest@example.com", items: [{ productId: String(product!._id), qty: 1 }], shippingAddress });
    const orderId = String((await Order.findOne({ orderNumber: orderResponse.body.orderNumber }))!._id);
    await expect(transition(orderId, "orderStatus", "completed", null, "skip")).rejects.toThrow("Invalid orderStatus transition");
    await expect(transition(orderId, "fulfillmentStatus", "awaiting_supplier", null, "supplier handoff")).rejects.toThrow("Fulfillment requires");
    await Order.updateOne({ _id: orderId }, { $set: { paymentStatus: "paid" } });
    await expect(transition(orderId, "fulfillmentStatus", "awaiting_supplier", null, "paid")).resolves.toMatchObject({ changed: true });
  });

  it("allows exactly one winner for concurrent transitions", async () => {
    const product = await Product.findOne({ sku: "ALPHA-1" }).lean();
    const orderResponse = await request(app).post("/orders").send({ email: "guest@example.com", items: [{ productId: String(product!._id), qty: 1 }], shippingAddress });
    const orderId = String((await Order.findOne({ orderNumber: orderResponse.body.orderNumber }))!._id);
    await Order.updateOne({ _id: orderId }, { $set: { paymentStatus: "paid" } });
    const results = await Promise.allSettled([
      transition(orderId, "fulfillmentStatus", "awaiting_supplier", null, "worker a"),
      transition(orderId, "fulfillmentStatus", "awaiting_supplier", null, "worker b")
    ]);
    expect(results.filter((result) => result.status === "fulfilled" && result.value.changed)).toHaveLength(1);
    expect(await OrderStatusHistory.countDocuments({ orderId, kind: "fulfillmentStatus", to: "awaiting_supplier" })).toBe(1);
  });
});

describe("authentication and authorization", () => {
  it("rejects NoSQL-shaped login input without revealing account existence", async () => {
    await User.create({ email: "customer@example.com", passwordHash: await hashPassword("correct horse battery staple"), role: "CUSTOMER" });
    const injection = await request(app).post("/auth/login").send({ email: { $ne: null }, password: { $ne: null } }).expect(401);
    const unknown = await request(app).post("/auth/login").send({ email: "missing@example.com", password: "wrong password here" }).expect(401);
    expect(injection.body).toEqual(unknown.body);
  });

  it("denies cross-customer order access and customer admin access", async () => {
    const first = await User.create({ email: "first@example.com", passwordHash: await hashPassword("correct horse battery staple"), role: "CUSTOMER" });
    const second = await User.create({ email: "second@example.com", passwordHash: await hashPassword("correct horse battery staple"), role: "CUSTOMER" });
    const order = await Order.create({ orderNumber: "NS-99999999", userId: first._id, email: first.email, items: [{ productId: new mongoose.Types.ObjectId(), name: "Snapshot", sku: "SNAP-1", unitPriceCents: 100, qty: 1, condition: "NEW" }], shippingAddress: { line1: "1 Main", city: "Austin", state: "TX", postalCode: "78701", country: "US" }, subtotalCents: 100, shippingCents: 999, taxCents: 8, totalCents: 1107, orderStatus: "pending", paymentStatus: "unpaid", fulfillmentStatus: "not_submitted", onHold: false });
    const token = await createAccessToken({ id: String(second._id), email: second.email, role: "CUSTOMER" });
    await request(app).get(`/orders/${order.orderNumber}`).set("authorization", `Bearer ${token}`).expect(404);
    await request(app).get("/admin/orders").set("authorization", `Bearer ${token}`).expect(403);
  });

  it("rejects client payment claims and mass-assigned payment state", async () => {
    const product = await Product.findOne({ sku: "ALPHA-1" }).lean();
    const securityAddress = { line1: "1 Main Street", city: "Austin", state: "TX", postalCode: "78701", country: "US" };
    const orderResponse = await request(app).post("/orders").send({ email: "security@example.com", items: [{ productId: String(product!._id), qty: 1 }], shippingAddress: securityAddress });
    const order = await Order.findOne({ orderNumber: orderResponse.body.orderNumber }).lean();
    const user = await User.create({ email: "security-user@example.com", passwordHash: await hashPassword("correct horse battery staple"), role: "CUSTOMER" });
    const token = await createAccessToken({ id: String(user._id), email: user.email, role: user.role });
    await request(app).post(`/orders/${order!._id}/payment`).set("authorization", `Bearer ${token}`).send({ asset: "BTC", txHash: "client-forged-hash" }).expect(400);
    await request(app).post("/orders").send({ email: "security@example.com", paymentStatus: "paid", items: [{ productId: String(product!._id), qty: 1 }], shippingAddress: securityAddress }).expect(400);
  });

  it("stores password reset tokens hashed and makes them single-use", async () => {
    const user = await User.create({ email: "reset@example.com", passwordHash: await hashPassword("correct horse battery staple"), role: "CUSTOMER" });
    const token = "reset-token-that-is-long-enough-123456";
    user.passwordResetTokenHash = (await import("node:crypto")).createHash("sha256").update(token).digest("hex");
    user.passwordResetExpiresAt = new Date(Date.now() + 60_000);
    await user.save();
    await request(app).post("/auth/reset-password").send({ token, password: "new correct horse battery staple" }).expect(200);
    await request(app).post("/auth/reset-password").send({ token, password: "another correct horse battery" }).expect(400);
  });
});
