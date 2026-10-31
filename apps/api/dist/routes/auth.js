import { Router } from "express";
import { z } from "zod";
import { User } from "../models/index.js";
import { createAccessToken, createOpaqueToken, findUserByEmail, hashPassword, hashToken, publicUser, tokenExpiry, verifyPassword } from "../services/auth.js";
const credentials = z.object({ email: z.string().trim().email().max(254), password: z.string().min(12).max(200) }).strict();
const emailOnly = z.object({ email: z.string().trim().email().max(254) }).strict();
const resetSchema = z.object({ token: z.string().min(20).max(200), password: z.string().min(12).max(200) }).strict();
const attempts = new Map();
function rateLimited(key) { const now = Date.now(); const entry = attempts.get(key); if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
} entry.count += 1; return entry.count > 10; }
const genericLoginError = () => ({ error: "Invalid email or password" });
export const authRouter = Router();
authRouter.post("/register", async (request, response) => { const parsed = credentials.safeParse(request.body); if (!parsed.success)
    return response.status(400).json({ error: "Invalid registration request" }); const email = parsed.data.email.toLowerCase(); const existing = await User.exists({ email }); if (existing)
    return response.status(400).json({ error: "Unable to create account" }); const token = createOpaqueToken(); await User.create({ email, passwordHash: await hashPassword(parsed.data.password), role: "CUSTOMER", emailVerificationTokenHash: hashToken(token), emailVerificationExpiresAt: tokenExpiry() }); return response.status(201).json({ message: "If the address can receive email, verification instructions have been sent." }); });
authRouter.post("/login", async (request, response) => { const parsed = credentials.safeParse(request.body); const key = request.ip ?? "unknown"; if (rateLimited(key))
    return response.status(429).json({ error: "Too many authentication attempts" }); if (!parsed.success)
    return response.status(401).json(genericLoginError()); const user = await findUserByEmail(parsed.data.email); const valid = user ? await verifyPassword(user.passwordHash, parsed.data.password).catch(() => false) : false; if (!user || !valid)
    return response.status(401).json(genericLoginError()); const accessToken = await createAccessToken({ id: String(user._id), email: user.email, role: user.role }); return response.json({ accessToken, user: publicUser(user) }); });
authRouter.post("/verify-email", async (request, response) => { const parsed = z.object({ token: z.string().min(20).max(200) }).strict().safeParse(request.body); if (!parsed.success)
    return response.status(400).json({ error: "Invalid verification token" }); const user = await User.findOne({ emailVerificationTokenHash: hashToken(parsed.data.token), emailVerificationExpiresAt: { $gt: new Date() } }).select("+emailVerificationTokenHash"); if (!user)
    return response.status(400).json({ error: "Invalid or expired verification token" }); user.emailVerifiedAt = new Date(); user.emailVerificationTokenHash = undefined; user.emailVerificationExpiresAt = undefined; await user.save(); return response.json({ message: "Email verified" }); });
authRouter.post("/request-password-reset", async (request, response) => { const parsed = emailOnly.safeParse(request.body); if (!parsed.success)
    return response.status(400).json({ error: "Invalid request" }); const user = await findUserByEmail(parsed.data.email); if (user) {
    const token = createOpaqueToken();
    user.passwordResetTokenHash = hashToken(token);
    user.passwordResetExpiresAt = tokenExpiry();
    await user.save();
} return response.json({ message: "If the address exists, reset instructions have been sent." }); });
authRouter.post("/reset-password", async (request, response) => { const parsed = resetSchema.safeParse(request.body); if (!parsed.success)
    return response.status(400).json({ error: "Invalid reset request" }); const user = await User.findOne({ passwordResetTokenHash: hashToken(parsed.data.token), passwordResetExpiresAt: { $gt: new Date() } }).select("+passwordResetTokenHash"); if (!user)
    return response.status(400).json({ error: "Invalid or expired reset token" }); user.passwordHash = await hashPassword(parsed.data.password); user.passwordResetTokenHash = undefined; user.passwordResetExpiresAt = undefined; await user.save(); return response.json({ message: "Password updated" }); });
