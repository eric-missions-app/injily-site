# Architecture Overview

A reusable blueprint for marketing/SaaS websites built the way this one is. Use this as a checklist when starting a new site from scratch.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (JIT, class-based dark mode) |
| Animation | Framer Motion |
| Font | Google Font via `next/font` (Manrope here) + Material Symbols for icons |
| Hosting | Vercel (zero-config for Next.js) |
| Images | `next/image`, remote images allow-listed in `next.config.js` |

This is a **static/SSG marketing site** — no database, no auth, no API routes. All "backend" needs (forms, analytics) are third-party embeds or external links (e.g. a Calendly link for demos).

## Directory Layout

```
src/
  app/
    layout.tsx          # root HTML shell, fonts, global <head> metadata (SEO/OG/Twitter)
    page.tsx             # homepage — composes section components
    globals.css          # Tailwind directives + CSS variable color tokens
    pricing/page.tsx
    resources/page.tsx
    product/<slug>/page.tsx       # one route per product feature
    use-cases/<slug>/page.tsx     # one route per audience segment
  components/
    Header.tsx, Footer.tsx        # global chrome, present on every page
    DropdownMenu.tsx              # shared nav primitive
    Hero.tsx, Features.tsx, HowItWorks.tsx, Testimonials.tsx, CTA.tsx, LogoCloud.tsx   # homepage sections
    ProductHero.tsx, ProductFeatures.tsx, ProductTabs.tsx, ProductCTA.tsx              # reusable sections for product/use-case pages
public/                  # static assets (favicon, logo)
```

**Routing convention**: every top-level nav item is a folder under `src/app/`; every sub-item (a product feature, a use case/persona) is a nested folder with its own `page.tsx`. This gives clean URLs (`/product/chat-plan`, `/use-cases/churches`) for free via the App Router's file-based routing — no router config needed.

## Page Composition Pattern

Every page is a **vertical stack of full-width `<section>` blocks**, each with alternating background (`bg-white` / `bg-background-light`) for visual rhythm:

```tsx
export default function SomePage() {
  return (
    <div className="w-full">
      <Header />
      <main className="pt-20">   {/* pt-20 offsets the fixed header */}
        <HeroSection />
        <DescriptionSection />
        <FeatureGridSection />
        <TabsSection />           {/* optional, interactive */}
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
```

Two flavors show up:
- **Homepage**: imports small, single-purpose components (`<Hero />`, `<Features />`, ...) — one component per section, kept in `src/components/`.
- **Product/use-case pages**: sections are often inlined directly in the page file (not extracted to components) since each page's copy is unique. Shared visual primitives (`ProductHero`, `ProductFeatures`, `ProductTabs`, `ProductCTA`) exist for the common cases, but pages are free to hand-roll a section when the layout differs slightly.

This is a reasonable tradeoff for a marketing site: extract a component only once a section's *structure* (not just its copy) repeats 3+ times.

## Styling System

**Don't hardcode colors in components.** Define them once as CSS variables, map them into Tailwind's theme, and reference the Tailwind tokens everywhere.

1. `globals.css` defines raw hex values as CSS variables under `:root`, with overrides under `.dark`:
   ```css
   :root { --color-primary: #2c6ed5; --color-background: #f8f9fa; ... }
   .dark { --color-background: #111827; ... }
   ```
2. `tailwind.config.js` maps those variables to theme colors (`primary`, `background`, `surface`, `text`, `border`, `accent`), plus `darkMode: 'class'`.
3. Components use the semantic token, and dark mode is automatic — no `dark:` variant needed for colors wired through variables:
   ```tsx
   <div className="bg-background text-text border border-border">
   ```
   (Note: this codebase has a mix of the semantic tokens above and older explicit `dark:bg-gray-900` style utilities from before the token system existed — new pages should prefer the semantic tokens.)

**Fonts**: a Google Font is loaded via `next/font/google` in `layout.tsx` (not a `<link>` tag) for automatic optimization/self-hosting, exposed as a CSS variable, and wired into `tailwind.config.js` under `fontFamily.sans`. A display/body font pair can be added the same way if the design calls for it.

**Icons**: Material Symbols loaded via a Google Fonts `<link>` in the root `<head>`, used via `<span className="material-symbols-outlined">icon_name</span>`.

## SEO / Metadata

All metadata (title, description, OG tags, Twitter card, favicon) is set once via the `metadata` export in `layout.tsx` using Next's typed `Metadata` API — no manual `<meta>` tags. Per-page metadata can be added by exporting `metadata` from an individual `page.tsx` (not yet used here, but supported by the App Router) when pages need unique titles/descriptions for SEO.

## Conventions Worth Repeating

- **Breadcrumb on sub-pages**: product/use-case pages open with a small `Product / Chat & Plan` breadcrumb link back to the parent section.
- **Consistent CTA pattern**: every page ends with a dark `bg-primary-darker` card containing a headline, subcopy, and a single primary button — usually an external scheduling link (Calendly) rather than a form, since this site has no backend.
- **Client components only when needed**: pages/components with interactive state (tabs, dropdowns) are marked `'use client'`; static sections stay server components by default for better performance.
- **Images**: external image hosts must be allow-listed in `next.config.js` under `images.remotePatterns`, or `next/image` will refuse to render them.

## Scaffolding a New, Similar Site

1. `npx create-next-app@14 <name> --typescript --tailwind --app`
2. Copy over: `tailwind.config.js` color/font token structure, `globals.css` variable scheme, `Header`/`Footer`/`DropdownMenu` as a starting chrome.
3. Define the new brand's palette as CSS variables first — everything else (buttons, cards, CTAs) falls out of the token system for free.
4. Pick nav structure (top-level sections → nested feature/persona pages) and create matching folders under `src/app/`.
5. Build the homepage from small section components; build sub-pages as single-file sections, extracting a shared component only when a structure repeats.
6. Push to GitHub, import into Vercel, attach custom domain. See `README.md` / `QUICK_START.md` for the exact deploy steps.

## Related Docs in This Repo

- `README.md` — setup, customization, and deployment instructions
- `QUICK_START.md` — condensed "get it live in 10 minutes" deploy guide
- `COLORS.md` — full reference for the color token system
