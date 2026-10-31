# Testnet release plan

Run the complete checkout and fulfillment flow independently on:

- Solana devnet: create a payment target, send the supported asset, wait for configured finality, verify the watcher, and confirm the paid queue.
- Sepolia: verify native ETH and token contract filtering with the configured test token.
- Bitcoin testnet: verify native SegWit derivation, confirmed outputs, split payments, RBF replacement handling, and replay rejection.

For each test, record the order number, payment asset/network, expected amount, provider transaction reference, confirmation count, status history, audit entry, email job status, and final fulfillment state. Test an underpayment, expiration, reorg/replacement, fraud hold, admin approval, shipment email, and manually recorded refund.

Only after all testnet evidence is reviewed should a release owner perform one small mainnet purchase per supported asset. Keep those orders on hold until payment finality and the corresponding observation/status history are independently checked.
