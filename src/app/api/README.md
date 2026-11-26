# src/app/api/

Route handlers. Everything here is dynamic and server-side.

| Folder | What it holds |
|---|---|
| `intake/` | the two public endpoints, `POST /api/intake/lead` and `POST /api/intake/case`. See [intake/README.md](intake/README.md). |

## Rules

- **The only public endpoints are `POST /api/intake/lead` and `POST /api/intake/case`.** Every other route handler
  checks the admin session first. No route ever returns stored data to the public.
- Handlers stay thin: validate with a schema from `@/lib/validation`, call a service from `@/server/services`,
  return. They never import `@/server/db`.
- Errors are generic. Never return a database message or a stack trace, and never log form contents.
