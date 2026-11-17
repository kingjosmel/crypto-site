import { NextRequest, NextResponse } from "next/server";
import { createOrderRecord, getOrdersByEmail, getOrderDetails, getUserOrders, verifyAuthToken } from "@/lib/catalogData";
import { fetchBaselineTxIds } from "@/lib/blockchainVerifier";
import { validateRefundWallet, type SupportedCryptoAsset } from "@/lib/walletValidation";

const DEFAULT_ESCROW_ADDRESSES: Record<SupportedCryptoAsset, string> = {
  BTC: "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu",
  ETH: "0x120D139dB706614f71e470A97852679F6FaebcB7",
  SOL: "X2ro74HaRbZ2XKDJ57yMmsKFD3CS4y9XFKtzSeQkCQ1",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, items, shippingAddress, billingAddress, customerName, phone, paymentMethod, cryptoCurrency, cryptoAmount, escrowAddress, refundWallet, refundWalletAddress } = body;
    if (!email || !items || !Array.isArray(items) || items.length === 0 || !shippingAddress) {
      return NextResponse.json({ error: "Missing required checkout fields: email, items, and shipping address" }, { status: 400 });
    }

    const normalizedMethod = String(paymentMethod || "").toUpperCase();
    if (normalizedMethod.includes("CARD") || normalizedMethod.includes("PAYPAL")) {
      return NextResponse.json(
        { error: "Credit/Debit Card and PayPal payments are unavailable. Please select Cryptocurrency (BTC, ETH, or SOL)." },
        { status: 400 }
      );
    }

    const resolvedCurrency: SupportedCryptoAsset =
      cryptoCurrency === "ETH" || cryptoCurrency === "SOL" || cryptoCurrency === "BTC"
        ? cryptoCurrency
        : String(paymentMethod || "").includes("ETH")
        ? "ETH"
        : String(paymentMethod || "").includes("SOL")
        ? "SOL"
        : "BTC";

    const rawRefundWallet = refundWallet || refundWalletAddress;
    const walletValidation = validateRefundWallet(rawRefundWallet, resolvedCurrency);
    if (!walletValidation.valid) {
      return NextResponse.json({ error: walletValidation.error }, { status: 400 });
    }

    const targetEscrowAddress = String(escrowAddress || DEFAULT_ESCROW_ADDRESSES[resolvedCurrency]).trim();
    const baselineTxIds = await fetchBaselineTxIds(resolvedCurrency, targetEscrowAddress);

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
      cryptoCurrency: resolvedCurrency,
      cryptoAmount,
      escrowAddress: targetEscrowAddress,
      refundWallet: walletValidation.cleaned,
      baselineTxIds,
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
