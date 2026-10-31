import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const apiUrl = process.env.API_URL ?? "http://localhost:4000";
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: { sessionToken: { name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" } } },
  providers: [CredentialsProvider({ name: "Credentials", credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } }, async authorize(credentials) { if (!credentials?.email || !credentials?.password) return null; const response = await fetch(`${apiUrl}/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: credentials.email, password: credentials.password }) }); if (!response.ok) return null; const body = await response.json() as { accessToken: string; user: { id: string; email: string; role: "CUSTOMER" | "ADMIN" } }; return { id: body.user.id, email: body.user.email, role: body.user.role, accessToken: body.accessToken }; } })],
  callbacks: { jwt({ token, user }) { if (user) { token.apiToken = user.accessToken; token.userId = user.id; token.role = user.role; } return token; }, session({ session, token }) { if (session.user) { session.user.id = token.userId ?? token.sub ?? ""; session.user.role = token.role ?? "CUSTOMER"; } session.accessToken = token.apiToken; return session; } }
};
export const auth = () => getServerSession(authOptions);
