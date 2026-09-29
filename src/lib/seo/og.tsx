import { ImageResponse } from 'next/og';

/**
 * The share card, in one place.
 *
 * File-based `opengraph-image` does NOT cascade to nested segments — a card
 * defined at the app root covers `/` and nothing below it. So every segment
 * needs its own, and the only way that stays consistent is if they all render
 * through here. `npm run seo` fails any route that ends up without one.
 *
 * Satori, which renders this, is not a browser: it supports a subset of CSS,
 * and it rejects any element with more than one child that has no explicit
 * `display`. Compose strings before interpolating them rather than writing
 * `{a} — {b}`, which is three children.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export function ogImage({
  eyebrow,
  headline,
  footer,
}: {
  eyebrow: string;
  headline: string;
  footer: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#070D26',
          color: '#FFFFFF',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 4, color: '#E6BA2D', textTransform: 'uppercase' }}>{eyebrow}</div>
        <div style={{ fontSize: 68, lineHeight: 1.05, letterSpacing: -2.5, maxWidth: 980, fontWeight: 800 }}>
          {headline}
        </div>
        <div style={{ fontSize: 24, color: '#AEB8C7' }}>{footer}</div>
      </div>
    ),
    OG_SIZE,
  );
}
