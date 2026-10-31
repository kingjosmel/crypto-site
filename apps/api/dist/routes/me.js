import { Router } from "express";
import { z } from "zod";
import { User } from "../models/index.js";
import { requireAuth } from "../middleware/auth.js";
const addressSchema = z.object({ label: z.string().trim().max(80).optional(), line1: z.string().trim().min(1).max(120), line2: z.string().trim().max(120).optional(), city: z.string().trim().min(1).max(80), state: z.string().trim().length(2), postalCode: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/), country: z.literal("US") }).strict();
const profileSchema = z.object({ addresses: z.array(addressSchema).max(10) }).strict();
export const meRouter = Router();
meRouter.get("/", requireAuth, async (request, response) => { const user = await User.findById(request.auth.userId).select("email role emailVerifiedAt addresses").lean(); if (!user)
    return response.status(404).json({ error: "User not found" }); return response.json({ id: String(user._id), email: user.email, role: user.role, emailVerifiedAt: user.emailVerifiedAt ?? null, addresses: user.addresses }); });
meRouter.patch("/", requireAuth, async (request, response) => { const parsed = profileSchema.safeParse(request.body); if (!parsed.success)
    return response.status(400).json({ error: "Invalid profile request", issues: parsed.error.issues }); const user = await User.findByIdAndUpdate(request.auth.userId, { $set: { addresses: parsed.data.addresses } }, { returnDocument: "after", runValidators: true }).select("email role emailVerifiedAt addresses").lean(); if (!user)
    return response.status(404).json({ error: "User not found" }); return response.json({ id: String(user._id), email: user.email, role: user.role, emailVerifiedAt: user.emailVerifiedAt ?? null, addresses: user.addresses }); });
