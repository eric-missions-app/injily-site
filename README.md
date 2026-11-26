# injily-site

The injily.com marketing site and its basic CRM: one Next.js 14 app on Vercel with a Postgres database. See
[ARCHITECTURE.md](ARCHITECTURE.md) for how it's built and the rules every change follows.

## Setup

```bash
npm install
cp .env.example .env.local      # fill in DATABASE_URL and the rest
npm run db:migrate              # apply migrations to your database
npm run dev                     # http://localhost:3000, admin at /admin
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | local dev server |
| `npm run lint` | ESLint |
| `npm run build` | production build; marketing routes must be static |
| `npm run db:generate` | generate a migration after changing `src/server/db/schema.ts` |
| `npm run db:migrate` | apply migrations |

## Deploy

Push to GitHub and import the repo into Vercel (Next.js is detected automatically). Add the Neon Postgres integration,
set the variables from `.env.example` in Project Settings → Environment Variables, and attach `injily.com` under
Domains. Every PR gets a preview deployment.
