import { HDKey } from "@scure/bip32";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { CIRCLE_ETHEREUM_USDC } from "../src/config/env.js";
import { Counter } from "../src/models/index.js";
import { EvmVerifier } from "../src/services/evmVerifier.js";

const network = "ethereum:1";
const config = {
  rpcUrl: "https://example.test",
  xpub: HDKey.fromMasterSeed(new Uint8Array(32).fill(7)).publicExtendedKey,
  chainId: 1,
  usdcAddress: CIRCLE_ETHEREUM_USDC as `0x${string}`,
  confirmations: 12,
  scanBlocks: 100n,
  counterKey: "evm-test"
};
const depositAddress = "0x1111111111111111111111111111111111111111" as const;
const txHash = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as const;
let replicaSet: MongoMemoryReplSet;

function clientWithLogs(logs: unknown[], latest = 120n) {
  return {
    getBlockNumber: async () => latest,
    getBlock: async () => ({ transactions: [] }),
    getLogs: async () => logs
  };
}

function usdcLog(overrides: Record<string, unknown> = {}) {
  return {
    address: CIRCLE_ETHEREUM_USDC,
    blockNumber: 110n,
    transactionHash: txHash,
    logIndex: 2n,
    args: { from: "0x2222222222222222222222222222222222222222", to: depositAddress, value: 1_250_000n },
    ...overrides
  };
}

describe("EvmVerifier", () => {
  beforeAll(async () => { replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } }); await mongoose.connect(replicaSet.getUri()); });
  afterAll(async () => { await mongoose.disconnect(); await replicaSet.stop(); });
  beforeEach(async () => { await Counter.deleteMany({ _id: config.counterKey }); });

  it("allocates unique BIP-32 addresses with the atomic counter", async () => {
    const client = clientWithLogs([]) as never;
    const verifier = new EvmVerifier({ ...config, client });
    const first = await verifier.createPaymentTarget({}, "ETH");
    const second = await verifier.createPaymentTarget({}, "ETH");
    expect(first.network).toBe(network);
    expect(first.depositAddress).not.toBe(second.depositAddress);
    expect(first.startBlock).toBe("120");
  });

  it("accepts only Circle USDC logs, formats amount, and ignores duplicate logs", async () => {
    const logs = [usdcLog(), usdcLog(), usdcLog({ address: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" })];
    const verifier = new EvmVerifier({ ...config, client: clientWithLogs(logs) as never });
    const observations = await verifier.findPayment({ asset: "USDC", network, depositAddress, expectedAmount: "1", expiresAt: new Date(), startBlock: "100" });
    expect(observations).toHaveLength(1);
    expect(observations[0].amount).toBe("1.25");
    expect(observations[0].confirmations).toBe(11);
  });

  it("detects incoming ETH transfers and calculates confirmations", async () => {
    const client = {
      getBlockNumber: async () => 120n,
      getBlock: async () => ({ transactions: [{ to: depositAddress, value: 2_000_000_000_000_000n, hash: txHash }] }),
      getLogs: async () => []
    };
    const verifier = new EvmVerifier({ ...config, client: client as never });
    const [observation] = await verifier.findPayment({ asset: "ETH", network, depositAddress, expectedAmount: "0.002", expiresAt: new Date(), startBlock: "120" });
    expect(observation.amount).toBe("0.002");
    expect(observation.confirmations).toBe(1);
  });

  it("reports a short USDC payment without inflating the amount", async () => {
    const verifier = new EvmVerifier({ ...config, client: clientWithLogs([usdcLog({ args: { ...usdcLog().args, value: 999_999n } })]) as never });
    const [observation] = await verifier.findPayment({ asset: "USDC", network, depositAddress, expectedAmount: "2", expiresAt: new Date(), startBlock: "100" });
    expect(observation.amount).toBe("0.999999");
  });

  it("re-checks a transaction after a reorg and returns no stale observation", async () => {
    let logs: unknown[] = [usdcLog()];
    const verifier = new EvmVerifier({ ...config, client: clientWithLogs([]) as never, });
    (verifier as unknown as { client: { getLogs: () => Promise<unknown[]> } }).client.getLogs = async () => logs;
    const payment = { asset: "USDC", network, depositAddress, expectedAmount: "1", expiresAt: new Date(), startBlock: "100" };
    expect(await verifier.findPayment(payment)).toHaveLength(1);
    logs = [];
    expect(await verifier.findPayment(payment)).toHaveLength(0);
  });
});
