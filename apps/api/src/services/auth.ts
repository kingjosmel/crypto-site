import argon2 from "argon2";
import { createHash, randomBytes } from "node:crypto";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { User } from "../models/index.js";

export type AuthClaims = JWTPayload & { role: "CUSTOMER" | "ADMIN"; email: string };
const secret = () => { const value = process.env.JWT_SECRET; if (!value) throw new Error("JWT_SECRET is required"); return new TextEncoder().encode(value); };
export const hashPassword = (password: string) => argon2.hash(password, { type: argon2.argon2id });
export const verifyPassword = (hash: string, password: string) => argon2.verify(hash, password);
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
export const createOpaqueToken = () => randomBytes(32).toString("base64url");
export async function createAccessToken(user: { id: string; email: string; role: "CUSTOMER" | "ADMIN" }) { return new SignJWT({ email: user.email, role: user.role }).setProtectedHeader({ alg: "HS256" }).setSubject(user.id).setIssuedAt().setExpirationTime("1h").sign(secret()); }
export async function verifyAccessToken(token: string) { const result = await jwtVerify<AuthClaims>(token, secret(), { algorithms: ["HS256"] }); if (!result.payload.sub || !result.payload.email || !result.payload.role) throw new Error("Invalid token claims"); return result.payload; }
export const tokenExpiry = () => new Date(Date.now() + 60 * 60 * 1000);
export function publicUser(user: { _id: unknown; email: string; role: string; emailVerifiedAt?: Date | null }) { return { id: String(user._id), email: user.email, role: user.role, emailVerifiedAt: user.emailVerifiedAt ?? null }; }
export async function findUserByEmail(email: string) { return User.findOne({ email: email.toLowerCase() }).select("+passwordHash +emailVerificationTokenHash +passwordResetTokenHash +totpSecret"); }
