"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

interface CryptoQRCodeProps {
  address: string;
  symbol?: string;
  amount?: string;
  size?: number;
  className?: string;
  showWalletLink?: boolean;
}

export function CryptoQRCode({
  address,
  symbol = "BTC",
  amount,
  size = 160,
  className = "",
  showWalletLink = true,
}: CryptoQRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [format, setFormat] = useState<"uri" | "raw">("uri");
  const [copied, setCopied] = useState(false);

  // Construct standard BIP21 / EIP-681 / crypto wallet URI or raw address
  const paymentUri = React.useMemo(() => {
    if (format === "raw") return address;

    const sym = symbol.toUpperCase();
    if (sym === "BTC") {
      return amount && parseFloat(amount) > 0
        ? `bitcoin:${address}?amount=${amount}`
        : `bitcoin:${address}`;
    } else if (sym === "ETH") {
      return amount && parseFloat(amount) > 0
        ? `ethereum:${address}?value=${amount}`
        : `ethereum:${address}`;
    } else if (sym === "SOL") {
      return amount && parseFloat(amount) > 0
        ? `solana:${address}?amount=${amount}`
        : `solana:${address}`;
    }
    return address;
  }, [address, symbol, amount, format]);

  useEffect(() => {
    let isMounted = true;
    if (!paymentUri) return;

    QRCode.toDataURL(paymentUri, {
      margin: 1,
      width: Math.max(size * 2, 320),
      errorCorrectionLevel: "M",
      color: {
        dark: "#111111",
        light: "#ffffff",
      },
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err) => {
        console.error("Failed to generate QR code:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [paymentUri, size]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const badgeSymbol = symbol === "BTC" ? "₿" : symbol === "ETH" ? "Ξ" : "◎";
  const badgeColor =
    symbol === "BTC" ? "#f7931a" : symbol === "ETH" ? "#627eea" : "#14f195";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* QR Code Container */}
      <div
        className="relative bg-white p-2.5 border border-[#d6d2c8] rounded-xs shadow-sm flex items-center justify-center transition-all hover:border-neutral-900"
        style={{ width: size + 16, height: size + 16 }}
      >
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt={`${symbol} Payment QR Code`}
            width={size}
            height={size}
            className="w-full h-full object-contain block select-none"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-neutral-100 text-[11px] text-neutral-400 font-mono animate-pulse"
            style={{ width: size, height: size }}
          >
            Generating QR...
          </div>
        )}

        {/* Center Symbol Pill for visual polish */}
        <div
          className="absolute inset-0 m-auto w-7 h-7 rounded-full border-2 border-white shadow-md flex items-center justify-center font-bold text-xs pointer-events-none"
          style={{ backgroundColor: badgeColor, color: "#ffffff" }}
        >
          {badgeSymbol}
        </div>
      </div>

      {/* Format Toggle & Action Links */}
      <div className="mt-2.5 flex flex-col items-center gap-1.5 w-full text-center">
        <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setFormat("uri")}
            className={`cursor-pointer transition-colors ${
              format === "uri"
                ? "font-bold text-neutral-950 underline underline-offset-2"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Wallet Format
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setFormat("raw")}
            className={`cursor-pointer transition-colors ${
              format === "raw"
                ? "font-bold text-neutral-950 underline underline-offset-2"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Plain Address
          </button>
        </div>

        {showWalletLink && (
          <div className="flex items-center gap-2 text-[11px] text-neutral-600">
            {symbol === "BTC" ? (
              <a
                href={`bitcoin:${address}${amount ? `?amount=${amount}` : ""}`}
                className="text-[#f7931a] hover:underline font-medium"
              >
                Open in Bitcoin Wallet ↗
              </a>
            ) : symbol === "ETH" ? (
              <a
                href={`ethereum:${address}${amount ? `?value=${amount}` : ""}`}
                className="text-[#627eea] hover:underline font-medium"
              >
                Open in Ethereum Wallet ↗
              </a>
            ) : (
              <a
                href={`solana:${address}${amount ? `?amount=${amount}` : ""}`}
                className="text-[#10b981] hover:underline font-medium"
              >
                Open in Solana Wallet ↗
              </a>
            )}
            <span>•</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-neutral-600 hover:text-neutral-950 underline cursor-pointer"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
