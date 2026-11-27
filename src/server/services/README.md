# src/server/services/

The CRM's business logic. **This is the only folder that imports `@/server/db`.** Route handlers, admin pages and
Server Actions validate their input, then call a function here; they never query the database themselves. Every file
starts with `import 'server-only';`.

## Files

| File | Exports | What it does |
|---|---|---|
| `people.ts` | `upsertPerson`, `upsertContact` | `upsertPerson` creates a person or finds them by lowercased email (`ON CONFLICT (email)`). For an existing person it only fills blank fields (phone, city, country, role, organization) and never overwrites a stored value; first and last name are kept. `consent_at` is set to the submission's consent time. `upsertContact` is the first step of every intake: match or create the organization (if one was named), then upsert the person linked to it. |
| `organizations.ts` | `matchOrCreateOrganization` | Finds an organization by name (case-insensitive) + country, or creates it. An existing organization isn't changed. `ON CONFLICT DO NOTHING` on the unique `(lower(name), country)` index makes concurrent intakes safe. |
| `leads.ts` | `createLead`, `listLeads`, `getLead`, `setLeadStatus`, `setLeadOwner` | `createLead` is lead intake, in one transaction: `upsertContact`, a lead with status `new`, and a `note` activity on it; it returns the lead, person and organization ids. The rest serve the admin: `listLeads(status?)` (newest first, with the person's name and country, else the organization's), `getLead(id)` (lead, person, organization and timeline), and the status and owner changes. |
| `cases.ts` | `createCase`, `listCases`, `getCase`, `setCaseStatus`, `setCaseOwner` | The same for Service Cases. `createCase` creates one with status `open` and returns the case, person and organization ids. In `listCases` and `getCase`, the organization is the person's. |
| `activities.ts` | `listActivities`, `addNote`, `ownerChangeBody` | `listActivities(recordType, id)` is a record's timeline, newest first; `addNote(input, author)` adds to it; `ownerChangeBody` is the timeline line for an owner change. |
| `signInTokens.ts` | the Auth.js adapter | For magic links: it stores and uses up rows in `verification_tokens`, and stores no users (admins are `ADMIN_EMAILS`). |
| `rateLimit.ts` | `hashIp`, `allowSubmission` | `hashIp` is an HMAC-SHA256 of the IP with `IP_HASH_SALT` (the raw IP is never stored). `allowSubmission(ip, kind)` allows at most 5 submissions per IP hash per 10 minutes, across both forms, and records each allowed one in `submissions`. A per-hash advisory lock keeps parallel requests from slipping past the limit. |

## Rules

- **A function that writes several records does it in one transaction.** Helpers that run inside another
  service's transaction take the transaction handle (`Tx` from `@/server/db/client`) as their first argument.
- **Status and owner changes run in one transaction** that locks the row, updates it and writes an `activities`
  row (`status_change` for a status, `note` for an owner). Setting the current value again changes nothing and
  writes nothing.
- Input arrives already parsed by the Zod schema from `@/lib/validation` (for intake: emails lowercased, countries
  uppercased, blank optional fields as `undefined`). Services still normalize the keys they match on.
- Edits return `'ok'` or `'not_found'`; the caller decides what to show.
- Take the acting admin's email as an argument (from `requireAdmin()`); services don't read the session.
- Never log form contents. Return record ids, and let the caller log those.
- Never return a database message. An error thrown here never reaches a visitor as-is: the intake route handler turns
  it into a generic 500.

## Adding a service

1. Add `<thing>.ts` with `import 'server-only';` first.
2. Take a parsed input type from `@/lib/validation`, and open a transaction with `getDb().transaction(…)` if it
   writes more than one row.
3. Add it to the table above.
