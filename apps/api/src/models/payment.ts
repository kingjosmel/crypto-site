import { Schema, model, models } from "mongoose";
const paymentStatuses = ["pending", "partially_paid", "paid", "expired", "failed", "admin_review", "refund_pending", "partially_refunded", "refunded"] as const;
export const Payment = models.Payment ?? model("Payment", new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
  asset: { type: String, required: true, trim: true, uppercase: true },
  network: { type: String, required: true, trim: true },
  depositAddress: { type: String, required: true, trim: true },
  startBlock: { type: String, trim: true },
  expectedAmount: { type: String, required: true },
  quotedUsdCents: { type: Number, required: true, min: 0, validate: Number.isInteger },
  rateUsed: { type: String, required: true },
  rateAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  receivedAmount: { type: String, required: true, default: "0" },
  status: { type: String, required: true, enum: paymentStatuses, default: "pending" },
  txRef: { type: String, sparse: true, unique: true },
  confirmations: { type: Number, required: true, min: 0, default: 0, validate: Number.isInteger },
  reviewReason: { type: String, trim: true }
}, { timestamps: true, strict: true }));

export const PaymentObservation = models.PaymentObservation ?? model("PaymentObservation", new Schema({
  paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true, index: true },
  network: { type: String, required: true, trim: true },
  txRef: { type: String, required: true, trim: true },
  logIndex: { type: Number, required: true, min: 0, validate: Number.isInteger },
  asset: { type: String, required: true, trim: true, uppercase: true },
  amount: { type: String, required: true },
  confirmations: { type: Number, required: true, min: 0, validate: Number.isInteger },
  raw: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true, strict: true }));
PaymentObservation.schema.index({ network: 1, txRef: 1, logIndex: 1 }, { unique: true });
