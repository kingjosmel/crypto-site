import * as Sentry from "@sentry/node";
let enabled = false;
export function initializeSentry() {
    const dsn = process.env.SENTRY_DSN;
    if (!dsn)
        return;
    Sentry.init({ dsn, environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "development", tracesSampleRate: 0.1 });
    enabled = true;
}
export function captureApiError(error) { if (enabled)
    Sentry.captureException(error); }
export function captureOperationalMessage(message, context) { if (enabled)
    Sentry.captureMessage(message, { level: "error", extra: context }); }
