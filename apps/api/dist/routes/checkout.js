import { Router } from "express";
import { z } from "zod";
import { createQuote, QuoteError } from "../services/quote.js";
const objectId = z.string().regex(/^[a-f\d]{24}$/i);
export const addressSchema = z.object({
    line1: z.string().trim().min(1).max(120),
    line2: z.string().trim().max(120).optional(),
    city: z.string().trim().min(1).max(80),
    state: z.string().trim().length(2).transform((value) => value.toUpperCase()),
    postalCode: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/),
    country: z.literal("US")
}).strict();
export const checkoutSchema = z.object({
    email: z.string().trim().email().max(254),
    items: z.array(z.object({ productId: objectId, qty: z.number().int().min(1).max(10), priceCents: z.number().int().nonnegative().optional() }).strict()).min(1).max(50),
    shippingAddress: addressSchema,
    billingAddress: addressSchema.optional()
}).strict().superRefine((value, context) => {
    const ids = value.items.map((item) => item.productId);
    if (new Set(ids).size !== ids.length)
        context.addIssue({ code: "custom", path: ["items"], message: "Duplicate products are not allowed" });
});
export const checkoutRouter = Router();
checkoutRouter.post("/quote", async (request, response) => {
    const parsed = checkoutSchema.safeParse(request.body);
    if (!parsed.success)
        return response.status(400).json({ error: "Invalid checkout request", issues: parsed.error.issues });
    try {
        const { items, shippingAddress } = parsed.data;
        return response.json(await createQuote(items, shippingAddress));
    }
    catch (error) {
        if (error instanceof QuoteError)
            return response.status(error.status).json({ error: error.message });
        throw error;
    }
});
