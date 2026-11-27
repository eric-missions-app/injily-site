# src/app/product/convert-tracking/

The Convert tracking product page, at `/product/convert-tracking`. Follows the rules in
[../README.md](../README.md).

| File | What it does |
|---|---|
| `page.tsx` | `metadata`, then `ProductHero` ("Product / Convert tracking", with `ConvertVisual`: one convert's card with the pipeline, a status change and a note, and a needs attention list), `ProductFeatures` with four points (registering converts right after an event or service with name, contact, preferred meeting time, location and notes; the New believer → Growing → Mature pipeline; notes and status history per convert; the needs attention list: disengaged, or still pending after 14 days), and `CTA`. |

Keep the stage names in step with `HowItWorks.tsx` on the homepage.
