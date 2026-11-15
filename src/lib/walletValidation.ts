export type SupportedCryptoAsset = "BTC" | "ETH" | "SOL" | "USDC";

const STORE_ESCROW_ADDRESSES = new Set([
  "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu",
  "0x120d139db706614f71e470a97852679f6faebcb7",
  "x2ro74harbz2xkdj57ymmskfd3cs4y9xfktzseqkcq1",
]);

export function getNetworkExample(asset: SupportedCryptoAsset): { label: string; example: string } {
  switch (asset) {
    case "BTC":
      return { label: "Bitcoin Mainnet (bc1..., 1..., or 3...)", example: "bc1q..." };
    case "ETH":
      return { label: "Ethereum Mainnet ERC-20 (0x...)", example: "0x..." };
    case "USDC":
      return { label: "USD Coin ERC-20 on Ethereum (0x...)", example: "0x..." };
    case "SOL":
      return { label: "Solana SPL Mainnet (Base58)", example: "Solana public key" };
  }
}

export function validateRefundWallet(
  address: string | undefined | null,
  asset: SupportedCryptoAsset
): { valid: boolean; cleaned?: string; error?: string } {
  const trimmed = (address ?? "").trim();
  if (!trimmed) {
    return { valid: true, cleaned: undefined };
  }

  if (STORE_ESCROW_ADDRESSES.has(trimmed.toLowerCase())) {
    return {
      valid: false,
      error: "Please enter your own personal receiving wallet address—not Northstar's deposit address.",
    };
  }

  if (asset === "BTC") {
    const isBech32 = /^bc1[ac-hj-np-z02-9]{25,62}$/i.test(trimmed);
    const isBase58 = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(trimmed);
    if (!isBech32 && !isBase58) {
      return {
        valid: false,
        error: "Invalid Bitcoin return address. Enter a valid BTC Native SegWit (bc1...) or Legacy/P2SH (1... / 3...) address.",
      };
    }
    return { valid: true, cleaned: trimmed };
  }

  if (asset === "ETH" || asset === "USDC") {
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      return {
        valid: false,
        error: `Invalid ${asset} ERC-20 return address. Enter a 42-character Ethereum address starting with 0x.`,
      };
    }
    return { valid: true, cleaned: trimmed };
  }

  if (asset === "SOL") {
    const looksLikeEvmOrBtc = /^0x/i.test(trimmed) || /^bc1/i.test(trimmed);
    const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed);
    if (looksLikeEvmOrBtc || !isSolana) {
      return {
        valid: false,
        error: "Invalid Solana return address. Enter a valid 32–44 character Solana SPL Base58 address.",
      };
    }
    return { valid: true, cleaned: trimmed };
  }

  return { valid: true, cleaned: trimmed };
}
