# src/app/api/

Route handlers. **The only public endpoints are `POST /api/intake/lead` and `POST /api/intake/case`** (J-2). Every
other handler here is admin-only and checks the session.

| Path | What it is |
|---|---|
| `auth/[...nextauth]/route.ts` | Auth.js: sign-in page, magic-link callback, sign-out, session. See [auth/README.md](auth/README.md). |

Handlers stay thin: validate with a schema from `@/lib/validation`, call a service, return. Never return a database
message or a stack trace.
