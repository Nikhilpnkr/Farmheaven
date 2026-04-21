import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('../../packages/i18n/src/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@farmheaven/ui', '@farmheaven/db', '@farmheaven/i18n'],
  experimental: {
    // typedRoutes: true,  // re-enable once stable with monorepo setups
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'jfvoskjsimncjexusquz.supabase.co' },
    ],
  },
};

export default withNextIntl(nextConfig);
