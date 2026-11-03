import { NextRequest, NextResponse } from "next/server";
import { getOrderDetails, getGuestOrder, getUserOrder, verifyAuthToken } from "@/lib/catalogData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const authHeader = request.headers.get("authorization");
  
  if (authHeader?.startsWith("Bearer ")) {
    const tokenUser = await verifyAuthToken(authHeader.replace("Bearer ", ""));
    if (tokenUser) {
      const userOrder = getUserOrder(orderNumber, tokenUser.id);
      if (userOrder) return NextResponse.json(userOrder);
    }
  }

  // Allow guest access directly by order number
  const order = getOrderDetails(orderNumber) || getGuestOrder(orderNumber);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
