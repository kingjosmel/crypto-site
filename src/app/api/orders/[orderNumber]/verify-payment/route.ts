import { NextRequest, NextResponse } from "next/server";
import {
  getClaimedTxHashes,
  getGuestOrder,
  getOrderDetails,
  updateOrderPaymentVerification,
} from "@/lib/catalogData";
import {
  getClaimedTxHashesFromFirestore,
  getOrderFromFirestore,
  updateOrderVerificationInFirestore,
} from "@/lib/firestoreStore";
import {
  getExplorerTxUrl,
  verifyOnChainPayment,
  type SupportedChain,
} from "@/lib/blockchainVerifier";
import { sendOrderConfirmationEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const fsOrder = await getOrderFromFirestore(orderNumber).catch(() => null);
  const localOrder = getOrderDetails(orderNumber) || getGuestOrder(orderNumber);
  const order = fsOrder || localOrder;

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

  const [fsClaimed] = await Promise.all([
    getClaimedTxHashesFromFirestore(order.orderNumber).catch(() => []),
  ]);
  const claimedSet = Array.from(new Set([...getClaimedTxHashes(order.orderNumber), ...fsClaimed]));

  const verification = await verifyOnChainPayment({
    chain,
    address,
    expectedAmountStr: order.cryptoAmount || "0",
    createdAtIso: order.createdAt,
    baselineTxIds: order.baselineTxIds || [],
    claimedTxIds: claimedSet,
    manualTxHash,
  });

  if (verification.status === "paid") {
    const nowIso = new Date().toISOString();
    const updatedLocal = updateOrderPaymentVerification(order.orderNumber, {
      status: "paid",
      txHash: verification.txHash,
      confirmations: verification.confirmations,
      explorerUrl: verification.explorerUrl,
    });

    if (fsOrder) {
      await updateOrderVerificationInFirestore(order.orderNumber, {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        fulfillmentStatus: "processing",
        txHash: verification.txHash,
        confirmations: verification.confirmations,
        explorerUrl: verification.explorerUrl,
        confirmationEmailSent: true,
        verifiedAt: nowIso,
        updatedAt: nowIso,
      }).catch((err) => console.error("Failed persisting paid status to Firestore:", err));
    }

    const hydratedPaid = updatedLocal || {
      ...order,
      paymentStatus: "paid" as const,
      orderStatus: "confirmed" as const,
      fulfillmentStatus: "processing" as const,
      txHash: verification.txHash,
      confirmations: verification.confirmations,
      explorerUrl: verification.explorerUrl,
      confirmationEmailSent: true,
      verifiedAt: nowIso,
      updatedAt: nowIso,
    };

    if (!order.confirmationEmailSent && hydratedPaid.email) {
      await sendOrderConfirmationEmail({
        orderNumber: hydratedPaid.orderNumber,
        customerName: hydratedPaid.customerName,
        email: hydratedPaid.email,
        totalCents: hydratedPaid.totalCents,
        subtotalCents: hydratedPaid.subtotalCents,
        taxCents: hydratedPaid.taxCents,
        cryptoCurrency: hydratedPaid.cryptoCurrency,
        cryptoAmount: hydratedPaid.cryptoAmount,
        txHash: hydratedPaid.txHash,
        explorerUrl: hydratedPaid.explorerUrl,
        trackingNumber:
          hydratedPaid.trackingNumber || `TRK-NS-${hydratedPaid.orderNumber.replace(/\D/g, "")}`,
        carrier: hydratedPaid.carrier,
        estimatedDelivery: hydratedPaid.estimatedDelivery,
        items: hydratedPaid.items.map((item) => ({
          name: item.name,
          sku: item.sku,
          qty: item.qty,
          lineTotalCents: item.lineTotalCents,
        })),
        shippingAddress: hydratedPaid.shippingAddress,
        baseUrl: request.nextUrl.origin,
      })
        .then((emailResult) => {
          if (!emailResult.ok) {
            console.error(
              `[verify-payment] Order confirmation email rejected for ${hydratedPaid.orderNumber}:`,
              emailResult.error?.message
            );
          }
        })
        .catch((err) => {
          console.error(
            `[verify-payment] Order confirmation email failed for ${hydratedPaid.orderNumber}:`,
            err instanceof Error ? err.message : "Unknown error"
          );
        });
    }

    return NextResponse.json({
      ...verification,
      order: hydratedPaid,
    });
  }

  if (verification.status === "confirming") {
    const nowIso = new Date().toISOString();
    const updatedLocal = updateOrderPaymentVerification(order.orderNumber, {
      status: "confirming",
      txHash: verification.txHash,
      confirmations: verification.confirmations,
      explorerUrl: verification.explorerUrl,
    });

    if (fsOrder) {
      await updateOrderVerificationInFirestore(order.orderNumber, {
        paymentStatus: "confirming",
        txHash: verification.txHash,
        confirmations: verification.confirmations,
        explorerUrl: verification.explorerUrl,
        updatedAt: nowIso,
      }).catch((err) => console.error("Failed persisting confirming status to Firestore:", err));
    }

    return NextResponse.json({
      ...verification,
      order: updatedLocal || {
        ...order,
        paymentStatus: "confirming" as const,
        txHash: verification.txHash,
        confirmations: verification.confirmations,
        explorerUrl: verification.explorerUrl,
        updatedAt: nowIso,
      },
    });
  }

  return NextResponse.json({
    ...verification,
    order,
  });
}
