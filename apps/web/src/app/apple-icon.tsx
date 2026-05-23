import { ImageResponse } from 'next/og';

// Next.js App Router auto-serves this as /apple-icon (180x180 PNG).
// Replaces the prior 404 on /apple-icon.png, /apple-touch-icon.png.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0A714E', // emerald-700 — matches --primary in globals.css
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 120,
        fontWeight: 700,
        fontFamily: 'serif',
      }}
    >
      F
    </div>,
    { ...size },
  );
}
