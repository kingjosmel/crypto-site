Project: crypto-only e-commerce store (electronics first, luxury later), USD pricing, US customers.

Stack: npm workspaces monorepo.
- apps/web = Next.js (App Router) + React + TypeScript + Tailwind
- apps/api = Node + Express + TypeScript + Mongoose + MongoDB (replica set, so transactions work)
- packages/shared = zod schemas and shared types (compiled to dist; api and web import the build)
- Jobs: Agenda (MongoDB-backed). Email: Resend. Auth: Auth.js.
- Tests: Vitest + supertest. API tests that need a database use mongodb-memory-server in replica-set mode.

Rules:
- TypeScript strict. ESM in apps/api and packages/shared (relative imports end in `.js`).
- Validate every API input with zod on the server.
- Money is integer cents (USD). Crypto amounts are decimal strings or bigint base units, never floats.
- Never store private keys or seed phrases. Only public keys / xpubs (watch-only).
- Payment is "paid" only after the backend verifies it on-chain at required finality. Never trust redirects, screenshots, or client-submitted tx hashes.
- Order status, payment status and fulfillment status are separate. All transitions go through one state-machine service, inside a MongoDB transaction, using an atomic compare-and-set on the current status and writing an OrderStatusHistory document.
- Everything idempotent: unique indexes on txid/signature per payment, no duplicate state changes.
- Never build Mongo filters or updates from raw request input. Parse with zod first. Mongoose `sanitizeFilter` is on; keep it on.
- Supplier cost and margins are never returned by public endpoints. Select public fields explicitly instead of excluding private ones.
- Secrets only via env vars, validated at startup in config/env.ts. .env.example has placeholders only.
- Do not invent third-party API endpoints or behavior. If unsure, say so and ask me to provide docs.
- Keep it simple. No new dependency without stating why.
- Add tests for every business rule. Comment complex logic.