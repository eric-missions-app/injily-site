# public/

Static files served as-is from the site root (`public/foo.svg` is `/foo.svg`). Favicon, logo, OG image and product
screenshots live here.

## What's here now

Nothing yet. The hero's app mockup was removed: the site shows no mockups or invented screenshots (see "Content
rules" in `ARCHITECTURE.md`).

## Rules

- Show images with `next/image`, giving the real `width` and `height` so the layout doesn't shift.
- Image files are assets, so their colors are baked in. Components still never hardcode colors.
- Everything here is public. Never put anything private in this folder.
