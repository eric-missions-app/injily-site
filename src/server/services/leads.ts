import 'server-only';
import { desc, eq } from 'drizzle-orm';
import type { LeadStatus, OpportunityStage } from '@/lib/validation/admin';
import type { LeadInput } from '@/lib/validation/lead';
import { getDb } from '@/server/db/client';
import { activities, leads, opportunities, organizations, people } from '@/server/db/schema';
import { listActivities, ownerChangeBody, type Activity } from './activities';
import { upsertContact } from './people';

export type CreatedLead = { leadId: string; personId: string; organizationId: string | undefined };

/**
 * Intake for the "Get early access" form. In one transaction: upserts the person and organization, creates the
 * lead (status `new`) and writes its first activity. `input` must already be parsed with `leadInput`.
 */
export async function createLead(input: LeadInput): Promise<CreatedLead> {
  return getDb().transaction(async (tx) => {
    const { personId, organizationId } = await upsertContact(tx, input, new Date());

    const [lead] = await tx
      .insert(leads)
      .values({
        personId,
        organizationId,
        sourcePage: input.sourcePage,
        interest: input.interest,
        message: input.message,
        status: 'new',
      })
      .returning({ id: leads.id });

    await tx.insert(activities).values({
      recordType: 'lead',
      recordId: lead.id,
      kind: 'note',
      body: 'Lead created from the website form.',
    });

    return { leadId: lead.id, personId, organizationId };
  });
}

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
  /** The opportunity this lead was converted into, if any. */
  opportunities: { id: string; name: string; stage: OpportunityStage }[];
  activities: Activity[];
};

/** One Lead with its person, organization, opportunity and timeline, or null if it doesn't exist. */
export async function getLead(id: string): Promise<LeadDetail | null> {
  const [row] = await getDb()
    .select({ lead: leads, person: people, organization: organizations })
    .from(leads)
    .innerJoin(people, eq(leads.personId, people.id))
    .leftJoin(organizations, eq(leads.organizationId, organizations.id))
    .where(eq(leads.id, id));
  if (!row) return null;
  const [leadOpportunities, timeline] = await Promise.all([
    getDb()
      .select({ id: opportunities.id, name: opportunities.name, stage: opportunities.stage })
      .from(opportunities)
      .where(eq(opportunities.leadId, id))
      .orderBy(desc(opportunities.createdAt)),
    listActivities('lead', id),
  ]);
  return { ...row, opportunities: leadOpportunities, activities: timeline };
}

/**
 * Sets a Lead's status and records the change on its timeline. Setting the current status changes nothing. A change
 * to `converted` is refused with `'use_convert'`: only `convertLeadToOpportunity` makes it, together with the
 * opportunity.
 */
export async function setLeadStatus(
  id: string,
  status: LeadStatus,
  actorEmail: string,
): Promise<'ok' | 'not_found' | 'use_convert'> {
  return getDb().transaction(async (tx) => {
    const [current] = await tx
      .select({ status: leads.status })
      .from(leads)
      .where(eq(leads.id, id))
      .for('update');
    if (!current) return 'not_found';
    if (current.status === status) return 'ok';
    if (status === 'converted') return 'use_convert';

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
