import { Resend } from "resend";

export type EmailTemplate = "order_received" | "payment_pending" | "payment_received" | "payment_expired" | "partial_payment" | "shipped" | "refund_update";
export type EmailPayload = Record<string, string | number | undefined>;
export type ShipmentEmail = { to: string; orderNumber: string; carrier: string; trackingNumber: string };
export interface CustomerMailer { sendTemplate(template: EmailTemplate, to: string, payload: EmailPayload): Promise<void>; sendShipmentEmail(message: ShipmentEmail): Promise<void> }

function render(template: EmailTemplate, payload: EmailPayload) {
  const orderNumber = String(payload.orderNumber ?? "");
  const subjects: Record<EmailTemplate, string> = { order_received: `Order ${orderNumber} received`, payment_pending: `Payment instructions for order ${orderNumber}`, payment_received: `Payment received for order ${orderNumber}`, payment_expired: `Payment expired for order ${orderNumber}`, partial_payment: `Payment update for order ${orderNumber}`, shipped: `Order ${orderNumber} has shipped`, refund_update: `Refund update for order ${orderNumber}` };
  const lines: Record<EmailTemplate, string> = {
    order_received: `We received order ${orderNumber}.`,
    payment_pending: `Your order ${orderNumber} is awaiting payment.`,
    payment_received: `We received payment for order ${orderNumber}.`,
    payment_expired: `The payment window for order ${orderNumber} has expired.`,
    partial_payment: `We received a partial payment for order ${orderNumber}.`,
    shipped: `Order ${orderNumber} shipped via ${String(payload.carrier ?? "")} with tracking ${String(payload.trackingNumber ?? "")}.`,
    refund_update: `Refund ${String(payload.refundStatus ?? "updated")} for order ${orderNumber}: ${String(payload.amount ?? "")} ${String(payload.asset ?? "")}.`
  };
  return { subject: subjects[template], text: lines[template] };
}

export class ResendCustomerMailer implements CustomerMailer {
  private readonly client: Resend;
  constructor(private readonly from: string, apiKey = process.env.RESEND_API_KEY) {
    if (!apiKey) throw new Error("RESEND_API_KEY is required");
    this.client = new Resend(apiKey);
  }
  async sendTemplate(template: EmailTemplate, to: string, payload: EmailPayload) {
    const rendered = render(template, payload);
    const result = await this.client.emails.send({ from: this.from, to, ...rendered });
    if (result.error) throw new Error(`Shipment email failed: ${result.error.message}`);
  }
  async sendShipmentEmail(message: ShipmentEmail) { await this.sendTemplate("shipped", message.to, message); }
}

let configuredMailer: CustomerMailer | undefined;
export function configureCustomerMailer(mailer: CustomerMailer) { configuredMailer = mailer; }
export function getCustomerMailer() {
  if (!configuredMailer) configuredMailer = new ResendCustomerMailer(process.env.RESEND_FROM ?? "orders@example.invalid");
  return configuredMailer;
}
