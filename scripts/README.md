# scripts/

Node scripts that run outside the Next.js app, during builds and deploys. They aren't bundled into the site.

| Path | What it is |
|---|---|
| `migrate-on-deploy.mjs` | Applies pending `drizzle/` migrations with drizzle's migrator. `npm run vercel-build` runs it before `next build`. It migrates only when `VERCEL_ENV` is `production`; previews and local builds print why they skipped. It connects with `DATABASE_URL_UNPOOLED`, falling back to `DATABASE_URL`. A failed migration exits non-zero, naming the file, so the deploy fails. It never prints the connection string. |

## Rules

- Plain `.mjs` that runs with `node`: no TypeScript and no imports from `src/` (that code is server-only and needs
  Next.js to load).
- Never print secrets or connection strings, and never print form contents.

## Running `migrate-on-deploy.mjs` by hand

Point `.env.local` at a fresh Neon branch, never at production, then:

```bash
VERCEL_ENV=production node scripts/migrate-on-deploy.mjs
```

It reads `.env.local` and `.env` the way `drizzle.config.ts` does. For everyday local migrations, use
`npm run db:migrate`.
