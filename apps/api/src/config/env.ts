import { z } from "zod";

const envSchema = z.object({
  EVM_RPC_URL: z.string().url(),
  EVM_XPUB: z.string().regex(/^xpub[1-9A-HJ-NP-Za-km-z]+$/),
  EVM_CHAIN_ID: z.coerce.number().int().default(1),
  EVM_USDC_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  EVM_CONFIRMATIONS: z.coerce.number().int().positive().default(12),
  EVM_SCAN_BLOCKS: z.coerce.bigint().positive().default(50_000n)
});

export const CIRCLE_ETHEREUM_USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as const;

export type EvmConfig = {
  rpcUrl: string;
  xpub: string;
  chainId: number;
  usdcAddress: `0x${string}`;
  confirmations: number;
  scanBlocks: bigint;
};

const bitcoinEnvSchema = z.object({
  BTC_XPUB: z.string().regex(/^xpub[1-9A-HJ-NP-Za-km-z]+$/),
  BTC_CONFIRMATIONS: z.coerce.number().int().positive().default(2),
  BTC_HIGH_VALUE_CONFIRMATIONS: z.coerce.number().int().positive().default(3),
  BTC_HIGH_VALUE_USD_CENTS: z.coerce.number().int().positive().default(100_000)
});

const fraudEnvSchema = z.object({
  FRAUD_HIGH_VALUE_USD_CENTS: z.coerce.number().int().positive().default(100_000),
  FRAUD_NEW_ACCOUNT_HIGH_VALUE_CENTS: z.coerce.number().int().positive().default(250_000),
  FRAUD_EMAIL_WINDOW_MINUTES: z.coerce.number().int().positive().default(30),
  FRAUD_EMAIL_ORDER_LIMIT: z.coerce.number().int().positive().default(3),
  FRAUD_IP_ORDER_LIMIT: z.coerce.number().int().positive().default(5)
});

export type FraudConfig = {
  highValueCents: number;
  newAccountHighValueCents: number;
  windowMinutes: number;
  emailOrderLimit: number;
  ipOrderLimit: number;
};

export function readFraudConfig(source: NodeJS.ProcessEnv = process.env): FraudConfig {
  const parsed = fraudEnvSchema.safeParse(source);
  if (!parsed.success) throw new Error(`Invalid fraud configuration: ${parsed.error.message}`);
  return { highValueCents: parsed.data.FRAUD_HIGH_VALUE_USD_CENTS, newAccountHighValueCents: parsed.data.FRAUD_NEW_ACCOUNT_HIGH_VALUE_CENTS, windowMinutes: parsed.data.FRAUD_EMAIL_WINDOW_MINUTES, emailOrderLimit: parsed.data.FRAUD_EMAIL_ORDER_LIMIT, ipOrderLimit: parsed.data.FRAUD_IP_ORDER_LIMIT };
}

export type BitcoinConfig = {
  xpub: string;
  confirmations: number;
  highValueConfirmations: number;
  highValueUsdCents: number;
};

export function readBitcoinConfig(source: NodeJS.ProcessEnv = process.env): BitcoinConfig {
  const parsed = bitcoinEnvSchema.safeParse(source);
  if (!parsed.success) throw new Error(`Invalid Bitcoin configuration: ${parsed.error.message}`);
  if (parsed.data.BTC_HIGH_VALUE_CONFIRMATIONS < parsed.data.BTC_CONFIRMATIONS) throw new Error("BTC_HIGH_VALUE_CONFIRMATIONS must be at least BTC_CONFIRMATIONS");
  return {
    xpub: parsed.data.BTC_XPUB,
    confirmations: parsed.data.BTC_CONFIRMATIONS,
    highValueConfirmations: parsed.data.BTC_HIGH_VALUE_CONFIRMATIONS,
    highValueUsdCents: parsed.data.BTC_HIGH_VALUE_USD_CENTS
  };
}

export function readEvmConfig(source: NodeJS.ProcessEnv = process.env): EvmConfig {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) throw new Error(`Invalid EVM configuration: ${parsed.error.message}`);
  if (parsed.data.EVM_CHAIN_ID !== 1) throw new Error("EVM_CHAIN_ID must be 1 for Ethereum mainnet");
  if (parsed.data.EVM_USDC_ADDRESS.toLowerCase() !== CIRCLE_ETHEREUM_USDC.toLowerCase()) throw new Error("EVM_USDC_ADDRESS must be Circle's Ethereum mainnet USDC contract");
  return {
    rpcUrl: parsed.data.EVM_RPC_URL,
    xpub: parsed.data.EVM_XPUB,
    chainId: parsed.data.EVM_CHAIN_ID,
    usdcAddress: parsed.data.EVM_USDC_ADDRESS as `0x${string}`,
    confirmations: parsed.data.EVM_CONFIRMATIONS,
    scanBlocks: parsed.data.EVM_SCAN_BLOCKS
  };
}
