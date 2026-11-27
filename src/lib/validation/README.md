# src/lib/validation/

Zod schemas, one per input. **The same schema runs in the browser (the form) and on the server (the route
handler or Server Action)**, so nothing here imports from `@/server` or reads a secret. Each input schema is exported
together with its inferred type.

## Files

| File | Exports | Used by |
|---|---|---|
| `shared.ts` | `contactFields`, `phoneNumber`, `requiredText`, `optionalText`, `ORGANIZATION_TYPES` | `lead.ts` and `case.ts` |
| `lead.ts` | `leadInput`, `LeadInput` | `LeadForm` and `POST /api/intake/lead` |
| `case.ts` | `caseInput`, `CaseInput` | `CaseForm` and `POST /api/intake/case` |
| `admin.ts` | `statusChangeInput`, `ownerChangeInput`, `noteInput`, `personEditInput`, `organizationEditInput`, `opportunityEditInput`, `convertLeadInput`, `leadStatusFilter`, `caseStatusFilter`, `opportunityStageFilter`, `searchQuery`, `LEAD_STATUSES`, `CASE_STATUSES`, `ORGANIZATION_TYPES`, `OPPORTUNITY_STAGES` | the admin Server Actions and pages |

## The intake fields

| Field | Rule |
|---|---|
| `name` | required, one field, trimmed, 1–120 characters |
| `email` | required, trimmed and lowercased, a valid email |
| `phone` | required, trimmed; 7–25 characters of digits, spaces and `+()-.`, with at least 7 digits |
| `organizationName` | optional, up to 200 characters |
| `message` | optional, up to 2000 characters; **required** on a case |
| `sourcePage` | optional, the page the form was on |
| `subject` | case only, optional, up to 200 characters |
| `website` | the honeypot: a hidden field people never fill. The route accepts a filled one with 200 and stores nothing. |

There's no consent field: the forms show a privacy notice next to the button, and intake stores the submission time
as the Person's `consentAt`. Unknown keys are dropped.

Optional text is trimmed, and an empty string becomes `undefined`, so a blank form field never counts as a value.

## The admin inputs

- `statusChangeInput`: the allowed statuses depend on `recordType` (`lead` or `service_case`).
- `ownerChangeInput`: an email, or empty to unassign, which becomes `null`.
- `noteInput`: 1–5,000 characters.
- `leadStatusFilter`, `caseStatusFilter`: the list filters; an unknown `?status=` means all.
- `personEditInput`: one required `name` (up to 120 characters); the email is lowercased and the country uppercased
  to two letters; empty optional fields (phone included) become `null`.
- `organizationEditInput`: name and type are required; the country is optional (two letters, or empty for `null`).
- `opportunityEditInput`: name and stage are required; the expected start is a `YYYY-MM-DD` date or empty, and notes
  are up to 5,000 characters.
- `convertLeadInput`: the id of the lead to convert.
- `searchQuery`: the `?q=` search on lists; empty or over 100 characters means no search.
- `opportunityStageFilter`: the `?stage=` filter; an unknown value means all.
- `LEAD_STATUSES`, `CASE_STATUSES` and `OPPORTUNITY_STAGES` must match the enums in `src/server/db/schema.ts`.
  `ORGANIZATION_TYPES` is defined in `shared.ts` and re-exported here.

## Adding a schema

Export the schema and its inferred type together:

```ts
export const thingInput = z.object({ name: requiredText('a name', 100) });
export type ThingInput = z.infer<typeof thingInput>;
```

Error messages in a schema are shown to people as they are (a form shows them next to the field), so write them as
one short sentence.
