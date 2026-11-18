import { NextRequest, NextResponse } from "next/server";
import { getGuestOrder, getOrderDetails } from "@/lib/catalogData";
import { getOrderFromFirestore } from "@/lib/firestoreStore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || undefined;

  const fsOrder = await getOrderFromFirestore(orderNumber).catch(() => null);
  const order = fsOrder || getGuestOrder(orderNumber, token) || getOrderDetails(orderNumber);
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
    cryptoCurrency: order.cryptoCurrency,
    cryptoAmount: order.cryptoAmount,
    escrowAddress: order.escrowAddress,
    refundWallet: order.refundWallet,
    txHash: order.txHash,
    confirmations: order.confirmations,
    explorerUrl: order.explorerUrl,
    carrier: order.carrier ?? "FedEx Priority Overnight / UPS Next Day Air (Insured)",
    trackingNumber: order.trackingNumber ?? `TRK-NS-${order.orderNumber.replace(/\D/g, "")}`,
    estimatedDelivery: order.estimatedDelivery ?? "1–2 Business Days via Insured Express Courier (USA)",
    confirmationEmailSent: order.confirmationEmailSent ?? false,
    sentEmailDetails: order.sentEmailDetails,
    createdAt: order.createdAt,
  });
}
