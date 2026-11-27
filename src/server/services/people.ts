import 'server-only';
import { sql } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import type { Tx } from '@/server/db/client';
import { people } from '@/server/db/schema';
import type { CaseInput } from '@/lib/validation/case';
import type { LeadInput } from '@/lib/validation/lead';
import { matchOrCreateOrganization } from './organizations';

export type PersonIntake = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  /** ISO 3166-1 alpha-2 */
  country: string;
  role?: string;
  organizationId?: string;
  /** When the visitor ticked the consent checkbox. */
  consentAt: Date;
};

/** Keep the stored value unless it's blank; then take the submitted one. */
const fillBlank = (column: AnyPgColumn, excluded: string) =>
  sql`coalesce(nullif(${column}, ''), excluded.${sql.raw(excluded)})`;

/**
 * Creates the person, or finds them by (lowercased) email. For an existing person only blank fields are filled in;
 * a value already stored is never overwritten by a form. `consent_at` is set to this submission's consent.
 * Returns the person's id.
 */
export async function upsertPerson(tx: Tx, input: PersonIntake): Promise<string> {
  const [person] = await tx
    .insert(people)
    .values({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.trim().toLowerCase(),
      phone: input.phone,
      city: input.city,
      country: input.country,
      role: input.role,
      organizationId: input.organizationId,
      consentAt: input.consentAt,
    })
    .onConflictDoUpdate({
      target: people.email,
      set: {
        phone: fillBlank(people.phone, 'phone'),
        city: fillBlank(people.city, 'city'),
        country: fillBlank(people.country, 'country'),
        role: fillBlank(people.role, 'role'),
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
 * upsert the person and link them to it if they had no organization yet.
 */
export async function upsertContact(
  tx: Tx,
  input: LeadInput | CaseInput,
  consentAt: Date,
): Promise<{ personId: string; organizationId: string | undefined }> {
  const organizationId = input.organizationName
    ? await matchOrCreateOrganization(tx, {
        name: input.organizationName,
        type: input.organizationType,
        city: input.city,
        country: input.country,
      })
    : undefined;

  const personId = await upsertPerson(tx, {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    city: input.city,
    country: input.country,
    role: input.role,
    organizationId,
    consentAt,
  });

  return { personId, organizationId };
}
