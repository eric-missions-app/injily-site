# src/app/use-cases/

One page per audience, at `/use-cases/<slug>`. The Who it's for dropdown, the Footer's Who it's for column
(`USE_CASES_NAV` in `src/lib/site.ts`) and the homepage's Who it's for cards (`Audiences`, `#audiences`) point here.

## What's here now

| Folder | Page |
|---|---|
| [`churches/`](churches/README.md) | `/use-cases/churches`: pastors and their teams |
| [`evangelists/`](evangelists/README.md) | `/use-cases/evangelists`: evangelists and their teams |
| [`mission-teams/`](mission-teams/README.md) | `/use-cases/mission-teams`: mission and outreach teams |

## Rules for a use-case page

- **Same frame as every marketing page:** `Header`, `<main className="pt-20">`, the sections, `CTA` last, `Footer`.
- **Short:** `ProductHero` (breadcrumb `Who it's for / <name>`, with the first crumb `USE_CASES_NAV.label` linking
  to `/#audiences`, the title and a one-sentence intro for that audience), then `ProductFeatures` ("What we're
  building", at most three points), then `CTA`. Nothing else.
- **Every point has a "More about" link** (`link` on the point) to an existing `/product` page that makes the same
  claim. Link only to pages in `PRODUCT_NAV`.
- **No mockups:** no app screens, cards with avatars, charts, task lists, import boxes or other pictures of the
  product. It isn't built yet.
- **Copy stays within the content rules in `ARCHITECTURE.md`:** the intro says what injily is being built to do
  ("We're building injily to…"), and every point is one of the allowed claims (keep track of each new believer, make
  sure someone is responsible for following up, see who needs attention) in the future tense ("injily will…"). No
  specific features, invented people, churches or numbers.
- **Words:** the people who follow up are "your team" (never "mentor" or "missioner"); headings say "new believer",
  not "convert".
- **Exports its own `metadata`** (`title`, `description`); the description follows the same content rules.
- **Static:** no database, cookies or headers; no app links. Every new icon goes in `icon_names` in
  `src/app/layout.tsx`.
