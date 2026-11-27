# src/server/

Server-only code: the database, the CRM's business logic, email and admin sign-in. **Every file here starts with
`import 'server-only';`**, so the build fails if a client component ever imports one. That keeps the database
connection and secrets out of the browser.

## Layout

| Folder / file | What it holds | Ticket |
|---|---|---|
| `db/` | the Drizzle schema and the one database connection | here now, see [db/README.md](db/README.md) |
| `services/` | business logic. Here now: intake and the admin side of `leads.ts` and `cases.ts`, `people.ts`, `organizations.ts`, `opportunities.ts`, `rateLimit.ts`, `activities.ts`, `search.ts`, `signInTokens.ts` | here now, see [services/README.md](services/README.md) |
| `email/` | the Resend client and the email templates (team notification, visitor confirmation) | J-3 |
| `auth.ts` | Auth.js: email magic links via Resend, accepted only for `ADMIN_EMAILS`; JWT sessions. Exports `handlers`, `auth`, `signIn`, `signOut` and `requireAdmin()` | here now |
| `auth.config.ts` | the Edge-safe part of the Auth.js config that `src/middleware.ts` uses (no adapter, no provider), plus `isAdminEmail()` | here now |

## Admin sign-in

- A link is requested at `/api/auth/signin`. **Only an address in `ADMIN_EMAILS` gets one.** Any other address gets
  no email and lands on the same "Check your email" page, so the form doesn't reveal who's an admin.
- The link's token is stored hashed in `verification_tokens` (through `services/signInTokens.ts`) and works once.
- Sessions are signed JWT cookies (`AUTH_SECRET`); there are no users or sessions tables. Middleware, the admin
  layout, every admin page and every Server Action re-check that the session's email is still on the allow-list,
  so removing an address locks it out on its next request.
- **Every admin page and Server Action calls `requireAdmin()` first.** It returns the admin's email (for
  `activities.author_email`) or redirects to sign-in.

## Who may import what

```
app/api/*/route.ts ─┐
app/admin/**        ├─▶ server/services/* ─▶ server/db
(Server Actions)    ┘           │
                                └─▶ server/email
```

- **Only `services/` imports `db/`.** Route handlers, admin pages and Server Actions call a service function; they
  never query the database themselves.
- **Business logic lives only in services.** That covers deduplicating people and organizations, status changes,
  writing `activities` rows, rate limiting and sending email. Route handlers and pages stay thin: validate,
  call, return.
- **A service that writes several records does it in one transaction.** It sends email only after the
  transaction commits. An email failure is logged and never fails the request.

## Secrets and logging

- Secrets (`DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY`, `IP_HASH_SALT`, …) are read only here, from
  `process.env`. Every variable is listed in `.env.example` at the repo root.
- **Never log form contents** (names, emails, phone numbers, messages). Log record ids and error codes.
- Errors that reach a visitor are generic. Never return a database message or a stack trace.
