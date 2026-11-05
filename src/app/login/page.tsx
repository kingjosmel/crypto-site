"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteShell } from "@/components/SiteShell";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <SiteShell>
      <section className="account-panel">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center mb-8">
          <div>
            <p className="eyebrow">Private Client Portal</p>
            <h1>Welcome back.</h1>
            <p style={{ color: "var(--muted)", fontSize: "15px", marginTop: "12px", lineHeight: "1.6" }}>
              Access your bespoke acquisitions, cryptographically secured invoices, and private courier tracking.
            </p>
          </div>
          <div className="relative w-full aspect-16/10 rounded-xs overflow-hidden border border-[#ece8e1] shadow-xs">
            <Image
              src="/images/editorial_atelier.jpg"
              alt="Northstar Private Atelier"
              fill
              quality={95}
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <form
          className="checkout-form"
          onSubmit={async (event) => {
            event.preventDefault();
            setError("");
            const form = new FormData(event.currentTarget);
            const result = await signIn("credentials", {
              email: String(form.get("email")),
              password: String(form.get("password")),
              redirect: false,
              callbackUrl: "/account",
            });
            if (result?.error) setError("Invalid email or password");
            else router.push("/account");
          }}
        >
          <label htmlFor="login-email">
            Email
            <input id="login-email" name="email" type="email" required autoComplete="email" />
          </label>
          <label htmlFor="login-password">
            Password
            <input id="login-password" name="password" type="password" required minLength={12} autoComplete="current-password" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark text-white" type="submit" style={{ color: "#ffffff" }}>
            Sign in
          </button>
        </form>

        <div style={{ marginTop: "32px", padding: "20px 24px", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "2px", textAlign: "center" }}>
          <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 600 }}>Looking to track your purchase?</p>
          <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--muted)", lineHeight: "1.5" }}>
            Customers do not need an account to place orders or monitor shipments. All tracking is linked to your order number and email.
          </p>
          <Link href="/track" className="button button-light" style={{ display: "inline-block" }}>
            Open Guest Tracking Portal →
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
