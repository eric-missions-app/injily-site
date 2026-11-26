# src/server/

Server-only code: the database, the CRM's business logic, email and admin sign-in. **Every file here starts with
`import 'server-only';`**, so the build fails if a client component ever imports one. That keeps the database
connection and secrets out of the browser.

## Layout

| Folder / file | What it holds | Ticket |
|---|---|---|
| `db/` | the Drizzle schema and the one database connection | J-1 (here now), see [db/README.md](db/README.md) |
| `services/` | business logic: `people.ts`, `organizations.ts`, `leads.ts`, `cases.ts`, `rateLimit.ts`, then `opportunities.ts` | J-2, J-5 |
| `email/` | the Resend client and the email templates (team notification, visitor confirmation) | J-3 |
| `auth.ts` | Auth.js config: email magic links, limited to `ADMIN_EMAILS` | J-4 |

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
