import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Telugu } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const telugu = Noto_Sans_Telugu({ subsets: ['telugu'], variable: '--font-telugu', display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3B7A3F',
};

export const metadata: Metadata = {
  title: 'FarmHeaven Worker',
  description: 'Task list, voice notes, attendance',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'FH Worker',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="te" className={`${inter.variable} ${telugu.variable}`}>
      <body className="min-h-screen bg-background font-sans">{children}</body>
    </html>
  );
}
