export type SupportedChain = "BTC" | "ETH" | "SOL";

export type VerificationState = "paid" | "confirming" | "awaiting_payment" | "provider_error";

export interface OnChainVerificationResult {
  verified: boolean;
  status: VerificationState;
  txHash?: string;
  receivedAmount?: string;
  confirmations?: number;
  explorerUrl?: string;
  message: string;
  checkedAt: string;
}

interface MempoolTxVout {
  scriptpubkey_address?: string;
  value?: number;
}

interface MempoolTx {
  txid: string;
  status?: {
    confirmed?: boolean;
    block_height?: number;
    block_time?: number;
  };
  vout?: MempoolTxVout[];
}

interface BlockscoutTx {
  hash?: string;
  status?: string;
  result?: string;
  value?: string;
  to?: { hash?: string } | null;
  timestamp?: string;
  confirmations?: number;
}

interface AlchemyAssetTransfer {
  hash?: string;
  to?: string | null;
  value?: number | null;
  rawContract?: {
    value?: string | null;
  };
  metadata?: {
    blockTimestamp?: string;
  };
  blockNum?: string;
}

interface AlchemyTxObject {
  hash?: string;
  to?: string | null;
  value?: string;
  blockNumber?: string | null;
}

interface AlchemyTxReceipt {
  status?: string;
  blockNumber?: string;
}

const DEFAULT_ALCHEMY_ETH_RPC_URL = "https://eth-mainnet.g.alchemy.com/v2/alch_JIm6rWxy-2Jq7VueWXTEO";
const DEFAULT_ALCHEMY_SOL_RPC_URL = "https://solana-mainnet.g.alchemy.com/v2/alch_5G8ByIS5uLu2nPWSLvVK0";
const FALLBACK_SOL_RPC_URL = "https://api.mainnet-beta.solana.com";

function getAlchemyEthRpcUrl(): string {
  return process.env.ALCHEMY_ETH_RPC_URL?.trim() || DEFAULT_ALCHEMY_ETH_RPC_URL;
}

function getSolanaRpcUrls(): string[] {
  const custom = process.env.ALCHEMY_SOL_RPC_URL?.trim();
  const primary = custom || DEFAULT_ALCHEMY_SOL_RPC_URL;
  return primary === FALLBACK_SOL_RPC_URL ? [primary] : [primary, FALLBACK_SOL_RPC_URL];
}

async function callSolanaRpc<T>(method: string, params: unknown[], timeoutMs = 4500): Promise<T> {
  const urls = getSolanaRpcUrls();
  let lastError: unknown = null;

  for (const rpcUrl of urls) {
    try {
      const resp = await fetchJsonWithTimeout<{ result?: T; error?: { message?: string } }>(
        rpcUrl,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method,
            params,
          }),
        },
        timeoutMs
      );
      if (resp.error) {
        throw new Error(resp.error.message || `Solana RPC error on ${method}`);
      }
      return resp.result as T;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Solana RPC failed on ${method}`);
}

async function callAlchemyEthRpc<T>(rpcUrl: string, method: string, params: unknown[], timeoutMs = 4500): Promise<T> {
  const resp = await fetchJsonWithTimeout<{ result?: T; error?: { message?: string } }>(
    rpcUrl,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    },
    timeoutMs
  );
  if (resp.error) {
    throw new Error(resp.error.message || `Alchemy RPC error on ${method}`);
  }
  return resp.result as T;
}

function pow10BigInt(decimals: number): bigint {
  return BigInt("1" + "0".repeat(Math.max(0, decimals)));
}

function parseDecimalToScaledBigInt(amountStr: string, decimals: number): bigint {
  const clean = String(amountStr || "0").trim();
  if (!/^\d+(\.\d+)?$/.test(clean)) return BigInt(0);
  const [wholePart, fracPart = ""] = clean.split(".");
  const paddedFrac = (fracPart + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(wholePart || "0") * pow10BigInt(decimals) + BigInt(paddedFrac || "0");
}

function formatScaledBigInt(value: bigint, decimals: number): string {
  const factor = pow10BigInt(decimals);
  const whole = value / factor;
  const frac = (value % factor).toString().padStart(decimals, "0");
  return `${whole.toString()}.${frac}`;
}

async function fetchJsonWithTimeout<T>(url: string, init?: RequestInit, timeoutMs = 4500): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} from ${url}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export function getExplorerTxUrl(chain: SupportedChain, txHash: string): string {
  if (chain === "BTC") return `https://mempool.space/tx/${txHash}`;
  if (chain === "ETH") return `https://eth.blockscout.com/tx/${txHash}`;
  return `https://solscan.io/tx/${txHash}`;
}

