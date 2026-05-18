import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@farmheaven/ui', '@farmheaven/db', '@farmheaven/i18n'],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
};

export default nextConfig;
