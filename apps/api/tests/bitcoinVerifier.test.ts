import * as bitcoin from "bitcoinjs-lib";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Counter } from "../src/models/index.js";
import { BitcoinVerifier, type BitcoinChainProvider, type BitcoinTransaction } from "../src/services/bitcoinVerifier.js";

const bip32 = BIP32Factory(ecc);
const xpub = bip32.fromSeed(Buffer.alloc(32, 9), bitcoin.networks.bitcoin).neutered().publicKey;
const config = {
  xpub: bip32.fromSeed(Buffer.alloc(32, 9), bitcoin.networks.bitcoin).neutered().toBase58(),
  confirmations: 2,
  highValueConfirmations: 3,
  highValueUsdCents: 100_000,
  counterKey: "bitcoin-test"
};
const network = "bitcoin:mainnet";
let replicaSet: MongoMemoryReplSet;

function transaction(txid: string, value: number, address: string, blockHeight: number, sequence = 0xffffffff): BitcoinTransaction {
  return { txid, vin: [{ sequence }], vout: [{ n: 0, value, scriptpubkey_address: address }], status: { confirmed: true, block_height: blockHeight } };
}

function providerFor(transactions: BitcoinTransaction[], tipHeight = 120): BitcoinChainProvider {
  return {
    getAddressTxs: async () => transactions.map(({ txid }) => ({ txid })),
    getTx: async (txid) => transactions.find((item) => item.txid === txid)!,
    getTipHeight: async () => tipHeight
  };
}

async function verifierWith(transactions: BitcoinTransaction[], tipHeight = 120) {
  return new BitcoinVerifier({ ...config, provider: providerFor(transactions, tipHeight) });
}

describe("BitcoinVerifier", () => {
  beforeAll(async () => { replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } }); await mongoose.connect(replicaSet.getUri()); });
  afterAll(async () => { await mongoose.disconnect(); await replicaSet.stop(); });
  beforeEach(async () => { await Counter.deleteMany({ _id: config.counterKey }); });

  it("derives unique native SegWit addresses from the XPUB", async () => {
    const verifier = await verifierWith([]);
    const first = await verifier.createPaymentTarget({}, "BTC");
    const second = await verifier.createPaymentTarget({}, "BTC");
    expect(first.network).toBe(network);
    expect(first.depositAddress).toMatch(/^bc1q/);
    expect(second.depositAddress).not.toBe(first.depositAddress);
    void xpub;
  });

  it("detects an exact payment after the configured confirmations", async () => {
    const address = "bc1qexample";
    const verifier = await verifierWith([transaction("exact", 100_000_000, address, 119)]);
    const observations = await verifier.findPayment({ asset: "BTC", network, depositAddress: address, expectedAmount: "1", quotedUsdCents: 50_000, expiresAt: new Date() });
    expect(observations.map((item) => item.amount)).toEqual(["1"]);
  });

  it("reports an underpayment without treating it as the expected amount", async () => {
    const address = "bc1qunderpay";
    const verifier = await verifierWith([transaction("underpay", 90_000_000, address, 119)]);
    const observations = await verifier.findPayment({ asset: "BTC", network, depositAddress: address, expectedAmount: "1", quotedUsdCents: 50_000, expiresAt: new Date() });
    expect(observations.reduce((sum, item) => sum + Number(item.amount), 0)).toBe(0.9);
  });

  it("sums split payments as separate unique outputs", async () => {
    const address = "bc1qsplit";
    const verifier = await verifierWith([transaction("split-a", 40_000_000, address, 119), transaction("split-b", 60_000_000, address, 118)]);
    const observations = await verifier.findPayment({ asset: "BTC", network, depositAddress: address, expectedAmount: "1", quotedUsdCents: 50_000, expiresAt: new Date() });
    expect(observations).toHaveLength(2);
    expect(observations.reduce((sum, item) => sum + Number(item.amount), 0)).toBe(1);
  });

  it("ignores an unconfirmed RBF transaction and counts its confirmed replacement", async () => {
    const address = "bc1qreplacement";
    const oldTransaction = { ...transaction("rbf-old", 100_000_000, address, 119, 0xfffffffd), status: { confirmed: false } };
    const replacement = transaction("rbf-new", 100_000_000, address, 119);
    const verifier = await verifierWith([oldTransaction, replacement]);
    const observations = await verifier.findPayment({ asset: "BTC", network, depositAddress: address, expectedAmount: "1", quotedUsdCents: 50_000, expiresAt: new Date() });
    expect(observations.map((item) => item.txRef)).toEqual(["rbf-new"]);
  });

  it("does not double count duplicate address transactions or outputs", async () => {
    const address = "bc1qduplicate";
    const duplicate = transaction("same-tx", 100_000_000, address, 119);
    const provider = providerFor([duplicate, duplicate]);
    const verifier = new BitcoinVerifier({ ...config, provider });
    const observations = await verifier.findPayment({ asset: "BTC", network, depositAddress: address, expectedAmount: "1", quotedUsdCents: 50_000, expiresAt: new Date() });
    expect(observations).toHaveLength(1);
    expect(observations[0].logIndex).toBe(0);
  });
});
