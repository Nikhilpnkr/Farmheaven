import { ImageResponse } from 'next/og';

// Next.js App Router auto-uses this for og:image and twitter:image
// on every page (the metadata in layout.tsx declares the og card type
// as summary_large_image, which expects 1200x630).
// Replaces the prior 404 on /og-image.png, /opengraph-image.png.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'FarmHeaven — Real organic food, Hyderabad';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0A714E 0%, #064E3B 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        color: 'white',
        fontFamily: 'serif',
      }}
    >
      {/* Brand mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            background: 'rgba(255,255,255,0.12)',
            border: '2px solid rgba(255,255,255,0.4)',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 44,
            fontWeight: 700,
          }}
        >
          F
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>FarmHeaven</div>
      </div>

      {/* Headline + sub */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -1,
            maxWidth: 1000,
          }}
        >
          Real food from a real farm.
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'sans-serif',
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          72 acres outside Hyderabad. Certified organic, PGS-India. Cold-chained to your door.
        </div>
      </div>
    </div>,
    { ...size },
  );
}
