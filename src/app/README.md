# src/app/

The Next.js App Router. **Every folder is a URL.** A folder with a `page.tsx` is a page, a folder with a `route.ts`
is an API endpoint, and there's no router config anywhere.

## What's here now

| File | What it does |
|---|---|
| `layout.tsx` | The root HTML shell for every page. It loads Manrope through `next/font/google` (self-hosted, exposed as `--font-manrope`), links the Material Symbols icon font, and sets site-wide `metadata` (title template `%s \| injily`, description). |
| `globals.css` | Tailwind's directives plus the **color tokens**: CSS variables under `:root` (light) and `.dark` (dark). This is the only place a color value is written. |
| `page.tsx` | The homepage (`/`). For now it's just `Header`, an empty `<main className="pt-20">` and `Footer`. Sections arrive with J-6 and J-7. |
| `privacy/page.tsx` | The privacy policy (`/privacy`), linked from the Footer and from the forms' consent checkbox. Static, plain-language copy: what we collect, why, who can see it, how long we keep it, the visitor's rights and how to ask (via `/contact`). When the copy changes, update its "Last updated" date; keep it in step with the form fields and the services it names. No CTA card. |

## What's coming, by ticket

```
app/
  page.tsx                      J-6, J-7   homepage sections
  product/<slug>/page.tsx       J-8, J-9   convert-tracking, follow-up, mentoring, missions, insights
  use-cases/<slug>/page.tsx     J-10       churches, evangelists, mission-teams
  faq/page.tsx                  J-10
  get-started/page.tsx          J-11       Lead form (every "Get early access" button lands here)
  contact/page.tsx              J-11       Service Case form
  sitemap.ts, robots.ts         J-13
  not-found.tsx                 J-13
  api/intake/lead/route.ts      J-2        the only public endpoints
  api/intake/case/route.ts      J-2
  api/auth/[...nextauth]/route.ts  J-4
  admin/                        J-4, J-5   signed-in CRM
```

## Rules for pages here

- **Marketing pages are static.** `npm run build` must show them as `○ (Static)`. They never import from
  `@/server`, and never call `cookies()`, `headers()` or anything else that makes a route dynamic.
- **Every page has the same frame:** `<Header />`, then `<main className="pt-20">` (the padding clears the fixed
  80px header), a stack of full-width `<section>`s with alternating `bg-background` / `bg-background-light`, the
  shared `CTA` card (from J-7; not on `/get-started`, `/contact` and `/privacy`), then `<Footer />`.
- **Every marketing page exports its own `metadata`** (`title`, `description`). The layout's template adds
  " | injily".
- **Sub-pages open with a breadcrumb** back to their parent, e.g. `Product / Mentoring`.
- **Anything under `api/` and `admin/` is dynamic and server-side.** Route handlers stay thin: they validate input
  with a Zod schema from `@/lib/validation`, call a service, and return.

## Adding a page

1. Create `src/app/<section>/<slug>/page.tsx` and export a default component plus `metadata`.
2. If it belongs in the nav, add it to `src/lib/site.ts`; the Header, mobile menu and Footer all read from there.
3. Run `npm run build` and check the new route shows as static.
