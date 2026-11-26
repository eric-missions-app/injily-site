# src/lib/

Plain TypeScript that both halves of the app share. **Nothing here touches the database or reads a secret**, so
anything in `lib/` is safe to import from a client component.

## What's here now

### `site.ts`: site config

The one source for names and links. Header, mobile menu and Footer all render from it, so changing the nav means
editing this file and nothing else.

| Export | What it is |
|---|---|
| `SITE_NAME` | `'injily'`, used for the wordmark and the footer |
| `CTA_LABEL`, `CTA_HREF` | `'Get early access'` → `/get-started`. Every call-to-action button uses these. |
| `PRODUCT_NAV` | the Product dropdown: 5 links to `/product/<slug>` |
| `USE_CASES_NAV` | the Who it's for dropdown: 3 links to `/use-cases/<slug>` |
| `FAQ_LINK` | `/faq` |
| `NAV_GROUPS`, `NAV_LINKS` | what the Header shows: the dropdowns, then the plain links |
| `FOOTER_COLUMNS` | the Footer's three columns: Product, Who it's for, Company (FAQ, Contact, Privacy) |
| `NavLink`, `NavGroup` | the types for the above |

## Coming next

### `validation/`: Zod schemas (J-2 onward)

There's one schema per input, and **the same schema runs in the browser and on the server**:

| File | Used by |
|---|---|
| `validation/lead.ts` | `LeadForm` and `POST /api/intake/lead` |
| `validation/case.ts` | `CaseForm` and `POST /api/intake/case` |
| `validation/admin.ts` | every admin Server Action (status, owner, note, edits) |

Export the schema and its inferred type together:

```ts
export const leadInput = z.object({ firstName: z.string().trim().min(1), /* … */ });
export type LeadInput = z.infer<typeof leadInput>;
```

## Rules

- No imports from `@/server`, no `process.env` secrets (`NEXT_PUBLIC_*` is fine), and no React components.
- If it's copy (sentences people read), it belongs in `src/content/`, not here.
