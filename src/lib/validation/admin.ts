import { z } from 'zod';

/** Lead and Service Case statuses, in workflow order. Must match the enums in src/server/db/schema.ts. */
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'closed'] as const;
export const CASE_STATUSES = ['open', 'in_progress', 'resolved'] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type CaseStatus = (typeof CASE_STATUSES)[number];

/** The records the admin Leads and Cases screens edit. Values match `activities.record_type`. */
export const adminRecordType = z.enum(['lead', 'service_case']);
export type AdminRecordType = z.infer<typeof adminRecordType>;

/** Change a Lead's or a Service Case's status. The allowed statuses depend on the record type. */
const pickStatus = { error: 'Pick a status from the list.' };
export const statusChangeInput = z.discriminatedUnion('recordType', [
  z.object({ recordType: z.literal('lead'), id: z.uuid(), status: z.enum(LEAD_STATUSES, pickStatus) }),
  z.object({ recordType: z.literal('service_case'), id: z.uuid(), status: z.enum(CASE_STATUSES, pickStatus) }),
]);
export type StatusChangeInput = z.infer<typeof statusChangeInput>;

/** Assign a Lead or a Service Case to someone by email. An empty value clears the owner. */
export const ownerChangeInput = z.object({
  recordType: adminRecordType,
  id: z.uuid(),
  ownerEmail: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.union([z.literal(''), z.email()], { error: 'Enter a valid email address.' }))
    .transform((value) => (value === '' ? null : value)),
});
export type OwnerChangeInput = z.infer<typeof ownerChangeInput>;

/** Add a note to a Lead's or a Service Case's timeline. */
export const noteInput = z.object({
  recordType: adminRecordType,
  id: z.uuid(),
  body: z.string().trim().min(1, 'Write a note first.').max(5000, 'Keep notes under 5,000 characters.'),
});
export type NoteInput = z.infer<typeof noteInput>;

/** The `?status=` filter on the Leads and Cases lists. Anything unknown means "all". */
export const leadStatusFilter = z.enum(LEAD_STATUSES).optional().catch(undefined);
export const caseStatusFilter = z.enum(CASE_STATUSES).optional().catch(undefined);

/** Organization types and Opportunity stages. Must match the enums in src/server/db/schema.ts. */
export const ORGANIZATION_TYPES = ['church', 'ministry', 'mission_team', 'other'] as const;
export const OPPORTUNITY_STAGES = ['discovery', 'onboarding', 'active', 'lost'] as const;

export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];
export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number];

/** Empty form fields become `null`. */
const emptyToNull = (value: string | undefined) => (value ? value : null);

/** A required one-line text field. */
const requiredText = (label: string, max: number) =>
  z
    .string({ error: `Enter a ${label}.` })
    .trim()
    .min(1, `Enter a ${label}.`)
    .max(max, `Keep the ${label} under ${max} characters.`);

/** An optional one-line text field: empty becomes `null`. */
const optionalText = (label: string, max: number) =>
  z.string().trim().max(max, `Keep the ${label} under ${max} characters.`).optional().transform(emptyToNull);

/** ISO 3166-1 alpha-2, stored uppercase. */
const countryCode = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{2}$/, 'Enter a two-letter country code, like BR.');

/** Edit a Person. Phone, city, country, role and organization may be left empty. */
export const personEditInput = z.object({
  id: z.uuid(),
  firstName: requiredText('first name', 100),
  lastName: requiredText('last name', 100),
  email: z
    .string({ error: 'Enter a valid email address.' })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: 'Enter a valid email address.' })),
  phone: optionalText('phone', 50),
  city: optionalText('city', 100),
  country: z.string().trim().optional().transform(emptyToNull).pipe(countryCode.nullable()),
  role: optionalText('role', 100),
  organizationId: z
    .string()
    .optional()
    .transform(emptyToNull)
    .pipe(z.uuid({ error: 'Pick an organization from the list.' }).nullable()),
});
export type PersonEditInput = z.infer<typeof personEditInput>;

/** Edit an Organization. Name, type and country are required: intake matches an organization by name + country. */
export const organizationEditInput = z.object({
  id: z.uuid(),
  name: requiredText('name', 200),
  type: z.enum(ORGANIZATION_TYPES, { error: 'Pick a type from the list.' }),
  city: optionalText('city', 100),
  country: z.string({ error: 'Enter a two-letter country code, like BR.' }).pipe(countryCode),
  website: optionalText('website', 300),
});
export type OrganizationEditInput = z.infer<typeof organizationEditInput>;

/** Edit an Opportunity. Expected start is a `YYYY-MM-DD` date, or empty. */
export const opportunityEditInput = z.object({
  id: z.uuid(),
  name: requiredText('name', 200),
  stage: z.enum(OPPORTUNITY_STAGES, { error: 'Pick a stage from the list.' }),
  expectedStart: z
    .string()
    .trim()
    .optional()
    .transform(emptyToNull)
    .pipe(z.iso.date({ error: 'Enter a date, like 2027-01-15.' }).nullable()),
  notes: optionalText('notes', 5000),
});
export type OpportunityEditInput = z.infer<typeof opportunityEditInput>;

/** Convert a qualified Lead into an Opportunity. */
export const convertLeadInput = z.object({ leadId: z.uuid() });

/** The `?q=` search on the People and Organizations lists. Empty or unusable means no search. */
export const searchQuery = z
  .string()
  .trim()
  .max(100)
  .optional()
  .transform((value) => value || undefined)
  .catch(undefined);

/** The `?stage=` filter on the Opportunities list. Anything unknown means "all". */
export const opportunityStageFilter = z.enum(OPPORTUNITY_STAGES).optional().catch(undefined);
