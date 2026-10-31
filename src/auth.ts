import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByCredentials, createToken } from "@/lib/catalogData";

const apiUrl = process.env.API_URL ?? "http://127.0.0.1:3000";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "abcdefgh12345678",
  session: { strategy: "jwt" },
  useSecureCookies: false,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
          });
          if (response.ok) {
            const body = (await response.json()) as {
              accessToken: string;
              user: { id: string; email: string; role: "CUSTOMER" | "ADMIN" };
            };
            return {
              id: body.user.id,
              email: body.user.email,
              role: body.user.role,
              accessToken: body.accessToken
            };
          }
        } catch {
          // Fallback to internal lookup
        }

        const user = findUserByCredentials(credentials.email, credentials.password);
        if (user) {
          const accessToken = await createToken({ id: user.id, email: user.email, role: user.role });
          return { id: user.id, email: user.email, role: user.role, accessToken };
        }
        return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.apiToken = (user as unknown as { accessToken: string }).accessToken;
        token.userId = user.id;
        token.role = (user as unknown as { role: "CUSTOMER" | "ADMIN" }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) ?? token.sub ?? "";
        session.user.role = (token.role as "CUSTOMER" | "ADMIN") ?? "CUSTOMER";
      }
      session.accessToken = token.apiToken as string;
      return session;
    }
  }
};

export const auth = () => getServerSession(authOptions);
