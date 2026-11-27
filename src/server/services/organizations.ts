import 'server-only';
import { and, asc, desc, eq, ilike, ne, sql } from 'drizzle-orm';
import type { LeadStatus, OpportunityStage, OrganizationEditInput, OrganizationType } from '@/lib/validation/admin';
import { getDb, type Tx } from '@/server/db/client';
import { leads, opportunities, organizations, people } from '@/server/db/schema';
import { containsPattern } from './search';

/** An organization named on an intake form. The forms ask for its name only, so it has no country. */
export type OrganizationIntake = {
  name: string;
};

/** Matches `organizations.country` to `country`, with null matching null (as the unique index treats them). */
const sameCountry = (country: string | null) => sql`coalesce(${organizations.country}, '') = ${country ?? ''}`;

/**
 * Returns the id of the organization with this name (case-insensitive) and no country, creating it (type `other`)
 * if there's none. An existing organization is never changed. Safe under concurrency: the unique index on
 * (lower(name), coalesce(country, '')) makes a second insert a no-op, and the select then finds the row the other
 * request created.
 */
export async function matchOrCreateOrganization(tx: Tx, input: OrganizationIntake): Promise<string> {
  const name = input.name.trim();

  const [created] = await tx
    .insert(organizations)
    .values({ name, type: 'other' })
    .onConflictDoNothing()
    .returning({ id: organizations.id });
  if (created) return created.id;

  const [existing] = await tx
    .select({ id: organizations.id })
    .from(organizations)
    .where(and(sql`lower(${organizations.name}) = lower(${name})`, sameCountry(null)))
    .limit(1);
  if (!existing) throw new Error('organization_upsert_failed');
  return existing.id;
}

export type OrganizationListRow = {
  id: string;
  name: string;
  type: OrganizationType;
  city: string | null;
  country: string | null;
  createdAt: Date;
};

/** Organizations for the admin list, by name, optionally only those whose name contains `query`. */
export async function listOrganizations(query?: string): Promise<OrganizationListRow[]> {
  return getDb()
    .select({
      id: organizations.id,
      name: organizations.name,
      type: organizations.type,
      city: organizations.city,
      country: organizations.country,
      createdAt: organizations.createdAt,
    })
    .from(organizations)
    .where(query ? ilike(organizations.name, containsPattern(query)) : undefined)
    .orderBy(asc(organizations.name));
}

/** Every organization's id, name and country, by name: the choices for a Person's organization. */
export async function listOrganizationOptions(): Promise<{ id: string; name: string; country: string | null }[]> {
  return getDb()
    .select({ id: organizations.id, name: organizations.name, country: organizations.country })
    .from(organizations)
    .orderBy(asc(organizations.name));
}

export type OrganizationDetail = {
  organization: typeof organizations.$inferSelect;
  people: { id: string; name: string; email: string; role: string | null }[];
  leads: { id: string; status: LeadStatus; name: string; createdAt: Date }[];
  opportunities: { id: string; name: string; stage: OpportunityStage; createdAt: Date }[];
};

/** One Organization with its people (by name), leads and opportunities (newest first), or null. */
export async function getOrganization(id: string): Promise<OrganizationDetail | null> {
  const db = getDb();
  const [organization] = await db.select().from(organizations).where(eq(organizations.id, id));
  if (!organization) return null;

  const [orgPeople, orgLeads, orgOpportunities] = await Promise.all([
    db
      .select({
        id: people.id,
        name: people.name,
        email: people.email,
        role: people.role,
      })
      .from(people)
      .where(eq(people.organizationId, id))
      .orderBy(asc(people.name)),
    db
      .select({
        id: leads.id,
        status: leads.status,
        name: people.name,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .innerJoin(people, eq(leads.personId, people.id))
      .where(eq(leads.organizationId, id))
      .orderBy(desc(leads.createdAt)),
    db
      .select({
        id: opportunities.id,
        name: opportunities.name,
        stage: opportunities.stage,
        createdAt: opportunities.createdAt,
      })
      .from(opportunities)
      .where(eq(opportunities.organizationId, id))
      .orderBy(desc(opportunities.createdAt)),
  ]);
  return { organization, people: orgPeople, leads: orgLeads, opportunities: orgOpportunities };
}

/**
 * Saves an Organization's details. Returns 'duplicate' if another organization has the same name
 * (case-insensitive) and country (or both no country), which the unique index forbids.
 */
export async function updateOrganization(input: OrganizationEditInput): Promise<'ok' | 'not_found' | 'duplicate'> {
  const { id, ...fields } = input;
  return getDb().transaction(async (tx) => {
    const [current] = await tx
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.id, id))
      .for('update');
    if (!current) return 'not_found';

    const [other] = await tx
      .select({ id: organizations.id })
      .from(organizations)
      .where(
        and(
          sql`lower(${organizations.name}) = lower(${fields.name})`,
          sameCountry(fields.country),
          ne(organizations.id, id),
        ),
      );
    if (other) return 'duplicate';

    await tx.update(organizations).set(fields).where(eq(organizations.id, id));
    return 'ok';
  });
}
