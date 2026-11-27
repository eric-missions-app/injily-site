# src/app/privacy/

The privacy policy, at `/privacy`. The Footer's Privacy link points here, and so will the forms' consent checkbox.

## What's here now

| File | What it does |
|---|---|
| `page.tsx` | A static page with its own `metadata`. Plain-language copy under one heading per topic: what we collect, why, who can see it, how long we keep it, the visitor's rights, and how to ask (a link to `/contact`). `LAST_UPDATED` holds the date shown under the title. |

## Rules for editing

- **When the copy changes, update `LAST_UPDATED`** (both `iso` and `label`).
- **Keep it in step with the form fields** in `src/lib/validation/lead.ts` and `case.ts` (the fields both forms
  share are in `shared.ts`). Adding, removing or changing a field means checking "What we collect".
- **Keep it in step with the services and third parties the site uses.** Today it names Resend (email), Neon
  (database), Vercel (hosting and request logs) and Google Fonts (the icon font linked in `src/app/layout.tsx`).
  Adding or removing one means checking "Who can see it".
- **Only promise what the code does.** Nothing deletes data automatically, including `submissions` rows (the salted
  IP hash). If a cleanup job is added, state its period under "How long we keep it".
- **No CTA card**, unlike other marketing pages.
- It stays a static server component, like every marketing page.
