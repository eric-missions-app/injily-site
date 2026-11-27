# src/app/get-started/

The "Get early access" page, at `/get-started`. `CTA_HREF` in `@/lib/site` points here, so every call to action on
the site lands on this page.

## What's here now

| File | What it does |
|---|---|
| `page.tsx` | A static page with its own `metadata`: the "Get early access" heading, a short paragraph on what happens next (a person from the team gets in touch), and `LeadForm` (`@/components/forms/LeadForm`), then the Footer. |

## Rules

- **It stays static.** The form is a client component that POSTs to `/api/intake/lead`; the page itself never reads
  the database, cookies, headers or search params.
- **No CTA card**, unlike other marketing pages: the form is the call to action.
- The form's fields and confirmation live in [`src/components/forms/`](../../components/forms/README.md).
