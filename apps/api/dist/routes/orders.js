import { createHash, randomBytes } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { Counter, Order, Payment } from "../models/index.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { createQuote, QuoteError } from "../services/quote.js";
import { getPaymentService } from "../services/paymentRuntime.js";
import { checkoutSchema } from "./checkout.js";
import { evaluateFraud } from "../services/fraud.js";
import { enqueueEmail } from "../services/emailQueue.js";
export const ordersRouter = Router();
const hashToken = (token) => createHash("sha256").update(token).digest("hex");
const objectId = z.string().regex(/^[a-f\d]{24}$/i);
ordersRouter.post("/", optionalAuth, async (request, response) => {
    const parsed = checkoutSchema.safeParse(request.body);
    if (!parsed.success)
        return response.status(400).json({ error: "Invalid order request", issues: parsed.error.issues });
    const session = await Order.startSession();
    try {
        let result;
        let notificationEmail = parsed.data.email;
        await session.withTransaction(async () => {
            const quote = await createQuote(parsed.data.items, parsed.data.shippingAddress, undefined, session);
            const counter = await Counter.findOneAndUpdate({ _id: "orders" }, { $inc: { value: 1 } }, { returnDocument: "after", upsert: true, session });
            const orderNumber = `NS-${String(counter.value).padStart(8, "0")}`;
            const accessToken = randomBytes(32).toString("base64url");
            const fraud = await evaluateFraud({ email: parsed.data.email, sourceIp: request.ip, userId: request.auth?.userId, totalCents: quote.totalCents, shippingAddress: parsed.data.shippingAddress, billingAddress: parsed.data.billingAddress, session });
            const order = await Order.create([{
                    orderNumber, userId: request.auth?.userId ?? null, email: parsed.data.email, items: quote.items,
                    shippingAddress: parsed.data.shippingAddress, billingAddress: parsed.data.billingAddress, subtotalCents: quote.subtotalCents, shippingCents: quote.shippingCents, taxCents: quote.taxCents, totalCents: quote.totalCents,
                    orderStatus: "pending", paymentStatus: "unpaid", fulfillmentStatus: "not_submitted", onHold: fraud.held, fraudStatus: fraud.held ? "held" : "clear", fraudReasons: fraud.reasons, sourceIp: request.ip, guestTokenHash: hashToken(accessToken)
                }], { session });
            notificationEmail = order[0].email;
            result = { orderNumber: order[0].orderNumber, accessToken };
        });
        await enqueueEmail("order_received", notificationEmail, { orderNumber: result.orderNumber }, `order-received:${result.orderNumber}`);
        return response.status(201).json(result);
    }
    catch (error) {
        if (error instanceof QuoteError)
            return response.status(error.status).json({ error: error.message });
        throw error;
    }
    finally {
        await session.endSession();
    }
});
const publicOrderFields = "_id orderNumber email items shippingAddress subtotalCents shippingCents taxCents totalCents orderStatus paymentStatus fulfillmentStatus onHold holdReason createdAt updatedAt";
ordersRouter.get("/guest/:orderNumber", async (request, response) => { const parsed = z.object({ orderNumber: z.string().regex(/^NS-\d{8}$/), token: z.string().min(20).max(200) }).safeParse({ orderNumber: request.params.orderNumber, token: request.query.token }); if (!parsed.success)
    return response.status(400).json({ error: "Invalid guest tracking request" }); const order = await Order.findOne({ orderNumber: parsed.data.orderNumber, guestTokenHash: hashToken(parsed.data.token) }).select(publicOrderFields).lean(); if (!order)
    return response.status(404).json({ error: "Order not found" }); return response.json(order); });
ordersRouter.get("/", requireAuth, async (request, response) => { const orders = await Order.find({ userId: request.auth.userId }).select(publicOrderFields).sort({ createdAt: -1 }).lean(); return response.json({ items: orders }); });
ordersRouter.get("/:orderNumber", requireAuth, async (request, response) => { const parsed = z.string().regex(/^NS-\d{8}$/).safeParse(request.params.orderNumber); if (!parsed.success)
    return response.status(400).json({ error: "Invalid order number" }); const order = await Order.findOne({ orderNumber: parsed.data, userId: request.auth.userId }).select(publicOrderFields).lean(); if (!order)
    return response.status(404).json({ error: "Order not found" }); return response.json(order); });
ordersRouter.post("/:id/payment", requireAuth, async (request, response) => { const id = objectId.safeParse(request.params.id); const parsed = z.object({ asset: z.string().trim().min(1).max(20).regex(/^[A-Za-z0-9_-]+$/) }).strict().safeParse(request.body); if (!id.success || !parsed.success)
    return response.status(400).json({ error: "Invalid payment request" }); const order = await Order.findOne({ _id: id.data, userId: request.auth.userId }).select("_id").lean(); if (!order)
    return response.status(404).json({ error: "Order not found" }); try {
    return response.status(201).json(await getPaymentService().createPayment(String(order._id), parsed.data.asset));
}
catch (error) {
    if (error instanceof Error && "status" in error)
        return response.status(Number(error.status)).json({ error: error.message });
    throw error;
} });
ordersRouter.get("/:id/payment-status", requireAuth, async (request, response) => { const id = objectId.safeParse(request.params.id); if (!id.success)
    return response.status(400).json({ error: "Invalid order id" }); const order = await Order.findOne({ _id: id.data, userId: request.auth.userId }).select("_id").lean(); if (!order)
    return response.status(404).json({ error: "Order not found" }); const payment = await Payment.findOne({ orderId: order._id }).select("asset network depositAddress expectedAmount quotedUsdCents rateUsed rateAt expiresAt receivedAmount status confirmations reviewReason").sort({ createdAt: -1 }).lean(); if (!payment)
    return response.status(404).json({ error: "Payment not found" }); return response.json(payment); });
