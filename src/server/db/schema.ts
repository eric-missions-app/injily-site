import 'server-only';
import { sql } from 'drizzle-orm';
import {
  check,
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// Shared columns: every table has id, createdAt and updatedAt.
const id = uuid('id').primaryKey().defaultRandom();
const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const organizationType = pgEnum('organization_type', [
  'church',
  'ministry',
  'mission_team',
  'other',
]);
export const leadStatus = pgEnum('lead_status', [
  'new',
  'contacted',
  'qualified',
  'converted',
  'closed',
]);
export const serviceCaseStatus = pgEnum('service_case_status', ['open', 'in_progress', 'resolved']);
export const opportunityStage = pgEnum('opportunity_stage', [
  'discovery',
  'onboarding',
  'active',
  'lost',
]);
export const activityRecordType = pgEnum('activity_record_type', [
  'person',
  'organization',
  'lead',
  'service_case',
  'opportunity',
]);
export const activityKind = pgEnum('activity_kind', ['note', 'status_change', 'email']);
export const submissionKind = pgEnum('submission_kind', ['lead', 'case']);

export const organizations = pgTable(
  'organizations',
  {
    id,
    name: text('name').notNull(),
    type: organizationType('type').notNull().default('other'),
    city: text('city'),
    /** ISO 3166-1 alpha-2, uppercase, or null when unknown (the intake forms don't ask for it). */
    country: varchar('country', { length: 2 }),
    website: text('website'),
    ...timestamps,
  },
  (table) => [
    // One organization per name (case-insensitive) and country, with "no country" counting as one value, so
    // concurrent intakes can't create duplicates and the service can upsert with ON CONFLICT.
    uniqueIndex('organizations_name_country_unique').on(
      sql`lower(${table.name})`,
      sql`coalesce(${table.country}, '')`,
    ),
    check('organizations_country_iso2', sql`${table.country} ~ '^[A-Z]{2}$'`),
  ],
);

export const people = pgTable(
  'people',
  {
    id,
    /** The person's name in one field, as they typed it. */
    name: text('name').notNull(),
    /** Stored lowercased; unique. */
    email: text('email').notNull(),
    /** The intake forms require it; nullable because the admin may add people without one. */
    phone: text('phone'),
    city: text('city'),
    /** ISO 3166-1 alpha-2 */
    country: varchar('country', { length: 2 }),
    role: text('role'),
    organizationId: uuid('organization_id').references(() => organizations.id, {
      onDelete: 'set null',
    }),
    /** When the person last submitted a form (shown with its privacy notice). Required: everyone comes in that way. */
    consentAt: timestamp('consent_at', { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('people_email_unique').on(table.email),
    check('people_email_lowercase', sql`email = lower(email)`),
    check('people_country_iso2', sql`${table.country} ~ '^[A-Z]{2}$'`),
  ],
);

export const leads = pgTable('leads', {
  id,
  personId: uuid('person_id')
    .notNull()
    .references(() => people.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, {
    onDelete: 'set null',
  }),
  sourcePage: text('source_page'),
  interest: text('interest'),
  message: text('message'),
  status: leadStatus('status').notNull().default('new'),
  ownerEmail: text('owner_email'),
  ...timestamps,
});

export const serviceCases = pgTable('service_cases', {
  id,
  personId: uuid('person_id')
    .notNull()
    .references(() => people.id, { onDelete: 'cascade' }),
  subject: text('subject'),
  message: text('message'),
  status: serviceCaseStatus('status').notNull().default('open'),
  ownerEmail: text('owner_email'),
  ...timestamps,
});

export const opportunities = pgTable('opportunities', {
  id,
  organizationId: uuid('organization_id').references(() => organizations.id, {
    onDelete: 'set null',
  }),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  stage: opportunityStage('stage').notNull().default('discovery'),
  expectedStart: date('expected_start'),
  notes: text('notes'),
  ...timestamps,
});

export const activities = pgTable(
  'activities',
  {
    id,
    recordType: activityRecordType('record_type').notNull(),
    recordId: uuid('record_id').notNull(),
    kind: activityKind('kind').notNull(),
    body: text('body'),
    authorEmail: text('author_email'),
    ...timestamps,
  },
  (table) => [index('activities_record_idx').on(table.recordType, table.recordId)],
);

export const submissions = pgTable(
  'submissions',
  {
    id,
    kind: submissionKind('kind').notNull(),
    ipHash: text('ip_hash').notNull(),
    ...timestamps,
  },
  (table) => [index('submissions_ip_hash_created_at_idx').on(table.ipHash, table.createdAt)],
);

/**
 * Admin sign-in: one row per emailed magic link, deleted when it's used. Auth.js stores a hash of the token, never
 * the token itself. There's no users or sessions table: admins are the addresses in ADMIN_EMAILS, and sessions are
 * signed JWT cookies.
 */
export const verificationTokens = pgTable(
  'verification_tokens',
  {
    id,
    /** The email address the link was sent to, lowercased. */
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex('verification_tokens_token_unique').on(table.token)],
);
