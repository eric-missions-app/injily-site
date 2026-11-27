# src/app/admin/

The signed-in CRM. Every request needs a session for an address in `ADMIN_EMAILS`: `src/middleware.ts` redirects
anyone else to sign-in (`/api/auth/signin`), and the layout, every page and every Server Action check again with
`requireAdmin()` from `@/server/auth`.

## Files

| Path | What it is |
|---|---|
| `page.tsx` | `/admin` itself: checks the session and redirects to `/admin/leads`. |
| `error.tsx` | Shown in place of a page that fails to render (e.g. the database is down), with a Try again button. The admin header stays. |
| `layout.tsx` | Checks the session and renders the admin chrome: the "injily admin" wordmark, the nav (Leads, Cases, People, Organizations, Opportunities), the signed-in email and Sign out. Sets `dynamic = 'force-dynamic'` and `robots: { index: false }` for everything below it. |
| `actions.ts` | The Server Actions: `changeStatus`, `changeOwner`, `addNoteAction`, `savePerson`, `saveOrganization`, `saveOpportunity`, `convertLeadAction` and `signOutAction`. Each edit calls `requireAdmin()`, parses the form with a schema from `@/lib/validation/admin`, calls a service, and returns an `ActionState` ("Saved" or one error line) for `ActionForm`. The `save*` actions also return `fieldErrors` (field name → message) for `FieldError`, including "email already taken" and "duplicate organization" from the service; nothing is saved when one is returned. `convertLeadAction` redirects to the new opportunity. Service calls go through `attempt()`, so a database failure becomes the error line "Something went wrong saving this." instead of crashing the page. `signOutAction` checks the session too. |
| `leads/page.tsx` | Leads, newest first: name, organization, country, status, owner, created. `?status=new` (etc.) filters; an unknown value shows all. |
| `leads/[id]/page.tsx` | One Lead: the request (interest, source page, message), the person, the organization, the status picker, owner, a note box and the timeline. A `qualified` lead without an opportunity gets a "Convert to opportunity" button; a converted lead links to its opportunity. |
| `cases/page.tsx` | Service Cases, the same list as Leads. |
| `cases/[id]/page.tsx` | One Service Case: subject and message, the person and their organization, status, owner, notes and the timeline. |
| `people/page.tsx` | People, by name: name, email, organization, country. `?q=` searches the name and email (case-insensitive, contains). |
| `people/[id]/page.tsx` | One Person: the edit form (one name field, email, phone, city, country, role, organization; only name and email required) and their leads and cases. |
| `organizations/page.tsx` | Organizations, by name: name, type, city, country (`—` when none). `?q=` searches the name. |
| `organizations/[id]/page.tsx` | One Organization: the edit form (name, type, city, optional country, website) and its people, leads and opportunities. |
| `opportunities/page.tsx` | Opportunities, newest first: name, organization, stage, expected start, created. `?stage=` filters; an unknown value shows all. |
| `opportunities/[id]/page.tsx` | One Opportunity: its organization and lead, the edit form (name, stage, expected start, notes) and the timeline. |

## Rules

- **Pages stay thin:** `requireAdmin()`, validate params with Zod, call a service from `@/server/services`, render.
  Never import `@/server/db` here.
- **Every Server Action starts with `requireAdmin()`** and validates its input with a schema from
  `@/lib/validation/admin`. Middleware also covers them (an action POSTs to its page's URL), but the action's own
  check is the one that counts.
- Every status or owner change writes an `activities` row (done by the service): a status change (or an
  Opportunity's stage change) as `status_change`, an owner change and a note as `note`. Saving other Opportunity
  fields writes one `note` naming them. Converting a lead writes a row on the lead and on the new opportunity. The
  timeline shows them newest first with author and time. Person and Organization edits don't write activities.
- Edit forms use `ActionForm noValidate` with the fields from `@/components/admin/Fields`, so every validation
  message comes from the Zod schema and shows next to its field.
- Colors only through tokens, as everywhere else. Interactive bits (`ActionForm`) live in `@/components/admin`.

## Adding an admin screen

1. Create `src/app/admin/<name>/page.tsx` (and `[id]/page.tsx`), calling `requireAdmin()` first.
2. Add it to `ADMIN_NAV` in `layout.tsx`.
3. Put its queries in a service and its edit schemas in `@/lib/validation/admin`.
