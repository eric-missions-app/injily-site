# src/app/contact/

The contact page, at `/contact`. The Footer's Contact link and the privacy policy's "How to ask" point here.

## What's here now

| File | What it does |
|---|---|
| `page.tsx` | A static page with its own `metadata`: the "Contact us" heading, one line of intro, and `CaseForm` (`@/components/forms/CaseForm`), then the Footer. Each message becomes a Service Case in the CRM. |

## Rules

- **It stays static.** The form is a client component that POSTs to `/api/intake/case`; the page itself never reads
  the database, cookies, headers or search params.
- **No CTA card**, unlike other marketing pages.
- The form's fields and confirmation live in [`src/components/forms/`](../../components/forms/README.md).
