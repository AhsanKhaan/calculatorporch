import type { NextConfig } from 'next';

// Static export (docs/04 §2). Headers live in public/_headers, not here: a static export ignores
// next.config headers() and can't use Proxy (security/02 §1).
const config: NextConfig = {
  output: 'export',
  trailingSlash: true, // URLs end with "/" (e.g. /diy/gravel-calculator/)
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // SEC-CODE-18: strip console.* (except console.error) from production bundles.
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
};

export default config;
