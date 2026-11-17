import { NextRequest, NextResponse } from "next/server";
import {
  getClaimedTxHashes,
  getGuestOrder,
  getOrderDetails,
  updateOrderPaymentVerification,
} from "@/lib/catalogData";
import {
  getExplorerTxUrl,
  verifyOnChainPayment,
  type SupportedChain,
} from "@/lib/blockchainVerifier";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const order = getOrderDetails(orderNumber) || getGuestOrder(orderNumber);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const chain: SupportedChain = order.cryptoCurrency || "BTC";

  if (order.paymentStatus === "paid") {
    return NextResponse.json({
      verified: true,
      status: "paid",
      txHash: order.txHash,
      confirmations: order.confirmations ?? 1,
      explorerUrl: order.explorerUrl || (order.txHash ? getExplorerTxUrl(chain, order.txHash) : undefined),
      message: "Payment verified on-chain.",
      checkedAt: new Date().toISOString(),
      order,
    });
  }

  const { searchParams } = new URL(request.url);
  const manualTxHash = searchParams.get("txHash") || undefined;

  const address =
    order.escrowAddress ||
    (chain === "BTC"
      ? "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu"
      : chain === "ETH"
      ? "0x120D139dB706614f71e470A97852679F6FaebcB7"
      : "X2ro74HaRbZ2XKDJ57yMmsKFD3CS4y9XFKtzSeQkCQ1");

  const verification = await verifyOnChainPayment({
    chain,
    address,
    expectedAmountStr: order.cryptoAmount || "0",
    createdAtIso: order.createdAt,
    baselineTxIds: order.baselineTxIds || [],
    claimedTxIds: getClaimedTxHashes(order.orderNumber),
    manualTxHash,
  });

  if (verification.status === "paid") {
    const updated = updateOrderPaymentVerification(order.orderNumber, {
      status: "paid",
      txHash: verification.txHash,
      confirmations: verification.confirmations,
      explorerUrl: verification.explorerUrl,
    });
    return NextResponse.json({
      ...verification,
      order: updated || order,
    });
  }

  if (verification.status === "confirming") {
    const updated = updateOrderPaymentVerification(order.orderNumber, {
      status: "confirming",
      txHash: verification.txHash,
      confirmations: verification.confirmations,
      explorerUrl: verification.explorerUrl,
    });
    return NextResponse.json({
      ...verification,
      order: updated || order,
    });
  }

  return NextResponse.json({
    ...verification,
    order,
  });
}
