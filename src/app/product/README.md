# src/app/product/

One page per product feature, at `/product/<slug>`. The Product dropdown, the Footer's Product column
(`PRODUCT_NAV` in `src/lib/site.ts`) and the homepage feature cards' "Learn more" links point here.

## What's here now

| Folder | Page |
|---|---|
| [`convert-tracking/`](convert-tracking/README.md) | `/product/convert-tracking` |
| [`follow-up/`](follow-up/README.md) | `/product/follow-up` (the homepage's Task Management and Calendar & Planner cards both link here) |

Mentoring, Missions and Insights come next (J-9).

## Rules for a product page

- **Same frame as every marketing page:** `Header`, `<main className="pt-20">`, the sections, `CTA` last, `Footer`.
- **Sections:** `ProductHero` (breadcrumb `Product / <name>` with "Product" linking to `/#features`, title,
  subtitle, visual), then `ProductFeatures` (3–6 points), then `CTA`. A page may hand-roll a section between them
  when its layout differs; keep backgrounds alternating (`bg-background` / `bg-background-light`).
- **The hero visual** is a small static component in the page file, styled only with color tokens, so it works in
  light and dark. Pass a `visualLabel` that says in words what it shows.
- **Exports its own `metadata`** (`title`, `description`).
- **Static and honest:** no database, cookies or headers; no numbers or statistics claims; no app links (Log in,
  Sign up, Dashboard). Every new icon goes in `icon_names` in `src/app/layout.tsx`.
