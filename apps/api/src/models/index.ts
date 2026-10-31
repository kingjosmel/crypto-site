import { Schema, model, models } from "mongoose";

const addressSchema = new Schema({
  label: { type: String, trim: true },
  line1: { type: String, required: true, trim: true },
  line2: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true },
  country: { type: String, required: true, default: "US", uppercase: true, trim: true }
}, { _id: true, strict: true });

const imageSchema = new Schema({
  url: { type: String, required: true, trim: true },
  alt: { type: String, required: true, trim: true },
  position: { type: Number, required: true, min: 0, validate: Number.isInteger }
}, { _id: false, strict: true });

const specSchema = new Schema({
  key: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true }
}, { _id: false, strict: true });

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, trim: true },
  unitPriceCents: { type: Number, required: true, min: 0, validate: Number.isInteger },
  qty: { type: Number, required: true, min: 1, max: 10, validate: Number.isInteger },
  condition: { type: String, required: true, enum: ["NEW", "REFURBISHED", "PRE_OWNED"] }
}, { _id: false, strict: true });

const timestamps = { timestamps: true, strict: true } as const;
const enumValues = <T extends string>(values: readonly T[]) => ({ type: String, enum: values, required: true });

export const User = models.User ?? model("User", new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: enumValues(["CUSTOMER", "ADMIN"] as const),
  addresses: { type: [addressSchema], default: [] },
  emailVerifiedAt: { type: Date },
  emailVerificationTokenHash: { type: String, select: false, index: true },
  emailVerificationExpiresAt: { type: Date, select: false },
  passwordResetTokenHash: { type: String, select: false, index: true },
  passwordResetExpiresAt: { type: Date, select: false },
  totpEnabled: { type: Boolean, default: false },
  totpSecret: { type: String, select: false }
}, timestamps));

export const Category = models.Category ?? model("Category", new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, trim: true }
}, timestamps));

export const Product = models.Product ?? model("Product", new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  brand: { type: String, required: true, trim: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  condition: enumValues(["NEW", "REFURBISHED", "PRE_OWNED"] as const),
  priceCents: { type: Number, required: true, min: 0, validate: Number.isInteger },
  currency: { type: String, required: true, enum: ["USD"], default: "USD" },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  status: enumValues(["DRAFT", "ACTIVE", "ARCHIVED"] as const),
  stockStatus: { type: String, required: true, trim: true },
  warranty: { type: String, trim: true },
  returnPolicy: { type: String, trim: true },
  description: { type: String, trim: true },
  specs: { type: [specSchema], default: [] },
  images: { type: [imageSchema], default: [] },
  sizes: { type: [String], default: [] },
  authenticity: { type: String, trim: true }
}, timestamps));
Product.schema.index({ status: 1, categoryId: 1, priceCents: 1 });
Product.schema.index({ name: "text", brand: "text", description: "text" });

export const Supplier = models.Supplier ?? model("Supplier", new Schema({
  name: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  status: { type: String, required: true, trim: true }
}, timestamps));

export const SupplierProduct = models.SupplierProduct ?? model("SupplierProduct", new Schema({
  supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  supplierSku: { type: String, required: true, trim: true },
  costCents: { type: Number, required: true, min: 0, validate: Number.isInteger },
  stockStatus: { type: String, required: true, trim: true },
  lastCheckedAt: { type: Date, required: true }
}, timestamps));
SupplierProduct.schema.index({ supplierId: 1, productId: 1 }, { unique: true });

export const AuditLog = models.AuditLog ?? model("AuditLog", new Schema({
  actorId: { type: Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true, trim: true },
  entity: { type: String, required: true, trim: true },
  entityId: { type: Schema.Types.ObjectId, required: true },
  before: { type: Schema.Types.Mixed },
  after: { type: Schema.Types.Mixed },
  ip: { type: String, trim: true },
  at: { type: Date, required: true, default: Date.now }
}, timestamps));

export const Counter = models.Counter ?? model("Counter", new Schema({ _id: { type: String, required: true }, value: { type: Number, required: true, min: 0, default: 0, validate: Number.isInteger } }, { strict: true }));

export const Order = models.Order ?? model("Order", new Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  email: { type: String, required: true, lowercase: true, trim: true },
  items: { type: [orderItemSchema], required: true, validate: (items: unknown[]) => items.length > 0 },
  shippingAddress: { type: addressSchema, required: true },
  billingAddress: { type: addressSchema },
  subtotalCents: { type: Number, required: true, min: 0, validate: Number.isInteger },
  shippingCents: { type: Number, required: true, min: 0, validate: Number.isInteger },
  taxCents: { type: Number, required: true, min: 0, validate: Number.isInteger },
  totalCents: { type: Number, required: true, min: 0, validate: Number.isInteger },
  orderStatus: { type: String, required: true, enum: ["pending", "confirmed", "cancelled", "completed"] },
  paymentStatus: { type: String, required: true, enum: ["unpaid", "pending", "partially_paid", "paid", "expired", "failed", "refund_pending", "partially_refunded", "refunded"] },
  fulfillmentStatus: { type: String, required: true, enum: ["not_submitted", "awaiting_supplier", "submitted", "processing", "shipped", "delivered", "cancelled", "exception"] },
  onHold: { type: Boolean, required: true, default: false },
  holdReason: { type: String, trim: true },
  fraudStatus: { type: String, required: true, enum: ["clear", "held", "approved", "rejected"], default: "clear" },
  fraudReasons: { type: [String], default: [] },
  sourceIp: { type: String, trim: true, index: true },
  supplierId: { type: Schema.Types.ObjectId, ref: "Supplier" },
  supplierReference: { type: String, trim: true },
  supplierOrderPlacedAt: { type: Date },
  carrier: { type: String, trim: true },
  trackingNumber: { type: String, trim: true },
  guestTokenHash: { type: String, select: false, index: true }
}, timestamps));

export const OrderStatusHistory = models.OrderStatusHistory ?? model("OrderStatusHistory", new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
  actor: { type: Schema.Types.ObjectId, ref: "User", default: null },
  kind: { type: String, required: true, enum: ["orderStatus", "paymentStatus", "fulfillmentStatus"] },
  from: { type: String, required: true },
  to: { type: String, required: true },
  reason: { type: String, required: true, trim: true }
}, timestamps));

const refundStatuses = ["pending", "sent", "confirmed", "failed", "cancelled"] as const;
export const Refund = models.Refund ?? model("Refund", new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
  amount: { type: String, required: true },
  asset: { type: String, required: true, trim: true, uppercase: true },
  network: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  txRef: { type: String, trim: true },
  status: { type: String, required: true, enum: refundStatuses, default: "pending" },
  reason: { type: String, required: true, trim: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, timestamps));

export const EmailJob = models.EmailJob ?? model("EmailJob", new Schema({
  template: { type: String, required: true, trim: true },
  to: { type: String, required: true, trim: true, lowercase: true },
  payload: { type: Schema.Types.Mixed, required: true },
  dedupeKey: { type: String, required: true, unique: true },
  status: { type: String, required: true, enum: ["pending", "processing", "sent", "failed"], default: "pending" },
  attempts: { type: Number, required: true, min: 0, default: 0 },
  nextAttemptAt: { type: Date, required: true, default: Date.now },
  lastError: { type: String, trim: true }
}, timestamps));

export { Payment, PaymentObservation } from "./payment.js";

import { Payment, PaymentObservation } from "./payment.js";
export const allModels = { User, Category, Product, Supplier, SupplierProduct, AuditLog, Counter, Order, OrderStatusHistory, Refund, EmailJob, Payment, PaymentObservation };
