import { app } from "./app.js";
import { connectDatabase } from "./db.js";
import { createEmailQueue } from "./services/emailQueue.js";
import { initializeSentry } from "./services/sentry.js";

const port = Number(process.env.PORT ?? 4000);
initializeSentry();
await connectDatabase();
if (process.env.MONGODB_URI) await createEmailQueue(process.env.MONGODB_URI);
app.listen(port, () => console.log(`API listening on port ${port}`));
