# src/app/use-cases/

One page per audience, at `/use-cases/<slug>`. The Who it's for dropdown, the Footer's Who it's for column
(`USE_CASES_NAV` in `src/lib/site.ts`) and the homepage's Who it's for cards (`Audiences`, `#audiences`) point here.

## What's here now

| Folder | Page |
|---|---|
| [`churches/`](churches/README.md) | `/use-cases/churches`: pastors and follow-up leaders |
| [`evangelists/`](evangelists/README.md) | `/use-cases/evangelists`: individual evangelists and missioners |
| [`mission-teams/`](mission-teams/README.md) | `/use-cases/mission-teams`: outreach and mission-trip teams |

## Rules for a use-case page

- **Same frame as every marketing page:** `Header`, `<main className="pt-20">`, the sections, `CTA` last, `Footer`.
- **Sections:** `ProductHero` (breadcrumb `Who it's for / <name>`, with the first crumb `USE_CASES_NAV.label` linking
  to `/#audiences`), then three `UseCaseSection`s (`tone` `light`, `default`, `light`, so backgrounds alternate into
  the `bg-background` CTA), then `CTA`.
- **Every `UseCaseSection` links to the `/product` pages it describes**, and each page links to at least two of them.
  Only say what those product pages say injily does.
- **The hero visual** is a small static component in the page file, styled only with color tokens, with a
  `visualLabel` that says in words what it shows.
- **Exports its own `metadata`** (`title`, `description`).
- **Static and honest:** no database, cookies or headers; no statistics claims; no app links. Every new icon goes in
  `icon_names` in `src/app/layout.tsx`.
