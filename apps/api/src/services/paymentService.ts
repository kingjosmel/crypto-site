import { Decimal } from "decimal.js";
import { Order, Payment, PaymentObservation } from "../models/index.js";
import { transition } from "./stateMachine.js";
import type { ChainVerifier, PaymentObservationInput, PaymentStatus, PriceOracle } from "./paymentTypes.js";
import { enqueueEmail } from "./emailQueue.js";

export class PaymentServiceError extends Error { constructor(message: string, public readonly status = 400) { super(message); } }
export type PaymentServiceOptions = { oracle: PriceOracle; verifiers: Map<string, ChainVerifier>; underpayTolerance?: string; now?: () => Date };
export class PaymentService {
  private readonly underpayTolerance: Decimal;
  private readonly now: () => Date;
  constructor(private readonly options: PaymentServiceOptions) { this.underpayTolerance = new Decimal(options.underpayTolerance ?? "0.005"); this.now = options.now ?? (() => new Date()); }
  private verifier(asset: string) { const value = this.options.verifiers.get(asset.toUpperCase()); if (!value) throw new PaymentServiceError(`No payment verifier configured for ${asset}`, 503); return value; }
  async createPayment(orderId: string, asset: string) {
    const verifier = this.verifier(asset);
    const rate = await this.options.oracle.getUsdRate(asset);
    const rateDecimal = new Decimal(rate);
    if (!rateDecimal.isFinite() || rateDecimal.lte(0)) throw new PaymentServiceError("Invalid price rate", 503);
    const session = await Order.startSession();
    try {
      let payment: { id: string; expectedAmount: string; expiresAt: Date; network: string; depositAddress: string } | undefined;
      let orderNumber = "";
      let orderEmail = "";
      await session.withTransaction(async () => {
        const order = await Order.findById(orderId).session(session).lean();
        if (!order) throw new PaymentServiceError("Order not found", 404);
        orderNumber = order.orderNumber;
        orderEmail = order.email;
        if (order.paymentStatus !== "unpaid") throw new PaymentServiceError("Order is not awaiting payment", 409);
        const target = await verifier.createPaymentTarget(order, asset.toUpperCase());
        const expectedAmount = new Decimal(order.totalCents).div(100).div(rateDecimal).toSignificantDigits(24).toFixed();
        const expiresAt = new Date(this.now().getTime() + 15 * 60_000);
        const created = await Payment.create([{ orderId: order._id, asset: asset.toUpperCase(), network: target.network, depositAddress: target.depositAddress, startBlock: target.startBlock, expectedAmount, quotedUsdCents: order.totalCents, rateUsed: rate, rateAt: this.now(), expiresAt, receivedAmount: "0", status: "pending", confirmations: 0 }], { session });
        await transition(String(order._id), "paymentStatus", "pending", null, "Payment target created", session);
        payment = { id: String(created[0]._id), expectedAmount, expiresAt, network: target.network, depositAddress: target.depositAddress };
      });
      await enqueueEmail("payment_pending", orderEmail, { orderNumber, asset: asset.toUpperCase(), amount: payment!.expectedAmount }, `payment-pending:${payment!.id}`);
      return payment!;
    } finally { await session.endSession(); }
  }
  async observePayment(paymentId: string, observations: PaymentObservationInput[], reconcile = false) {
    const session = await Payment.startSession();
    try {
      let result: PaymentStatus | undefined;
      await session.withTransaction(async () => {
        const payment = await Payment.findById(paymentId).session(session).lean();
        if (!payment) throw new PaymentServiceError("Payment not found", 404);
        if (reconcile) {
          const currentKeys = new Set(observations.map((observation) => `${observation.network}:${observation.txRef}:${observation.logIndex}`));
          const recorded = await PaymentObservation.find({ paymentId: payment._id, asset: payment.asset }).session(session).lean();
          const stale = recorded.filter((item) => !currentKeys.has(`${item.network}:${item.txRef}:${item.logIndex}`)).map((item) => item._id);
          if (stale.length) await PaymentObservation.deleteMany({ _id: { $in: stale } }, { session });
        }
        for (const observation of observations) {
          if (observation.asset !== payment.asset || observation.network !== payment.network) continue;
          const owned = await PaymentObservation.findOne({ network: observation.network, txRef: observation.txRef, paymentId: { $ne: payment._id } }).session(session).lean();
          if (owned) throw new PaymentServiceError("Transaction is already associated with another payment", 409);
          const existing = await PaymentObservation.findOne({ network: observation.network, txRef: observation.txRef, logIndex: observation.logIndex }).session(session).lean();
          if (!existing) await PaymentObservation.create([{ paymentId: payment._id, ...observation }], { session });
        }
        const recorded = await PaymentObservation.find({ paymentId: payment._id }).session(session).lean();
        const received = recorded.reduce((total, item) => total.plus(new Decimal(item.amount)), new Decimal(0));
        const confirmations = recorded.reduce((max, item) => Math.max(max, item.confirmations), 0);
        const currentTime = this.now();
        const expected = new Decimal(payment.expectedAmount);
        const isLate = currentTime > payment.expiresAt;
        let nextStatus: PaymentStatus = payment.status as PaymentStatus;
        let reason = "Payment observation processed";
        if (!recorded.length && payment.status === "paid") { nextStatus = "admin_review"; reason = "Previously settled chain observation disappeared; reorg requires review"; }
        else if (isLate && recorded.length) { nextStatus = "admin_review"; reason = "Late payment requires admin review"; }
        else if (isLate) { nextStatus = "expired"; reason = "Payment window expired"; }
        else if (received.gte(expected)) { nextStatus = "paid"; reason = received.gt(expected) ? "Overpayment requires refund review" : "Payment received"; }
        else if (received.gte(expected.mul(new Decimal(1).minus(this.underpayTolerance)))) { nextStatus = "paid"; reason = "Payment received within underpayment tolerance"; }
        else if (received.gt(0)) { nextStatus = "partially_paid"; reason = "Underpayment requires admin review"; }
        await Payment.findByIdAndUpdate(payment._id, { $set: { receivedAmount: received.toFixed(), confirmations, status: nextStatus, txRef: recorded[0]?.txRef, reviewReason: reason } }, { session, returnDocument: "after" });
        if (nextStatus === "admin_review") await Order.updateOne({ _id: payment.orderId }, { $set: { onHold: true, holdReason: reason } }, { session });
        else if (nextStatus === "partially_paid") { await Order.updateOne({ _id: payment.orderId }, { $set: { onHold: true, holdReason: reason } }, { session }); await transition(String(payment.orderId), "paymentStatus", nextStatus, null, reason, session); }
        else if (nextStatus === "paid" && received.gt(expected)) { await transition(String(payment.orderId), "paymentStatus", "paid", null, reason, session); await Order.updateOne({ _id: payment.orderId }, { $set: { onHold: true, holdReason: reason } }, { session }); }
        else if (nextStatus === "paid" || nextStatus === "expired") await transition(String(payment.orderId), "paymentStatus", nextStatus, null, reason, session);
        result = nextStatus;
      });
      const currentPayment = await Payment.findById(paymentId).lean();
      const order = currentPayment ? await Order.findById(currentPayment.orderId).select("email orderNumber").lean() : null;
      const template = result === "paid" ? "payment_received" : result === "partially_paid" ? "partial_payment" : result === "expired" ? "payment_expired" : null;
      if (template && order) await enqueueEmail(template, order.email, { orderNumber: order.orderNumber, asset: currentPayment?.asset, amount: currentPayment?.receivedAmount }, `payment-status:${paymentId}:${result}`);
      return result!;
    } finally { await session.endSession(); }
  }
  async watchPayment(paymentId: string) { const payment = await Payment.findById(paymentId).lean(); if (!payment) throw new PaymentServiceError("Payment not found", 404); const verifier = this.verifier(payment.asset); const observations = await verifier.findPayment(payment); return this.observePayment(paymentId, observations.filter((item) => item.confirmations >= verifier.requiredFinality), true); }
}
