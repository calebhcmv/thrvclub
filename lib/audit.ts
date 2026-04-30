import { db } from '@/lib/db';
import { auditLogs } from '@/lib/db/schema';

type AuditPayload = {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export async function logAudit(payload: AuditPayload) {
  await db.insert(auditLogs).values({
    userId: payload.userId,
    action: payload.action,
    entity: payload.entity,
    entityId: payload.entityId,
    metadata: payload.metadata ? JSON.stringify(payload.metadata) : null,
  });
}
