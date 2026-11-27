import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { HERO_SUBHEAD } from '@/content/hero';
import { SITE_NAME } from '@/lib/site';

// The social card (og:image and twitter:image) for every page: rendered once to a static PNG at build time.
export const alt = `${SITE_NAME} — Never lose a new believer`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// CSS variables don't reach the image renderer, so the tokens are read out of globals.css (:root, the light palette)
// at build time. No color value is written here.
async function loadPalette() {
  const css = await readFile(join(process.cwd(), 'src/app/globals.css'), 'utf8');
  const root = css.match(/:root\s*\{([^}]*)\}/)?.[1] ?? '';

  return (token: string, opacity = 1) => {
    const channels = root.match(new RegExp(`--color-${token}:\\s*(\\d+) (\\d+) (\\d+);`));
    if (!channels) throw new Error(`globals.css :root has no --color-${token}`);
    return `rgba(${channels.slice(1).join(', ')}, ${opacity})`;
  };
}

export default async function OpengraphImage() {
  const color = await loadPalette();

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
          background: color('primary-darker'),
          color: color('on-primary-darker'),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 56, fontWeight: 700 }}>
          <div
            style={{
              width: 64,
              height: 64,
              marginRight: 24,
              borderRadius: 16,
              background: color('primary'),
              color: color('on-primary'),
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
          <div
            style={{
              marginTop: 32,
              maxWidth: 1000,
              fontSize: 34,
              lineHeight: 1.4,
              color: color('on-primary-darker', 0.8),
            }}
          >
            {HERO_SUBHEAD}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
