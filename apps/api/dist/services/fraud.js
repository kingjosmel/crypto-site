import { Order, User } from "../models/index.js";
import { readFraudConfig } from "../config/env.js";
function normalizedAddress(address) { return [address.line1, address.line2 ?? "", address.city, address.state, address.postalCode, address.country].map((part) => part.trim().toLowerCase()).join("|"); }
export async function evaluateFraud(input, config = readFraudConfig()) {
    const reasons = [];
    if (input.totalCents >= config.highValueCents)
        reasons.push("high_value_order");
    const since = new Date(Date.now() - config.windowMinutes * 60_000);
    const emailCount = await Order.countDocuments({ email: input.email.toLowerCase(), createdAt: { $gte: since } }).session(input.session);
    if (emailCount >= config.emailOrderLimit - 1)
        reasons.push("email_velocity");
    if (input.sourceIp) {
        const ipCount = await Order.countDocuments({ sourceIp: input.sourceIp, createdAt: { $gte: since } }).session(input.session);
        if (ipCount >= config.ipOrderLimit - 1)
            reasons.push("ip_velocity");
    }
    if (input.userId && input.totalCents >= config.newAccountHighValueCents) {
        const user = await User.findById(input.userId).select("createdAt").session(input.session).lean();
        if (user && Date.now() - new Date(user.createdAt).getTime() <= 7 * 24 * 60 * 60_000)
            reasons.push("new_account_high_value");
    }
    if (input.billingAddress && normalizedAddress(input.billingAddress) !== normalizedAddress(input.shippingAddress))
        reasons.push("shipping_billing_mismatch");
    return { held: reasons.length > 0, reasons };
}
