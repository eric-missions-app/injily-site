# src/app/

The Next.js App Router. **Every folder is a URL.** A folder with a `page.tsx` is a page, a folder with a `route.ts`
is an API endpoint, and there's no router config anywhere.

## What's here now

| File | What it does |
|---|---|
| `layout.tsx` | The root HTML shell for every page. It loads Manrope through `next/font/google` (self-hosted, exposed as `--font-manrope`), links the Material Symbols icon font, and sets site-wide `metadata` (title template `%s \| injily`, description). It also renders `SourcePageTracker` (from `components/forms/`), which records the previous page so a lead's `sourcePage` survives client-side navigation. |
| `globals.css` | Tailwind's directives plus the **color tokens**: CSS variables under `:root` (light) and `.dark` (dark). This is the only place a color value is written. |
| `page.tsx` | The homepage (`/`): `Header`, then `Hero`, `WhyItMatters`, `Features`, `HowItWorks`, `Audiences`, `FaqPreview` and `CTA` inside `<main className="pt-20">`, then `Footer`. Section backgrounds alternate `bg-background` / `bg-background-light` from the Hero down. |
| `privacy/page.tsx` | The privacy policy (`/privacy`). Static. Read [privacy/README.md](privacy/README.md) before editing it. |
| `get-started/page.tsx` | "Get early access" (`/get-started`), where every CTA button lands: what happens next and `LeadForm`. Static, no CTA card. See [get-started/README.md](get-started/README.md). |
| `contact/page.tsx` | "Contact us" (`/contact`): `CaseForm`. Static, no CTA card. See [contact/README.md](contact/README.md). |
| `api/intake/lead/route.ts`, `api/intake/case/route.ts` | The only public endpoints: `POST` a lead or a service case. See [api/README.md](api/README.md) and [api/intake/README.md](api/intake/README.md). |
| `api/auth/[...nextauth]/route.ts` | Auth.js for admin sign-in. See [api/README.md](api/README.md). |
| `admin/` | The signed-in CRM: Leads, Service Cases, People, Organizations and Opportunities (list and detail) and their Server Actions. See [admin/README.md](admin/README.md). |

## What's coming, by ticket

```
app/
  product/<slug>/page.tsx       J-8, J-9   convert-tracking, follow-up, mentoring, missions, insights
  use-cases/<slug>/page.tsx     J-10       churches, evangelists, mission-teams
  faq/page.tsx                  J-10
  sitemap.ts, robots.ts         J-13
  not-found.tsx                 J-13
```

## Rules for pages here

- **Marketing pages are static.** `npm run build` must show them as `○ (Static)`. They never import from
  `@/server`, and never call `cookies()`, `headers()` or anything else that makes a route dynamic.
- **Every page has the same frame:** `<Header />`, then `<main className="pt-20">` (the padding clears the fixed
  80px header), a stack of full-width `<section>`s with alternating `bg-background` / `bg-background-light`, the
  shared `CTA` card (`@/components/CTA`; not on `/get-started`, `/contact` and `/privacy`), then `<Footer />`.
- **Every marketing page exports its own `metadata`** (`title`, `description`). The layout's template adds
  " | injily".
- **Sub-pages open with a breadcrumb** back to their parent, e.g. `Product / Mentoring`.
- **Anything under `api/` and `admin/` is dynamic and server-side.** Route handlers stay thin: they validate input
  with a Zod schema from `@/lib/validation`, call a service, and return.

## Adding a page

1. Create `src/app/<section>/<slug>/page.tsx` and export a default component plus `metadata`.
2. If it belongs in the nav, add it to `src/lib/site.ts`; the Header, mobile menu and Footer all read from there.
3. Run `npm run build` and check the new route shows as static.
