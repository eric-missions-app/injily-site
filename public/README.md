# public/

Static files served as-is from the site root (`public/foo.svg` is `/foo.svg`). Favicon, logo, OG image and product
screenshots live here.

## What's here now

| File | Used by |
|---|---|
| `favicon.svg` | The site icon (an "i" on the primary color), set in `metadata.icons` in `src/app/layout.tsx`. |

The social card isn't here: it's rendered at build time from `src/app/opengraph-image.tsx`.

The hero's app mockup was removed: the site shows no mockups or invented screenshots (see "Content rules" in
`ARCHITECTURE.md`).

## Rules

- Show images with `next/image`, giving the real `width` and `height` so the layout doesn't shift.
- Image files are assets, so their colors are baked in. Components still never hardcode colors.
- Everything here is public. Never put anything private in this folder.
