# src/server/services/

The CRM's business logic. **The only folder that imports `@/server/db`.** Route handlers, admin pages and Server
Actions validate their input, then call a function here.

| File | What it does |
|---|---|
| `leads.ts` | `listLeads(status?)` (newest first, with the person's name and country, else the organization's), `getLead(id)` (lead, person, organization and timeline), `setLeadStatus` and `setLeadOwner`. The intake functions arrive with J-2. |
| `cases.ts` | The same for Service Cases: `listCases`, `getCase` (the organization is the person's), `setCaseStatus`, `setCaseOwner`. |
| `activities.ts` | `listActivities(recordType, id)` (a record's timeline, newest first), `addNote(input, author)` and `ownerChangeBody`, the timeline line for an owner change. |
| `signInTokens.ts` | The Auth.js adapter for magic links: it stores and uses up rows in `verification_tokens`, and stores no users (admins are `ADMIN_EMAILS`). |

## Rules

- **Status and owner changes run in one transaction** that locks the row, updates it and writes an `activities`
  row (`status_change` for a status, `note` for an owner). Setting the current value again changes nothing and
  writes nothing.
- Edits return `'ok'` or `'not_found'`; the caller decides what to show. Never return a database message.
- Take the acting admin's email as an argument (from `requireAdmin()`); services don't read the session.
