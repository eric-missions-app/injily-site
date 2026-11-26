import 'server-only';
import { desc, eq } from 'drizzle-orm';
import type { LeadStatus } from '@/lib/validation/admin';
import { getDb } from '@/server/db/client';
import { activities, leads, organizations, people } from '@/server/db/schema';
import { listActivities, ownerChangeBody, type Activity } from './activities';

export type LeadListRow = {
  id: string;
  firstName: string;
  lastName: string;
  organizationName: string | null;
  country: string | null;
  status: LeadStatus;
  ownerEmail: string | null;
  createdAt: Date;
};

/** Leads for the admin list, newest first, optionally only one status. */
export async function listLeads(status?: LeadStatus): Promise<LeadListRow[]> {
  return getDb()
    .select({
      id: leads.id,
      firstName: people.firstName,
      lastName: people.lastName,
      organizationName: organizations.name,
      // The person's country, else the organization's.
      country: people.country,
      organizationCountry: organizations.country,
      status: leads.status,
      ownerEmail: leads.ownerEmail,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .innerJoin(people, eq(leads.personId, people.id))
    .leftJoin(organizations, eq(leads.organizationId, organizations.id))
    .where(status ? eq(leads.status, status) : undefined)
    .orderBy(desc(leads.createdAt))
    .then((rows) =>
      rows.map(({ organizationCountry, ...row }) => ({ ...row, country: row.country ?? organizationCountry })),
    );
}

export type LeadDetail = {
  lead: typeof leads.$inferSelect;
  person: typeof people.$inferSelect;
  organization: typeof organizations.$inferSelect | null;
  activities: Activity[];
};

/** One Lead with its person, organization and timeline, or null if it doesn't exist. */
export async function getLead(id: string): Promise<LeadDetail | null> {
  const [row] = await getDb()
    .select({ lead: leads, person: people, organization: organizations })
    .from(leads)
    .innerJoin(people, eq(leads.personId, people.id))
    .leftJoin(organizations, eq(leads.organizationId, organizations.id))
    .where(eq(leads.id, id));
  if (!row) return null;
  return { ...row, activities: await listActivities('lead', id) };
}

/** Sets a Lead's status and records the change on its timeline. Setting the current status changes nothing. */
export async function setLeadStatus(
  id: string,
  status: LeadStatus,
  actorEmail: string,
): Promise<'ok' | 'not_found'> {
  return getDb().transaction(async (tx) => {
    const [current] = await tx
      .select({ status: leads.status })
      .from(leads)
      .where(eq(leads.id, id))
      .for('update');
    if (!current) return 'not_found';
    if (current.status === status) return 'ok';

    await tx.update(leads).set({ status }).where(eq(leads.id, id));
    await tx.insert(activities).values({
      recordType: 'lead',
      recordId: id,
      kind: 'status_change',
      body: `Status: ${current.status} → ${status}`,
      authorEmail: actorEmail,
    });
    return 'ok';
  });
}

/** Sets or clears a Lead's owner and records the change on its timeline. */
export async function setLeadOwner(
  id: string,
  ownerEmail: string | null,
  actorEmail: string,
): Promise<'ok' | 'not_found'> {
  return getDb().transaction(async (tx) => {
    const [current] = await tx
      .select({ ownerEmail: leads.ownerEmail })
      .from(leads)
      .where(eq(leads.id, id))
      .for('update');
    if (!current) return 'not_found';
    if (current.ownerEmail === ownerEmail) return 'ok';

    await tx.update(leads).set({ ownerEmail }).where(eq(leads.id, id));
    await tx.insert(activities).values({
      recordType: 'lead',
      recordId: id,
      kind: 'note',
      body: ownerChangeBody(current.ownerEmail, ownerEmail),
      authorEmail: actorEmail,
    });
    return 'ok';
  });
}
