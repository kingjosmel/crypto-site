import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { AuditLog, Category, User } from "../src/models/index.js";
import { createAccessToken, hashPassword } from "../src/services/auth.js";

process.env.JWT_SECRET = "admin-test-secret-that-is-long-enough";
let replicaSet: MongoMemoryReplSet;
let customerToken: string;
let adminToken: string;

const adminRoutes: Array<[string, string]> = [
  ["get", "/admin/dashboard"], ["get", "/admin/products"], ["post", "/admin/products"], ["patch", "/admin/products/000000000000000000000000"], ["delete", "/admin/products/000000000000000000000000"],
  ["get", "/admin/categories"], ["post", "/admin/categories"], ["patch", "/admin/categories/000000000000000000000000"], ["delete", "/admin/categories/000000000000000000000000"],
  ["get", "/admin/suppliers"], ["post", "/admin/suppliers"], ["patch", "/admin/suppliers/000000000000000000000000"], ["delete", "/admin/suppliers/000000000000000000000000"],
  ["get", "/admin/suppliers/000000000000000000000000/products"], ["post", "/admin/suppliers/000000000000000000000000/products"], ["patch", "/admin/supplier-products/000000000000000000000000"], ["delete", "/admin/supplier-products/000000000000000000000000"],
  ["post", "/admin/uploads/images"], ["get", "/admin/orders/paid-queue"], ["get", "/admin/orders"], ["get", "/admin/orders/000000000000000000000000"], ["get", "/admin/orders/000000000000000000000000/payment-observations"], ["get", "/admin/orders/000000000000000000000000/status-history"],
  ["post", "/admin/orders/000000000000000000000000/fraud-approve"], ["post", "/admin/orders/000000000000000000000000/hold"], ["post", "/admin/orders/000000000000000000000000/release"], ["post", "/admin/orders/000000000000000000000000/cancel"], ["post", "/admin/orders/000000000000000000000000/supplier-order"], ["post", "/admin/orders/000000000000000000000000/ship"],
  ["get", "/admin/refunds"], ["post", "/admin/refunds"], ["patch", "/admin/refunds/000000000000000000000000"], ["get", "/admin/payment-observations"], ["get", "/admin/audit-logs"]
];

function send(method: string, path: string) {
  const builder = request(app) as unknown as Record<string, (route: string) => request.Test>;
  return builder[method](path).send({});
}

describe("admin authorization", () => {
  beforeAll(async () => { replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } }); await mongoose.connect(replicaSet.getUri()); await Promise.all([Category.syncIndexes(), AuditLog.syncIndexes()]); });
  afterAll(async () => { await mongoose.disconnect(); await replicaSet.stop(); });
  beforeEach(async () => {
    await Promise.all([User.deleteMany({}), AuditLog.deleteMany({})]);
    const passwordHash = await hashPassword("correct horse battery staple");
    const customer = await User.create({ email: "customer-admin-test@example.com", passwordHash, role: "CUSTOMER" });
    const admin = await User.create({ email: "admin-admin-test@example.com", passwordHash, role: "ADMIN", totpEnabled: false });
    customerToken = await createAccessToken({ id: String(customer._id), email: customer.email, role: customer.role });
    adminToken = await createAccessToken({ id: String(admin._id), email: admin.email, role: admin.role });
  });

  it.each(adminRoutes)("rejects %s %s without authentication", async (method, path) => { expect((await send(method, path)).status).toBe(401); });
  it.each(adminRoutes)("rejects %s %s for customers", async (method, path) => { expect((await send(method, path).set("authorization", `Bearer ${customerToken}`)).status).toBe(403); });
  it.each(adminRoutes)("rejects %s %s without 2FA", async (method, path) => { expect((await send(method, path).set("authorization", `Bearer ${adminToken}`)).status).toBe(403); });

  it("audits an authorized product mutation", async () => {
    const admin = await User.findOne({ role: "ADMIN" }).lean();
    const totpSecret = "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP";
    await User.updateOne({ _id: admin!._id }, { $set: { totpEnabled: true, totpSecret } });
    const category = await Category.create({ name: "Admin Test", slug: "admin-test" });
    const { generateSync } = await import("otplib");
    const response = await request(app).post("/admin/products").set("authorization", `Bearer ${adminToken}`).set("x-totp-code", generateSync({ secret: totpSecret })).send({ name: "Admin Product", slug: "admin-product", brand: "Northstar", categoryId: String(category._id), condition: "NEW", priceCents: 100, currency: "USD", sku: "ADMIN-1", status: "DRAFT", stockStatus: "IN_STOCK", specs: [], images: [] }).expect(201);
    expect(await AuditLog.countDocuments({ action: "create", entity: "Product", entityId: response.body._id })).toBe(1);
  });
});
