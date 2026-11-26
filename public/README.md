# public/

Static files served as-is from the site root (`public/foo.svg` is `/foo.svg`). Favicon, logo, OG image and product
screenshots live here.

## What's here now

| File | Used by |
|---|---|
| `hero-illustration.svg` | `src/components/Hero.tsx`: a stylised injily dashboard (converts with their follow-up status, an upcoming meeting, a mentor pairing). It's drawn in the light palette from `globals.css`. |

## Rules

- Show images with `next/image`, giving the real `width` and `height` so the layout doesn't shift.
- Image files are assets, so their colors are baked in. Components still never hardcode colors.
- Everything here is public. Never put anything private in this folder.
