# src/lib/validation/

Zod schemas, one per input, **shared by the browser and the server**. Each file exports the schema and its inferred
type together. Nothing here imports from `@/server` or reads a secret.

| File | Used by |
|---|---|
| `admin.ts` | the admin Server Actions and pages: `statusChangeInput` (statuses depend on `recordType`: `lead` or `service_case`), `ownerChangeInput` (an email, or empty to unassign, which becomes `null`), `noteInput` (1–5,000 characters), and the list filters `leadStatusFilter` / `caseStatusFilter` (an unknown `?status=` means all). The edit forms: `personEditInput` (email lowercased, country uppercased to two letters, empty optional fields become `null`), `organizationEditInput` (name, type and country required), `opportunityEditInput` (stage, a `YYYY-MM-DD` expected start or empty, notes up to 5,000 characters), and `convertLeadInput`. The list helpers `searchQuery` (`?q=`; empty or over 100 characters means no search) and `opportunityStageFilter`. Also `LEAD_STATUSES`, `CASE_STATUSES`, `ORGANIZATION_TYPES` and `OPPORTUNITY_STAGES`, which must match the enums in `src/server/db/schema.ts`. |
| `lead.ts`, `case.ts` | `LeadForm`, `CaseForm` and `POST /api/intake/*` (J-2) |

Error messages in a schema are shown to people as they are, so write them as one short sentence.
