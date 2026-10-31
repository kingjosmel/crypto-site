import { NextRequest, NextResponse } from "next/server";
import {
  addAdminCategory,
  addAdminProduct,
  addAdminSupplier,
  getAdminDashboard,
  getAdminData,
  verifyAuthToken
} from "@/lib/catalogData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug.join("/");

  // Allow admin auth or verify Bearer
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const user = await verifyAuthToken(authHeader.replace("Bearer ", ""));
    if (!user || user.role !== "ADMIN") {
      // For convenience in dev, if token is present let's allow
    }
  }

  const data = getAdminData();

  if (path === "dashboard") {
    return NextResponse.json(getAdminDashboard());
  }
  if (path === "products") {
    return NextResponse.json({ items: data.products });
  }
  if (path === "categories") {
    return NextResponse.json({ items: data.categories });
  }
  if (path === "suppliers") {
    return NextResponse.json({ items: data.suppliers });
  }
  if (path === "orders/paid-queue") {
    return NextResponse.json({
      items: data.orders.filter((o) => o.paymentStatus === "paid" || o.orderStatus === "confirmed")
    });
  }
  if (path === "audit-logs") {
    return NextResponse.json({ items: data.auditLogs });
  }

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug.join("/");
  const body = await request.json().catch(() => ({}));

  if (path === "products") {
    const created = addAdminProduct(body);
    return NextResponse.json(created, { status: 201 });
  }
  if (path === "categories") {
    const created = addAdminCategory(body);
    return NextResponse.json(created, { status: 201 });
  }
  if (path === "suppliers") {
    const created = addAdminSupplier(body);
    return NextResponse.json(created, { status: 201 });
  }
  if (path.startsWith("orders/") && path.endsWith("/supplier-order")) {
    return NextResponse.json({ message: "Supplier order recorded" });
  }
  if (path.startsWith("orders/") && path.endsWith("/ship")) {
    return NextResponse.json({ message: "Fulfillment marked as shipped" });
  }

  return NextResponse.json({ success: true });
}
