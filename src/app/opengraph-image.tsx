import { ImageResponse } from 'next/og';
import { HERO_SUBHEAD } from '@/content/hero';
import { SITE_NAME } from '@/lib/site';

// The social card (og:image and twitter:image) for every page: rendered once to a static PNG at build time.
export const alt = `${SITE_NAME} — Never lose a new believer`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// An image, not a component: CSS variables don't reach the renderer, so the palette from globals.css (:root) is
// baked in, the same way public/ assets bake theirs in. primary-darker, primary, on-primary-darker, and a light
// primary tint for the subhead.
const colors = {
  background: 'rgb(49, 46, 129)',
  mark: 'rgb(79, 70, 229)',
  text: 'rgb(255, 255, 255)',
  muted: 'rgb(199, 210, 254)',
};

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: colors.background,
          color: colors.text,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 56, fontWeight: 700 }}>
          <div
            style={{
              width: 64,
              height: 64,
              marginRight: 24,
              borderRadius: 16,
              background: colors.mark,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 44,
            }}
          >
            i
          </div>
          {SITE_NAME}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>
            Never lose a new believer.
          </div>
          <div style={{ marginTop: 32, maxWidth: 1000, fontSize: 34, lineHeight: 1.4, color: colors.muted }}>
            {HERO_SUBHEAD}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
