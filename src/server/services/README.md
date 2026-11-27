# src/server/services/

The CRM's business logic. **The only folder that imports `@/server/db`.** Route handlers, admin pages and Server
Actions validate their input, then call a function here.

| File | What it does |
|---|---|
| `leads.ts` | `listLeads(status?)` (newest first, with the person's name and country, else the organization's), `getLead(id)` (lead, person, organization, the opportunity it was converted into, and timeline), `setLeadStatus` (returns `'use_convert'` for a change to `converted`, which only `convertLeadToOpportunity` makes) and `setLeadOwner`. The intake functions arrive with J-2. |
| `cases.ts` | The same for Service Cases: `listCases`, `getCase` (the organization is the person's), `setCaseStatus`, `setCaseOwner`. |
| `people.ts` | `listPeople(query?)` (by last then first name; `query` matches first, last or full name or email), `getPerson(id)` (person, organization, leads, cases) and `updatePerson(input)`, which returns `'email_taken'` if another person has the email and `'organization_not_found'` for a missing organization. |
| `organizations.ts` | `listOrganizations(query?)` (by name; `query` matches the name), `listOrganizationOptions()` (the Person form's organization picker), `getOrganization(id)` (organization, people, leads, opportunities) and `updateOrganization(input)`, which returns `'duplicate'` if another organization has the same name (case-insensitive) and country. |
| `opportunities.ts` | `listOpportunities(stage?)` (newest first), `getOpportunity(id)` (opportunity, organization, lead and timeline), `updateOpportunity(input, actor)` and `convertLeadToOpportunity(leadId, actor)`. Converting runs in one transaction: it creates the opportunity at `discovery`, named after the lead's organization (or the person, if there's none), sets the lead to `converted` and writes an activity on both. A lead that isn't `qualified`, or already has an opportunity, isn't converted. |
| `activities.ts` | `listActivities(recordType, id)` (a record's timeline, newest first), `addNote(input, author)` and `ownerChangeBody`, the timeline line for an owner change. |
| `search.ts` | `containsPattern(query)`: an `ILIKE` "contains" pattern with `%`, `_` and `\` escaped. |
| `signInTokens.ts` | The Auth.js adapter for magic links: it stores and uses up rows in `verification_tokens`, and stores no users (admins are `ADMIN_EMAILS`). |

## Rules

- **Status and owner changes run in one transaction** that locks the row, updates it and writes an `activities`
  row (`status_change` for a status or an Opportunity's stage, `note` for an owner or other Opportunity fields).
  Setting the current value again changes nothing and writes nothing.
- **Edits that could break a unique index check first** (a Person's email, an Organization's name + country) and
  return a named result the caller shows as a field error.
- Edits return `'ok'` or `'not_found'`; the caller decides what to show. Never return a database message.
- Take the acting admin's email as an argument (from `requireAdmin()`); services don't read the session.
