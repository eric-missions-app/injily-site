# src/app/product/

One page per product feature, at `/product/<slug>`. The Product dropdown, the Footer's Product column
(`PRODUCT_NAV` in `src/lib/site.ts`) and the use-case pages' "More about" links point here.

## What's here now

| Folder | Page |
|---|---|
| [`convert-tracking/`](convert-tracking/README.md) | `/product/convert-tracking` |
| [`follow-up/`](follow-up/README.md) | `/product/follow-up` |
| [`mentoring/`](mentoring/README.md) | `/product/mentoring` |
| [`missions/`](missions/README.md) | `/product/missions` |
| [`insights/`](insights/README.md) | `/product/insights` |

## Rules for a product page

- **Same frame as every marketing page:** `Header`, `<main className="pt-20">`, the sections, `CTA` last, `Footer`.
- **Short:** `ProductHero` (breadcrumb `Product / <name>` with "Product" linking to `/#features`, the title and a
  one-sentence intro), then `ProductFeatures` ("What we're building", at most three points), then `CTA`. Nothing
  else.
- **No mockups:** no app screens, cards with avatars, charts, task lists, import boxes or other pictures of the
  product. It isn't built yet.
- **Copy stays within the content rules in `ARCHITECTURE.md`:** the intro says what injily is being built to do
  ("We're building injily to…"), and every point is one of the allowed claims (keep track of each new believer, make
  sure someone is responsible for following up, see who needs attention) in the future tense ("injily will…"). No
  specific features, invented people, churches or numbers.
- **Words:** the people who follow up are "your team" (never "mentor" or "missioner"); headings say "new believer",
  not "convert". The page names in the nav and breadcrumb stay as they are.
- **Exports its own `metadata`** (`title`, `description`); the description follows the same content rules.
- **Static:** no database, cookies or headers; no app links (Log in, Sign up, Dashboard). Every new icon goes in
  `icon_names` in `src/app/layout.tsx`.
