let configured;
export function configurePaymentService(service) { configured = service; }
export function getPaymentService() { if (!configured)
    throw new Error("Payment service is not configured"); return configured; }
