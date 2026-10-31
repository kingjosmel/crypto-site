import { NextRequest, NextResponse } from "next/server";
import { createOrderRecord, getUserOrders, verifyAuthToken } from "@/lib/catalogData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, items, shippingAddress, billingAddress } = body;
    if (!email || !items || !shippingAddress) {
      return NextResponse.json({ error: "Missing required checkout fields" }, { status: 400 });
    }

    // Check optional auth header
    const authHeader = request.headers.get("authorization");
    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const tokenUser = await verifyAuthToken(authHeader.replace("Bearer ", ""));
      if (tokenUser) userId = tokenUser.id;
    }

    const order = createOrderRecord({ email, items, shippingAddress, billingAddress, userId });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to place order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokenUser = await verifyAuthToken(authHeader.replace("Bearer ", ""));
  if (!tokenUser) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const orders = getUserOrders(tokenUser.id);
  return NextResponse.json({ items: orders });
}
