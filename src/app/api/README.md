# src/app/api/

Route handlers. Everything here is dynamic and server-side.

| Path | What it is |
|---|---|
| `intake/` | the two public endpoints, `POST /api/intake/lead` and `POST /api/intake/case`. See [intake/README.md](intake/README.md). |
| `auth/[...nextauth]/route.ts` | Auth.js: sign-in page, magic-link callback, sign-out, session. See [auth/README.md](auth/README.md). |

## Rules

- **The only public endpoints are `POST /api/intake/lead` and `POST /api/intake/case`.** Every other route handler
  is admin-only and checks the session (`auth/` is the sign-in itself). No route ever returns stored data to the
  public.
- Handlers stay thin: validate with a schema from `@/lib/validation`, call a service from `@/server/services`,
  return. They never import `@/server/db`.
- Errors are generic. Never return a database message or a stack trace, and never log form contents.
