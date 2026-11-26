# src/components/

React components for the marketing pages. Admin-only components are in [`admin/`](admin/README.md), and the two
forms go in `forms/` (J-11).

## What's here now

| Component | Client? | What it does |
|---|---|---|
| `Header.tsx` | yes | The fixed 80px header: the "injily" wordmark (home link), the Product and Who it's for dropdowns, the FAQ link and the "Get early access" button. Below `md` (768px) these collapse into a menu button that opens a full-width panel. Esc closes the panel and puts focus back on the menu button. Every link comes from `@/lib/site`. |
| `DropdownMenu.tsx` | yes | One nav dropdown (used twice by Header). It opens on click, closes on outside click, Esc or focus leaving it, and returns focus to its button on Esc. It's animated with Framer Motion. |
| `Footer.tsx` | no | The wordmark, three link columns from `FOOTER_COLUMNS` (Product, Who it's for, Company), and "© {year} injily. Built for the harvest." The year is fixed at build time, because the page is static. |

## Coming next

| Component | Ticket | Notes |
|---|---|---|
| `Hero`, `WhyItMatters`, `Features` | J-6 | homepage sections, one component each |
| `HowItWorks`, `Audiences`, `FaqPreview`, `CTA` | J-7 | `CTA` is the dark `bg-primary-darker` card every page ends with |
| `ProductHero`, `ProductFeatures` | J-8 | shared by the 5 product and 3 use-case pages |
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
  `text-on-primary`, and use `hover:bg-primary-hover` for hover. Both pass WCAG AA in light and dark.
- **Focus is always visible:** interactive elements use `focus-visible:ring-2 focus-visible:ring-primary`.
- **Icons:** `<span aria-hidden="true" className="material-symbols-outlined">name</span>`. The font only serves the
  glyphs listed in `icon_names` in `src/app/layout.tsx`, so **add every new icon name there** (alphabetical), or it
  shows up as the word.
- **Images:** use `next/image`. An external host must first be allow-listed in `next.config.js`
  `images.remotePatterns`.
- **No app links.** There's no Log in, Sign up or Dashboard on the site. Every call to action uses `CTA_LABEL` /
  `CTA_HREF` from `@/lib/site`.
