"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { CheckCircle2, Clock, CreditCard, ExternalLink, Lock, RefreshCw, ShieldCheck, Wallet } from "lucide-react";
import { formatPrice } from "@/lib/api";
import { parseCart, writeCart, addToCart, getCartSnapshot, type CartItem } from "@/lib/cart";
import { INITIAL_PRODUCTS } from "@/lib/catalogData";
import { CryptoQRCode } from "@/components/CryptoQRCode";
import { useLiveCryptoRates, calculateCryptoAmount } from "@/lib/cryptoRates";
import { getNetworkExample, validateRefundWallet } from "@/lib/walletValidation";

export type CryptoCurrency = "BTC" | "ETH" | "SOL";
export type PaymentMethodSelection = "CARD" | "PAYPAL" | "CRYPTO" | null;

export interface CryptoOption {
  symbol: CryptoCurrency;
  name: string;
  icon: string;
  network: string;
  address: string;
  rateUsd: number;
  decimals: number;
  confirmations: string;
  accentColor: string;
  badgeBg: string;
}

export const CRYPTO_CONFIG: Record<CryptoCurrency, CryptoOption> = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    icon: "₿",
    network: "Bitcoin Mainnet (Native SegWit)",
    address: "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu",
    rateUsd: 85000,
    decimals: 8,
    confirmations: "2 Block Confirmations (~20 min)",
    accentColor: "#f7931a",
    badgeBg: "rgba(247, 147, 26, 0.08)",
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    icon: "Ξ",
    network: "Ethereum Mainnet (ERC-20)",
    address: "0x120D139dB706614f71e470A97852679F6FaebcB7",
    rateUsd: 2600,
    decimals: 6,
    confirmations: "12 Block Confirmations (~3 min)",
    accentColor: "#627eea",
    badgeBg: "rgba(98, 126, 234, 0.08)",
  },
  SOL: {
    symbol: "SOL",
    name: "Solana",
    icon: "◎",
    network: "Solana Mainnet (SPL)",
    address: "X2ro74HaRbZ2XKDJ57yMmsKFD3CS4y9XFKtzSeQkCQ1",
    rateUsd: 180,
    decimals: 4,
    confirmations: "32 Confirmations (~15 sec)",
    accentColor: "#14f195",
    badgeBg: "rgba(20, 241, 149, 0.08)",
  },
};

type CompletedOrder = {
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  totalCents: number;
  email: string;
  customerName?: string;
  paymentMethod: string;
  cryptoCurrency: CryptoCurrency;
  cryptoAmount: string;
  escrowAddress: string;
  refundWallet?: string;
  txHash?: string;
  explorerUrl?: string;
  items: {
    productId: string;
    name: string;
    sku: string;
    qty: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }[];
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

type VerificationBannerState = {
  status: "awaiting_payment" | "confirming" | "paid" | "provider_error";
  message: string;
  txHash?: string;
  confirmations?: number;
  explorerUrl?: string;
  checkedAt?: string;
};

const PENDING_ORDER_STORAGE_KEY = "northstar-pending-crypto-order";

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("northstar-cart-change", callback);
  return () => window.removeEventListener("northstar-cart-change", callback);
};
const getSnapshot = getCartSnapshot;

