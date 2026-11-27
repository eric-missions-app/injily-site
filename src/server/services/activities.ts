import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import type { NoteInput } from '@/lib/validation/admin';
import { getDb } from '@/server/db/client';
import { activities, leads, serviceCases } from '@/server/db/schema';

export type Activity = typeof activities.$inferSelect;

/** A record's timeline, newest first. */
export async function listActivities(recordType: Activity['recordType'], recordId: string): Promise<Activity[]> {
  return getDb()
    .select()
    .from(activities)
    .where(and(eq(activities.recordType, recordType), eq(activities.recordId, recordId)))
    .orderBy(desc(activities.createdAt));
}

/**
 * The timeline line for an owner change. It's written as a `note`: the `activity_kind` enum has no owner kind, and
 * `status_change` is kept for statuses.
 */
export function ownerChangeBody(from: string | null, to: string | null): string {
  return `Owner: ${from ?? 'unassigned'} → ${to ?? 'unassigned'}`;
}

/** Adds a note to a Lead's or Service Case's timeline. Returns 'not_found' if the record doesn't exist. */
export async function addNote(input: NoteInput, authorEmail: string): Promise<'ok' | 'not_found'> {
  const db = getDb();
  const table = input.recordType === 'lead' ? leads : serviceCases;
  const [record] = await db.select({ id: table.id }).from(table).where(eq(table.id, input.id));
  if (!record) return 'not_found';

  await db.insert(activities).values({
    recordType: input.recordType,
    recordId: input.id,
    kind: 'note',
    body: input.body,
    authorEmail,
  });
  return 'ok';
}
