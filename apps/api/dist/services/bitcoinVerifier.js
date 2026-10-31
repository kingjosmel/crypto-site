import * as bitcoin from "bitcoinjs-lib";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import { Counter } from "../models/index.js";
import { readBitcoinConfig } from "../config/env.js";
const bip32 = BIP32Factory(ecc);
const SATOSHIS_PER_BTC = 100000000n;
export class BitcoinVerifier {
    options;
    requiredFinality;
    counterKey;
    constructor(options) {
        this.options = options;
        this.requiredFinality = options.confirmations;
        this.counterKey = options.counterKey ?? "bitcoin-mainnet-deposit";
    }
    static fromEnv(provider) {
        return new BitcoinVerifier({ ...readBitcoinConfig(), provider });
    }
    async createPaymentTarget(_order, asset) {
        if (asset.toUpperCase() !== "BTC")
            throw new Error(`Unsupported Bitcoin asset: ${asset}`);
        const tipHeight = await this.options.provider.getTipHeight();
        const counter = await Counter.findOneAndUpdate({ _id: this.counterKey }, { $inc: { value: 1 } }, { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }).lean();
        if (!counter)
            throw new Error("Unable to allocate a Bitcoin deposit index");
        const child = bip32.fromBase58(this.options.xpub, bitcoin.networks.bitcoin).derive(counter.value - 1);
        const payment = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(child.publicKey), network: bitcoin.networks.bitcoin });
        if (!payment.address)
            throw new Error("Unable to derive a Bitcoin native SegWit address");
        return { network: "bitcoin:mainnet", depositAddress: payment.address, startBlock: String(tipHeight) };
    }
    async findPayment(payment) {
        if (payment.asset !== "BTC" || payment.network !== "bitcoin:mainnet")
            return [];
        const tipHeight = await this.options.provider.getTipHeight();
        const summaries = await this.options.provider.getAddressTxs(payment.depositAddress);
        const txids = [...new Set(summaries.map((summary) => summary.txid))];
        const observations = [];
        const seenOutputs = new Set();
        const requiredConfirmations = (payment.quotedUsdCents ?? 0) >= this.options.highValueUsdCents ? this.options.highValueConfirmations : this.options.confirmations;
        for (const txid of txids) {
            const transaction = await this.options.provider.getTx(txid);
            if (!transaction.status.confirmed || transaction.status.block_height === undefined)
                continue;
            if (transaction.vin.some((input) => input.sequence !== undefined && input.sequence < 0xfffffffe))
                continue;
            const confirmations = tipHeight - transaction.status.block_height + 1;
            if (confirmations < requiredConfirmations)
                continue;
            for (const output of transaction.vout) {
                if (output.scriptpubkey_address !== payment.depositAddress)
                    continue;
                const key = `${transaction.txid}:${output.n}`;
                if (seenOutputs.has(key))
                    continue;
                seenOutputs.add(key);
                observations.push({
                    network: payment.network,
                    txRef: transaction.txid,
                    logIndex: output.n,
                    asset: "BTC",
                    amount: formatBtc(output.value),
                    confirmations,
                    raw: transaction
                });
            }
        }
        return observations;
    }
}
function formatBtc(satoshis) {
    if (!Number.isSafeInteger(satoshis) || satoshis < 0)
        throw new Error("Bitcoin output value is invalid");
    const value = BigInt(satoshis);
    const whole = value / SATOSHIS_PER_BTC;
    const fraction = (value % SATOSHIS_PER_BTC).toString().padStart(8, "0").replace(/0+$/, "");
    return fraction ? `${whole}.${fraction}` : String(whole);
}
