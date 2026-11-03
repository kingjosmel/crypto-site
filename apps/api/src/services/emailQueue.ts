import { Agenda } from "agenda";
import { MongoBackend } from "@agendajs/mongo-backend";
import { EmailJob } from "../models/index.js";
import { getCustomerMailer, type EmailTemplate, type EmailPayload } from "./mailer.js";

export async function enqueueEmail(template: EmailTemplate, to: string, payload: EmailPayload, dedupeKey: string) {
  try { return await EmailJob.create({ template, to, payload, dedupeKey, status: "pending", nextAttemptAt: new Date() }); } catch (error) {
    if (error instanceof Error && "code" in error && Number(error.code) === 11000) return EmailJob.findOne({ dedupeKey });
    throw error;
  }
}

export async function processEmailJobs(limit = 20) {
  for (let index = 0; index < limit; index += 1) {
    const job = await EmailJob.findOneAndUpdate({ status: { $in: ["pending", "failed"] }, nextAttemptAt: { $lte: new Date() } }, { $set: { status: "processing" } }, { sort: { nextAttemptAt: 1 }, returnDocument: "after" }).lean();
    if (!job) return;
    try {
      await getCustomerMailer().sendTemplate(job.template as EmailTemplate, job.to, job.payload as EmailPayload);
      await EmailJob.updateOne({ _id: job._id }, { $set: { status: "sent", lastError: undefined } });
    } catch (error) {
      const attempts = job.attempts + 1;
      if (attempts >= 5) console.warn("[Operational Alert] Email job exhausted retries", { jobId: String(job._id), template: job.template });
      await EmailJob.updateOne({ _id: job._id }, { $set: { status: attempts >= 5 ? "failed" : "pending", attempts, nextAttemptAt: new Date(Date.now() + Math.min(60 * 60_000, 2 ** attempts * 60_000)), lastError: error instanceof Error ? error.message : "Email delivery failed" } });
    }
  }
}

export async function createEmailQueue(mongoUri: string) {
  const agenda = new Agenda({ backend: new MongoBackend({ address: mongoUri }) });
  agenda.define("processEmailJobs", async () => processEmailJobs());
  await agenda.start();
  await agenda.every("30 seconds", "processEmailJobs");
  return agenda;
}
