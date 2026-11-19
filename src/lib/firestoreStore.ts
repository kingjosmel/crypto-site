import { createHash } from "node:crypto";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from "./firebase";
import type { OrderRecord } from "./catalogData";

const CONTACT_SALT = "ns-contact-v1:deft-shard-f0z9n";

export function hashEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

export function maskEmail(email: string): string {
  const clean = email.trim();
  const [local, domain] = clean.split("@");
  if (!local || !domain) return "***";
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

export function deriveContactId(orderNumber: string): string {
  return createHash("sha256")
    .update(`${CONTACT_SALT}:${orderNumber.trim().toUpperCase()}`)
    .digest("hex");
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      out[k] = v;
    }
  }
  return out;
}

export interface VerifiedProductReview {
  reviewId: string;
  orderNumber: string;
  productId: string;
  productSlug: string;
  productName: string;
  reviewerName: string;
  reviewerLocation?: string;
  rating: number;
  deliveryRating: number;
  comment: string;
  photoUrl?: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export async function generateUniqueOrderNumberInFirestore(): Promise<string> {
  await testFirestoreConnection();
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = String(Date.now() + attempt).slice(-8).padStart(8, "0");
    const candidate = `NS-${suffix}`;
    try {
      const snap = await getDoc(doc(db, "orders", candidate));
      if (!snap.exists()) return candidate;
    } catch {
      return candidate;
    }
  }
  const fallbackNum = Math.floor(10000000 + Math.random() * 89999999);
  return `NS-${fallbackNum}`;
}

export async function saveOrderToFirestore(order: OrderRecord): Promise<void> {
  await testFirestoreConnection();

  const cleanEmail = order.email.trim();
  const emailHash = hashEmail(cleanEmail);
  const contactId = deriveContactId(order.orderNumber);
  const currency = order.cryptoCurrency || "BTC";

  const publicOrderPayload = stripUndefined({
    orderNumber: order.orderNumber,
    emailHash,
    emailMasked: maskEmail(cleanEmail),
    paymentMethod: `CRYPTO_${currency}`,
    cryptoCurrency: currency,
    cryptoAmount: String(order.cryptoAmount || "0"),
    escrowAddress: String(order.escrowAddress || ""),
    baselineTxIds: Array.isArray(order.baselineTxIds) ? order.baselineTxIds.slice(0, 30) : [],
    items: order.items.slice(0, 25),
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    taxCents: order.taxCents,
    totalCents: order.totalCents,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    carrier: order.carrier,
    trackingNumber: order.trackingNumber,
    estimatedDelivery: order.estimatedDelivery,
    confirmationEmailSent: Boolean(order.confirmationEmailSent),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  });

  const cleanShipping = stripUndefined({
    line1: order.shippingAddress.line1,
    line2: order.shippingAddress.line2,
    city: order.shippingAddress.city,
    state: order.shippingAddress.state,
    postalCode: order.shippingAddress.postalCode,
    country: order.shippingAddress.country,
  });

  const contactPayload = stripUndefined({
    orderNumber: order.orderNumber,
    email: cleanEmail,
    customerName: order.customerName,
    phone: order.phone,
    refundWallet: order.refundWallet,
    shippingAddress: cleanShipping,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  });

  try {
    await setDoc(doc(db, "orders", order.orderNumber), publicOrderPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `orders/${order.orderNumber}`);
  }

  try {
    await setDoc(doc(db, "orderContacts", contactId), contactPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `orderContacts/${contactId}`);
  }
}

export async function updateOrderVerificationInFirestore(
  orderNumber: string,
  payload: {
    paymentStatus: "confirming" | "paid";
    orderStatus?: OrderRecord["orderStatus"];
    fulfillmentStatus?: OrderRecord["fulfillmentStatus"];
    txHash?: string;
    confirmations?: number;
    explorerUrl?: string;
    confirmationEmailSent?: boolean;
    verifiedAt?: string;
    updatedAt: string;
  }
): Promise<void> {
  await testFirestoreConnection();
  const docRef = doc(db, "orders", orderNumber);
  const updateFields = stripUndefined({
    paymentStatus: payload.paymentStatus,
    orderStatus: payload.orderStatus,
    fulfillmentStatus: payload.fulfillmentStatus,
    txHash: payload.txHash,
    confirmations: payload.confirmations,
    explorerUrl: payload.explorerUrl,
    confirmationEmailSent: payload.confirmationEmailSent,
    verifiedAt: payload.verifiedAt,
    updatedAt: payload.updatedAt,
  });

  try {
    await updateDoc(docRef, updateFields);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `orders/${orderNumber}`);
  }
}

