export type PaymentObservationInput = { network: string; txRef: string; logIndex: number; asset: string; amount: string; confirmations: number; raw: unknown };
export type PaymentLike = { asset: string; network: string; depositAddress: string; expectedAmount: string; quotedUsdCents?: number; expiresAt: Date; startBlock?: string };
export type PaymentTarget = { network: string; depositAddress: string; startBlock?: string };
export interface ChainVerifier { createPaymentTarget(order: unknown, asset: string): Promise<PaymentTarget>; findPayment(payment: PaymentLike): Promise<PaymentObservationInput[]>; readonly requiredFinality: number; }
export interface PriceOracle { getUsdRate(asset: string): Promise<string>; }
export type PaymentStatus = "pending" | "partially_paid" | "paid" | "expired" | "failed" | "admin_review" | "refund_pending" | "partially_refunded" | "refunded";
