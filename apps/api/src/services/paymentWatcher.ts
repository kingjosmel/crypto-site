import { Agenda } from "agenda";
import { MongoBackend } from "@agendajs/mongo-backend";
import { Payment } from "../models/index.js";
import { PaymentService } from "./paymentService.js";

export async function watchPayments(service: PaymentService) {
  const stuckSince = new Date(Date.now() - Number(process.env.STUCK_PAYMENT_MINUTES ?? 30) * 60_000);
  const stuck = await Payment.find({ status: "pending", createdAt: { $lt: stuckSince } }).select("_id createdAt").lean();
  if (stuck.length) {
    console.warn("[Payment Watcher Alert] Pending payments are stuck", { count: stuck.length, paymentIds: stuck.map((payment) => String(payment._id)) });
  }
  const payments = await Payment.find({ status: { $in: ["pending", "expired"] } }).select("_id").lean();
  for (const payment of payments) {
    try {
      await service.watchPayment(String(payment._id));
    } catch (error) {
      console.error("[Payment Watcher Error]", error);
    }
  }
}

export async function createPaymentWatcher(mongoUri: string, service: PaymentService) {
  const agenda = new Agenda({ backend: new MongoBackend({ address: mongoUri }) });
  agenda.define("watchPayments", async () => watchPayments(service));
  await agenda.start();
  await agenda.every("30 seconds", "watchPayments");
  return agenda;
}
