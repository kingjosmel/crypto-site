import type { AuthClaims } from "../services/auth.js";
declare module "express-serve-static-core" { interface Request { auth?: { userId: string; email: string; role: AuthClaims["role"] }; } }