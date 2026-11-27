# src/app/faq/

The FAQ page, at `/faq`: the header nav's FAQ link, the Footer's Company column and the homepage's "See all
questions" link point here.

| File | What it does |
|---|---|
| `page.tsx` | `metadata`, then one `bg-background-light` section with the `h1` "Frequently asked questions", a line of intro and `FaqAccordion` with every entry from `@/content/faq` (questions as `h2`), then `CTA`. Static; the page itself is a server component and only the accordion is client-side. |

## Common changes

- **Add or reword a question:** edit `src/content/faq.ts`, not this page. The homepage preview shows the first four.
