# src/server/db/

The CRM's database: Postgres on Neon, accessed through Drizzle ORM. **Only `src/server/services/` imports from
here.**

## Files

| File | What it does |
|---|---|
| `schema.ts` | Every table, enum, index and check constraint. This is the source of truth for the database; migrations are generated from it. |
| `client.ts` | `getDb()`, the one database connection. It's created on first use, so `next build` works without `DATABASE_URL`, and a request without it fails with "DATABASE_URL is not set". It uses Neon's WebSocket driver (`ws`) because intake needs transactions, which the HTTP driver doesn't support. |

```ts
import { getDb } from '@/server/db/client';
import { leads } from '@/server/db/schema';

const db = getDb();
await db.transaction(async (tx) => { /* … */ });
```

## Tables

Every table has `id` (uuid, generated), `created_at` and `updated_at`. `updated_at` is set on every update.

| Table | Holds | Important constraints |
|---|---|---|
| `organizations` | name, type (`church`, `ministry`, `mission_team`, `other`), city, country, website | **unique on `lower(name)` + `country`**; `country` required, 2 uppercase letters |
| `people` | first/last name, email, phone, city, country, role, organization, `consent_at` | **unique `email`, stored lowercase** (enforced by a check); `consent_at` required; `country` 2 uppercase letters |
| `leads` | person, organization, source page, interest, message, status (`new` → `contacted` → `qualified` → `converted` / `closed`), owner email | person required (deleted with the person) |
| `service_cases` | person, subject, message, status (`open` → `in_progress` → `resolved`), owner email | person required |
| `opportunities` | organization, lead, name, stage (`discovery`, `onboarding`, `active`, `lost`), expected start, notes | |
| `activities` | the timeline for any record: `record_type` + `record_id`, kind (`note`, `status_change`, `email`), body, author email | indexed on (`record_type`, `record_id`) |
| `submissions` | one row per intake request: kind, salted IP hash | indexed on (`ip_hash`, `created_at`) for the 5-per-10-minutes rate limit |

### How intake uses the constraints

- **People** are upserted by email. Normalize it with `email.trim().toLowerCase()` before the query. The check
  constraint rejects mixed case, so a forgotten normalization fails loudly and can't create a duplicate.
- **Organizations** are upserted with `ON CONFLICT (lower(name), country)`. Two visitors from the same church
  submitting at the same moment get one organization, not two. Countries are always uppercase ISO codes (`BR`, not
  `br` or `Brazil`), and the Zod schema converts them before the service runs.
- **Consent:** a person can't be saved without `consent_at`. Set it to the time of the submission.

## Changing the schema

1. Edit `schema.ts`.
2. Run `npm run db:generate`. It writes a new SQL file and snapshot to `drizzle/` and needs no database
   connection.
3. Commit `schema.ts` and the generated files together, in the same PR.
4. `npm run db:migrate` applies pending migrations to the database in `DATABASE_URL`.

**Never edit a migration that has been applied anywhere.** Make a new one. See [drizzle/README.md](../../../drizzle/README.md).

`db:generate` sets `NODE_OPTIONS=--conditions=react-server` because `schema.ts` imports `server-only`, which throws
outside a React Server environment. The inline variable syntax doesn't work in Windows `cmd`; use WSL or Git Bash
there.