export function getExplorerAddressUrl(chain: SupportedChain, address: string): string {
  if (chain === "BTC") return `https://mempool.space/address/${address}`;
  if (chain === "ETH") return `https://eth.blockscout.com/address/${address}`;
  return `https://solscan.io/account/${address}`;
}

export async function fetchBaselineTxIds(chain: SupportedChain, address: string): Promise<string[]> {
  try {
    if (chain === "BTC") {
      const txs = await fetchJsonWithTimeout<MempoolTx[]>(
        `https://mempool.space/api/address/${encodeURIComponent(address)}/txs`,
        undefined,
        2500
      );
      return Array.isArray(txs) ? txs.map((t) => t.txid).filter(Boolean) : [];
    }

    if (chain === "ETH") {
      const alchemyUrl = getAlchemyEthRpcUrl();
      if (alchemyUrl) {
        try {
          const result = await callAlchemyEthRpc<{ transfers?: AlchemyAssetTransfer[] }>(
            alchemyUrl,
            "alchemy_getAssetTransfers",
            [
              {
                fromBlock: "0x0",
                toBlock: "latest",
                toAddress: address,
                category: ["external", "internal"],
                excludeZeroValue: true,
                maxCount: "0x14",
                order: "desc",
              },
            ],
            2500
          );
          return Array.isArray(result?.transfers)
            ? result.transfers.map((t) => t.hash).filter((h): h is string => Boolean(h))
            : [];
        } catch {
          // Fall back to Blockscout below
        }
      }

      const data = await fetchJsonWithTimeout<{ items?: BlockscoutTx[] }>(
        `https://eth.blockscout.com/api/v2/addresses/${encodeURIComponent(address)}/transactions`,
        undefined,
        2500
      );
      return Array.isArray(data?.items)
        ? data.items.map((t) => t.hash).filter((h): h is string => Boolean(h))
        : [];
    }

    const solResult = await callSolanaRpc<Array<{ signature?: string }>>(
      "getSignaturesForAddress",
      [address, { limit: 20 }],
      2500
    );
    return Array.isArray(solResult)
      ? solResult.map((r) => r.signature).filter((s): s is string => Boolean(s))
      : [];
  } catch {
    return [];
  }
}

