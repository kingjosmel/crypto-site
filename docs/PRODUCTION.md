# Production checklist

## Required environment

- `NODE_ENV=production`
- `JWT_SECRET` and the NextAuth secret are long random values stored in the host secret manager.
- `MONGODB_URI` points to the Atlas replica set using a least-privilege application user.
- `ALLOWED_ORIGINS` contains only the Vercel production origin.
- `TRUST_PROXY` matches the number of trusted reverse-proxy hops in front of the API host.
- `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, and `SENTRY_ENVIRONMENT` are configured.
- Payment RPC/provider values, XPUBs, and confirmation thresholds are configured. Never provide private keys or seed phrases.
- `RESEND_API_KEY`, `RESEND_FROM`, and S3-compatible storage variables are configured.
- Fraud thresholds and velocity limits are reviewed before launch.

## Deployment

Web deploys to Vercel from the repository root with `npm run build`. Set `API_URL`, `NEXT_PUBLIC_API_URL`, and NextAuth secrets in Vercel project settings. Do not expose server-only secrets as `NEXT_PUBLIC_*` values.

Deploy the API and worker together on a Node host with `npm ci`, `npm run build --workspace apps/api`, and `npm run start --workspace apps/api`. The API process starts the Agenda email worker. Run `npm run db:sync-indexes` as a release step after migrations and before traffic is enabled.

Use a health check that verifies the API process and database connectivity. Keep the worker on the same release version as the API. Roll back the application release if the health check or payment watcher alert fires.

## MongoDB Atlas

Use a replica set with automated backups and point-in-time restore enabled. Restrict network access to the API host/VPC egress addresses, require TLS, and create separate least-privilege users for the application and deployment/index job. Test a restore into an isolated project before launch and document the recovery owner, RPO, and RTO.

## Release gates

CI must pass lint, web build, API build, API tests, and `npm audit --audit-level=high`. Complete testnet checkout runs on Solana devnet, Sepolia, and Bitcoin testnet before enabling production payment providers. Then execute one small, manually observed mainnet purchase per supported asset and verify finality, order history, fulfillment hold behavior, email delivery, and refund recording.
