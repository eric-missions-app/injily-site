import 'server-only';
import { desc, eq } from 'drizzle-orm';
import type { LeadStatus, OpportunityEditInput, OpportunityStage } from '@/lib/validation/admin';
import { getDb } from '@/server/db/client';
import { activities, leads, opportunities, organizations, people } from '@/server/db/schema';
import { listActivities, type Activity } from './activities';

export type OpportunityListRow = {
  id: string;
  name: string;
  organizationName: string | null;
  stage: OpportunityStage;
  expectedStart: string | null;
  createdAt: Date;
};

/** Opportunities for the admin list, newest first, optionally only one stage. */
export async function listOpportunities(stage?: OpportunityStage): Promise<OpportunityListRow[]> {
  return getDb()
    .select({
      id: opportunities.id,
      name: opportunities.name,
      organizationName: organizations.name,
      stage: opportunities.stage,
      expectedStart: opportunities.expectedStart,
      createdAt: opportunities.createdAt,
    })
    .from(opportunities)
    .leftJoin(organizations, eq(opportunities.organizationId, organizations.id))
    .where(stage ? eq(opportunities.stage, stage) : undefined)
    .orderBy(desc(opportunities.createdAt));
}

export type OpportunityDetail = {
  opportunity: typeof opportunities.$inferSelect;
  organization: { id: string; name: string } | null;
  lead: { id: string; status: LeadStatus; firstName: string; lastName: string } | null;
  activities: Activity[];
};

/** One Opportunity with its organization, the lead it came from and its timeline, or null if it doesn't exist. */
export async function getOpportunity(id: string): Promise<OpportunityDetail | null> {
  const [row] = await getDb()
    .select({
      opportunity: opportunities,
      organizationId: organizations.id,
      organizationName: organizations.name,
      leadId: leads.id,
      leadStatus: leads.status,
      firstName: people.firstName,
      lastName: people.lastName,
    })
    .from(opportunities)
    .leftJoin(organizations, eq(opportunities.organizationId, organizations.id))
    .leftJoin(leads, eq(opportunities.leadId, leads.id))
    .leftJoin(people, eq(leads.personId, people.id))
    .where(eq(opportunities.id, id));
  if (!row) return null;

  return {
    opportunity: row.opportunity,
    organization:
      row.organizationId && row.organizationName ? { id: row.organizationId, name: row.organizationName } : null,
    lead:
      row.leadId && row.leadStatus && row.firstName !== null && row.lastName !== null
        ? { id: row.leadId, status: row.leadStatus, firstName: row.firstName, lastName: row.lastName }
        : null,
    activities: await listActivities('opportunity', id),
  };
}

const FIELD_LABELS = { name: 'name', expectedStart: 'expected start', notes: 'notes' } as const;

/**
 * Saves an Opportunity's name, stage, expected start and notes in one transaction. A stage change is recorded on
 * the timeline as a `status_change`; changes to the other fields as one `note` naming them. Saving the same values
 * again changes nothing and writes nothing.
 */
export async function updateOpportunity(
  input: OpportunityEditInput,
  actorEmail: string,
): Promise<'ok' | 'not_found'> {
  const { id, ...fields } = input;
  return getDb().transaction(async (tx) => {
    const [current] = await tx
      .select({
        name: opportunities.name,
        stage: opportunities.stage,
        expectedStart: opportunities.expectedStart,
        notes: opportunities.notes,
      })
      .from(opportunities)
      .where(eq(opportunities.id, id))
      .for('update');
    if (!current) return 'not_found';

    const changed = (Object.keys(FIELD_LABELS) as (keyof typeof FIELD_LABELS)[]).filter(
      (key) => current[key] !== fields[key],
    );
    const stageChanged = current.stage !== fields.stage;
    if (!stageChanged && changed.length === 0) return 'ok';

    await tx.update(opportunities).set(fields).where(eq(opportunities.id, id));
    const entries: (typeof activities.$inferInsert)[] = [];
    if (stageChanged) {
      entries.push({
        recordType: 'opportunity',
        recordId: id,
        kind: 'status_change',
        body: `Stage: ${current.stage} → ${fields.stage}`,
        authorEmail: actorEmail,
      });
    }
    if (changed.length > 0) {
      entries.push({
        recordType: 'opportunity',
        recordId: id,
        kind: 'note',
        body: `Updated ${changed.map((key) => FIELD_LABELS[key]).join(', ')}.`,
        authorEmail: actorEmail,
      });
    }
    await tx.insert(activities).values(entries);
    return 'ok';
  });
}

export type ConvertResult =
  | { status: 'ok'; opportunityId: string }
  | { status: 'not_found' | 'not_qualified' | 'already_converted' };

/**
 * Converts a qualified Lead into an Opportunity, in one transaction: creates the Opportunity at stage `discovery`,
 * named after the lead's organization (or the person, if the lead has none) and linked to the lead and
 * organization; sets the lead to `converted`; and writes an activity on both timelines. A lead that isn't
 * `qualified`, or already has an opportunity, is left alone.
 */
export async function convertLeadToOpportunity(leadId: string, actorEmail: string): Promise<ConvertResult> {
  return getDb().transaction(async (tx) => {
    const [lead] = await tx
      .select({ status: leads.status, personId: leads.personId, organizationId: leads.organizationId })
      .from(leads)
      .where(eq(leads.id, leadId))
      .for('update');
    if (!lead) return { status: 'not_found' };
    if (lead.status !== 'qualified') return { status: 'not_qualified' };

    const [existing] = await tx
      .select({ id: opportunities.id })
      .from(opportunities)
      .where(eq(opportunities.leadId, leadId));
    if (existing) return { status: 'already_converted' };

    const [person] = await tx
      .select({ firstName: people.firstName, lastName: people.lastName })
      .from(people)
      .where(eq(people.id, lead.personId));
    const [organization] = lead.organizationId
      ? await tx
          .select({ name: organizations.name })
          .from(organizations)
          .where(eq(organizations.id, lead.organizationId))
      : [];
    const personName = person ? `${person.firstName} ${person.lastName}` : 'the person';
    const name = organization?.name ?? personName;

    const [opportunity] = await tx
      .insert(opportunities)
      .values({ organizationId: lead.organizationId, leadId, name, stage: 'discovery' })
      .returning({ id: opportunities.id });
    if (!opportunity) throw new Error('opportunity insert returned no row');

    await tx.update(leads).set({ status: 'converted' }).where(eq(leads.id, leadId));
    await tx.insert(activities).values([
      {
        recordType: 'lead',
        recordId: leadId,
        kind: 'status_change',
        body: `Status: qualified → converted. Opportunity “${name}” created.`,
        authorEmail: actorEmail,
      },
      {
        recordType: 'opportunity',
        recordId: opportunity.id,
        kind: 'note',
        body: `Created from ${personName}’s lead.`,
        authorEmail: actorEmail,
      },
    ]);
    return { status: 'ok', opportunityId: opportunity.id };
  });
}