export function CheckoutForm() {
  const router = useRouter();
  const cartSnapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const cart: CartItem[] = parseCart(cartSnapshot);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [awaitingOrder, setAwaitingOrder] = useState<CompletedOrder | null>(null);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [verificationState, setVerificationState] = useState<VerificationBannerState | null>(null);
  const [checkingChain, setCheckingChain] = useState(false);
  const [manualTxHashInput, setManualTxHashInput] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodSelection>(null);
  const [cryptoCurrency, setCryptoCurrency] = useState<CryptoCurrency>("BTC");
  const [refundWallet, setRefundWallet] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardBillingZip, setCardBillingZip] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paypalName, setPaypalName] = useState("");
  const [paypalAuthorized, setPaypalAuthorized] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  // Live real-time cryptocurrency rates via Coinpaprika
  const { rates: liveRates } = useLiveCryptoRates(15000);

  // Auto-populate cart if user arrived with ?buyNow=<id-or-slug>
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const buyNowId = params.get("buyNow");
      if (buyNowId) {
        const currentCart = parseCart(getCartSnapshot());
        const hasItem = currentCart.some((i) => i.productId === buyNowId || i.slug === buyNowId);
        if (!hasItem) {
          const product = INITIAL_PRODUCTS.find((p) => p._id === buyNowId || p.slug === buyNowId);
          if (product) {
            addToCart({
              productId: product._id,
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              imageUrl: product.images[0]?.url,
            });
          }
        }
      }
    } catch (err) {
      console.error("Auto buyNow recovery error:", err);
    }
  }, []);

  // Resume pending on-chain payment listener if page refreshed
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedOrderNumber = window.sessionStorage?.getItem(PENDING_ORDER_STORAGE_KEY);
      if (!savedOrderNumber) return;
      void fetch(`/api/orders/${encodeURIComponent(savedOrderNumber)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((order) => {
          if (!order || !order.orderNumber) {
            window.sessionStorage?.removeItem(PENDING_ORDER_STORAGE_KEY);
            return;
          }
          const mapped: CompletedOrder = {
            orderNumber: order.orderNumber,
            trackingNumber: order.trackingNumber || `TRK-NS-${order.orderNumber.replace(/\D/g, "")}`,
            carrier: order.carrier || "FedEx Priority Overnight / UPS Next Day Air (Insured)",
            estimatedDelivery: order.estimatedDelivery || "1–2 Business Days via Insured Express Courier (USA)",
            totalCents: order.totalCents,
            email: order.email,
            customerName: order.customerName,
            paymentMethod: order.paymentMethod || "CRYPTO_BTC",
            cryptoCurrency: order.cryptoCurrency || "BTC",
            cryptoAmount: order.cryptoAmount || "0",
            escrowAddress: order.escrowAddress || CRYPTO_CONFIG[(order.cryptoCurrency as CryptoCurrency) || "BTC"].address,
            refundWallet: order.refundWallet,
            txHash: order.txHash,
            explorerUrl: order.explorerUrl,
            items: order.items || [],
            shippingAddress: order.shippingAddress,
          };
          if (order.paymentStatus === "paid") {
            window.sessionStorage?.removeItem(PENDING_ORDER_STORAGE_KEY);
            writeCart([]);
            setCompletedOrder(mapped);
          } else {
            setAwaitingOrder(mapped);
          }
        })
        .catch(() => {});
    } catch {
      // Ignore storage failures
    }
  }, []);

  const verifyPendingOrder = useCallback(async (orderNumber: string, manualTx?: string) => {
    setCheckingChain(true);
    try {
      const qs = manualTx?.trim() ? `?txHash=${encodeURIComponent(manualTx.trim())}` : "";
      const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}/verify-payment${qs}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        setVerificationState({
          status: "provider_error",
          message: data.error || "Unable to verify payment status right now.",
        });
        return;
      }

      setVerificationState({
        status: data.status || "awaiting_payment",
        message: data.message || "Listening for incoming transfer...",
        txHash: data.txHash,
        confirmations: data.confirmations,
        explorerUrl: data.explorerUrl,
        checkedAt: data.checkedAt,
      });

      if (data.verified && data.status === "paid" && data.order) {
        if (typeof window !== "undefined") {
          try {
            window.sessionStorage?.removeItem(PENDING_ORDER_STORAGE_KEY);
          } catch {
            // ignore
          }
        }
        writeCart([]);
        setCompletedOrder({
          orderNumber: data.order.orderNumber,
          trackingNumber: data.order.trackingNumber,
          carrier: data.order.carrier || "FedEx Priority Overnight / UPS Next Day Air (Insured)",
          estimatedDelivery: data.order.estimatedDelivery || "1–2 Business Days via Insured Express Courier (USA)",
          totalCents: data.order.totalCents,
          email: data.order.email,
          customerName: data.order.customerName,
          paymentMethod: data.order.paymentMethod,
          cryptoCurrency: data.order.cryptoCurrency || "BTC",
          cryptoAmount: data.order.cryptoAmount,
          escrowAddress: data.order.escrowAddress,
          refundWallet: data.order.refundWallet,
          txHash: data.txHash || data.order.txHash,
          explorerUrl: data.explorerUrl || data.order.explorerUrl,
          items: data.order.items || [],
          shippingAddress: data.order.shippingAddress,
        });
        setAwaitingOrder(null);
      }
    } catch {
      setVerificationState({
        status: "provider_error",
        message: "Connection issue checking blockchain. Retrying automatically...",
      });
    } finally {
      setCheckingChain(false);
    }
  }, []);

  const awaitingOrderNumber = awaitingOrder?.orderNumber || "";
  useEffect(() => {
    if (!awaitingOrderNumber) return;
    const initialTimer = setTimeout(() => {
      void verifyPendingOrder(awaitingOrderNumber);
    }, 0);
    const interval = setInterval(() => {
      void verifyPendingOrder(awaitingOrderNumber);
    }, 6000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [awaitingOrderNumber, verifyPendingOrder]);

  // Cart summary calculations
  const subtotalCents = cart.reduce((acc, item) => acc + item.priceCents * item.qty, 0);
  const discountCents = discountApplied ? Math.round(subtotalCents * 0.1) : 0; // 10% promotional code
  const shippingCents = 0; // Guaranteed 24-Hour Delivery is Complimentary
  const taxableAmount = subtotalCents - discountCents;
  const taxCents = Math.round((taxableAmount * 825) / 10000);
  const totalCents = taxableAmount + shippingCents + taxCents;

  const currentCrypto = CRYPTO_CONFIG[cryptoCurrency];
  const liveRateUsd = liveRates[cryptoCurrency]?.price || currentCrypto.rateUsd;
  const calculatedCryptoAmount = calculateCryptoAmount(totalCents, liveRateUsd, currentCrypto.decimals);
  const refundWalletCheck = validateRefundWallet(refundWallet, cryptoCurrency);
  const refundNetworkInfo = getNetworkExample(cryptoCurrency);

  function formatCardNumberInput(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function formatExpiryInput(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  }

  async function handleSubmitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cart.length === 0) return;

    if (!selectedPaymentMethod) {
      setError("Please select a payment method to continue.");
      return;
    }

    if (selectedPaymentMethod === "CARD") {
      const cardDigits = cardNumber.replace(/\D/g, "");
      if (!cardName.trim()) {
        setError("Please enter the cardholder name.");
        return;
      }
      if (cardDigits.length < 13 || cardDigits.length > 19) {
        setError("Please enter a valid 13 to 19 digit card number.");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.trim())) {
        setError("Please enter a valid expiration date in MM/YY format.");
        return;
      }
      if (!/^\d{3,4}$/.test(cardCvc.trim())) {
        setError("Please enter a valid 3 or 4 digit security code (CVC).");
        return;
      }
      if (cardBillingZip.trim().length < 4) {
        setError("Please enter your billing ZIP or postal code.");
        return;
      }

      setLoading(true);
      setError("");
      await new Promise((resolve) => setTimeout(resolve, 900));
      router.push("/checkout/payment-unavailable?method=card");
      return;
    }

    if (selectedPaymentMethod === "PAYPAL") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail.trim())) {
        setError("Please enter a valid PayPal account email address.");
        return;
      }
      if (!paypalName.trim()) {
        setError("Please enter the full name on your PayPal account.");
        return;
      }
      if (!paypalAuthorized) {
        setError("Please confirm the PayPal authorization box to continue.");
        return;
      }

      setLoading(true);
      setError("");
      await new Promise((resolve) => setTimeout(resolve, 900));
      router.push("/checkout/payment-unavailable?method=paypal");
      return;
    }

    if (!refundWalletCheck.valid) {
      setError(refundWalletCheck.error || "Please enter a valid Refund Return Wallet address.");
      return;
    }

    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const fullName = String(form.get("fullName") || "").trim();
    const phone = String(form.get("phone") || "").trim();

    const payload = {
      email,
      customerName: fullName,
      phone,
      paymentMethod: `CRYPTO_${cryptoCurrency}`,
      cryptoCurrency,
      cryptoAmount: calculatedCryptoAmount,
      escrowAddress: currentCrypto.address,
      refundWallet: refundWallet.trim() || undefined,
      items: cart.map((item) => ({
        productId: item.productId,
        qty: item.qty,
        priceCents: item.priceCents,
      })),
      shippingAddress: {
        line1: String(form.get("line1")),
        line2: String(form.get("line2") || "") || undefined,
        city: String(form.get("city")),
        state: String(form.get("state")).toUpperCase(),
        postalCode: String(form.get("postalCode")),
        country: "US",
      },
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to place order.");
      }

      const pendingOrder: CompletedOrder = {
        orderNumber: data.orderNumber,
        trackingNumber: data.trackingNumber,
        carrier: data.carrier || "FedEx Priority Overnight / UPS Next Day Air (Insured)",
        estimatedDelivery: data.estimatedDelivery || "1–2 Business Days via Insured Express Courier (USA)",
        totalCents: data.totalCents || totalCents,
        email: data.email,
        customerName: fullName,
        paymentMethod: data.paymentMethod || `CRYPTO_${cryptoCurrency}`,
        cryptoCurrency,
        cryptoAmount: data.cryptoAmount || calculatedCryptoAmount,
        escrowAddress: data.escrowAddress || currentCrypto.address,
        refundWallet: data.refundWallet || (refundWallet.trim() || undefined),
        items: data.items,
        shippingAddress: data.shippingAddress,
      };

      if (typeof window !== "undefined") {
        try {
          window.sessionStorage?.setItem(PENDING_ORDER_STORAGE_KEY, data.orderNumber);
        } catch {
          // ignore
        }
      }

      setVerificationState({
        status: "awaiting_payment",
        message: `Listening on ${currentCrypto.name} blockchain for ${pendingOrder.cryptoAmount} ${pendingOrder.cryptoCurrency}...`,
      });
      setAwaitingOrder(pendingOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, field: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2500);
    }
  }

  // Live On-Chain Escrow Listener View (before order confirmation)
  if (awaitingOrder && !completedOrder) {
    const coinConfig = CRYPTO_CONFIG[awaitingOrder.cryptoCurrency];
    const isConfirming = verificationState?.status === "confirming";

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white border border-[#dcdcdc] rounded-xs p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#e5e5e5]">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#047857] mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                {isConfirming
                  ? `${coinConfig.name} Mempool Detected · Confirming`
                  : `Live ${coinConfig.name} Escrow Listener Active`}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal">
                Awaiting {coinConfig.symbol} Payment Verification
              </h1>
              <p className="text-xs text-neutral-600 mt-1">
                Order <strong className="font-mono text-neutral-950">{awaitingOrder.orderNumber}</strong> is reserved. Send the exact amount below—your confirmation screen opens automatically once funds are verified on-chain.
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Order Total</span>
              <strong className="font-mono text-lg text-neutral-950 block">{formatPrice(awaitingOrder.totalCents)}</strong>
              <span className="font-mono text-xs font-semibold text-[#a3702b]">
                {awaitingOrder.cryptoAmount} {awaitingOrder.cryptoCurrency}
              </span>
            </div>
          </div>

          {/* Live Blockchain Status Banner */}
          <div
            className={`p-4 rounded-xs border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
              isConfirming
                ? "bg-amber-50 border-amber-200 text-amber-950"
                : "bg-[#fafafa] border-[#dcdcdc] text-neutral-800"
            }`}
            aria-live="polite"
          >
            <div className="flex items-start gap-2.5">
              {isConfirming ? (
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <Clock className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <div>
                <strong className="block text-xs font-semibold">
                  {verificationState?.message || `Listening for ${awaitingOrder.cryptoAmount} ${awaitingOrder.cryptoCurrency}...`}
                </strong>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  Checking automatically every 6 seconds via{" "}
                  {awaitingOrder.cryptoCurrency === "BTC"
                    ? "Mempool.space"
                    : awaitingOrder.cryptoCurrency === "ETH"
                    ? "Alchemy Ethereum Mainnet"
                    : "Alchemy Solana Mainnet"}
                  {verificationState?.checkedAt ? ` · Last checked ${new Date(verificationState.checkedAt).toLocaleTimeString()}` : ""}
                </span>
                {verificationState?.txHash && (
                  <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono break-all text-neutral-700">
                      TX: {verificationState.txHash}
                    </span>
                    {verificationState.explorerUrl && (
                      <a
                        href={verificationState.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#047857] hover:underline"
                      >
                        View Explorer <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void verifyPendingOrder(awaitingOrder.orderNumber, manualTxHashInput)}
              disabled={checkingChain}
              className="px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-semibold uppercase tracking-wider rounded-xs shrink-0 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
              style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingChain ? "animate-spin" : ""}`} aria-hidden="true" />
              <span style={{ color: "#ffffff" }}>{checkingChain ? "Checking…" : "Check Now"}</span>
            </button>
          </div>

          {/* QR Code & Deposit Coordinates */}
          <div className="border border-[#d4d4d4] bg-[#fafafa] p-5 rounded-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <CryptoQRCode
                address={awaitingOrder.escrowAddress}
                symbol={awaitingOrder.cryptoCurrency}
                amount={awaitingOrder.cryptoAmount}
                size={150}
                showWalletLink={true}
                className="shrink-0"
              />

              <div className="flex-1 min-w-0 space-y-3 w-full">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Send Exact {coinConfig.name} To Escrow Address
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(awaitingOrder.escrowAddress, "await-addr")}
                      className="text-[11px] font-semibold uppercase tracking-wider text-[#a3702b] hover:underline cursor-pointer"
                    >
                      {copiedField === "await-addr" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="p-2.5 bg-white border border-[#cccccc] font-mono text-xs text-neutral-900 break-all select-all">
                    {awaitingOrder.escrowAddress}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Exact Amount Due
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(awaitingOrder.cryptoAmount, "await-amt")}
                      className="text-[11px] font-semibold uppercase tracking-wider text-[#a3702b] hover:underline cursor-pointer"
                    >
                      {copiedField === "await-amt" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="p-2.5 bg-white border border-[#cccccc] flex justify-between items-center">
                    <span className="font-mono text-sm font-bold text-neutral-950">
                      {awaitingOrder.cryptoAmount} {awaitingOrder.cryptoCurrency}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      ≈ {formatPrice(awaitingOrder.totalCents)}
                    </span>
                  </div>
                </div>

                {awaitingOrder.refundWallet && (
                  <div className="text-[11px] text-[#047857] font-mono bg-white border border-[#dcdcdc] px-2.5 py-2 rounded-xs truncate">
                    Return Wallet: {awaitingOrder.refundWallet}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Optional Direct TX Hash Verification */}
          <div className="border-t border-[#e5e5e5] pt-5 space-y-2">
            <label htmlFor="manualTxHashInput" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600">
              Already sent from your wallet? Paste Transaction Hash (Optional)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="manualTxHashInput"
                type="text"
                value={manualTxHashInput}
                onChange={(e) => setManualTxHashInput(e.target.value)}
                placeholder={`Paste ${coinConfig.symbol} transaction hash / signature`}
                className="flex-1 px-3 py-2.5 bg-[#f7f7f7] border border-[#cccccc] focus:border-black focus:bg-white focus:outline-none text-xs font-mono text-neutral-900"
              />
              <button
                type="button"
                disabled={checkingChain || !manualTxHashInput.trim()}
                onClick={() => void verifyPendingOrder(awaitingOrder.orderNumber, manualTxHashInput)}
                className="px-4 py-2.5 bg-white hover:bg-neutral-50 border border-[#cccccc] text-neutral-900 text-xs font-semibold uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                Verify TXID
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e5e5] text-xs">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  try {
                    window.sessionStorage?.removeItem(PENDING_ORDER_STORAGE_KEY);
                  } catch {
                    // ignore
                  }
                }
                setAwaitingOrder(null);
                setVerificationState(null);
              }}
              className="text-neutral-600 hover:text-black underline cursor-pointer"
            >
              ← Change payment method or coin
            </button>
            <Link
              href={`/track?order=${encodeURIComponent(awaitingOrder.orderNumber)}`}
              className="text-[#047857] font-semibold hover:underline"
            >
              Track {awaitingOrder.orderNumber} status →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation View (Shown ONLY after payment is verified on-chain)
  if (completedOrder) {
    const coinConfig = CRYPTO_CONFIG[completedOrder.cryptoCurrency];

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white border border-[#dcdcdc] rounded-xs p-8 sm:p-12 shadow-sm">
          {/* Header */}
          <div className="text-center pb-8 border-b border-[#dcdcdc]">
            <div className="w-14 h-14 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center text-2xl mx-auto mb-4 font-bold">
              ✓
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#047857] block mb-2">
              Order Protected · 14-Day Inspection Escrow
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal mb-3">
              Thank You for Your Order
            </h1>
            <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
              We received your order and registered your escrow-protected settlement. Your receipt, return protection summary, and live courier tracking have been sent to <strong className="text-neutral-900">{completedOrder.email}</strong>.
            </p>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-[#dcdcdc] text-xs">
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">
                Order Number
              </span>
              <strong className="text-neutral-950 font-mono text-sm">{completedOrder.orderNumber}</strong>
            </div>
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">
                Tracking Code
              </span>
              <strong className="text-neutral-950 font-mono text-sm">
                {completedOrder.trackingNumber}
              </strong>
            </div>
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">
                Estimated Delivery
              </span>
              <strong className="text-[#047857] font-semibold text-sm">1–2 Business Days (Insured)</strong>
            </div>
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">Payment Option</span>
              <strong className="text-neutral-950 text-sm">
                {`${coinConfig.name} (${coinConfig.symbol})`}
              </strong>
            </div>
          </div>

          {/* Crypto Settlement Info */}
          <div className="my-6 p-4 rounded-xs border border-[#e5e5e5] bg-[#fafafa]">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Escrow Settlement & Return Protection
              </span>
              <span className="text-xs font-mono font-semibold text-[#a3702b]">
                {completedOrder.cryptoAmount} {completedOrder.cryptoCurrency}
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-white p-2.5 border border-[#dcdcdc] rounded-xs">
                <span className="text-neutral-500">Escrow Address:</span>
                <span className="font-mono text-neutral-800 truncate ml-2 max-w-[260px] sm:max-w-none">
                  {completedOrder.escrowAddress}
                </span>
              </div>
              {completedOrder.txHash && (
                <div className="flex justify-between items-center bg-white p-2.5 border border-[#dcdcdc] rounded-xs gap-2">
                  <span className="text-neutral-500 shrink-0">Verified Transaction Hash:</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-neutral-800 truncate max-w-[220px] sm:max-w-[340px]">
                      {completedOrder.txHash}
                    </span>
                    {completedOrder.explorerUrl && (
                      <a
                        href={completedOrder.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-[#047857] hover:underline shrink-0"
                      >
                        Explorer ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
              {completedOrder.refundWallet && (
                <div className="flex justify-between items-center bg-white p-2.5 border border-[#dcdcdc] rounded-xs">
                  <span className="text-neutral-500">Refund Return Wallet ({completedOrder.cryptoCurrency}):</span>
                  <div className="flex items-center gap-2 ml-2 min-w-0">
                    <span className="font-mono text-[#047857] font-medium truncate max-w-[200px] sm:max-w-[320px]">
                      {completedOrder.refundWallet}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(completedOrder.refundWallet!, "refundWallet")}
                      className="text-[11px] font-semibold text-neutral-700 hover:text-black underline shrink-0 cursor-pointer"
                    >
                      {copiedField === "refundWallet" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="py-6 border-b border-[#dcdcdc]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
              {`Items Ordered (${completedOrder.items?.length || 0})`}
            </h2>
            <div className="space-y-3">
              {completedOrder.items?.map((item) => (
                <div key={item.productId || item.name} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-neutral-900 block">{item.name}</span>
                    <span className="text-xs text-neutral-500">Quantity: {item.qty} · In stock</span>
                  </div>
                  <span className="font-mono font-semibold text-neutral-950">
                    {formatPrice(item.lineTotalCents)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-4 mt-4 border-t border-[#f0eee9] flex justify-between items-center">
              <span className="text-sm font-semibold text-neutral-900">
                Total
              </span>
              <span className="text-lg font-mono font-bold text-neutral-950">
                {formatPrice(completedOrder.totalCents)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href={`/track?order=${encodeURIComponent(completedOrder.orderNumber)}`}
              className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
              style={{ color: "#ffffff" }}
            >
              <span style={{ color: "#ffffff" }}>Track Delivery Status →</span>
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-[#cccccc] text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Bag State
  if (!cart.length) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="relative w-40 h-28 mx-auto mb-6 rounded-xs overflow-hidden border border-[#dcdcdc] shadow-xs">
          <Image
            src="/images/editorial_collection_curation.jpg"
            alt="Northstar Archive Collection"
            fill
            sizes="160px"
            quality={95}
            priority
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        </div>
        <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
          Express Checkout
        </span>
        <h1 className="font-serif text-3xl text-neutral-950 font-normal mb-3">
          Your bag is currently empty.
        </h1>
        <p className="text-sm text-neutral-600 mb-8 max-w-md mx-auto leading-relaxed">
          Please add a designer bag, luxury footwear, or tailored apparel piece from our catalog to proceed to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
          style={{ color: "#ffffff" }}
        >
          <span style={{ color: "#ffffff" }}>Explore Collection →</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#dcdcdc]">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/cart" className="hover:text-black transition-colors">Bag</Link>
          <span>/</span>
          <span className="text-neutral-950 font-semibold">Information & Shipping</span>
          <span>/</span>
          <span>Payment</span>
        </div>
        <span className="text-[11px] uppercase tracking-wider text-[#047857] font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          Insured Express USA Delivery · Protected Checkout
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Checkout Inputs (Shopify style) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmitOrder} className="space-y-8">
            {/* 1. Contact Information */}
            <section className="bg-white p-6 sm:p-8 border border-[#dcdcdc] rounded-xs shadow-2xs">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
                  Contact Information
                </h2>
                <span className="text-xs text-neutral-500">Guest Checkout</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-3 bg-[#f7f7f7] border border-[#cccccc] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Your order invoice and courier tracking coordinates will be sent here.
                  </p>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="marketingConsent"
                    defaultChecked
                    className="mt-1 h-3.5 w-3.5 text-neutral-950 border-neutral-300 rounded-none focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="marketingConsent" className="text-xs text-neutral-600 cursor-pointer">
                    Email me about new luxury arrivals and seasonal archive collections.
                  </label>
                </div>
              </div>
            </section>

            {/* 2. Shipping Address */}
            <section className="bg-white p-6 sm:p-8 border border-[#dcdcdc] rounded-xs shadow-2xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 mb-4">
                Shipping Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="country" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                    Country / Region
                  </label>
                  <input
                    id="country"
                    type="text"
                    disabled
                    value="United States (Guaranteed 24-Hour Delivery)"
                    className="w-full px-3.5 py-3 bg-[#e5e5e5] border border-[#cccccc] rounded-none text-sm text-neutral-700 cursor-not-allowed font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Alexander Wright"
                      className="w-full px-3.5 py-3 bg-[#f7f7f7] border border-[#cccccc] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="e.g. (555) 019-2834"
                      className="w-full px-3.5 py-3 bg-[#f7f7f7] border border-[#cccccc] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="line1" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="line1"
                    name="line1"
                    type="text"
                    required
                    autoComplete="shipping street-address"
                    placeholder="House number and street name"
                    className="w-full px-3.5 py-3 bg-[#f7f7f7] border border-[#cccccc] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="line2" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                    Apartment, Suite, Unit <span className="text-neutral-400 lowercase font-normal">(optional)</span>
                  </label>
                  <input
                    id="line2"
                    name="line2"
                    type="text"
                    autoComplete="shipping address-line2"
                    placeholder="Apartment, suite, unit, etc."
                    className="w-full px-3.5 py-3 bg-[#f7f7f7] border border-[#cccccc] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                  <div className="sm:col-span-3">
                    <label htmlFor="city" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      autoComplete="shipping address-level2"
                      placeholder="e.g. New York"
                      className="w-full px-3.5 py-3 bg-[#f7f7f7] border border-[#cccccc] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="state" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      required
                      minLength={2}
                      maxLength={2}
                      autoComplete="shipping address-level1"
                      placeholder="NY"
                      className="w-full px-3.5 py-3 bg-[#f7f7f7] border border-[#cccccc] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 uppercase placeholder:text-neutral-400 transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="postalCode" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      required
                      pattern="[0-9]{5}(-[0-9]{4})?"
                      autoComplete="shipping postal-code"
                      placeholder="10021"
                      className="w-full px-3.5 py-3 bg-[#f7f7f7] border border-[#cccccc] focus:border-black focus:bg-white focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Shipping Method */}
            <section className="bg-white p-6 sm:p-8 border border-[#dcdcdc] rounded-xs shadow-2xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 mb-4">
                Shipping Method
              </h2>
              <div className="p-4 border-2 border-neutral-950 bg-[#fafafa] rounded-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-neutral-950 font-semibold">
                      FedEx Priority Overnight / UPS Next Day Air (Insured)
                    </strong>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#10b981]/15 text-[#047857] px-2 py-0.5 rounded-xs">
                      Included
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    Estimated 1–2 business days nationwide after payment verification and pre-dispatch inspection. 100% full-value transit insurance and adult signature required.
                  </p>
                </div>
                <span className="text-sm font-bold font-mono text-neutral-950 shrink-0">
                  FREE
                </span>
              </div>
            </section>

            {/* 4. Payment & Buyer Protection */}
            <section className="bg-white p-6 sm:p-8 border border-[#dcdcdc] rounded-xs shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
                    Payment & Buyer Protection
                  </h2>
                  <p className="text-xs text-neutral-600 mt-1">
                    Select your preferred payment method below to complete your order.
                  </p>
                </div>
                <span className="text-[11px] text-[#047857] font-mono font-semibold shrink-0">
                  14-Day Return Protection
                </span>
              </div>

              {/* Payment Method Selector (Nothing selected by default; Crypto is the 3rd option) */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                  Select Payment Method
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPaymentMethod("CARD");
                      setError("");
                    }}
                    aria-pressed={selectedPaymentMethod === "CARD"}
                    className={`p-3.5 rounded-xs text-left transition-colors cursor-pointer ${
                      selectedPaymentMethod === "CARD"
                        ? "border-2 border-neutral-950 bg-[#fafafa]"
                        : "border border-[#cccccc] hover:border-neutral-950 bg-white hover:bg-[#fafafa]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950">
                        <CreditCard className="w-3.5 h-3.5 text-neutral-700" aria-hidden="true" />
                        Credit / Debit Card
                      </span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full inline-block shrink-0 ${
                          selectedPaymentMethod === "CARD"
                            ? "border-4 border-neutral-950"
                            : "border border-neutral-400"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-[11px] text-neutral-500 block">
                      Visa · Mastercard · Amex
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPaymentMethod("PAYPAL");
                      setError("");
                    }}
                    aria-pressed={selectedPaymentMethod === "PAYPAL"}
                    className={`p-3.5 rounded-xs text-left transition-colors cursor-pointer ${
                      selectedPaymentMethod === "PAYPAL"
                        ? "border-2 border-neutral-950 bg-[#fafafa]"
                        : "border border-[#cccccc] hover:border-neutral-950 bg-white hover:bg-[#fafafa]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950">
                        <span className="font-serif italic font-bold text-[#003087] text-sm leading-none">P</span>
                        PayPal
                      </span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full inline-block shrink-0 ${
                          selectedPaymentMethod === "PAYPAL"
                            ? "border-4 border-neutral-950"
                            : "border border-neutral-400"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-[11px] text-neutral-500 block">
                      PayPal Express Checkout
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPaymentMethod("CRYPTO");
                      setError("");
                    }}
                    aria-pressed={selectedPaymentMethod === "CRYPTO"}
                    className={`p-3.5 rounded-xs text-left transition-colors cursor-pointer ${
                      selectedPaymentMethod === "CRYPTO"
                        ? "border-2 border-neutral-950 bg-[#fafafa]"
                        : "border border-[#cccccc] hover:border-neutral-950 bg-white hover:bg-[#fafafa]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950">
                        <Wallet className="w-3.5 h-3.5 text-[#047857]" aria-hidden="true" />
                        Crypto
                      </span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full inline-block shrink-0 ${
                          selectedPaymentMethod === "CRYPTO"
                            ? "border-4 border-neutral-950"
                            : "border border-neutral-400"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-[11px] text-neutral-600 block">
                      BTC · ETH · SOL
                    </span>
                  </button>
                </div>
              </div>

              {selectedPaymentMethod === "CARD" ? (
                <div className="border border-[#d4d4d4] bg-[#fafafa] p-5 rounded-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-950">
                      <CreditCard className="w-4 h-4 text-neutral-700" aria-hidden="true" />
                      Card Details
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                      <Lock className="w-3 h-3" aria-hidden="true" />
                      TLS Encrypted
                    </span>
                  </div>

                  <div>
                    <label htmlFor="cardName" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      Name on Card <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cardName"
                      type="text"
                      required
                      autoComplete="cc-name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. Alexander Wright"
                      className="w-full px-3.5 py-3 bg-white border border-[#cccccc] focus:border-black focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="cardNumber" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      inputMode="numeric"
                      required
                      autoComplete="cc-number"
                      maxLength={23}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumberInput(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3.5 py-3 bg-white border border-[#cccccc] focus:border-black focus:outline-none rounded-none text-sm font-mono text-neutral-900 placeholder:text-neutral-400 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="cardExpiry" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                        Expiration (MM/YY) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cardExpiry"
                        type="text"
                        inputMode="numeric"
                        required
                        autoComplete="cc-exp"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiryInput(e.target.value))}
                        placeholder="08/28"
                        className="w-full px-3.5 py-3 bg-white border border-[#cccccc] focus:border-black focus:outline-none rounded-none text-sm font-mono text-neutral-900 placeholder:text-neutral-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="cardCvc" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                        Security Code (CVC) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cardCvc"
                        type="password"
                        inputMode="numeric"
                        required
                        autoComplete="cc-csc"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="•••"
                        className="w-full px-3.5 py-3 bg-white border border-[#cccccc] focus:border-black focus:outline-none rounded-none text-sm font-mono text-neutral-900 placeholder:text-neutral-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="cardBillingZip" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                        Billing ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cardBillingZip"
                        type="text"
                        required
                        autoComplete="postal-code"
                        value={cardBillingZip}
                        onChange={(e) => setCardBillingZip(e.target.value)}
                        placeholder="10021"
                        className="w-full px-3.5 py-3 bg-white border border-[#cccccc] focus:border-black focus:outline-none rounded-none text-sm font-mono text-neutral-900 placeholder:text-neutral-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ) : selectedPaymentMethod === "PAYPAL" ? (
                <div className="border border-[#d4d4d4] bg-[#fafafa] p-5 rounded-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-950">
                      <span className="font-serif italic font-bold text-[#003087] text-base leading-none">P</span>
                      PayPal Express Checkout
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#003087] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      Buyer Protection
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Enter your PayPal account information below to proceed with final payment authorization for{" "}
                    <strong className="font-mono text-neutral-950">{formatPrice(totalCents)}</strong>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="paypalEmail" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                        PayPal Account Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="paypalEmail"
                        type="email"
                        required
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-3 bg-white border border-[#cccccc] focus:border-black focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="paypalName" className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                        PayPal Account Holder Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="paypalName"
                        type="text"
                        required
                        value={paypalName}
                        onChange={(e) => setPaypalName(e.target.value)}
                        placeholder="e.g. Alexander Wright"
                        className="w-full px-3.5 py-3 bg-white border border-[#cccccc] focus:border-black focus:outline-none rounded-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      id="paypalAuthorized"
                      type="checkbox"
                      required
                      checked={paypalAuthorized}
                      onChange={(e) => setPaypalAuthorized(e.target.checked)}
                      className="mt-1 h-3.5 w-3.5 text-neutral-950 border-neutral-300 rounded-none focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="paypalAuthorized" className="text-xs text-neutral-600 cursor-pointer leading-relaxed">
                      I authorize Northstar Supply to submit this order total of {formatPrice(totalCents)} to PayPal Express for final checkout authorization.
                    </label>
                  </div>
                </div>
              ) : selectedPaymentMethod === "CRYPTO" ? (
                <>
                  {/* 3 Supported Assets Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(Object.keys(CRYPTO_CONFIG) as CryptoCurrency[]).map((coinKey) => {
                      const coin = CRYPTO_CONFIG[coinKey];
                      const isSelected = cryptoCurrency === coinKey;
                      const coinRate = liveRates[coinKey]?.price || coin.rateUsd;
                      const coinAmount = calculateCryptoAmount(totalCents, coinRate, coin.decimals);

                      return (
                        <button
                          key={coinKey}
                          type="button"
                          onClick={() => setCryptoCurrency(coinKey)}
                          className={`p-3.5 border text-center transition-all cursor-pointer rounded-xs flex flex-col items-center justify-center ${
                            isSelected
                              ? "border-neutral-950 bg-[#fafafa] shadow-xs ring-1 ring-neutral-950"
                              : "border-[#cccccc] bg-white hover:border-neutral-400"
                          }`}
                        >
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2 shadow-2xs"
                            style={{ backgroundColor: coin.accentColor }}
                          >
                            {coin.icon}
                          </span>
                          <strong className="text-xs text-neutral-950 font-semibold block">
                            {coin.name}
                          </strong>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-mono">
                            {coin.symbol}
                          </span>
                          <span className="text-xs font-mono font-bold text-neutral-950 mt-1">
                            {coinAmount} {coin.symbol}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Deposit Address Box */}
                  <div className="border border-[#d4d4d4] bg-[#fafafa] p-5 rounded-xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <CryptoQRCode
                        address={currentCrypto.address}
                        symbol={cryptoCurrency}
                        amount={calculatedCryptoAmount}
                        size={140}
                        showWalletLink={true}
                        className="shrink-0"
                      />

                      <div className="flex-1 min-w-0 space-y-3 w-full">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                              {currentCrypto.name} Escrow Address
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(currentCrypto.address, "addr")}
                              className="text-[11px] font-semibold uppercase tracking-wider text-[#a3702b] hover:underline cursor-pointer"
                            >
                              {copiedField === "addr" ? "Copied" : "Copy"}
                            </button>
                          </div>
                          <div className="p-2.5 bg-white border border-[#cccccc] font-mono text-xs text-neutral-900 break-all select-all">
                            {currentCrypto.address}
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                              Amount to Send
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(calculatedCryptoAmount, "amt")}
                              className="text-[11px] font-semibold uppercase tracking-wider text-[#a3702b] hover:underline cursor-pointer"
                            >
                              {copiedField === "amt" ? "Copied" : "Copy"}
                            </button>
                          </div>
                          <div className="p-2.5 bg-white border border-[#cccccc] flex justify-between items-center">
                            <span className="font-mono text-sm font-bold text-neutral-950">
                              {calculatedCryptoAmount} {currentCrypto.symbol}
                            </span>
                            <span className="text-xs text-neutral-500 font-mono">
                              ≈ {formatPrice(totalCents)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-600 border-t border-[#dcdcdc] pt-3 leading-relaxed space-y-1">
                      <p>
                        Send only <strong>{currentCrypto.name}</strong> via <strong>{currentCrypto.network}</strong>. After clicking complete order below, a live blockchain listener opens with payment confirmation status and transaction ID.
                      </p>
                      <p className="text-amber-900">
                        <strong>Disclosure:</strong> On-chain crypto transfers do not carry card-style chargebacks; refunds are governed by our written{" "}
                        <Link href="/buyer-protection" className="underline font-semibold">
                          Buyer Protection Policy
                        </Link>{" "}
                        at full USD invoice value via your Refund Return Wallet.
                      </p>
                    </div>
                  </div>

                  {/* Refund Return Wallet Field */}
                  <div className="border-t border-[#e5e5e5] pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <label htmlFor="refundWallet" className="block text-xs font-semibold uppercase tracking-wider text-neutral-800">
                        Refund Return Wallet Address{" "}
                        <span className="text-[#047857] font-medium lowercase">(optional · 14-day return protection)</span>
                      </label>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {refundNetworkInfo.label}
                      </span>
                    </div>
                    <input
                      id="refundWallet"
                      name="refundWallet"
                      type="text"
                      value={refundWallet}
                      onChange={(e) => setRefundWallet(e.target.value)}
                      placeholder={`Your personal ${cryptoCurrency} address (${refundNetworkInfo.example}) for any return refund`}
                      aria-invalid={Boolean(refundWallet.trim()) && !refundWalletCheck.valid}
                      className={`w-full px-3.5 py-2.5 bg-[#f7f7f7] border focus:bg-white focus:outline-none rounded-none text-xs font-mono text-neutral-900 placeholder:text-neutral-400 transition-colors ${
                        refundWallet.trim() && !refundWalletCheck.valid
                          ? "border-red-500 focus:border-red-600"
                          : refundWallet.trim() && refundWalletCheck.valid
                          ? "border-[#047857] focus:border-[#047857]"
                          : "border-[#cccccc] focus:border-black"
                      }`}
                    />
                    {refundWallet.trim() && !refundWalletCheck.valid ? (
                      <p className="text-[11px] text-red-600 mt-1.5 font-medium" role="alert">
                        {refundWalletCheck.error}
                      </p>
                    ) : refundWallet.trim() && refundWalletCheck.valid ? (
                      <p className="text-[11px] text-[#047857] mt-1.5 font-medium">
                        ✓ Valid {cryptoCurrency} return address registered. Any approved 14-day return will be refunded to this address.
                      </p>
                    ) : null}
                    <p className="text-[11px] text-neutral-500 mt-1.5 leading-relaxed">
                      <strong>Does not change where you pay:</strong> your payment still goes to Northstar&apos;s deposit address above. Paying from Coinbase, Kraken, or Cash App? Adding your personal return wallet ensures any 14-day refund settles directly to you—never a shared exchange hot wallet.
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-4 border border-dashed border-[#cccccc] bg-[#fafafa] rounded-xs text-xs text-neutral-600">
                  Choose a payment method above to enter your payment details and complete your order.
                </div>
              )}
            </section>

            {/* Buyer Protection & Policy Transparency Strip */}
            <div className="p-4 bg-[#fafafa] border border-[#dcdcdc] rounded-xs text-xs text-neutral-700 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <strong className="text-neutral-950 uppercase tracking-wider text-[11px]">
                  Northstar Buyer Protection · No Unexpected Charges
                </strong>
                <div className="flex flex-wrap gap-3 text-[11px] font-semibold">
                  <Link href="/buyer-protection" className="text-[#047857] hover:underline">
                    Buyer Protection →
                  </Link>
                  <Link href="/returns-refunds" className="text-neutral-700 hover:underline">
                    Refund Policy →
                  </Link>
                  <Link href="/shipping" className="text-neutral-700 hover:underline">
                    Shipping →
                  </Link>
                  <Link href="/contact" className="text-neutral-700 hover:underline">
                    Support →
                  </Link>
                </div>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                100% insured courier delivery with signature required, lifetime authenticity guarantee, 14-day eligible returns, and direct client support at support@shopnorthstar.store.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                {error}
              </div>
            )}

            {/* Complete Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-600 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
              style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
            >
              <span style={{ color: "#ffffff" }}>
                {loading
                  ? selectedPaymentMethod === "CARD"
                    ? "Authorizing Card Payment..."
                    : selectedPaymentMethod === "PAYPAL"
                    ? "Connecting to PayPal Express..."
                    : "Processing Order and Registering Escrow..."
                  : selectedPaymentMethod === "CARD"
                  ? `Pay ${formatPrice(totalCents)} with Card`
                  : selectedPaymentMethod === "PAYPAL"
                  ? `Continue to PayPal · ${formatPrice(totalCents)}`
                  : selectedPaymentMethod === "CRYPTO"
                  ? `Complete Protected Order · ${calculatedCryptoAmount} ${currentCrypto.symbol}`
                  : "Complete Order"}
              </span>
            </button>

            <p className="text-center text-xs text-neutral-500">
              Guaranteed 24-hour USA delivery · 14-day return protection · 100% lifetime authenticity guarantee.
            </p>
          </form>
        </div>

        {/* Right Column: Order Summary (Shopify sticky sidebar style) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white border border-[#dcdcdc] p-6 sm:p-8 rounded-xs shadow-2xs space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 pb-4 border-b border-[#dcdcdc]">
              Order Summary ({cart.length})
            </h2>

            {/* Line items list */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.size || "std"}`} className="flex items-center gap-4 py-2 border-b border-[#e5e5e5] last:border-none">
                  <div className="relative w-16 h-20 bg-white shrink-0 border border-[#e5e5e5] rounded-xs overflow-hidden">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold">
                      {item.qty}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-medium text-neutral-950 leading-snug truncate">
                      {item.name}
                    </h3>
                    {item.size && (
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-600 block mt-0.5">
                        Size: {item.size}
                      </span>
                    )}
                    <span className="text-[11px] text-neutral-500 block mt-0.5 font-mono">
                      {formatPrice(item.priceCents)} each
                    </span>
                  </div>

                  <span className="text-xs font-mono font-semibold text-neutral-950">
                    {formatPrice(item.priceCents * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Discount Code Input */}
            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount code or promo"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#f7f7f7] border border-[#cccccc] focus:border-black focus:bg-white focus:outline-none rounded-none text-xs text-neutral-900 placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (discountCode.trim()) {
                      setDiscountApplied(true);
                    }
                  }}
                  className="px-4 py-2 bg-[#e5e5e5] hover:bg-[#d4d4d4] text-neutral-800 text-xs font-semibold uppercase tracking-wider border border-[#cccccc] transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {discountApplied && (
                <span className="text-[11px] text-[#047857] block mt-1 font-medium">
                  10% luxury promotion applied
                </span>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-[#dcdcdc] space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-mono text-neutral-950 font-medium">{formatPrice(subtotalCents)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-[#047857]">
                  <span>Promotion (10% off)</span>
                  <span className="font-mono font-medium">-{formatPrice(discountCents)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Insured Express Shipping (1–2 Business Days)</span>
                <span className="text-[#047857] font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-mono text-neutral-950">{formatPrice(taxCents)}</span>
              </div>
              <div className="pt-4 border-t border-[#dcdcdc] flex justify-between items-baseline">
                <span className="text-sm font-semibold text-neutral-950">Total</span>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-neutral-950 block">
                    {formatPrice(totalCents)}
                  </span>
                  {selectedPaymentMethod === "CRYPTO" && (
                    <span className="text-xs font-mono font-semibold text-[#a3702b] block">
                      ≈ {calculatedCryptoAmount} {currentCrypto.symbol}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-[#dcdcdc] space-y-2 text-[11px] text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="text-[#047857]">✓</span>
                <span>Guaranteed 24-Hour delivery to any US address</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#047857]">✓</span>
                <span>100% lifetime authenticity guarantee with certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#047857]">✓</span>
                <span>Complimentary 14-day returns &amp; buyer protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
