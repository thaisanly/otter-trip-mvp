import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
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
