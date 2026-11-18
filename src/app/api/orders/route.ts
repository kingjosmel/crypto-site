import { NextRequest, NextResponse } from "next/server";
import {
  createOrderRecord,
  getOrderDetails,
  getOrdersByEmail,
  getUserOrders,
  verifyAuthToken,
} from "@/lib/catalogData";
import { fetchBaselineTxIds } from "@/lib/blockchainVerifier";
import {
  generateUniqueOrderNumberInFirestore,
  getOrderFromFirestore,
  getOrdersByEmailFromFirestore,
  saveOrderToFirestore,
} from "@/lib/firestoreStore";
import { validateRefundWallet, type SupportedCryptoAsset } from "@/lib/walletValidation";

const DEFAULT_ESCROW_ADDRESSES: Record<SupportedCryptoAsset, string> = {
  BTC: "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu",
  ETH: "0x120D139dB706614f71e470A97852679F6FaebcB7",
  SOL: "X2ro74HaRbZ2XKDJ57yMmsKFD3CS4y9XFKtzSeQkCQ1",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      items,
      shippingAddress,
      billingAddress,
      customerName,
      phone,
      paymentMethod,
      cryptoCurrency,
      cryptoAmount,
      escrowAddress,
      refundWallet,
      refundWalletAddress,
    } = body;

    if (!email || !items || !Array.isArray(items) || items.length === 0 || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required checkout fields: email, items, and shipping address" },
        { status: 400 }
      );
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
    const [baselineTxIds, uniqueOrderNumber] = await Promise.all([
      fetchBaselineTxIds(resolvedCurrency, targetEscrowAddress),
      generateUniqueOrderNumberInFirestore().catch(() => undefined),
    ]);

    const authHeader = request.headers.get("authorization");
    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const tokenUser = await verifyAuthToken(authHeader.replace("Bearer ", ""));
      if (tokenUser) userId = tokenUser.id;
    }

    const order = createOrderRecord({
      orderNumberOverride: uniqueOrderNumber,
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
      userId,
    });

    const fullOrderRecord = getOrderDetails(order.orderNumber);
    if (fullOrderRecord) {
      await saveOrderToFirestore(fullOrderRecord).catch((err) => {
        console.error("Failed persisting order to Firestore:", err);
      });
    }

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

  if (emailParam) {
    const localOrders = getOrdersByEmail(emailParam);
    const firestoreOrders = await getOrdersByEmailFromFirestore(emailParam).catch(() => []);
    const byOrderNumber = new Map<string, typeof localOrders[number]>();
    for (const o of firestoreOrders) byOrderNumber.set(o.orderNumber, o);
    for (const o of localOrders) {
      if (!byOrderNumber.has(o.orderNumber)) byOrderNumber.set(o.orderNumber, o);
    }
    return NextResponse.json({ items: Array.from(byOrderNumber.values()) });
  }

  if (queryParam) {
    const fsOrder = await getOrderFromFirestore(queryParam).catch(() => null);
    const order = fsOrder || getOrderDetails(queryParam);
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
