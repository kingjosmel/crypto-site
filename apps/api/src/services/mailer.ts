export type EmailTemplate = "order_received" | "payment_pending" | "payment_received" | "payment_expired" | "partial_payment" | "shipped" | "refund_update";
export type EmailPayload = Record<string, string | number | undefined>;
export type ShipmentEmail = { to: string; orderNumber: string; carrier: string; trackingNumber: string };
export interface CustomerMailer {
  sendTemplate(template: EmailTemplate, to: string, payload: EmailPayload): Promise<void>;
  sendShipmentEmail(message: ShipmentEmail): Promise<void>;
}

export interface DispatchedEmail {
  id: string;
  template: EmailTemplate;
  to: string;
  subject: string;
  text: string;
  sentAt: string;
}

export const dispatchedEmailLog: DispatchedEmail[] = [];

function render(template: EmailTemplate, payload: EmailPayload) {
  const orderNumber = String(payload.orderNumber ?? "");
  const subjects: Record<EmailTemplate, string> = {
    order_received: `Order ${orderNumber} Confirmation & Vault Dispatch`,
    payment_pending: `Payment instructions for order ${orderNumber}`,
    payment_received: `Payment confirmed for order ${orderNumber}`,
    payment_expired: `The payment window for order ${orderNumber} has expired`,
    partial_payment: `Payment update for order ${orderNumber}`,
    shipped: `Tracking Details: Order ${orderNumber} Dispatched via Armored Courier`,
    refund_update: `Refund update for order ${orderNumber}`
  };
  const lines: Record<EmailTemplate, string> = {
    order_received: `Your Northstar / Supply order ${orderNumber} has been received and confirmed. Items are currently in serialized vault inspection. Tracking: ${String(payload.trackingNumber ?? "TRK-NS-" + orderNumber)}`,
    payment_pending: `Your order ${orderNumber} is awaiting payment.`,
    payment_received: `Payment confirmed for order ${orderNumber}.`,
    payment_expired: `The payment window for order ${orderNumber} has expired.`,
    partial_payment: `We received a partial payment for order ${orderNumber}.`,
    shipped: `Order ${orderNumber} has been handed over to ${String(payload.carrier ?? "Armored White-Glove Courier")} with tracking code ${String(payload.trackingNumber ?? "")}.`,
    refund_update: `Refund ${String(payload.refundStatus ?? "updated")} for order ${orderNumber}: ${String(payload.amount ?? "")} ${String(payload.asset ?? "")}.`
  };
  return { subject: subjects[template], text: lines[template] };
}

export class DirectCustomerMailer implements CustomerMailer {
  constructor(private readonly from: string = "orders@northstar-supply.com") {}

  async sendTemplate(template: EmailTemplate, to: string, payload: EmailPayload): Promise<void> {
    const rendered = render(template, payload);
    const emailRecord: DispatchedEmail = {
      id: `mail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      template,
      to,
      subject: rendered.subject,
      text: rendered.text,
      sentAt: new Date().toISOString()
    };
    dispatchedEmailLog.unshift(emailRecord);
    if (dispatchedEmailLog.length > 200) dispatchedEmailLog.pop();
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Order Email Dispatched] To: ${to} | Subject: "${rendered.subject}"`);
    }
  }

  async sendShipmentEmail(message: ShipmentEmail): Promise<void> {
    await this.sendTemplate("shipped", message.to, message);
  }
}

let configuredMailer: CustomerMailer | undefined;
export function configureCustomerMailer(mailer: CustomerMailer) {
  configuredMailer = mailer;
}
export function getCustomerMailer(): CustomerMailer {
  if (!configuredMailer) {
    configuredMailer = new DirectCustomerMailer(process.env.MAIL_FROM ?? "orders@northstar-supply.com");
  }
  return configuredMailer;
}
