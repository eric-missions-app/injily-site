# src/content/

Copy kept as data: sentences people read that more than one page shows. Components import it and render it; the
words live here so they're written once.

## What's here now

| File | What it holds |
|---|---|
| `faq.ts` | `FAQ`, every FAQ entry (`{ question, answer }`) in display order, and the `FaqEntry` type. The homepage `FaqPreview` shows the first four; `/faq` (J-10) shows them all. |

## Rules

- Plain TypeScript data only: no React components, no imports from `@/server`, no `process.env`. Anything here is
  safe to import from a client component.
- Site config (nav, CTA label and target) stays in `src/lib/site.ts`; this folder is for copy.

## Common changes

- **Add or reword a question:** edit `faq.ts`. Order matters: the first four entries are the homepage preview.
