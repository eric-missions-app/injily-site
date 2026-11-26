import 'server-only';
import { and, eq, sql } from 'drizzle-orm';
import type { Tx } from '@/server/db/client';
import { organizations } from '@/server/db/schema';

export type OrganizationIntake = {
  name: string;
  type?: (typeof organizations.$inferInsert)['type'];
  city?: string;
  /** ISO 3166-1 alpha-2 */
  country: string;
};

/**
 * Returns the id of the organization with this name (case-insensitive) and country, creating it if there's none.
 * An existing organization is never changed. Safe under concurrency: the unique index on (lower(name), country)
 * makes a second insert a no-op, and the select then finds the row the other request created.
 */
export async function matchOrCreateOrganization(tx: Tx, input: OrganizationIntake): Promise<string> {
  const name = input.name.trim();
  const country = input.country.trim().toUpperCase();

  const [created] = await tx
    .insert(organizations)
    .values({ name, type: input.type ?? 'other', city: input.city, country })
    .onConflictDoNothing()
    .returning({ id: organizations.id });
  if (created) return created.id;

  const [existing] = await tx
    .select({ id: organizations.id })
    .from(organizations)
    .where(and(sql`lower(${organizations.name}) = lower(${name})`, eq(organizations.country, country)))
    .limit(1);
  if (!existing) throw new Error('organization_upsert_failed');
  return existing.id;
}
