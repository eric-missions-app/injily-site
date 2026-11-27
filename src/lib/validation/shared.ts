import { z } from 'zod';

/** The organization types the CRM knows. Mirrors the `organization_type` enum in the database. */
export const ORGANIZATION_TYPES = ['church', 'ministry', 'mission_team', 'other'] as const;

/** Required text: trimmed, not empty, at most `max` characters. */
export function requiredText(label: string, max: number) {
  return z
    .string({ error: `Enter ${label}.` })
    .trim()
    .min(1, { error: `Enter ${label}.` })
    .max(max, { error: `Keep ${label} under ${max} characters.` });
}

/** Optional text: trimmed; an empty string becomes `undefined`, so the service only ever sees real values. */
export function optionalText(label: string, max: number) {
  return z
    .string()
    .trim()
    .max(max, { error: `Keep ${label} under ${max} characters.` })
    .optional()
    .transform((value) => (value ? value : undefined));
}

const PHONE_ERROR = 'Enter a valid phone number.';

/**
 * A phone number as people type it: 7 to 25 characters of digits, spaces and `+()-.`, with at least 7 digits
 * (`+55 81 99999-0000`, `(555) 123-4567`). Stored as typed, trimmed.
 */
export const phoneNumber = z
  .string({ error: 'Enter your phone number.' })
  .trim()
  .min(1, { error: 'Enter your phone number.' })
  .regex(/^[0-9 +().-]{7,25}$/, { error: PHONE_ERROR })
  .refine((value) => (value.match(/\d/g) ?? []).length >= 7, { error: PHONE_ERROR });

/**
 * The fields every intake form shares: who the visitor is, their organization, the message, and the honeypot.
 * `lead.ts` and `case.ts` build on this. There's no consent field: the form shows a privacy notice by the button,
 * and intake records the submission time as `consentAt`.
 */
export const contactFields = {
  name: requiredText('your name', 120),
  email: z
    .string({ error: 'Enter your email address.' })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: 'Enter a valid email address.' }).max(254)),
  phone: phoneNumber,
  organizationName: optionalText('the organization name', 200),
  message: optionalText('the message', 2000),
  sourcePage: optionalText('the source page', 500),
  /** Honeypot: hidden from people, so only bots fill it. A filled one is accepted and dropped. */
  website: z.string().optional(),
};
