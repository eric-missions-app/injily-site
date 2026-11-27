# src/

All the application code. This one Next.js app serves two halves with different rules:

| Half | Where | Rendering | Can touch the database? |
|---|---|---|---|
| Marketing site | `app/` (except `app/api/` and `app/admin/`), `components/`, `content/` | static, prerendered at build | no |
| CRM | `app/api/`, `app/admin/`, `server/`, `components/admin/` | dynamic, on the server | only through `server/services/` |

`lib/` is shared by both: plain TypeScript with no database access and no secrets.

## Folders

| Folder | What's in it | Read more |
|---|---|---|
| `app/` | routes: one folder per URL, plus the root layout and global CSS | [app/README.md](app/README.md) |
| `components/` | React components for the marketing pages; `admin/` and `forms/` subfolders later | [components/README.md](components/README.md) |
| `lib/` | site config (nav, CTA) now; Zod schemas in `lib/validation/` later | [lib/README.md](lib/README.md) |
| `server/` | server-only code: the database, services, email, auth | [server/README.md](server/README.md) |
| `content/` | copy kept as data: the FAQ entries | [content/README.md](content/README.md) |
| `middleware.ts` | protects `/admin/*` (arrives with J-4) | |

## How data flows

```
visitor ─▶ marketing page (static) ─▶ form (client component, components/forms/)
                                         │  POST JSON, validated with lib/validation/*
                                         ▼
                              app/api/intake/*/route.ts  (thin: parse, rate-limit, call service)
                                         ▼
                              server/services/*  (business logic, one transaction)
                                         ▼
                              server/db  ─▶  Postgres (Neon)
                                         ▼
                              server/email  ─▶  team inbox + visitor confirmation

team ─▶ app/admin/* (signed in) ─▶ Server Actions ─▶ server/services/* ─▶ server/db
```

## Imports

`@/` points at `src/` (see `tsconfig.json`), so write `import Header from '@/components/Header'`, not relative paths
across folders.

The rules that matter most:
- Nothing outside `server/` imports from `server/`, except `app/api/` and `app/admin/`.
- No client component (`'use client'`) imports from `server/` at all. The `server-only` package makes the build
  fail if one tries.

See [ARCHITECTURE.md](../ARCHITECTURE.md) for the full rules.
