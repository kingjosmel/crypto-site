# Incident runbook

## Payment or watcher incident

1. Pause fulfillment and keep affected orders on hold.
2. Check Sentry for watcher failures, stale pending-payment alerts, RPC/provider errors, and database errors.
3. Confirm the provider tip/finality independently before changing any payment record.
4. Do not mark an order paid from a redirect, screenshot, client hash, or customer email.
5. Preserve payment observations, status history, audit logs, and provider responses.
6. If a reorg or duplicate is suspected, move the order to admin review and document the reason.
7. Resume fulfillment only after the chain is stable and an admin approves the hold.

## Security incident

1. Disable affected admin/API credentials and rotate compromised secrets.
2. Preserve logs and Sentry event IDs; do not delete evidence.
3. Restrict Atlas network access and revoke unexpected database users.
4. Rotate JWT/NextAuth, Resend, S3, RPC, and deployment credentials as applicable.
5. Review AuditLog for mutations and payment observations for replay or mass-assignment attempts.
6. Notify the incident owner and legal contact according to the response plan.

## Wallet and XPUB handling

- The server may store only account-level XPUBs and public addresses.
- Never put private keys, seed phrases, signing devices, or wallet exports in environment files, CI, tickets, logs, backups, or the database.
- Keep XPUBs in the production secret manager, restrict read access to the API service, and rotate by deploying a new derivation account with a documented index boundary.
- Manual refunds are sent from an offline-controlled wallet. Record the destination, asset, network, amount, and transaction reference in the admin refund record only after independent review.
- Verify destination and network out-of-band before signing a refund.
