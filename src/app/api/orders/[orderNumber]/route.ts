import { NextRequest, NextResponse } from "next/server";
import { getUserOrder, verifyAuthToken } from "@/lib/catalogData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokenUser = await verifyAuthToken(authHeader.replace("Bearer ", ""));
  if (!tokenUser) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const order = getUserOrder(orderNumber, tokenUser.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
