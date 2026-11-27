# Architecture

injily-site is two things in one Next.js app on Vercel:

1. **The marketing site** (injily.com): static pages that explain injily to churches, evangelists and mission teams.
2. **A basic CRM**: the site's forms create records (Person, Organization, Lead, Service Case) in a Postgres
   database, and a small signed-in admin area at `/admin` is where the team follows them up.

The marketing pages stay static and fast. Everything dynamic (the database, the intake API, the admin area) is
server-side and kept apart from them.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS (class-based dark mode) |
| Animation | Framer Motion |
| Font | Manrope via `next/font/google`; Material Symbols for icons |
| Database | Postgres (Neon, through the Vercel integration) |
| Data access | Drizzle ORM; migrations with `drizzle-kit`, committed under `drizzle/` |
| Validation | Zod, one schema per input, shared by the form and the server |
| Admin sign-in | Auth.js (NextAuth v5) email magic links, limited to an allow-list |
| Email | Resend (team notifications and visitor confirmations) |
| Hosting | Vercel |
| Images | `next/image`; remote hosts allow-listed in `next.config.js` |

## Directory layout

```
src/
  app/
    layout.tsx                 # root shell, fonts, site-wide metadata (SEO/OG/Twitter)
    page.tsx                   # homepage: composes section components
    globals.css                # Tailwind directives + CSS variable color tokens
    product/<slug>/page.tsx    # one page per product feature
    use-cases/<slug>/page.tsx  # one page per audience
    faq/page.tsx
    get-started/page.tsx       # Lead form ("Get early access")
    contact/page.tsx           # Service Case form
    privacy/page.tsx
    api/
      intake/lead/route.ts     # public POST: creates Person, Organization, Lead
      intake/case/route.ts     # public POST: creates Person, Service Case
      auth/[...nextauth]/route.ts
    admin/                     # signed-in CRM; dynamic, never cached
      layout.tsx               # checks the session, renders the admin chrome
      leads/page.tsx, leads/[id]/page.tsx
      cases/page.tsx, cases/[id]/page.tsx
      people/…, organizations/…, opportunities/…
  components/                  # marketing components (Header, Footer, Hero, …)
  components/admin/            # admin-only components (tables, status pickers)
  components/forms/            # LeadForm, CaseForm (client components)
  content/                     # copy as data (faq.ts, nav in site.ts)
  lib/
    site.ts                    # nav tree, CTA label and target
    validation/                # Zod schemas: lead.ts, case.ts, admin edits
  server/                      # server-only code; every file starts with `import 'server-only'`
    db/schema.ts               # Drizzle tables
    db/client.ts               # the one database connection
    services/                  # business logic: leads.ts, cases.ts, people.ts, …
    email/                     # Resend client and email templates
    auth.ts                    # Auth.js config and allow-list
    auth.config.ts             # the Edge-safe part middleware uses (JWT sessions, no adapter)
  middleware.ts                # protects /admin/*
drizzle/                       # generated migrations (committed)
public/                        # favicon, logo, OG image, screenshots
```

**Routing:** every top-level nav item is a folder under `src/app/`. Every sub-item (a product feature, an audience)
is a nested folder with its own `page.tsx`. There's no router config.

## The two halves

### Marketing pages (static)

- Everything outside `src/app/api/` and `src/app/admin/` is static: `npm run build` must report those routes as
  static (○). Never read the database, cookies or headers in a marketing page.
- Every page is a vertical stack of full-width `<section>` blocks with alternating backgrounds (`bg-background` /
  `bg-background-light`), under a fixed `Header` (`<main className="pt-20">`) and above a `Footer`.
- **Homepage**: small single-purpose components in `src/components/`, one per section (`Hero`, `WhyItMatters`,
  `Features`, `Audiences`, `FaqPreview`, then `CTA`).
