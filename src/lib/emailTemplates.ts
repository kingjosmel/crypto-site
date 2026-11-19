export interface EmailTemplateOutput {
  subject: string;
  html: string;
  text: string;
}

export interface OrderEmailItem {
  name: string;
  sku: string;
  qty: number;
  lineTotalCents: number;
}

export interface OrderConfirmationTemplateInput {
  orderNumber: string;
  customerName?: string;
  email: string;
  totalCents: number;
  subtotalCents: number;
  taxCents: number;
  cryptoCurrency?: string;
  cryptoAmount?: string;
  txHash?: string;
  explorerUrl?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  items: OrderEmailItem[];
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  baseUrl?: string;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((cents || 0) / 100);
}

function wrapLuxuryEmailLayout(params: {
  preheader: string;
  eyebrow: string;
  title: string;
  bodyHtml: string;
  baseUrl: string;
}): string {
  const cleanBase = params.baseUrl.replace(/\/+$/, "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(params.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f4f0;color:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${escapeHtml(params.preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f4f0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border:1px solid #dcdcdc;">
          <!-- Header -->
          <tr>
            <td style="background-color:#0f0f0f;padding:28px 32px;text-align:center;border-bottom:1px solid #262626;">
              <a href="${escapeHtml(cleanBase)}" style="color:#ffffff;text-decoration:none;font-family:Georgia,'Times New Roman',serif;font-size:24px;letter-spacing:0.22em;text-transform:uppercase;font-weight:400;">
                NORTHSTAR
              </a>
              <div style="margin-top:6px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#a3702b;font-weight:700;">
                Northstar Supply LLC · Authenticated Luxury
              </div>
            </td>
          </tr>

          <!-- Title Band -->
          <tr>
            <td style="padding:32px 32px 20px 32px;border-bottom:1px solid #eceae4;">
              <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#a3702b;margin-bottom:8px;">
                ${escapeHtml(params.eyebrow)}
              </div>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;font-weight:400;color:#0f0f0f;">
                ${escapeHtml(params.title)}
              </h1>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding:28px 32px 32px 32px;font-size:14px;line-height:1.65;color:#2b2b2b;">
              ${params.bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;padding:24px 32px;border-top:1px solid #dcdcdc;font-size:11px;line-height:1.6;color:#666666;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <strong style="color:#0f0f0f;text-transform:uppercase;letter-spacing:0.12em;font-size:10px;">Northstar Supply LLC</strong><br />
                    548 Market St, Ste 41200, San Francisco, CA 94104<br />
                    Client Services: <a href="mailto:support@shopnorthstar.store" style="color:#0f0f0f;text-decoration:underline;">support@shopnorthstar.store</a> · Mon–Sat, 9:00 AM – 7:00 PM EST
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px;">
                    <a href="${escapeHtml(cleanBase)}/track" style="color:#047857;text-decoration:none;font-weight:600;margin-right:16px;">Track Order</a>
                    <a href="${escapeHtml(cleanBase)}/verify" style="color:#0f0f0f;text-decoration:none;font-weight:600;margin-right:16px;">Verification Registry</a>
                    <a href="${escapeHtml(cleanBase)}/buyer-protection" style="color:#0f0f0f;text-decoration:none;font-weight:600;">Buyer Protection</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildTestEmailTemplate(params: {
  sentAt: string;
  fromAddress: string;
  recipient: string;
  baseUrl?: string;
}): EmailTemplateOutput {
  const baseUrl = params.baseUrl || "https://shopnorthstar.store";
  const subject = "Northstar · Transactional Email Configuration Verified";

  const bodyHtml = `
    <p style="margin:0 0 16px 0;">
      This verification message confirms that Northstar's server-side Resend transactional email service is configured and operational.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafafa;border:1px solid #dcdcdc;margin:20px 0;">
      <tr>
        <td style="padding:16px 20px;font-size:12px;line-height:1.7;">
          <div style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#047857;margin-bottom:6px;">
            Dispatch Telemetry
          </div>
          <div><strong>Sender:</strong> <span style="font-family:monospace;">${escapeHtml(params.fromAddress)}</span></div>
          <div><strong>Test Recipient:</strong> <span style="font-family:monospace;">${escapeHtml(params.recipient)}</span></div>
          <div><strong>Timestamp (UTC):</strong> <span style="font-family:monospace;">${escapeHtml(params.sentAt)}</span></div>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 24px 0;color:#555555;font-size:13px;">
      This endpoint sends strictly to the server-configured test recipient and enforces administrative authorization.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background-color:#0f0f0f;padding:13px 24px;">
          <a href="${escapeHtml(baseUrl)}/verify" style="color:#ffffff;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;display:inline-block;">
            Open Northstar Storefront →
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = wrapLuxuryEmailLayout({
    preheader: "Northstar Resend transactional email test confirmation.",
    eyebrow: "System Verification",
    title: "Transactional Email Ready",
    bodyHtml,
    baseUrl,
  });

  const text = [
    "NORTHSTAR SUPPLY LLC — TRANSACTIONAL EMAIL VERIFICATION",
    "",
    "This verification message confirms that Northstar's server-side Resend email integration is active.",
    `Sender: ${params.fromAddress}`,
    `Test Recipient: ${params.recipient}`,
    `Timestamp: ${params.sentAt}`,
    "",
    `Storefront: ${baseUrl}`,
  ].join("\n");

  return { subject, html, text };
}

export function buildOrderConfirmationEmailTemplate(
  order: OrderConfirmationTemplateInput
): EmailTemplateOutput {
  const baseUrl = order.baseUrl || "https://shopnorthstar.store";
  const trackUrl = `${baseUrl.replace(/\/+$/, "")}/track?order=${encodeURIComponent(order.orderNumber)}`;
  const buyerProtectionUrl = `${baseUrl.replace(/\/+$/, "")}/buyer-protection`;
  const trackingCode = order.trackingNumber || `TRK-${order.orderNumber}`;
  const subject = `Order ${order.orderNumber} Confirmed · Tracking ${trackingCode} · Northstar Supply`;

  const itemsRowsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eceae4;">
          <div style="font-weight:600;color:#0f0f0f;font-size:13px;">${escapeHtml(item.name)}</div>
          <div style="font-size:11px;color:#666666;font-family:monospace;margin-top:2px;">SKU: ${escapeHtml(item.sku)} · Qty ${escapeHtml(item.qty)}</div>
        </td>
        <td align="right" style="padding:12px 0;border-bottom:1px solid #eceae4;font-family:monospace;font-weight:600;color:#0f0f0f;font-size:13px;white-space:nowrap;">
          ${escapeHtml(formatUsd(item.lineTotalCents))}
        </td>
      </tr>`
    )
    .join("");

  const txBlockHtml = order.txHash
    ? `<div style="margin-top:6px;">
         <strong>Transaction Hash:</strong><br />
         <span style="font-family:monospace;font-size:11px;word-break:break-all;color:#333333;">${escapeHtml(order.txHash)}</span>
         ${
           order.explorerUrl
             ? ` · <a href="${escapeHtml(order.explorerUrl)}" style="color:#047857;text-decoration:underline;">View Explorer ↗</a>`
             : ""
         }
       </div>`
    : "";

  const bodyHtml = `
    <p style="margin:0 0 16px 0;">
      ${order.customerName ? `Dear ${escapeHtml(order.customerName)},` : "Thank you for your order."}
    </p>
    <p style="margin:0 0 20px 0;">
      Your payment for order <strong style="font-family:monospace;">${escapeHtml(order.orderNumber)}</strong> has been verified. Our specialists are completing pre-dispatch quality inspection and boutique packaging verification prior to insured courier handover.
    </p>

    <!-- Prominent Tracking Code Banner -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f0f0f;color:#ffffff;margin-bottom:20px;">
      <tr>
        <td style="padding:18px 20px;">
          <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#a3702b;margin-bottom:6px;">
            Your Tracking Code
          </div>
          <div style="font-family:monospace;font-size:18px;font-weight:700;letter-spacing:0.08em;color:#ffffff;">
            ${escapeHtml(trackingCode)}
          </div>
          <div style="margin-top:6px;font-size:11px;color:#cccccc;">
            Use this code or your order number (<span style="font-family:monospace;color:#ffffff;">${escapeHtml(order.orderNumber)}</span>) anytime on our tracking portal.
          </div>
        </td>
      </tr>
    </table>

    <!-- Order Coordinates Box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafafa;border:1px solid #dcdcdc;margin-bottom:24px;">
      <tr>
        <td style="padding:18px 20px;font-size:12px;line-height:1.7;">
          <div style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#047857;margin-bottom:8px;">
            ✓ Settlement &amp; Fulfillment Summary
          </div>
          <div><strong>Order Number:</strong> <span style="font-family:monospace;">${escapeHtml(order.orderNumber)}</span></div>
          <div><strong>Tracking Code:</strong> <span style="font-family:monospace;font-weight:700;color:#0f0f0f;">${escapeHtml(trackingCode)}</span></div>
          <div><strong>Carrier Service:</strong> ${escapeHtml(order.carrier || "FedEx Priority Overnight / UPS Next Day Air (Insured)")}</div>
          <div><strong>Estimated Window:</strong> ${escapeHtml(order.estimatedDelivery || "1–2 Business Days via Insured Express Courier (USA)")}</div>
          ${
            order.cryptoAmount && order.cryptoCurrency
              ? `<div><strong>Crypto Settlement:</strong> <span style="font-family:monospace;">${escapeHtml(order.cryptoAmount)} ${escapeHtml(order.cryptoCurrency)}</span></div>`
              : ""
          }
          ${txBlockHtml}
        </td>
      </tr>
    </table>

    <!-- Items Table -->
    <div style="font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#0f0f0f;border-bottom:1px solid #0f0f0f;padding-bottom:8px;">
      Order Items (${order.items.length})
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
      ${itemsRowsHtml}
      <tr>
        <td style="padding:10px 0 4px 0;font-size:12px;color:#666666;">Insured Express Shipping</td>
        <td align="right" style="padding:10px 0 4px 0;font-size:12px;color:#047857;font-weight:700;">COMPLIMENTARY</td>
      </tr>
      <tr>
        <td style="padding:4px 0 10px 0;font-size:12px;color:#666666;">Estimated Tax</td>
        <td align="right" style="padding:4px 0 10px 0;font-size:12px;font-family:monospace;color:#0f0f0f;">${escapeHtml(formatUsd(order.taxCents))}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0 0;border-top:1px solid #dcdcdc;font-size:14px;font-weight:700;color:#0f0f0f;">Total Paid</td>
        <td align="right" style="padding:12px 0 0 0;border-top:1px solid #dcdcdc;font-size:16px;font-family:monospace;font-weight:700;color:#0f0f0f;">${escapeHtml(formatUsd(order.totalCents))}</td>
      </tr>
    </table>

    <!-- Shipping Address -->
    <div style="background-color:#fafafa;border:1px solid #e5e5e5;padding:14px 18px;font-size:12px;line-height:1.6;margin:20px 0 24px 0;">
      <strong style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#666666;display:block;margin-bottom:4px;">
        Signature-Required Delivery Address
      </strong>
      ${escapeHtml(order.shippingAddress.line1)}<br />
      ${order.shippingAddress.line2 ? `${escapeHtml(order.shippingAddress.line2)}<br />` : ""}
      ${escapeHtml(order.shippingAddress.city)}, ${escapeHtml(order.shippingAddress.state)} ${escapeHtml(order.shippingAddress.postalCode)}<br />
      ${escapeHtml(order.shippingAddress.country)}
    </div>

    <!-- CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;">
      <tr>
        <td style="background-color:#0f0f0f;padding:14px 26px;">
          <a href="${escapeHtml(trackUrl)}" style="color:#ffffff;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;display:inline-block;">
            Track Your Order →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:12px;color:#555555;">
      Protected by our 14-day return &amp; lifetime authenticity policy. Review coverage anytime at <a href="${escapeHtml(buyerProtectionUrl)}" style="color:#0f0f0f;text-decoration:underline;">Northstar Buyer Protection</a>.
    </p>
  `;

  const html = wrapLuxuryEmailLayout({
    preheader: `Order ${order.orderNumber} payment confirmed. Track fulfillment and courier milestones.`,
    eyebrow: "Order Confirmed · Insured Dispatch",
    title: `Thank You for Your Order (${order.orderNumber})`,
    bodyHtml,
    baseUrl,
  });

  const text = [
    `NORTHSTAR SUPPLY LLC — ORDER CONFIRMATION (${order.orderNumber})`,
    "",
    `Total Paid: ${formatUsd(order.totalCents)}`,
    order.cryptoAmount && order.cryptoCurrency
      ? `Crypto Settlement: ${order.cryptoAmount} ${order.cryptoCurrency}`
      : "",
    order.txHash ? `Transaction Hash: ${order.txHash}` : "",
    `Tracking Number: ${order.trackingNumber || "Assigned upon courier pickup"}`,
    "",
    "Items:",
    ...order.items.map((i) => `- ${i.name} (SKU: ${i.sku}) x${i.qty} — ${formatUsd(i.lineTotalCents)}`),
    "",
    `Track your order: ${trackUrl}`,
    `Buyer Protection: ${buyerProtectionUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

export function buildOrderStatusEmailTemplate(params: {
  orderNumber: string;
  eyebrow: string;
  headline: string;
  message: string;
  ctaLabel?: string;
  ctaUrl?: string;
  baseUrl?: string;
}): EmailTemplateOutput {
  const baseUrl = params.baseUrl || "https://shopnorthstar.store";
  const targetUrl = params.ctaUrl || `${baseUrl.replace(/\/+$/, "")}/track?order=${encodeURIComponent(params.orderNumber)}`;
  const subject = `${params.headline} · Order ${params.orderNumber}`;

  const bodyHtml = `
    <p style="margin:0 0 18px 0;">
      Order <strong style="font-family:monospace;">${escapeHtml(params.orderNumber)}</strong> update:
    </p>
    <p style="margin:0 0 24px 0;">
      ${escapeHtml(params.message)}
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background-color:#0f0f0f;padding:13px 24px;">
          <a href="${escapeHtml(targetUrl)}" style="color:#ffffff;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;display:inline-block;">
            ${escapeHtml(params.ctaLabel || "View Order Status →")}
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = wrapLuxuryEmailLayout({
    preheader: params.message,
    eyebrow: params.eyebrow,
    title: params.headline,
    bodyHtml,
    baseUrl,
  });

  const text = [
    `NORTHSTAR SUPPLY LLC — ORDER ${params.orderNumber}`,
    params.headline,
    "",
    params.message,
    "",
    `View details: ${targetUrl}`,
  ].join("\n");

  return { subject, html, text };
}
