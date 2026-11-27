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
