# src/app/admin/

The signed-in CRM. Every request needs a session for an address in `ADMIN_EMAILS`: `src/middleware.ts` redirects
anyone else to sign-in (`/api/auth/signin`), and the layout, every page and every Server Action check again with
`requireAdmin()` from `@/server/auth`.

## Files

| Path | What it is |
|---|---|
| `layout.tsx` | Checks the session and renders the admin chrome: the "injily admin" wordmark, the nav (Leads, Cases), the signed-in email and Sign out. Sets `dynamic = 'force-dynamic'` and `robots: { index: false }` for everything below it. |
| `actions.ts` | The Server Actions: `changeStatus`, `changeOwner`, `addNoteAction` and `signOutAction`. Each edit calls `requireAdmin()`, parses the form with a schema from `@/lib/validation/admin`, calls a service, and returns an `ActionState` ("Saved" or one error line) for `ActionForm`. |
| `leads/page.tsx` | Leads, newest first: name, organization, country, status, owner, created. `?status=new` (etc.) filters; an unknown value shows all. |
| `leads/[id]/page.tsx` | One Lead: the request (interest, source page, message), the person, the organization, the status picker, owner, a note box and the timeline. |
| `cases/page.tsx` | Service Cases, the same list as Leads. |
| `cases/[id]/page.tsx` | One Service Case: subject and message, the person and their organization, status, owner, notes and the timeline. |

## Rules

- **Pages stay thin:** `requireAdmin()`, validate params with Zod, call a service from `@/server/services`, render.
  Never import `@/server/db` here.
- **Every Server Action starts with `requireAdmin()`** and validates its input with a schema from
  `@/lib/validation/admin`. Middleware also covers them (an action POSTs to its page's URL), but the action's own
  check is the one that counts.
- Every status or owner change writes an `activities` row (done by the service): a status change as
  `status_change`, an owner change and a note as `note`. The timeline shows them newest first with author and time.
- Colors only through tokens, as everywhere else. Interactive bits (`ActionForm`) live in `@/components/admin`.

## Adding an admin screen

1. Create `src/app/admin/<name>/page.tsx` (and `[id]/page.tsx`), calling `requireAdmin()` first.
2. Add it to `ADMIN_NAV` in `layout.tsx`.
3. Put its queries in a service and its edit schemas in `@/lib/validation/admin`.
