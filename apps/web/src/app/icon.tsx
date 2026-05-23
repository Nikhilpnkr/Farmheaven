import { ImageResponse } from 'next/og';

// Next.js App Router auto-serves this as /icon (32x32 PNG).
// Replaces the prior 404 on /favicon.ico, /icon.png.
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
        fontSize: 22,
        fontWeight: 700,
        fontFamily: 'serif',
        borderRadius: 6,
      }}
    >
      F
    </div>,
    { ...size },
  );
}
