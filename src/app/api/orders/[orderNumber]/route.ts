import { NextRequest, NextResponse } from "next/server";
import {
  getGuestOrder,
  getOrderDetails,
  getUserOrder,
  updateOrderRefundWallet,
  verifyAuthToken,
} from "@/lib/catalogData";
import { getOrderFromFirestore, updateRefundWalletInFirestore } from "@/lib/firestoreStore";
import { validateRefundWallet, type SupportedCryptoAsset } from "@/lib/walletValidation";

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

  const fsOrder = await getOrderFromFirestore(orderNumber).catch(() => null);
  const order = fsOrder || getOrderDetails(orderNumber) || getGuestOrder(orderNumber);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const body = await request.json();
    const email = String(body.email || "").trim();
    const refundWallet = String(body.refundWallet || "").trim();

    if (!email || !refundWallet) {
      return NextResponse.json(
        { error: "Both order email and a Refund Return Wallet address are required." },
        { status: 400 }
      );
    }

    const fsExisting = await getOrderFromFirestore(orderNumber).catch(() => null);
    const existing = fsExisting || getOrderDetails(orderNumber) || getGuestOrder(orderNumber);
    if (!existing) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (existing.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Email address does not match the order record." }, { status: 403 });
    }

    const asset: SupportedCryptoAsset = existing.cryptoCurrency || "BTC";
    const walletCheck = validateRefundWallet(refundWallet, asset);
    if (!walletCheck.valid || !walletCheck.cleaned) {
      return NextResponse.json({ error: walletCheck.error || "Invalid wallet address." }, { status: 400 });
    }

    const localResult = updateOrderRefundWallet(orderNumber, email, walletCheck.cleaned);
    const nowIso = new Date().toISOString();
    if (fsExisting) {
      await updateRefundWalletInFirestore(existing.orderNumber, walletCheck.cleaned, nowIso);
    }

    if ("order" in localResult && localResult.order) {
      return NextResponse.json(localResult.order);
    }

    return NextResponse.json({
      ...existing,
      refundWallet: walletCheck.cleaned,
      updatedAt: nowIso,
    });
  } catch {
    return NextResponse.json({ error: "Unable to update Refund Return Wallet." }, { status: 400 });
  }
}
