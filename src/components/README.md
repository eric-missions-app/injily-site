# src/components/

React components for the marketing pages. Admin-only components are in [`admin/`](admin/README.md), and the two
forms are in [`forms/`](forms/README.md).

## What's here now

| Component | Client? | What it does |
|---|---|---|
| `Header.tsx` | yes | The fixed 80px header: the "injily" wordmark (home link), the Product and Who it's for dropdowns, the FAQ link and the "Get early access" button. Below `md` (768px) these collapse into a menu button that opens a full-width panel. Esc closes the panel and puts focus back on the menu button. Every link comes from `@/lib/site`. |
| `DropdownMenu.tsx` | yes | One nav dropdown (used twice by Header). It opens on click, closes on outside click, Esc or focus leaving it, and returns focus to its button on Esc. It's animated with Framer Motion. |
| `Footer.tsx` | no | The wordmark with one muted line under it ("Helping churches follow up with every new believer."), three link columns from `FOOTER_COLUMNS` (Product, Who it's for, Company), and "© {year} injily. Built for the harvest." The year is fixed at build time, because the page is static. |
| `Hero.tsx` | no | Homepage hero, text only and centered: the "Discipleship made simple" eyebrow, the headline "Never lose a new believer again.", the subhead (`HERO_SUBHEAD` from `@/content/hero`: we're building injily…, also the site's meta description), the `CTA_LABEL` button and a "What we're building" link to `#features`. No mockup or illustration. No entrance motion, so it shows on first paint. |
| `WhyItMatters.tsx` | no | Homepage section on why follow-up matters: what happens after a decision, then three points (nobody knows who's responsible, notes live on phones and paper, leaders can't see who's slipping). No statistics or numbers. |
| `Features.tsx` | no | Homepage `#features` (the Hero's "What we're building" target): "What we're building" and three cards (Keep track of every new believer, Someone responsible for each person, See who needs attention), each an icon, title and one sentence in the future tense. No links. Copy stays within the content rules in `ARCHITECTURE.md`. |
| `FadeIn.tsx` | yes | The one client wrapper for entrance motion: fades and lifts its children in once, when they scroll into view (Framer Motion, honors reduced motion). The server HTML is visible; after mount it hides only blocks still below the screen, so nothing depends on JavaScript to show. Static sections wrap their content in it and stay server components. Don't use it above the fold. |
| `Audiences.tsx` | no | Homepage `#audiences` (the use-case pages' breadcrumb target, on `bg-background-light`), "Who it's for": three cards (Churches & pastors, Evangelists, Mission & outreach teams), one line each within the content rules (say "your team", never "missioner"). The whole card links to its `/use-cases/<slug>` page. |
| `FaqPreview.tsx` | no | Homepage FAQ (on `bg-background`): `FaqAccordion` with the first four entries from `@/content/faq` and a "See all questions" link to `/faq`. |
| `FaqAccordion.tsx` | yes | The FAQ accordion used by `FaqPreview` and `/faq`: the `entries` it's given, one open at a time, questions as the given `headingLevel` (`h3` under a section's `h2`, `h2` under a page's `h1`). Real buttons with `aria-expanded`, so Tab and Enter work. Answers are in the server HTML, hidden until opened. |
| `CTA.tsx` | no | The dark `bg-primary-darker` card every marketing page ends with (not `/get-started`, `/contact` or `/privacy`): "Want to be first to try injily?", "Leave your details and we'll be in touch." and one `CTA_LABEL` button to `CTA_HREF`, light on the card (`bg-surface text-primary`) for the strongest contrast. Put `<CTA />` after the page's last section. The one optional prop, `tone`, sets the section background behind the card: `bg-background` by default, or `bg-background-light` with `tone="light"` when the section above is `bg-background` (the homepage). |
| `ProductHero.tsx` | no | The opening section of a product or use-case page (`bg-background`): a breadcrumb (`parent` link, then `name` as the current page, e.g. "Product / Convert tracking"), the `title` (the page's `h1`), and the `subtitle` (the page's one-sentence intro, in the future tense). Text only: no mockup or visual. No entrance motion: it's above the fold. |
| `ProductFeatures.tsx` | no | A product or use-case page's grid of at most three `points` (Material Symbols icon, title, body) under a `title` and optional `subtitle`, on `bg-background-light`, three across from `md`. A point's optional `link` adds a "More about <label>" link to a `/product` page under its body (the use-case pages use it). |

## Coming next

| Component | Ticket | Notes |
|---|---|---|
| `forms/LeadForm`, `forms/CaseForm` | J-11 | client components that POST to `/api/intake/*` |
| `admin/*` | J-5 | more admin components for People, Organizations and Opportunities |

## Rules

- **One homepage section, one component.** Keep them small and single-purpose.
- **Extract a shared component only when a section's structure repeats 3 or more times.** Repeated copy alone
  doesn't count. A page can hand-roll a section whose layout is slightly different.
- **Server component by default.** Add `'use client'` only for interactive state (menus, accordions, forms). If a
  static section only needs an entrance animation, wrap it in a small client wrapper and keep the section itself a
  server component.
- **Colors only through tokens:** `bg-primary`, `text-text`, `text-muted`, `border-border`, `bg-surface`, and so on.
  Never write hex, `rgb()`, or Tailwind palette classes like `bg-indigo-600`. For text on a primary background, use
  `text-on-primary`, and use `hover:bg-primary-hover` for hover. Both pass WCAG AA in light and dark. On the dark `bg-primary-darker` card,
  text uses `text-on-primary-darker`, which stays light in both themes.
- **Focus is always visible:** interactive elements use `focus-visible:ring-2 focus-visible:ring-primary` (on the
  dark CTA card, `focus-visible:ring-on-primary-darker`, so the ring shows against it).
- **Icons:** `<span aria-hidden="true" className="material-symbols-outlined">name</span>`. The font only serves the
  glyphs listed in `icon_names` in `src/app/layout.tsx`, so **add every new icon name there** (alphabetical), or it
  shows up as the word.
- **Images:** use `next/image`. An external host must first be allow-listed in `next.config.js`
  `images.remotePatterns`.
- **No app links.** There's no Log in, Sign up or Dashboard on the site. Every call to action uses `CTA_LABEL` /
  `CTA_HREF` from `@/lib/site`.
