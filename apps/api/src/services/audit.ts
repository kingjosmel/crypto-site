import type { ClientSession } from "mongoose";
import { AuditLog } from "../models/index.js";

export async function auditMutation(input: { actorId: string; action: string; entity: string; entityId: string; before?: unknown; after?: unknown; session?: ClientSession }) {
  await AuditLog.create([{
    actorId: input.actorId,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    before: input.before,
    after: input.after,
    ip: undefined
  }], input.session ? { session: input.session } : undefined);
}
