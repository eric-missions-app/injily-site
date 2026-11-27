# src/components/

React components for the marketing pages. Admin-only components are in [`admin/`](admin/README.md), and the two
forms are in [`forms/`](forms/README.md).

## What's here now

| Component | Client? | What it does |
|---|---|---|
| `Header.tsx` | yes | The fixed 80px header: the "injily" wordmark (home link), the Product and Who it's for dropdowns, the FAQ link and the "Get early access" button. Below `md` (768px) these collapse into a menu button that opens a full-width panel. Esc closes the panel and puts focus back on the menu button. Every link comes from `@/lib/site`. |
| `DropdownMenu.tsx` | yes | One nav dropdown (used twice by Header). It opens on click, closes on outside click, Esc or focus leaving it, and returns focus to its button on Esc. It's animated with Framer Motion. |
| `Footer.tsx` | no | The wordmark, three link columns from `FOOTER_COLUMNS` (Product, Who it's for, Company), and "© {year} injily. Built for the harvest." The year is fixed at build time, because the page is static. |
| `Hero.tsx` | no | Homepage hero: the "Discipleship made simple" eyebrow, the headline and subhead, the `CTA_LABEL` button, a "See how it works" link to `#how-it-works`, and the product illustration `public/hero-illustration.svg`. Two columns from `lg`; below that the illustration sits under the text. No entrance motion, so it shows on first paint. |
| `WhyItMatters.tsx` | no | Homepage section on why follow-up matters: what happens after a decision, then three points (nobody knows who's responsible, notes live on phones and paper, leaders can't see who's slipping). No statistics or numbers. |
| `Features.tsx` | no | Homepage `#features`: "Everything your ministry needs" and six feature cards, each with an icon and a "Learn more" link to its product page. The card copy matches injily.com word for word; keep it that way. |
| `FadeIn.tsx` | yes | The one client wrapper for entrance motion: fades and lifts its children in once, when they scroll into view (Framer Motion, honors reduced motion). The server HTML is visible; after mount it hides only blocks still below the screen, so nothing depends on JavaScript to show. Static sections wrap their content in it and stay server components. Don't use it above the fold. |
| `HowItWorks.tsx` | no | Homepage `#how-it-works` (the Hero's "See how it works" target): "How it works", the numbered steps 01 Register a convert, 02 Assign & schedule, 03 Track & grow, and the discipleship pipeline as three stages: New believer, Growing, Mature. |
| `Audiences.tsx` | no | Homepage "Who it's for": three cards (Churches & pastors, Evangelists & missioners, Mission & outreach teams), one line each. The whole card links to its `/use-cases/<slug>` page. |
| `FaqPreview.tsx` | yes | Homepage FAQ: an accordion of the first four entries from `@/content/faq` (one open at a time; real buttons with `aria-expanded`, so Tab and Enter work) and a "See all questions" link to `/faq`. Answers are in the server HTML, hidden until opened. |
| `CTA.tsx` | no | The dark `bg-primary-darker` card every marketing page ends with (not `/get-started`, `/contact` or `/privacy`): "Ready to strengthen your church's follow-up?", "Make disciples, not just decisions." and one `CTA_LABEL` button to `CTA_HREF`. No props: put `<CTA />` after the page's last section. |

## Coming next

| Component | Ticket | Notes |
|---|---|---|
| `ProductHero`, `ProductFeatures` | J-8 | shared by the 5 product and 3 use-case pages |

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