async function verifyBitcoinPayment(params: {
  address: string;
  expectedAmountStr: string;
  createdAtMs: number;
  baselineTxIds: Set<string>;
  claimedTxIds: Set<string>;
  manualTxHash?: string;
}): Promise<OnChainVerificationResult> {
  const checkedAt = new Date().toISOString();
  const expectedSats = parseDecimalToScaledBigInt(params.expectedAmountStr, 8);
  const minAcceptedSats = (expectedSats * BigInt(98)) / BigInt(100);
  const createdUnix = Math.floor(params.createdAtMs / 1000);

  let txs: MempoolTx[] = [];

  if (params.manualTxHash) {
    try {
      const singleTx = await fetchJsonWithTimeout<MempoolTx>(
        `https://mempool.space/api/tx/${encodeURIComponent(params.manualTxHash.trim())}`
      );
      if (singleTx?.txid) txs = [singleTx];
    } catch {
      // Fallback to address listing
    }
  }

  if (txs.length === 0) {
    try {
      txs = await fetchJsonWithTimeout<MempoolTx[]>(
        `https://mempool.space/api/address/${encodeURIComponent(params.address)}/txs`
      );
    } catch {
      try {
        txs = await fetchJsonWithTimeout<MempoolTx[]>(
          `https://blockstream.info/api/address/${encodeURIComponent(params.address)}/txs`
        );
      } catch {
        return {
          verified: false,
          status: "provider_error",
          message: "Unable to reach Mempool.space right now. Retrying automatically...",
          checkedAt,
        };
      }
    }
  }

  if (!Array.isArray(txs)) {
    return {
      verified: false,
      status: "awaiting_payment",
      message: "Listening on Bitcoin Mempool for incoming transfer...",
      checkedAt,
    };
  }

  let bestUnconfirmed: { txid: string; sats: bigint } | null = null;

  for (const tx of txs) {
    if (!tx?.txid) continue;
    if (params.claimedTxIds.has(tx.txid)) continue;
    if (!params.manualTxHash && params.baselineTxIds.has(tx.txid)) continue;

    const receivedSats = (tx.vout || []).reduce((sum, out) => {
      if (out.scriptpubkey_address === params.address && typeof out.value === "number") {
        return sum + BigInt(Math.round(out.value));
      }
      return sum;
    }, BigInt(0));

    if (receivedSats < minAcceptedSats || receivedSats <= BigInt(0)) continue;

    const isConfirmed = Boolean(tx.status?.confirmed);
    if (isConfirmed) {
      const blockTime = tx.status?.block_time ?? 0;
      if (blockTime > 0 && blockTime < createdUnix - 180 && !params.manualTxHash) {
        continue;
      }
      return {
        verified: true,
        status: "paid",
        txHash: tx.txid,
        receivedAmount: formatScaledBigInt(receivedSats, 8),
        confirmations: 1,
        explorerUrl: getExplorerTxUrl("BTC", tx.txid),
        message: "Bitcoin payment confirmed on-chain.",
        checkedAt,
      };
    }

    if (!bestUnconfirmed) {
      bestUnconfirmed = { txid: tx.txid, sats: receivedSats };
    }
  }

  if (bestUnconfirmed) {
    return {
      verified: false,
      status: "confirming",
      txHash: bestUnconfirmed.txid,
      receivedAmount: formatScaledBigInt(bestUnconfirmed.sats, 8),
      confirmations: 0,
      explorerUrl: getExplorerTxUrl("BTC", bestUnconfirmed.txid),
      message: "Bitcoin transaction detected in Mempool (0/1 confirmations). Waiting for block confirmation...",
      checkedAt,
    };
  }

  return {
    verified: false,
    status: "awaiting_payment",
    explorerUrl: getExplorerAddressUrl("BTC", params.address),
    message: params.manualTxHash
      ? "That transaction hash does not match the required amount to this escrow address yet."
      : "Listening on Bitcoin Mempool for incoming transfer...",
    checkedAt,
  };
}

