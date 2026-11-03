import { app } from "./app.js";
import { connectDatabase } from "./db.js";
import { createEmailQueue } from "./services/emailQueue.js";
const port = Number(process.env.PORT ?? 4000);

try {
  const conn = await connectDatabase();
  if (conn && process.env.MONGODB_URI) {
    await createEmailQueue(process.env.MONGODB_URI).catch((e) => console.warn("Email queue skipped:", e));
  }
} catch (e) {
  console.warn("Database connection skipped:", e);
}

app.listen(port, () => console.log(`API listening on port ${port}`));
