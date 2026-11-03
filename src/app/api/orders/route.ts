import { NextRequest, NextResponse } from "next/server";
import { createOrderRecord, getOrdersByEmail, getOrderDetails, getUserOrders, verifyAuthToken } from "@/lib/catalogData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, items, shippingAddress, billingAddress, customerName, phone, paymentMethod, cryptoCurrency, cryptoAmount, escrowAddress } = body;
    if (!email || !items || !Array.isArray(items) || items.length === 0 || !shippingAddress) {
      return NextResponse.json({ error: "Missing required checkout fields: email, items, and shipping address" }, { status: 400 });
    }

    // Optional auth header (customers do not need to log in)
    const authHeader = request.headers.get("authorization");
    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const tokenUser = await verifyAuthToken(authHeader.replace("Bearer ", ""));
      if (tokenUser) userId = tokenUser.id;
    }

    const order = createOrderRecord({
      email,
      customerName,
      phone,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      cryptoCurrency,
      cryptoAmount,
      escrowAddress,
      userId
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to place order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const emailParam = searchParams.get("email");
  const queryParam = searchParams.get("q") || searchParams.get("orderNumber");

  // Allow lookup by email without login
  if (emailParam) {
    const orders = getOrdersByEmail(emailParam);
    return NextResponse.json({ items: orders });
  }

  // Allow lookup by order number or tracking number without login
  if (queryParam) {
    const order = getOrderDetails(queryParam);
    return NextResponse.json({ items: order ? [order] : [] });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const tokenUser = await verifyAuthToken(authHeader.replace("Bearer ", ""));
    if (tokenUser) {
      const orders = getUserOrders(tokenUser.id);
      return NextResponse.json({ items: orders });
    }
  }

  return NextResponse.json({ error: "Please provide an email or order number to track orders" }, { status: 400 });
}