export async function updateRefundWalletInFirestore(
  orderNumber: string,
  refundWallet: string,
  updatedAt: string
): Promise<void> {
  await testFirestoreConnection();
  const contactId = deriveContactId(orderNumber);
  try {
    await updateDoc(doc(db, "orderContacts", contactId), {
      refundWallet: refundWallet.trim(),
      updatedAt,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `orderContacts/${contactId}`);
  }
}

function hydrateOrderRecord(
  publicData: Record<string, unknown>,
  contactData?: Record<string, unknown> | null
): OrderRecord {
  const orderNumber = String(publicData.orderNumber || "");
  const email = contactData?.email
    ? String(contactData.email)
    : String(publicData.emailMasked || "");

  const currency = (publicData.cryptoCurrency as "BTC" | "ETH" | "SOL") || "BTC";
  const paymentStatus = (publicData.paymentStatus as OrderRecord["paymentStatus"]) || "awaiting_payment";
  const trackingNumber = String(publicData.trackingNumber || `TRK-NS-${orderNumber.replace(/\D/g, "")}`);
  const carrier = String(publicData.carrier || "FedEx Priority Overnight / UPS Next Day Air (Insured)");
  const items = Array.isArray(publicData.items) ? (publicData.items as OrderRecord["items"]) : [];

  return {
    _id: orderNumber,
    orderNumber,
    userId: null,
    email,
    customerName: contactData?.customerName ? String(contactData.customerName) : undefined,
    phone: contactData?.phone ? String(contactData.phone) : undefined,
    paymentMethod: String(publicData.paymentMethod || `CRYPTO_${currency}`),
    cryptoCurrency: currency,
    cryptoAmount: String(publicData.cryptoAmount || "0"),
    escrowAddress: String(publicData.escrowAddress || ""),
    refundWallet: contactData?.refundWallet ? String(contactData.refundWallet) : undefined,
    txHash: publicData.txHash ? String(publicData.txHash) : undefined,
    confirmations: typeof publicData.confirmations === "number" ? publicData.confirmations : undefined,
    explorerUrl: publicData.explorerUrl ? String(publicData.explorerUrl) : undefined,
    baselineTxIds: Array.isArray(publicData.baselineTxIds)
      ? (publicData.baselineTxIds as string[])
      : [],
    verifiedAt: publicData.verifiedAt ? String(publicData.verifiedAt) : undefined,
    items,
    shippingAddress: (contactData?.shippingAddress as OrderRecord["shippingAddress"]) || {
      line1: "On file",
      city: "United States",
      state: "US",
      postalCode: "00000",
      country: "US",
    },
    subtotalCents: Number(publicData.subtotalCents || 0),
    shippingCents: Number(publicData.shippingCents || 0),
    taxCents: Number(publicData.taxCents || 0),
    totalCents: Number(publicData.totalCents || 0),
    orderStatus: (publicData.orderStatus as OrderRecord["orderStatus"]) || "awaiting_payment",
    paymentStatus,
    fulfillmentStatus: (publicData.fulfillmentStatus as OrderRecord["fulfillmentStatus"]) || "not_submitted",
    onHold: false,
    guestToken: "",
    carrier,
    trackingNumber,
    estimatedDelivery: String(publicData.estimatedDelivery || "1–2 Business Days via Insured Express Courier (USA)"),
    confirmationEmailSent: Boolean(publicData.confirmationEmailSent),
    sentEmailDetails:
      paymentStatus === "paid"
        ? {
            to: email,
            subject: `Order ${orderNumber} Confirmed & Tracking Ready`,
            sentAt: String(publicData.verifiedAt || publicData.updatedAt || publicData.createdAt),
            trackingNumber,
            carrier,
            summary: `${items.length} item(s) verified on-chain (${publicData.cryptoAmount} ${currency}) under Northstar Buyer Protection.`,
          }
        : undefined,
    createdAt: String(publicData.createdAt || new Date().toISOString()),
    updatedAt: String(publicData.updatedAt || new Date().toISOString()),
  };
}

export async function getOrderFromFirestore(orderNumberOrTracking: string): Promise<OrderRecord | null> {
  await testFirestoreConnection();
  const raw = orderNumberOrTracking.trim();
  if (!raw) return null;
  const clean = raw.toUpperCase();

  let publicData: Record<string, unknown> | null = null;
  let resolvedOrderNumber = clean;

  if (/^NS-[0-9]{8}$/.test(clean)) {
    let orderSnap;
    try {
      orderSnap = await getDoc(doc(db, "orders", clean));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `orders/${clean}`);
    }
    if (!orderSnap.exists()) return null;
    publicData = orderSnap.data() as Record<string, unknown>;
    resolvedOrderNumber = String(publicData.orderNumber || clean);
  } else {
    // Support tracking codes like TRK-NS-482910-EXP or carrier tracking IDs
    const candidates = Array.from(new Set([clean, raw]));
    for (const candidate of candidates) {
      let snap;
      try {
        const q = query(
          collection(db, "orders"),
          where("trackingNumber", "==", candidate),
          limit(1)
        );
        snap = await getDocs(q);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "orders");
      }
      if (snap && !snap.empty) {
        const docSnap = snap.docs[0];
        publicData = docSnap.data() as Record<string, unknown>;
        resolvedOrderNumber = String(publicData.orderNumber || docSnap.id);
        break;
      }
    }
  }

  if (!publicData) return null;

  const contactId = deriveContactId(resolvedOrderNumber);
  let contactData: Record<string, unknown> | null = null;
  try {
    const contactSnap = await getDoc(doc(db, "orderContacts", contactId));
    if (contactSnap.exists()) {
      contactData = contactSnap.data() as Record<string, unknown>;
    }
  } catch {
    contactData = null;
  }

  return hydrateOrderRecord(publicData, contactData);
}

