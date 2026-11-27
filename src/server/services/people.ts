import 'server-only';
import { and, asc, desc, eq, ilike, ne, or, sql } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import type { CaseStatus, LeadStatus, PersonEditInput } from '@/lib/validation/admin';
import type { CaseInput } from '@/lib/validation/case';
import type { LeadInput } from '@/lib/validation/lead';
import { getDb, type Tx } from '@/server/db/client';
import { leads, organizations, people, serviceCases } from '@/server/db/schema';
import { matchOrCreateOrganization } from './organizations';
import { containsPattern } from './search';

export type PersonIntake = {
  name: string;
  email: string;
  phone: string;
  organizationId?: string;
  /** When the visitor submitted the form, next to its privacy notice. */
  consentAt: Date;
};

/** Keep the stored value unless it's blank; then take the submitted one. */
const fillBlank = (column: AnyPgColumn, excluded: string) =>
  sql`coalesce(nullif(${column}, ''), excluded.${sql.raw(excluded)})`;

/**
 * Creates the person, or finds them by (lowercased) email. For an existing person only blank fields are filled in;
 * a value already stored (the name included) is never overwritten by a form. `consent_at` is set to this submission.
 * Returns the person's id.
 */
export async function upsertPerson(tx: Tx, input: PersonIntake): Promise<string> {
  const [person] = await tx
    .insert(people)
    .values({
      name: input.name,
      email: input.email.trim().toLowerCase(),
      phone: input.phone,
      organizationId: input.organizationId,
      consentAt: input.consentAt,
    })
    .onConflictDoUpdate({
      target: people.email,
      set: {
        phone: fillBlank(people.phone, 'phone'),
        organizationId: sql`coalesce(${people.organizationId}, excluded.organization_id)`,
        consentAt: sql`excluded.consent_at`,
        updatedAt: new Date(),
      },
    })
    .returning({ id: people.id });
  return person.id;
}

/**
 * The shared first step of every intake: match or create the visitor's organization (when they named one), then
 * upsert the person and link them to it if they had no organization yet. `consentAt` is the submission time.
 */
export async function upsertContact(
  tx: Tx,
  input: LeadInput | CaseInput,
  consentAt: Date,
): Promise<{ personId: string; organizationId: string | undefined }> {
  const organizationId = input.organizationName
    ? await matchOrCreateOrganization(tx, { name: input.organizationName })
    : undefined;

  const personId = await upsertPerson(tx, {
    name: input.name,
    email: input.email,
    phone: input.phone,
    organizationId,
    consentAt,
  });

  return { personId, organizationId };
}

export type PersonListRow = {
  id: string;
  name: string;
  email: string;
  organizationName: string | null;
  country: string | null;
  createdAt: Date;
};

/** People for the admin list, by name, optionally only those whose name or email contains `query`. */
export async function listPeople(query?: string): Promise<PersonListRow[]> {
  const pattern = query ? containsPattern(query) : undefined;
  return getDb()
    .select({
      id: people.id,
      name: people.name,
      email: people.email,
      organizationName: organizations.name,
      country: people.country,
      createdAt: people.createdAt,
    })
    .from(people)
    .leftJoin(organizations, eq(people.organizationId, organizations.id))
    .where(pattern ? or(ilike(people.name, pattern), ilike(people.email, pattern)) : undefined)
    .orderBy(asc(people.name));
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
