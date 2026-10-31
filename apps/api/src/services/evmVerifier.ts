import { HDKey } from "@scure/bip32";
import { Counter } from "../models/index.js";
import { CIRCLE_ETHEREUM_USDC, readEvmConfig, type EvmConfig } from "../config/env.js";
import type { ChainVerifier, PaymentLike, PaymentObservationInput, PaymentTarget } from "./paymentTypes.js";
import { bytesToHex, createPublicClient, formatEther, formatUnits, http, type Address, type Hex, type PublicClient } from "viem";
import { publicKeyToAddress } from "viem/accounts";
import { mainnet } from "viem/chains";

const transferEvent = {
  type: "event",
  name: "Transfer",
  inputs: [
    { indexed: true, name: "from", type: "address" },
    { indexed: true, name: "to", type: "address" },
    { indexed: false, name: "value", type: "uint256" }
  ]
} as const;

type EvmClient = Pick<PublicClient, "getBlockNumber" | "getBlock" | "getLogs">;

type EvmVerifierOptions = EvmConfig & {
  client?: EvmClient;
  counterKey?: string;
};

export class EvmVerifier implements ChainVerifier {
  readonly requiredFinality: number;
  private readonly client: EvmClient;
  private readonly usdcAddress: Address;
  private readonly scanBlocks: bigint;
  private readonly counterKey: string;

  constructor(private readonly options: EvmVerifierOptions) {
    this.requiredFinality = options.confirmations;
    this.client = options.client ?? createPublicClient({ chain: mainnet, transport: http(options.rpcUrl) });
    this.usdcAddress = options.usdcAddress as Address;
    this.scanBlocks = options.scanBlocks;
    this.counterKey = options.counterKey ?? "evm-ethereum-mainnet-deposit";
  }

  static fromEnv() {
    return new EvmVerifier(readEvmConfig());
  }

  async createPaymentTarget(_order: unknown, asset: string): Promise<PaymentTarget> {
    const normalizedAsset = asset.toUpperCase();
    if (normalizedAsset !== "ETH" && normalizedAsset !== "USDC") throw new Error(`Unsupported EVM asset: ${asset}`);
    const startBlock = await this.client.getBlockNumber();
    const counter = await Counter.findOneAndUpdate(
      { _id: this.counterKey },
      { $inc: { value: 1 } },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    ).lean();
    if (!counter) throw new Error("Unable to allocate an EVM deposit index");
    const index = counter.value - 1;
    const account = HDKey.fromExtendedKey(this.options.xpub).deriveChild(index);
    if (!account.publicKey) throw new Error("EVM XPUB did not derive a public key");
    return { network: `ethereum:${this.options.chainId}`, depositAddress: publicKeyToAddress(bytesToHex(account.publicKey)), startBlock: String(startBlock) };
  }

  async findPayment(payment: PaymentLike): Promise<PaymentObservationInput[]> {
    if (payment.network !== `ethereum:${this.options.chainId}`) return [];
    const latest = await this.client.getBlockNumber();
    const anchored = payment.startBlock ? BigInt(payment.startBlock) : latest > this.scanBlocks ? latest - this.scanBlocks : 0n;
    const fromBlock = payment.startBlock ? anchored : latest > this.scanBlocks ? latest - this.scanBlocks : 0n;
    const toBlock = latest;
    const observations: PaymentObservationInput[] = [];
    if (payment.asset === "ETH") {
      for (let blockNumber = fromBlock; blockNumber <= toBlock; blockNumber += 1n) {
        const block = await this.client.getBlock({ blockNumber, includeTransactions: true });
        for (const transaction of block.transactions as readonly unknown[]) {
          const candidate = transaction as { to?: Address | null; value: bigint; hash: Hex };
          if (candidate.to?.toLowerCase() !== payment.depositAddress.toLowerCase() || candidate.value <= 0n) continue;
          observations.push({ network: payment.network, txRef: candidate.hash, logIndex: 0, asset: "ETH", amount: formatEther(candidate.value), confirmations: Number(latest - blockNumber + 1n), raw: transaction });
        }
      }
    } else if (payment.asset === "USDC") {
      const logs = await this.client.getLogs({ address: this.usdcAddress, event: transferEvent, args: { to: payment.depositAddress as Address }, fromBlock, toBlock });
      const seen = new Set<string>();
      for (const log of logs) {
        if (log.address?.toLowerCase() !== this.usdcAddress.toLowerCase()) continue;
        const txRef = log.transactionHash;
        const logIndex = Number(log.logIndex);
        const key = `${txRef}:${logIndex}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const value = log.args.value;
        if (!txRef || value === undefined || log.blockNumber === null) continue;
        observations.push({ network: payment.network, txRef, logIndex, asset: "USDC", amount: formatUnits(value, 6), confirmations: Number(latest - log.blockNumber + 1n), raw: log });
      }
    }
    return observations;
  }
}

export function createEvmVerifierFromEnv() {
  const config = readEvmConfig();
  if (config.usdcAddress.toLowerCase() !== CIRCLE_ETHEREUM_USDC.toLowerCase()) throw new Error("Unexpected Ethereum USDC address");
  return new EvmVerifier(config);
}