export async function getOrdersByEmailFromFirestore(email: string): Promise<OrderRecord[]> {
  await testFirestoreConnection();
  const emailHash = hashEmail(email);

  let snap;
  try {
    const q = query(collection(db, "orders"), where("emailHash", "==", emailHash), limit(20));
    snap = await getDocs(q);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "orders");
  }

  const results: OrderRecord[] = [];
  for (const d of snap.docs) {
    const data = d.data() as Record<string, unknown>;
    const orderNumber = String(data.orderNumber || d.id);
    const contactId = deriveContactId(orderNumber);
    let contactData: Record<string, unknown> | null = null;
    try {
      const contactSnap = await getDoc(doc(db, "orderContacts", contactId));
      if (contactSnap.exists()) {
        contactData = contactSnap.data() as Record<string, unknown>;
      }
    } catch {
      contactData = null;
    }
    results.push(hydrateOrderRecord(data, contactData));
  }

  return results;
}

export async function getClaimedTxHashesFromFirestore(excludeOrderNumber?: string): Promise<string[]> {
  await testFirestoreConnection();
  const cleanExclude = excludeOrderNumber?.trim().toUpperCase();
  try {
    const q = query(collection(db, "orders"), limit(100));
    const snap = await getDocs(q);
    const hashes: string[] = [];
    for (const d of snap.docs) {
      const data = d.data() as Record<string, unknown>;
      const num = String(data.orderNumber || d.id).toUpperCase();
      if (cleanExclude && num === cleanExclude) continue;
      if (typeof data.txHash === "string" && data.txHash.trim()) {
        hashes.push(data.txHash.trim());
      }
    }
    return hashes;
  } catch {
    return [];
  }
}

export async function getReviewsForProductFromFirestore(productId: string): Promise<VerifiedProductReview[]> {
  await testFirestoreConnection();
  try {
    const q = query(
      collection(db, "reviews"),
      where("verifiedPurchase", "==", true),
      where("productId", "==", productId),
      limit(30)
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => d.data() as VerifiedProductReview)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  } catch {
    return [];
  }
}

export async function createVerifiedReviewInFirestore(review: VerifiedProductReview): Promise<void> {
  await testFirestoreConnection();
  const payload = stripUndefined({
    reviewId: review.reviewId,
    orderNumber: review.orderNumber,
    productId: review.productId,
    productSlug: review.productSlug,
    productName: review.productName,
    reviewerName: review.reviewerName,
    reviewerLocation: review.reviewerLocation,
    rating: review.rating,
    deliveryRating: review.deliveryRating,
    comment: review.comment,
    photoUrl: review.photoUrl,
    verifiedPurchase: true,
    createdAt: review.createdAt,
  });

  try {
    await setDoc(doc(db, "reviews", review.reviewId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `reviews/${review.reviewId}`);
  }
}
