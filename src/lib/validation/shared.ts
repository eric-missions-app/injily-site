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

/**
 * The fields every intake form shares: who the visitor is, their organization, consent, and the honeypot.
 * `lead.ts` and `case.ts` extend this with their own fields.
 */
export const contactFields = {
  firstName: requiredText('your first name', 100),
  lastName: requiredText('your last name', 100),
  email: z
    .string({ error: 'Enter your email address.' })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: 'Enter a valid email address.' }).max(254)),
  phone: optionalText('the phone number', 40),
  city: optionalText('the city', 100),
  /** ISO 3166-1 alpha-2, converted to uppercase (`br` → `BR`). */
  country: z
    .string({ error: 'Choose your country.' })
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, { error: 'Choose your country.' }),
  organizationName: optionalText('the organization name', 200),
  organizationType: z.enum(ORGANIZATION_TYPES, { error: 'Choose an organization type.' }).optional(),
  role: optionalText('your role', 100),
  message: optionalText('the message', 2000),
  sourcePage: optionalText('the source page', 500),
  consent: z.literal(true, { error: 'Please agree to the privacy policy to continue.' }),
  /** Honeypot: hidden from people, so only bots fill it. A filled one is accepted and dropped. */
  website: z.string().optional(),
};