- **Product and use-case pages**: shared `ProductHero`, `ProductFeatures` and `CTA` sections. A page may hand-roll a
  section when its layout differs. Extract a shared component only once a section's *structure* (not just its copy)
  repeats 3 or more times.
- Sub-pages open with a breadcrumb (`Product / Mentoring`) back to their parent.
- Every page ends with the dark `bg-primary-darker` CTA card with one primary button, except `/get-started` and
  `/contact`, where the form is the call to action. The button's label and target come from `src/lib/site.ts`.
- Forms are the only interactive part of a marketing page: `src/components/forms/*` are client components that POST
  JSON to `/api/intake/*`. The page around them stays static.

### CRM (server)

- **The only public endpoints are `POST /api/intake/lead` and `POST /api/intake/case`.** There's no public read
  endpoint, ever. Any other route handler is admin-only and checks the session.
- **Route handlers and admin pages stay thin.** They parse input with the Zod schema, call a function in
  `src/server/services/`, and return the result. Business logic (deduplication, status changes, emails) lives
  only in services. Only services import `src/server/db`.
- **Server Actions** are allowed in `/admin` for edits (status, owner, notes). Each one checks the session and
  validates its input with a Zod schema first.
- `src/server/**` is server-only and is never imported from a client component.

### Data model

Keep it basic. Every table has `id` (uuid), `createdAt` and `updatedAt`.

| Table | Fields |
|---|---|
| `people` | firstName, lastName, email (unique, lowercased), phone, city, country (ISO 3166 alpha-2), role, organizationId |
| `organizations` | name, type (`church`, `ministry`, `mission_team`, `other`), city, country, website |
| `leads` | personId, organizationId, sourcePage, interest, message, status (`new`, `contacted`, `qualified`, `converted`, `closed`), ownerEmail |
| `service_cases` | personId, subject, message, status (`open`, `in_progress`, `resolved`), ownerEmail |
| `opportunities` | organizationId, leadId, name, stage (`discovery`, `onboarding`, `active`, `lost`), expectedStart, notes |
| `activities` | recordType, recordId, kind (`note`, `status_change`, `email`), body, authorEmail |
| `submissions` | kind (`lead`, `case`), ipHash, createdAt (for rate limiting) |
| `verification_tokens` | identifier (email), token (hashed), expires: admin magic links, deleted once used |

- Intake deduplicates: a Person is matched by email, an Organization by name and country (case-insensitive).
  An existing Person's blank fields get filled in, and filled ones are never overwritten by a form.
- Every status or owner change writes an `activities` row.
- Change the schema only in `src/server/db/schema.ts`, then `npm run db:generate`. Commit the migration with the
  change. Never edit an applied migration.

## Intake: forms to records

1. The visitor fills `LeadForm` or `CaseForm`. Required fields: first name, last name, email, country, and the consent
   checkbox (linked to `/privacy`). Phone, city, organization, role and message are optional.
2. The form validates with the same Zod schema the server uses, then POSTs JSON.
3. The route handler re-validates and drops the request quietly (returning 200) if the hidden honeypot field is
   filled. It rate-limits to 5 submissions per IP hash per 10 minutes (429), then calls the service.
4. The service, in one transaction, upserts the Person and Organization, creates the Lead or Service Case, and writes
   an activity.
5. After commit, it emails the team inbox (`TEAM_INBOX`) with a link to the record in `/admin`. It also sends the
   visitor a confirmation. An email failure is logged and never fails the submission.
6. The form is replaced with: **"Thanks, {first name}. Someone from our team will follow up shortly."**

Errors are shown next to the field (validation) or as one line above the button (anything else). Never show a stack
trace or a database message.

## Admin

- `/admin/*` requires a session; `middleware.ts` redirects to sign-in otherwise. Sign-in is an emailed magic link,
  accepted only for addresses in `ADMIN_EMAILS`.
- v1 screens: Leads and Service Cases (list with status filter, detail with status, owner and notes), then People,
  Organizations and Opportunities (list, detail, edit; convert a qualified Lead into an Opportunity).
