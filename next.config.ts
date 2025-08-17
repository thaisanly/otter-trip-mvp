import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: process.env.DRY_RUN === 'true' ? '.next-dry-run' : '.next',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    // Enable ESLint checks during build
    ignoreDuringBuilds: false,
    // Only check specific directories to avoid legacy code issues
    dirs: ['src/app', 'src/components', 'src/lib', 'src/api'],
  },
  typescript: {
    // Enable TypeScript checks during build
    ignoreBuildErrors: false,
  },
  experimental: {
    // Enable strict mode for better security and performance
    strictNextHead: true,
    optimizePackageImports: ['lucide-react', '@prisma/client'],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
