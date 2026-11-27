# src/content/

Copy kept as data: sentences people read that more than one page shows. Components import it and render it; the
words live here so they're written once.

## What's here now

| File | What it holds |
|---|---|
| `faq.ts` | `FAQ`, every FAQ entry (`{ question, answer }`) in display order, and the `FaqEntry` type. The homepage `FaqPreview` shows the first four; `/faq` shows them all. |
| `hero.ts` | `HERO_SUBHEAD`, the homepage hero's subhead. `Hero` shows it, and `app/layout.tsx` and `app/opengraph-image.tsx` use it as the site-wide description and the social card's text, so they never drift apart. |
| `countries.ts` | `COUNTRIES`, every ISO 3166-1 alpha-2 country as `{ code, name }` sorted by English name, and the `Country` type. The intake forms' country select lists them and sends the code. |

## Rules

- Plain TypeScript data only: no React components, no imports from `@/server`, no `process.env`. Anything here is
  safe to import from a client component.
- Site config (nav, CTA label and target) stays in `src/lib/site.ts`; this folder is for copy.

## Common changes

- **Add or reword a question:** edit `faq.ts`. Order matters: the first four entries are the homepage preview.
  Answers follow the content rules in `ARCHITECTURE.md`: say what injily is being built to do, and promise nothing
  else (no pricing, privacy, import or mobile claims).