- Admin pages are dynamic (`export const dynamic = 'force-dynamic'`), carry `robots: { index: false }`, and are left
  out of the sitemap.

## Content rules

injily isn't built yet, so the site only says what it is **being built** to do. These are the only product claims
allowed:

- injily is being built to help churches, evangelists and mission teams follow up with new believers: keep track of
  each person after they respond, make sure someone is responsible for following up, and see who needs attention.
- Say it in the future tense or as "we're building". Never write a sentence that says a feature works today.
- Nothing more specific: no numbers or time rules (like "14 days"), no import, no sign-in or email features, no
  branding, messaging, goals, dashboards, reports, calendars, reminders, pipelines or stage names, no multi-church
  features, no pricing, no privacy or security promises, no "works on your phone" or "nothing to install".
- No mockups or invented screenshots, people, churches, numbers, prices or promises unless a ticket states them word
  for word.

## Styling system

**Don't hardcode colors in components.** Define them once as CSS variables, map them into Tailwind's theme, and use
the tokens everywhere, in the admin area too.

1. `globals.css` defines the palette as CSS variables under `:root`, with overrides under `.dark`:
   `--color-primary`, `--color-primary-darker`, `--color-background`, `--color-background-light`, `--color-surface`,
   `--color-text`, `--color-muted`, `--color-border`, `--color-accent`, `--color-danger`, `--color-success`.
2. `tailwind.config.js` maps them to `primary`, `primary-darker`, `background`, … with `darkMode: 'class'`.
3. Components use the tokens: `bg-background text-text border-border`. No hex values, `rgb()`, or raw palette classes
   like `bg-indigo-600` in components.

**Fonts:** Manrope via `next/font/google` in `layout.tsx`, exposed as a CSS variable and set as `fontFamily.sans`.
**Icons:** Material Symbols via a Google Fonts `<link>` in the root head:
`<span className="material-symbols-outlined">icon_name</span>`.

## Client components only when needed

Mark a component `'use client'` only when it has interactive state: dropdowns, the mobile menu, FAQ accordions, forms,
admin pickers. Static sections stay server components.

## SEO and metadata

Site-wide metadata (title template, description, OG, Twitter card, favicon) is set once via the `metadata` export in
`layout.tsx`. Every marketing page exports its own `metadata`. `src/app/sitemap.ts` lists the marketing pages only, and
`robots.ts` disallows `/admin` and `/api`.

## Privacy and security

- Collect only the fields above. The consent checkbox is required, and its timestamp is stored with the Person.
- Store a salted hash of the IP (`IP_HASH_SALT`), never the raw IP.
- Secrets live only in server environment variables, never in `NEXT_PUBLIC_*`, never in client code, and never
  committed. `.env.example` lists every variable with a placeholder.
- Never log form contents. Log record ids.

## Environment variables

| Name | Used for |
|---|---|
| `DATABASE_URL` | Postgres connection (Neon) |
| `AUTH_SECRET` | Auth.js session signing |
| `ADMIN_EMAILS` | comma-separated allow-list for `/admin` |
| `RESEND_API_KEY` | sending email |
| `EMAIL_FROM` | sender, e.g. `injily <hello@injily.com>` |
| `TEAM_INBOX` | where new-lead and new-case notifications go |
| `IP_HASH_SALT` | salting IP hashes for rate limiting |
| `NEXT_PUBLIC_SITE_URL` | absolute URLs in metadata and emails |

## Folder READMEs

Every folder under `src/` (and `drizzle/`) has a `README.md`. It covers what the folder holds, file by file, the rules
for it, and how to make the common changes. When a change adds or changes what a folder holds, update that folder's
`README.md` in the same PR. A new folder gets its own.

## Checks

`npm run lint`, `npx tsc --noEmit` and `npm run build` must pass on every change. A schema change includes its
generated migration.
