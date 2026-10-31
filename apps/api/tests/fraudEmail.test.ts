import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Category, EmailJob, Order, User } from "../src/models/index.js";
import { evaluateFraud } from "../src/services/fraud.js";
import { configureCustomerMailer } from "../src/services/mailer.js";
import { enqueueEmail, processEmailJobs } from "../src/services/emailQueue.js";

let replicaSet: MongoMemoryReplSet;
const address = { line1: "1 Main", city: "Austin", state: "TX", postalCode: "78701", country: "US" };
const otherAddress = { line1: "2 Main", city: "Austin", state: "TX", postalCode: "78701", country: "US" };

async function order(email: string, sourceIp = "127.0.0.1") { return Order.create({ orderNumber: `NS-${Math.floor(Math.random() * 90000000 + 10000000)}`, email, sourceIp, items: [{ productId: new mongoose.Types.ObjectId(), name: "Device", sku: "DEVICE-1", unitPriceCents: 100, qty: 1, condition: "NEW" }], shippingAddress: address, subtotalCents: 100, shippingCents: 0, taxCents: 0, totalCents: 100, orderStatus: "pending", paymentStatus: "unpaid", fulfillmentStatus: "not_submitted", onHold: false }); }

describe("fraud holds and email retries", () => {
  beforeAll(async () => { replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } }); await mongoose.connect(replicaSet.getUri()); await Promise.all([Order.syncIndexes(), User.syncIndexes(), EmailJob.syncIndexes(), Category.syncIndexes()]); });
  afterAll(async () => { await mongoose.disconnect(); await replicaSet.stop(); });
  beforeEach(async () => { await Promise.all([Order.deleteMany({}), User.deleteMany({}), EmailJob.deleteMany({})]); });

  it("holds high-value mismatch orders and flags velocity", async () => {
    await order("buyer@example.com");
    await order("buyer@example.com");
    const session = await Order.startSession();
    try {
      const result = await evaluateFraud({ email: "buyer@example.com", sourceIp: "127.0.0.1", totalCents: 200_000, shippingAddress: address, billingAddress: otherAddress, session }, { highValueCents: 100_000, newAccountHighValueCents: 300_000, windowMinutes: 30, emailOrderLimit: 3, ipOrderLimit: 5 });
      expect(result.held).toBe(true);
      expect(result.reasons).toEqual(expect.arrayContaining(["high_value_order", "email_velocity", "shipping_billing_mismatch"]));
    } finally { await session.endSession(); }
  });

  it("deduplicates jobs and retries failed delivery", async () => {
    let attempts = 0;
    configureCustomerMailer({ sendTemplate: async () => { attempts += 1; if (attempts === 1) throw new Error("temporary"); }, sendShipmentEmail: async () => undefined });
    await enqueueEmail("order_received", "buyer@example.com", { orderNumber: "NS-00000001" }, "order:NS-00000001");
    await enqueueEmail("order_received", "buyer@example.com", { orderNumber: "NS-00000001" }, "order:NS-00000001");
    expect(await EmailJob.countDocuments()).toBe(1);
    await processEmailJobs();
    expect((await EmailJob.findOne())?.status).toBe("pending");
    await EmailJob.updateMany({}, { $set: { nextAttemptAt: new Date(0) } });
    await processEmailJobs();
    expect((await EmailJob.findOne())?.status).toBe("sent");
    expect(attempts).toBe(2);
  });
});
