import { NextRequest, NextResponse } from "next/server";
import { getGuestOrder, getOrderDetails } from "@/lib/catalogData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || undefined;

  const order = getGuestOrder(orderNumber, token) || getOrderDetails(orderNumber);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    _id: order._id,
    orderNumber: order.orderNumber,
    email: order.email,
    customerName: order.customerName,
    items: order.items,
    shippingAddress: order.shippingAddress,
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    taxCents: order.taxCents,
    totalCents: order.totalCents,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    carrier: order.carrier ?? "Armored White-Glove Logistics",
    trackingNumber: order.trackingNumber ?? `TRK-NS-${order.orderNumber.replace(/\D/g, "")}`,
    estimatedDelivery: order.estimatedDelivery ?? "2-3 Business Days",
    confirmationEmailSent: order.confirmationEmailSent ?? true,
    sentEmailDetails: order.sentEmailDetails,
    createdAt: order.createdAt
  });
}
