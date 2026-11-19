import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyAuthToken } from "@/lib/catalogData";
import { sendTestEmail, validateEmailEnv } from "@/lib/resend";

export const dynamic = "force-dynamic";

function safeSecretMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function authorizeTestEmailCaller(
  request: NextRequest
): Promise<{ authorized: boolean; status: number; reason?: string }> {
  const configuredSecret = process.env.TEST_EMAIL_SECRET?.trim();
  const headerSecret = request.headers.get("x-test-email-secret")?.trim() || "";
  const authHeader = request.headers.get("authorization")?.trim() || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : "";

  // 1. Optional configured server secret header / Bearer
  if (configuredSecret) {
    if (headerSecret && safeSecretMatch(headerSecret, configuredSecret)) {
      return { authorized: true, status: 200 };
    }
    if (bearerToken && safeSecretMatch(bearerToken, configuredSecret)) {
      return { authorized: true, status: 200 };
    }
  }

  // 2. Bearer JWT minted by /api/auth/login (must be ADMIN)
  if (bearerToken) {
    const tokenUser = await verifyAuthToken(bearerToken);
    if (tokenUser) {
      if (tokenUser.role === "ADMIN") {
        return { authorized: true, status: 200 };
      }
      return { authorized: false, status: 403, reason: "Admin privileges required." };
    }
  }

  // 3. Authenticated NextAuth browser session (must be ADMIN)
  const session = await auth().catch(() => null);
  if (session?.user) {
    if (session.user.role === "ADMIN") {
      return { authorized: true, status: 200 };
    }
    return { authorized: false, status: 403, reason: "Admin privileges required." };
  }

  return {
    authorized: false,
    status: 401,
    reason: "Authentication required. Sign in as an administrator or supply valid admin Bearer credentials.",
  };
}

export async function POST(request: NextRequest) {
  const authResult = await authorizeTestEmailCaller(request);
  if (!authResult.authorized) {
    return NextResponse.json(
      { ok: false, error: authResult.reason || "Unauthorized" },
      { status: authResult.status }
    );
  }

  // Block attempts to override target recipient via request body or query params
  const body = await request.json().catch(() => ({} as Record<string, unknown>));
  const queryRecipient = request.nextUrl.searchParams.get("to") || request.nextUrl.searchParams.get("recipient");
  if (
    queryRecipient ||
    (body && typeof body === "object" && ("to" in body || "recipient" in body || "email" in body))
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Arbitrary recipient addresses are disabled. This endpoint sends only to the configured TEST_EMAIL.",
      },
      { status: 400 }
    );
  }

  const envCheck = validateEmailEnv({ requireTestEmail: true });
  if (!envCheck.valid) {
    console.error("[/api/test-email] Missing server configuration:", envCheck.missing);
    return NextResponse.json(
      {
        ok: false,
        deliveryState: "failed",
        error: `Email service configuration incomplete. Missing server variable(s): ${envCheck.missing.join(", ")}`,
      },
      { status: 500 }
    );
  }

  const origin = request.nextUrl.origin;
  const result = await sendTestEmail(origin);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        deliveryState: result.deliveryState,
        error: result.error?.message || "Email provider rejected the test request.",
        errorType: result.error?.name || "resend_error",
      },
      { status: result.statusCode || 502 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      deliveryState: result.deliveryState,
      messageId: result.id,
      from: result.from,
      recipient: envCheck.testEmail,
      acceptedAt: result.acceptedAt,
      note: "Resend accepted the message for dispatch. Final inbox delivery, bounce, or failure status is tracked asynchronously in Resend or via webhooks.",
    },
    { status: 200 }
  );
}
