import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Order, Payment, PaymentObservation } from "../src/models/index.js";
import { FakeChainVerifier } from "../src/testing/fakeChainVerifier.js";
import { PaymentService } from "../src/services/paymentService.js";

let replicaSet: MongoMemoryReplSet;
let verifier: FakeChainVerifier;
let now: Date;
const oracle = { getUsdRate: async () => "1000" };
const address = { line1: "1 Main", city: "Austin", state: "TX", postalCode: "78701", country: "US" };

beforeAll(async () => { replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } }); await mongoose.connect(replicaSet.getUri()); await Promise.all([Order.syncIndexes(), Payment.syncIndexes(), PaymentObservation.syncIndexes()]); });
afterAll(async () => { await mongoose.disconnect(); await replicaSet.stop(); });
beforeEach(async () => { now = new Date("2026-01-01T00:00:00.000Z"); verifier = new FakeChainVerifier(); await Promise.all([Order.deleteMany({}), Payment.deleteMany({}), PaymentObservation.deleteMany({})]); });

async function createService() { return new PaymentService({ oracle, verifiers: new Map([["BTC", verifier]]), now: () => now }); }
async function createOrder() { return Order.create({ orderNumber: `NS-${Math.floor(Math.random() * 90000000 + 10000000)}`, email: "pay@example.com", items: [{ productId: new mongoose.Types.ObjectId(), name: "Miner", sku: "MINER-1", unitPriceCents: 10000, qty: 1, condition: "NEW" }], shippingAddress: address, subtotalCents: 10000, shippingCents: 0, taxCents: 0, totalCents: 10000, orderStatus: "pending", paymentStatus: "unpaid", fulfillmentStatus: "not_submitted", onHold: false }); }
async function createPayment() { const service = await createService(); const order = await createOrder(); const payment = await service.createPayment(String(order._id), "BTC"); return { service, order, payment }; }
const observation = (amount: string, asset = "BTC") => ({ network: "fake", txRef: `tx-${Math.random()}`, logIndex: 0, asset, amount, confirmations: 1, raw: { source: "fake" } });

describe("payment settlement policy", () => {
  it("settles exact payment", async () => { const { service, payment } = await createPayment(); verifier.setObservations([observation("0.1")]); expect(await service.watchPayment(payment.id)).toBe("paid"); expect((await Payment.findById(payment.id))!.status).toBe("paid"); });
  it("marks material underpayment partially paid and on hold", async () => { const { service, payment, order } = await createPayment(); verifier.setObservations([observation("0.09")]); expect(await service.watchPayment(payment.id)).toBe("partially_paid"); expect((await Order.findById(order._id))!.onHold).toBe(true); });
  it("pays and flags overpayment for refund review", async () => { const { service, payment, order } = await createPayment(); verifier.setObservations([observation("0.11")]); expect(await service.watchPayment(payment.id)).toBe("paid"); expect((await Order.findById(order._id))!.onHold).toBe(true); });
  it("expires an unpaid payment", async () => { const { service, payment } = await createPayment(); now = new Date(now.getTime() + 16 * 60_000); expect(await service.watchPayment(payment.id)).toBe("expired"); });
  it("sends a late payment to admin review", async () => { const { service, payment, order } = await createPayment(); now = new Date(now.getTime() + 16 * 60_000); verifier.setObservations([observation("0.1")]); expect(await service.watchPayment(payment.id)).toBe("admin_review"); expect((await Order.findById(order._id))!.onHold).toBe(true); });
  it("does not duplicate an observation", async () => { const { service, payment } = await createPayment(); const item = observation("0.1"); verifier.setObservations([item]); await service.watchPayment(payment.id); await service.watchPayment(payment.id); expect(await PaymentObservation.countDocuments({ txRef: item.txRef })).toBe(1); });
  it("rejects replaying one transaction on a second order", async () => { const service = await createService(); const first = await createOrder(); const second = await createOrder(); const firstPayment = await service.createPayment(String(first._id), "BTC"); const secondPayment = await service.createPayment(String(second._id), "BTC"); const item = observation("0.1"); await service.observePayment(firstPayment.id, [item]); await expect(service.observePayment(secondPayment.id, [item])).rejects.toThrow("already associated"); });
  it("ignores observations for the wrong asset", async () => { const { service, payment } = await createPayment(); verifier.setObservations([observation("0.1", "ETH")]); expect(await service.watchPayment(payment.id)).toBe("pending"); expect((await Payment.findById(payment.id))!.receivedAmount).toBe("0"); });
});