async function verifyEthereumViaAlchemy(params: {
  rpcUrl: string;
  address: string;
  minAcceptedWei: bigint;
  createdAtMs: number;
  baselineTxIds: Set<string>;
  claimedTxIds: Set<string>;
  manualTxHash?: string;
}): Promise<OnChainVerificationResult> {
  const checkedAt = new Date().toISOString();
  const targetAddr = params.address.toLowerCase();

  if (params.manualTxHash) {
    const hash = params.manualTxHash.trim();
    if (!params.claimedTxIds.has(hash)) {
      const [tx, receipt, latestBlockHex] = await Promise.all([
        callAlchemyEthRpc<AlchemyTxObject | null>(params.rpcUrl, "eth_getTransactionByHash", [hash]),
        callAlchemyEthRpc<AlchemyTxReceipt | null>(params.rpcUrl, "eth_getTransactionReceipt", [hash]),
        callAlchemyEthRpc<string>(params.rpcUrl, "eth_blockNumber", []),
      ]);

      if (tx && tx.to?.toLowerCase() === targetAddr) {
        let valueWei = BigInt(0);
        try {
          valueWei = BigInt(tx.value || "0");
        } catch {
          valueWei = BigInt(0);
        }

        if (valueWei >= params.minAcceptedWei && valueWei > BigInt(0)) {
          if (!tx.blockNumber || !receipt) {
            return {
              verified: false,
              status: "confirming",
              txHash: hash,
              receivedAmount: formatScaledBigInt(valueWei, 18),
              confirmations: 0,
              explorerUrl: getExplorerTxUrl("ETH", hash),
              message: "Ethereum transfer detected in mempool. Waiting for block confirmation...",
              checkedAt,
            };
          }

          if (receipt.status === "0x1") {
            const latestNum = Number.parseInt(latestBlockHex || "0x0", 16);
            const txBlockNum = Number.parseInt(receipt.blockNumber || tx.blockNumber, 16);
            const confirmations = Number.isFinite(latestNum) && Number.isFinite(txBlockNum)
              ? Math.max(1, latestNum - txBlockNum + 1)
              : 1;

            return {
              verified: true,
              status: "paid",
              txHash: hash,
              receivedAmount: formatScaledBigInt(valueWei, 18),
              confirmations,
              explorerUrl: getExplorerTxUrl("ETH", hash),
              message: "Ethereum payment confirmed on-chain.",
              checkedAt,
            };
          }
        }
      }
    }

    return {
      verified: false,
      status: "awaiting_payment",
      explorerUrl: getExplorerAddressUrl("ETH", params.address),
      message: "That transaction hash does not match the required ETH transfer to this escrow address.",
      checkedAt,
    };
  }

  const [transfersResult, latestBlockHex] = await Promise.all([
    callAlchemyEthRpc<{ transfers?: AlchemyAssetTransfer[] }>(
      params.rpcUrl,
      "alchemy_getAssetTransfers",
      [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          toAddress: params.address,
          category: ["external", "internal"],
          withMetadata: true,
          excludeZeroValue: true,
          maxCount: "0x14",
          order: "desc",
        },
      ]
    ),
    callAlchemyEthRpc<string>(params.rpcUrl, "eth_blockNumber", []),
  ]);

  const transfers = Array.isArray(transfersResult?.transfers) ? transfersResult.transfers : [];
  const latestBlockNum = Number.parseInt(latestBlockHex || "0x0", 16);

  for (const transfer of transfers) {
    const hash = transfer.hash;
    if (!hash) continue;
    if (params.claimedTxIds.has(hash)) continue;
    if (params.baselineTxIds.has(hash)) continue;
    if (transfer.to?.toLowerCase() !== targetAddr) continue;

    let valueWei = BigInt(0);
    if (transfer.rawContract?.value) {
      try {
        valueWei = BigInt(transfer.rawContract.value);
      } catch {
        valueWei = BigInt(0);
      }
    } else if (typeof transfer.value === "number" && Number.isFinite(transfer.value)) {
      valueWei = parseDecimalToScaledBigInt(transfer.value.toFixed(18), 18);
    }

    if (valueWei < params.minAcceptedWei || valueWei <= BigInt(0)) continue;

    if (transfer.metadata?.blockTimestamp) {
      const txMs = Date.parse(transfer.metadata.blockTimestamp);
      if (Number.isFinite(txMs) && txMs < params.createdAtMs - 180_000) {
        continue;
      }
    }

    const receipt = await callAlchemyEthRpc<AlchemyTxReceipt | null>(
      params.rpcUrl,
      "eth_getTransactionReceipt",
      [hash]
    );

    if (!receipt) {
      return {
        verified: false,
        status: "confirming",
        txHash: hash,
        receivedAmount: formatScaledBigInt(valueWei, 18),
        confirmations: 0,
        explorerUrl: getExplorerTxUrl("ETH", hash),
        message: "Ethereum transfer detected. Waiting for network confirmation...",
        checkedAt,
      };
    }

    if (receipt.status !== "0x1") continue;

    const txBlockNum = Number.parseInt(receipt.blockNumber || transfer.blockNum || "0x0", 16);
    const confirmations = Number.isFinite(latestBlockNum) && Number.isFinite(txBlockNum) && txBlockNum > 0
      ? Math.max(1, latestBlockNum - txBlockNum + 1)
      : 1;

    return {
      verified: true,
      status: "paid",
      txHash: hash,
      receivedAmount: formatScaledBigInt(valueWei, 18),
      confirmations,
      explorerUrl: getExplorerTxUrl("ETH", hash),
      message: "Ethereum payment confirmed on-chain.",
      checkedAt,
    };
  }

  return {
    verified: false,
    status: "awaiting_payment",
    explorerUrl: getExplorerAddressUrl("ETH", params.address),
    message: "Listening on Ethereum mainnet via Alchemy for incoming transfer...",
    checkedAt,
  };
}

