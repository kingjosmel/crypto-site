import { Resend } from "resend";
import {
  buildOrderConfirmationEmailTemplate,
  buildOrderStatusEmailTemplate,
  buildTestEmailTemplate,
  type OrderConfirmationTemplateInput,
} from "./emailTemplates";

let cachedResendClient: Resend | null = null;
let cachedApiKey: string | null = null;

export interface EmailConfigValidation {
  valid: boolean;
  missing: string[];
  fromEmail: string;
  testEmail: string;
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
  tags?: { name: string; value: string }[];
}

export interface SendEmailResult {
  ok: boolean;
  /**
   * "accepted" means Resend accepted the request and assigned a message ID.
   * Actual inbox "delivered" or "bounced" events happen asynchronously via webhooks/Resend dashboard.
   */
  deliveryState: "accepted" | "failed";
  id?: string;
  from: string;
  to: string[];
  acceptedAt?: string;
  statusCode?: number;
  error?: {
    name: string;
    message: string;
  };
}

function assertServerSide(): void {
  if (typeof window !== "undefined") {
    throw new Error("Resend email service may only be invoked on the server.");
  }
}

export function validateEmailEnv(options?: { requireTestEmail?: boolean }): EmailConfigValidation {
  assertServerSide();
  const missing: string[] = [];

  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "";
  const testEmail = process.env.TEST_EMAIL?.trim() || "";

  if (!apiKey) missing.push("RESEND_API_KEY");
  if (!fromEmail) missing.push("RESEND_FROM_EMAIL");
  if (options?.requireTestEmail && !testEmail) missing.push("TEST_EMAIL");

  return {
    valid: missing.length === 0,
    missing,
    fromEmail,
    testEmail,
  };
}

export function getResendClient(): Resend {
  assertServerSide();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Server configuration error: RESEND_API_KEY environment variable is not set.");
  }

  if (!cachedResendClient || cachedApiKey !== apiKey) {
    cachedResendClient = new Resend(apiKey);
    cachedApiKey = apiKey;
  }

  return cachedResendClient;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  assertServerSide();
  const recipients = (Array.isArray(input.to) ? input.to : [input.to])
    .map((r) => r.trim())
    .filter(Boolean);

  const envCheck = validateEmailEnv();
  const fromAddress = input.from?.trim() || envCheck.fromEmail;

  if (!envCheck.valid) {
    return {
      ok: false,
      deliveryState: "failed",
      from: fromAddress,
      to: recipients,
      statusCode: 500,
      error: {
        name: "configuration_error",
        message: `Missing required server environment variable(s): ${envCheck.missing.join(", ")}`,
      },
    };
  }

  if (recipients.length === 0) {
    return {
      ok: false,
      deliveryState: "failed",
      from: fromAddress,
      to: [],
      statusCode: 400,
      error: {
        name: "validation_error",
        message: "At least one recipient email address is required.",
      },
    };
  }

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: recipients,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo || "support@shopnorthstar.store",
      tags: input.tags,
    });

    if (error) {
      const errStatus =
        typeof (error as { statusCode?: unknown }).statusCode === "number"
          ? ((error as { statusCode: number }).statusCode)
          : 422;

      console.error("[Resend API Error]", {
        name: error.name,
        message: error.message,
        statusCode: errStatus,
        from: fromAddress,
      });

      return {
        ok: false,
        deliveryState: "failed",
        from: fromAddress,
        to: recipients,
        statusCode: errStatus,
        error: {
          name: error.name || "resend_api_error",
          message: error.message || "Resend rejected the email request.",
        },
      };
    }

    return {
      ok: true,
      deliveryState: "accepted",
      id: data?.id,
      from: fromAddress,
      to: recipients,
      acceptedAt: new Date().toISOString(),
      statusCode: 200,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected Resend transport error";
    console.error("[Resend Transport Failure]", message);
    return {
      ok: false,
      deliveryState: "failed",
      from: fromAddress,
      to: recipients,
      statusCode: 502,
      error: {
        name: "transport_error",
        message,
      },
    };
  }
}

export async function sendTestEmail(baseUrl?: string): Promise<SendEmailResult> {
  const envCheck = validateEmailEnv({ requireTestEmail: true });
  if (!envCheck.valid) {
    return {
      ok: false,
      deliveryState: "failed",
      from: envCheck.fromEmail,
      to: envCheck.testEmail ? [envCheck.testEmail] : [],
      statusCode: 500,
      error: {
        name: "configuration_error",
        message: `Missing required server environment variable(s): ${envCheck.missing.join(", ")}`,
      },
    };
  }

  const template = buildTestEmailTemplate({
    sentAt: new Date().toISOString(),
    fromAddress: envCheck.fromEmail,
    recipient: envCheck.testEmail,
    baseUrl,
  });

  return sendEmail({
    to: envCheck.testEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: [{ name: "category", value: "system_test" }],
  });
}

export async function sendOrderConfirmationEmail(
  order: OrderConfirmationTemplateInput
): Promise<SendEmailResult> {
  const template = buildOrderConfirmationEmailTemplate(order);
  return sendEmail({
    to: order.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: [
      { name: "category", value: "order_confirmation" },
      { name: "order_number", value: order.orderNumber },
    ],
  });
}

export async function sendOrderStatusEmail(params: {
  to: string;
  orderNumber: string;
  eyebrow: string;
  headline: string;
  message: string;
  ctaLabel?: string;
  ctaUrl?: string;
  baseUrl?: string;
}): Promise<SendEmailResult> {
  const template = buildOrderStatusEmailTemplate(params);
  return sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: [
      { name: "category", value: "order_status" },
      { name: "order_number", value: params.orderNumber },
    ],
  });
}
