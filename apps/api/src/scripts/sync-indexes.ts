import { connectDatabase, disconnectDatabase } from "../db.js";
import { allModels } from "../models/index.js";

await connectDatabase();
for (const [name, model] of Object.entries(allModels)) {
  await model.syncIndexes();
  console.log(`Synchronized indexes for ${name}`);
}
await disconnectDatabase();
