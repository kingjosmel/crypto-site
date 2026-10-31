import { PaymentService } from "./paymentService.js";
let configured: PaymentService | undefined;
export function configurePaymentService(service: PaymentService) { configured = service; }
export function getPaymentService() { if (!configured) throw new Error("Payment service is not configured"); return configured; }
