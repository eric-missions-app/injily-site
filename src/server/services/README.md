# src/server/services/

The CRM's business logic. **This is the only folder that imports `@/server/db`.** Route handlers, admin pages and
Server Actions call a function here; they never query the database themselves. Every file starts with
`import 'server-only';`.

## Files

| File | Exports | What it does |
|---|---|---|
| `people.ts` | `upsertPerson`, `upsertContact` | `upsertPerson` creates a person or finds them by lowercased email (`ON CONFLICT (email)`). For an existing person it only fills blank fields (phone, city, country, role, organization) and never overwrites a stored value; first and last name are kept. `consent_at` is set to the submission's consent time. `upsertContact` is the first step of every intake: match or create the organization (if one was named), then upsert the person linked to it. |
| `organizations.ts` | `matchOrCreateOrganization` | Finds an organization by name (case-insensitive) + country, or creates it. An existing organization isn't changed. `ON CONFLICT DO NOTHING` on the unique `(lower(name), country)` index makes concurrent intakes safe. |
| `leads.ts` | `createLead` | Lead intake, in one transaction: `upsertContact`, a lead with status `new`, and a `note` activity on it. Returns the lead, person and organization ids. |
| `cases.ts` | `createCase` | Service case intake, in one transaction: `upsertContact`, a service case with status `open`, and a `note` activity on it. Returns the case, person and organization ids. |
| `rateLimit.ts` | `hashIp`, `allowSubmission` | `hashIp` is an HMAC-SHA256 of the IP with `IP_HASH_SALT` (the raw IP is never stored). `allowSubmission(ip, kind)` allows at most 5 submissions per IP hash per 10 minutes, across both forms, and records each allowed one in `submissions`. A per-hash advisory lock keeps parallel requests from slipping past the limit. |

## Rules

- **A function that writes several records does it in one transaction.** Helpers that run inside another
  service's transaction take the transaction handle (`Tx` from `@/server/db/client`) as their first argument.
- Input arrives already parsed by the Zod schema from `@/lib/validation` (emails lowercased, countries uppercased,
  blank optional fields as `undefined`). Services still normalize the keys they match on.
- Never log form contents. Return record ids, and let the caller log those.
- Errors thrown here never reach a visitor as-is: the route handler turns them into a generic 500.

## Adding a service

1. Add `<thing>.ts` with `import 'server-only';` first.
2. Take a parsed input type from `@/lib/validation`, and open a transaction with `getDb().transaction(…)` if it
   writes more than one row.
3. Add it to the table above.