async function verifyEthereumPayment(params: {
  address: string;
  expectedAmountStr: string;
  createdAtMs: number;
  baselineTxIds: Set<string>;
  claimedTxIds: Set<string>;
  manualTxHash?: string;
}): Promise<OnChainVerificationResult> {
  const checkedAt = new Date().toISOString();
  const expectedWei = parseDecimalToScaledBigInt(params.expectedAmountStr, 18);
  const minAcceptedWei = (expectedWei * BigInt(98)) / BigInt(100);
  const targetAddr = params.address.toLowerCase();

  const alchemyUrl = getAlchemyEthRpcUrl();
  if (alchemyUrl) {
    try {
      return await verifyEthereumViaAlchemy({
        rpcUrl: alchemyUrl,
        address: params.address,
        minAcceptedWei,
        createdAtMs: params.createdAtMs,
        baselineTxIds: params.baselineTxIds,
        claimedTxIds: params.claimedTxIds,
        manualTxHash: params.manualTxHash,
      });
    } catch {
      // Fall back to Blockscout if Alchemy request fails
    }
  }

  let txs: BlockscoutTx[] = [];

  if (params.manualTxHash) {
    try {
      const tx = await fetchJsonWithTimeout<BlockscoutTx>(
        `https://eth.blockscout.com/api/v2/transactions/${encodeURIComponent(params.manualTxHash.trim())}`
      );
      if (tx?.hash) txs = [tx];
    } catch {
      // Fallback to address listing
    }
  }

  if (txs.length === 0) {
    try {
      const resp = await fetchJsonWithTimeout<{ items?: BlockscoutTx[] }>(
        `https://eth.blockscout.com/api/v2/addresses/${encodeURIComponent(params.address)}/transactions`
      );
      txs = Array.isArray(resp?.items) ? resp.items : [];
    } catch {
      return {
        verified: false,
        status: "provider_error",
        message: "Unable to query Ethereum RPC right now. Retrying automatically...",
        checkedAt,
      };
    }
  }

  for (const tx of txs) {
    const hash = tx.hash;
    if (!hash) continue;
    if (params.claimedTxIds.has(hash)) continue;
    if (!params.manualTxHash && params.baselineTxIds.has(hash)) continue;
    if (tx.to?.hash?.toLowerCase() !== targetAddr) continue;

    let valueWei = BigInt(0);
    try {
      valueWei = BigInt(tx.value || "0");
    } catch {
      valueWei = BigInt(0);
    }

    if (valueWei < minAcceptedWei || valueWei <= BigInt(0)) continue;

    if (tx.timestamp && !params.manualTxHash) {
      const txMs = Date.parse(tx.timestamp);
      if (Number.isFinite(txMs) && txMs < params.createdAtMs - 180_000) {
        continue;
      }
    }

    const confirmations = typeof tx.confirmations === "number" ? tx.confirmations : 0;
    const isOk = tx.status === "ok" || tx.result === "success";

    if (isOk && confirmations >= 1) {
      return {
        verified: true,
        status: "paid",
        txHash: hash,
        receivedAmount: formatScaledBigInt(valueWei, 18),
        confirmations,
        explorerUrl: getExplorerTxUrl("ETH", hash),
        message: "Ethereum payment confirmed on-chain.",
        checkedAt,
      };
    }

    return {
      verified: false,
      status: "confirming",
      txHash: hash,
      receivedAmount: formatScaledBigInt(valueWei, 18),
      confirmations,
      explorerUrl: getExplorerTxUrl("ETH", hash),
      message: "Ethereum transfer detected. Waiting for network confirmation...",
      checkedAt,
    };
  }

  return {
    verified: false,
    status: "awaiting_payment",
    explorerUrl: getExplorerAddressUrl("ETH", params.address),
    message: params.manualTxHash
      ? "That transaction hash does not match the required ETH transfer to this escrow address."
      : "Listening on Ethereum mainnet for incoming transfer...",
    checkedAt,
  };
}

