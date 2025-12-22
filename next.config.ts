import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // This is to prevent the default Next.js favicon from being used.
    // It finds the rule that handles `favicon.ico` and excludes it.
    if (!isServer) {
      const faviconRule = config.module.rules.find((rule:any) => 
        rule && typeof rule === 'object' && rule.test instanceof RegExp && rule.test.test('favicon.ico')
      );
      if (faviconRule && typeof faviconRule === 'object') {
        faviconRule.exclude = /favicon\.ico/;
      }
    }
    return config;
  }
};

export default nextConfig;
