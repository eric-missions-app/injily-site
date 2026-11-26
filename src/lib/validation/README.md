# src/lib/validation/

Zod schemas, one per input. **The same schema runs in the browser (the form) and on the server (the route
handler or Server Action)**, so nothing here imports from `@/server` or reads a secret.

## Files

| File | Exports | Used by |
|---|---|---|
| `shared.ts` | `contactFields`, `requiredText`, `optionalText`, `ORGANIZATION_TYPES` | `lead.ts` and `case.ts` |
| `lead.ts` | `leadInput`, `LeadInput` | `LeadForm` (J-11) and `POST /api/intake/lead` |
| `case.ts` | `caseInput`, `CaseInput` | `CaseForm` (J-11) and `POST /api/intake/case` |

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
Error messages are written for the visitor; the form shows them next to the field.

## Adding a schema

Export the schema and its inferred type together:

```ts
export const thingInput = z.object({ name: requiredText('a name', 100) });
export type ThingInput = z.infer<typeof thingInput>;
```
