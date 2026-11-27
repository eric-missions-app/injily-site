import 'server-only';
import { and, asc, desc, eq, ilike, ne, or, sql } from 'drizzle-orm';
import type { CaseStatus, LeadStatus, PersonEditInput } from '@/lib/validation/admin';
import { getDb } from '@/server/db/client';
import { leads, organizations, people, serviceCases } from '@/server/db/schema';
import { containsPattern } from './search';

export type PersonListRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationName: string | null;
  country: string | null;
  createdAt: Date;
};

/** People for the admin list, by last then first name, optionally only those whose name or email contains `query`. */
export async function listPeople(query?: string): Promise<PersonListRow[]> {
  const pattern = query ? containsPattern(query) : undefined;
  return getDb()
    .select({
      id: people.id,
      firstName: people.firstName,
      lastName: people.lastName,
      email: people.email,
      organizationName: organizations.name,
      country: people.country,
      createdAt: people.createdAt,
    })
    .from(people)
    .leftJoin(organizations, eq(people.organizationId, organizations.id))
    .where(
      pattern
        ? or(
            ilike(people.firstName, pattern),
            ilike(people.lastName, pattern),
            ilike(sql`${people.firstName} || ' ' || ${people.lastName}`, pattern),
            ilike(people.email, pattern),
          )
        : undefined,
    )
    .orderBy(asc(people.lastName), asc(people.firstName));
}

export type PersonDetail = {
  person: typeof people.$inferSelect;
  organization: typeof organizations.$inferSelect | null;
  leads: { id: string; status: LeadStatus; interest: string | null; organizationName: string | null; createdAt: Date }[];
  cases: { id: string; status: CaseStatus; subject: string | null; createdAt: Date }[];
};

/** One Person with their organization, leads and service cases (newest first), or null if they don't exist. */
export async function getPerson(id: string): Promise<PersonDetail | null> {
  const db = getDb();
  const [row] = await db
    .select({ person: people, organization: organizations })
    .from(people)
    .leftJoin(organizations, eq(people.organizationId, organizations.id))
    .where(eq(people.id, id));
  if (!row) return null;

  const [personLeads, personCases] = await Promise.all([
    db
      .select({
        id: leads.id,
        status: leads.status,
        interest: leads.interest,
        organizationName: organizations.name,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .leftJoin(organizations, eq(leads.organizationId, organizations.id))
      .where(eq(leads.personId, id))
      .orderBy(desc(leads.createdAt)),
    db
      .select({
        id: serviceCases.id,
        status: serviceCases.status,
        subject: serviceCases.subject,
        createdAt: serviceCases.createdAt,
      })
      .from(serviceCases)
      .where(eq(serviceCases.personId, id))
      .orderBy(desc(serviceCases.createdAt)),
  ]);
  return { ...row, leads: personLeads, cases: personCases };
}

/**
 * Saves a Person's details. Returns 'email_taken' if another person has the email (emails are unique) and
 * 'organization_not_found' if the chosen organization no longer exists.
 */
export async function updatePerson(
  input: PersonEditInput,
): Promise<'ok' | 'not_found' | 'email_taken' | 'organization_not_found'> {
  const { id, ...fields } = input;
  return getDb().transaction(async (tx) => {
    const [current] = await tx.select({ id: people.id }).from(people).where(eq(people.id, id)).for('update');
    if (!current) return 'not_found';

    const [other] = await tx
      .select({ id: people.id })
      .from(people)
      .where(and(eq(people.email, fields.email), ne(people.id, id)));
    if (other) return 'email_taken';

    if (fields.organizationId) {
      const [organization] = await tx
        .select({ id: organizations.id })
        .from(organizations)
        .where(eq(organizations.id, fields.organizationId));
      if (!organization) return 'organization_not_found';
    }

    await tx.update(people).set(fields).where(eq(people.id, id));
    return 'ok';
  });
}