async function verifySolanaPayment(params: {
  address: string;
  expectedAmountStr: string;
  createdAtMs: number;
  baselineTxIds: Set<string>;
  claimedTxIds: Set<string>;
  manualTxHash?: string;
}): Promise<OnChainVerificationResult> {
  const checkedAt = new Date().toISOString();
  const expectedLamports = parseDecimalToScaledBigInt(params.expectedAmountStr, 9);
  const minAcceptedLamports = (expectedLamports * BigInt(98)) / BigInt(100);
  const createdUnix = Math.floor(params.createdAtMs / 1000);

  let candidates: Array<{ signature: string; blockTime?: number | null; err?: unknown }> = [];

  if (params.manualTxHash) {
    candidates = [{ signature: params.manualTxHash.trim() }];
  } else {
    try {
      const sigResult = await callSolanaRpc<Array<{ signature?: string; blockTime?: number | null; err?: unknown }>>(
        "getSignaturesForAddress",
        [params.address, { limit: 15, commitment: "confirmed" }]
      );
      candidates = (Array.isArray(sigResult) ? sigResult : []).filter(
        (r): r is { signature: string; blockTime?: number | null; err?: unknown } => Boolean(r.signature && !r.err)
      );
    } catch {
      return {
        verified: false,
        status: "provider_error",
        message: "Unable to query Solana mainnet RPC right now. Retrying automatically...",
        checkedAt,
      };
    }
  }

  for (const cand of candidates) {
    const sig = cand.signature;
    if (params.claimedTxIds.has(sig)) continue;
    if (!params.manualTxHash && params.baselineTxIds.has(sig)) continue;
    if (cand.blockTime && cand.blockTime < createdUnix - 180 && !params.manualTxHash) continue;

    try {
      const tx = await callSolanaRpc<{
        blockTime?: number | null;
        meta?: {
          err?: unknown;
          preBalances?: number[];
          postBalances?: number[];
        } | null;
        transaction?: {
          message?: {
            accountKeys?: Array<string | { pubkey: string }>;
          };
        };
      } | null>("getTransaction", [
        sig,
        { encoding: "jsonParsed", maxSupportedTransactionVersion: 0, commitment: "confirmed" },
      ]);

      if (!tx || tx.meta?.err) continue;

      if (tx.blockTime && tx.blockTime < createdUnix - 180 && !params.manualTxHash) continue;

      const keys = tx.transaction?.message?.accountKeys || [];
      const accountIndex = keys.findIndex((k) => (typeof k === "string" ? k : k.pubkey) === params.address);
      if (accountIndex === -1) continue;

      const pre = BigInt(tx.meta?.preBalances?.[accountIndex] ?? 0);
      const post = BigInt(tx.meta?.postBalances?.[accountIndex] ?? 0);
      const deltaLamports = post - pre;

      if (deltaLamports >= minAcceptedLamports && deltaLamports > BigInt(0)) {
        return {
          verified: true,
          status: "paid",
          txHash: sig,
          receivedAmount: formatScaledBigInt(deltaLamports, 9),
          confirmations: 32,
          explorerUrl: getExplorerTxUrl("SOL", sig),
          message: "Solana payment confirmed on-chain.",
          checkedAt,
        };
      }
    } catch {
      // Skip individual TX fetch errors
    }
  }

  return {
    verified: false,
    status: "awaiting_payment",
    explorerUrl: getExplorerAddressUrl("SOL", params.address),
    message: params.manualTxHash
      ? "That Solana signature does not match the required SOL transfer to this escrow address."
      : "Listening on Solana mainnet via Alchemy for incoming transfer...",
    checkedAt,
  };
}

export async function verifyOnChainPayment(params: {
  chain: SupportedChain;
  address: string;
  expectedAmountStr: string;
  createdAtIso: string;
  baselineTxIds?: string[];
  claimedTxIds?: string[];
  manualTxHash?: string;
}): Promise<OnChainVerificationResult> {
  const createdAtMs = Date.parse(params.createdAtIso) || Date.now();
  const baseline = new Set(params.baselineTxIds || []);
  const claimed = new Set(params.claimedTxIds || []);
  const manualTx = params.manualTxHash?.trim() || undefined;

  if (params.chain === "BTC") {
    return verifyBitcoinPayment({
      address: params.address,
      expectedAmountStr: params.expectedAmountStr,
      createdAtMs,
      baselineTxIds: baseline,
      claimedTxIds: claimed,
      manualTxHash: manualTx,
    });
  }

  if (params.chain === "ETH") {
    return verifyEthereumPayment({
      address: params.address,
      expectedAmountStr: params.expectedAmountStr,
      createdAtMs,
      baselineTxIds: baseline,
      claimedTxIds: claimed,
      manualTxHash: manualTx,
    });
  }

  return verifySolanaPayment({
    address: params.address,
    expectedAmountStr: params.expectedAmountStr,
    createdAtMs,
    baselineTxIds: baseline,
    claimedTxIds: claimed,
    manualTxHash: manualTx,
  });
}
