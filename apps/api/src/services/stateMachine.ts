import type { ClientSession } from "mongoose";
import { Order, OrderStatusHistory } from "../models/index.js";

export type TransitionKind = "orderStatus" | "paymentStatus" | "fulfillmentStatus";
export type OrderStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "unpaid" | "pending" | "partially_paid" | "paid" | "expired" | "failed" | "refund_pending" | "partially_refunded" | "refunded";
export type FulfillmentStatus = "not_submitted" | "awaiting_supplier" | "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "exception";

export const allowedTransitions: Record<TransitionKind, Record<string, readonly string[]>> = {
  orderStatus: { pending: ["confirmed", "cancelled"], confirmed: ["completed", "cancelled"], cancelled: [], completed: [] },
  paymentStatus: {
    unpaid: ["pending", "failed", "expired"], pending: ["partially_paid", "paid", "failed", "expired"], partially_paid: ["paid", "failed", "refund_pending"], paid: ["refund_pending"], refund_pending: ["partially_refunded", "refunded"], partially_refunded: ["refunded"], failed: [], expired: [], refunded: []
  },
  fulfillmentStatus: { not_submitted: ["awaiting_supplier", "cancelled", "exception"], awaiting_supplier: ["submitted", "shipped", "cancelled", "exception"], submitted: ["processing", "shipped", "cancelled", "exception"], processing: ["shipped", "cancelled", "exception"], shipped: ["delivered", "exception"], delivered: [], cancelled: [], exception: ["processing", "cancelled"] }
};

export class TransitionError extends Error { constructor(message: string, public readonly status = 409) { super(message); } }

export async function transition(orderId: string, kind: TransitionKind, to: string, actor: string | null, reason: string, session?: ClientSession) {
  const allowed = allowedTransitions[kind];
  const orderField = kind;
  const run = async (transactionSession: ClientSession) => {
    const currentOrder = await Order.findById(orderId).select(`_id ${orderField} paymentStatus onHold`).session(transactionSession).lean();
    if (!currentOrder) throw new TransitionError("Order not found", 404);
    const from = String(currentOrder[orderField as keyof typeof currentOrder]);
    if (from === to) return { order: currentOrder, changed: false };
    if (!allowed[from]?.includes(to)) throw new TransitionError(`Invalid ${kind} transition: ${from} -> ${to}`);
    if (kind === "fulfillmentStatus" && from === "not_submitted" && (currentOrder.paymentStatus !== "paid" || currentOrder.onHold)) throw new TransitionError("Fulfillment requires a paid order that is not on hold");
    const updated = await Order.findOneAndUpdate({ _id: orderId, [orderField]: from }, { $set: { [orderField]: to } }, { returnDocument: "after", session: transactionSession }).lean();
    if (!updated) throw new TransitionError("Concurrent status transition lost", 409);
    await OrderStatusHistory.create([{ orderId, actor, kind, from, to, reason }], { session: transactionSession });
    return { order: updated, changed: true };
  };
  if (session) return run(session);
  const transactionSession = await Order.startSession();
  try { let result: Awaited<ReturnType<typeof run>>; await transactionSession.withTransaction(async () => { result = await run(transactionSession); }); return result!; } finally { await transactionSession.endSession(); }
}
