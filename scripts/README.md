# scripts/

Node scripts that run outside the Next.js app, during builds and deploys. They aren't bundled into the site.

| Path | What it is |
|---|---|
| `migrate-on-deploy.mjs` | Applies pending `drizzle/` migrations with drizzle's migrator. `npm run vercel-build` runs it after `next build`. It migrates only when `VERCEL_ENV` is `production`; previews and local builds print why they skipped. On Vercel (`VERCEL` set) with no `VERCEL_ENV`, it fails. It connects with `DATABASE_URL_UNPOOLED`, falling back to `DATABASE_URL`, and prints which of the two it used. A failed migration exits non-zero, naming the file, so the deploy fails. It never prints the connection string. |

## Rules

- Plain `.mjs` that runs with `node`: no TypeScript and no imports from `src/` (that code is server-only and needs
  Next.js to load).
- Never print secrets or connection strings, and never print form contents.

## Running `migrate-on-deploy.mjs` by hand

In `.env.local`, point **both `DATABASE_URL` and `DATABASE_URL_UNPOOLED`** at a fresh Neon branch, never at
production. Changing only `DATABASE_URL` isn't enough: this script uses `DATABASE_URL_UNPOOLED` first (`npm run
db:migrate` uses only `DATABASE_URL`), and a file from `vercel env pull` can hold production's. Then:

```bash
VERCEL_ENV=production node scripts/migrate-on-deploy.mjs
```

It reads `.env.local` and `.env` the way `drizzle.config.ts` does, and a variable already set in your shell wins over
both files. It prints which variable it connected with. For everyday local migrations, use `npm run db:migrate`.
