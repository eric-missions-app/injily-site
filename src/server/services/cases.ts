import 'server-only';
import { desc, eq } from 'drizzle-orm';
import type { CaseStatus } from '@/lib/validation/admin';
import type { CaseInput } from '@/lib/validation/case';
import { getDb } from '@/server/db/client';
import { activities, organizations, people, serviceCases } from '@/server/db/schema';
import { listActivities, ownerChangeBody, type Activity } from './activities';
import { sendIntakeEmails } from './intakeEmails';
import { upsertContact } from './people';

export type CreatedCase = { caseId: string; personId: string; organizationId: string | undefined };

/**
 * Intake for the contact form. In one transaction: upserts the person and organization, creates the service case
 * (status `open`) and writes its first activity. After it commits, emails the team and the visitor (a failure there is
 * logged, never thrown). `input` must already be parsed with `caseInput`.
 */
export async function createCase(input: CaseInput): Promise<CreatedCase> {
  const created = await getDb().transaction(async (tx) => {
    const { personId, organizationId } = await upsertContact(tx, input, new Date());

    const [serviceCase] = await tx
      .insert(serviceCases)
      .values({
        personId,
        subject: input.subject,
        message: input.message,
        status: 'open',
      })
      .returning({ id: serviceCases.id });

    await tx.insert(activities).values({
      recordType: 'service_case',
      recordId: serviceCase.id,
      kind: 'note',
      body: 'Service case created from the website form.',
    });

    return { caseId: serviceCase.id, personId, organizationId };
  });

  await sendIntakeEmails({ kind: 'case', id: created.caseId, input });
  return created;
}

export type CaseListRow = {
  id: string;
  firstName: string;
  lastName: string;
  organizationName: string | null;
  country: string | null;
  status: CaseStatus;
  ownerEmail: string | null;
  createdAt: Date;
};

/** Service Cases for the admin list, newest first, optionally only one status. */
export async function listCases(status?: CaseStatus): Promise<CaseListRow[]> {
  return getDb()
    .select({
      id: serviceCases.id,
      firstName: people.firstName,
      lastName: people.lastName,
      organizationName: organizations.name,
      // The person's country, else their organization's.
      country: people.country,
      organizationCountry: organizations.country,
      status: serviceCases.status,
      ownerEmail: serviceCases.ownerEmail,
      createdAt: serviceCases.createdAt,
    })
    .from(serviceCases)
    .innerJoin(people, eq(serviceCases.personId, people.id))
    .leftJoin(organizations, eq(people.organizationId, organizations.id))
    .where(status ? eq(serviceCases.status, status) : undefined)
    .orderBy(desc(serviceCases.createdAt))
    .then((rows) =>
      rows.map(({ organizationCountry, ...row }) => ({ ...row, country: row.country ?? organizationCountry })),
    );
}

export type CaseDetail = {
  serviceCase: typeof serviceCases.$inferSelect;
  person: typeof people.$inferSelect;
  organization: typeof organizations.$inferSelect | null;
  activities: Activity[];
};

/** One Service Case with its person, their organization and the timeline, or null if it doesn't exist. */
export async function getCase(id: string): Promise<CaseDetail | null> {
  const [row] = await getDb()
    .select({ serviceCase: serviceCases, person: people, organization: organizations })
    .from(serviceCases)
    .innerJoin(people, eq(serviceCases.personId, people.id))
    .leftJoin(organizations, eq(people.organizationId, organizations.id))
    .where(eq(serviceCases.id, id));
  if (!row) return null;
  return { ...row, activities: await listActivities('service_case', id) };
}

/** Sets a Service Case's status and records the change on its timeline. Setting the current status changes nothing. */
export async function setCaseStatus(
  id: string,
  status: CaseStatus,
  actorEmail: string,
): Promise<'ok' | 'not_found'> {
  return getDb().transaction(async (tx) => {
    const [current] = await tx
      .select({ status: serviceCases.status })
      .from(serviceCases)
      .where(eq(serviceCases.id, id))
      .for('update');
    if (!current) return 'not_found';
    if (current.status === status) return 'ok';

    await tx.update(serviceCases).set({ status }).where(eq(serviceCases.id, id));
    await tx.insert(activities).values({
      recordType: 'service_case',
      recordId: id,
      kind: 'status_change',
      body: `Status: ${current.status} → ${status}`,
      authorEmail: actorEmail,
    });
    return 'ok';
  });
}

/** Sets or clears a Service Case's owner and records the change on its timeline. */
export async function setCaseOwner(
  id: string,
  ownerEmail: string | null,
  actorEmail: string,
): Promise<'ok' | 'not_found'> {
  return getDb().transaction(async (tx) => {
    const [current] = await tx
      .select({ ownerEmail: serviceCases.ownerEmail })
      .from(serviceCases)
      .where(eq(serviceCases.id, id))
      .for('update');
    if (!current) return 'not_found';
    if (current.ownerEmail === ownerEmail) return 'ok';

    await tx.update(serviceCases).set({ ownerEmail }).where(eq(serviceCases.id, id));
    await tx.insert(activities).values({
      recordType: 'service_case',
      recordId: id,
      kind: 'note',
      body: ownerChangeBody(current.ownerEmail, ownerEmail),
      authorEmail: actorEmail,
    });
    return 'ok';
  });
}
