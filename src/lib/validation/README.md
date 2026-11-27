# src/lib/validation/

Zod schemas, one per input. **The same schema runs in the browser (the form) and on the server (the route
handler or Server Action)**, so nothing here imports from `@/server` or reads a secret. Each input schema is exported
together with its inferred type.

## Files

| File | Exports | Used by |
|---|---|---|
| `shared.ts` | `contactFields`, `requiredText`, `optionalText`, `ORGANIZATION_TYPES` | `lead.ts` and `case.ts` |
| `lead.ts` | `leadInput`, `LeadInput` | `LeadForm` and `POST /api/intake/lead` |
| `case.ts` | `caseInput`, `CaseInput` | `CaseForm` and `POST /api/intake/case` |
| `admin.ts` | `statusChangeInput`, `ownerChangeInput`, `noteInput`, `personEditInput`, `organizationEditInput`, `opportunityEditInput`, `convertLeadInput`, `leadStatusFilter`, `caseStatusFilter`, `opportunityStageFilter`, `searchQuery`, `LEAD_STATUSES`, `CASE_STATUSES`, `ORGANIZATION_TYPES`, `OPPORTUNITY_STAGES` | the admin Server Actions and pages |

## The intake fields

| Field | Rule |
|---|---|
| `firstName`, `lastName` | required, trimmed, up to 100 characters |
| `email` | required, trimmed and lowercased, a valid email |
| `country` | required, ISO 3166-1 alpha-2, converted to uppercase (`br` → `BR`) |
| `consent` | required, must be `true` |
| `phone`, `city`, `role` | optional |
| `organizationName`, `organizationType` | optional; the type is `church`, `ministry`, `mission_team` or `other` |
| `message` | optional, up to 2000 characters |
| `sourcePage` | optional, the page the form was on |
| `interest` | lead only, optional |
| `subject` | case only, **required** |
| `website` | the honeypot: a hidden field people never fill. The route accepts a filled one with 200 and stores nothing. |

Optional text is trimmed. In every optional text field and in `organizationType`, an empty string becomes
`undefined`, so a blank form field never counts as a value.

## The admin inputs

- `statusChangeInput`: the allowed statuses depend on `recordType` (`lead` or `service_case`).
- `ownerChangeInput`: an email, or empty to unassign, which becomes `null`.
- `noteInput`: 1–5,000 characters.
- `leadStatusFilter`, `caseStatusFilter`: the list filters; an unknown `?status=` means all.
- `personEditInput`: the email is lowercased and the country uppercased to two letters; empty optional fields become
  `null`.
- `organizationEditInput`: name, type and country are required.
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
