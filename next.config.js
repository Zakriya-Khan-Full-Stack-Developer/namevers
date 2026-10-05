/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  // Fix 6 — compress responses and drop the framework fingerprint.
  compress: true,
  poweredByHeader: false,
  // Fix 6 — serve modern image formats and cache optimised images for 30 days.
  // (No next/image is used today, so this is inert until one is introduced;
  // it caps image transformations on the Hobby plan when that happens.)
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 828, 1080, 1280],
  },
  // Keep the 216 MB dataset out of the serverless bundle.
  experimental: {
    outputFileTracingExcludes: {
      '/**': ['./public/names/**/*'],
    },
    // Cap build workers. Each worker loads the manifest, so on a many-core
    // machine the default worker count multiplies memory use and can OOM a
    // small container. Vercel's builder is unaffected by this ceiling.
    cpus: Number(process.env.NEXT_BUILD_CPUS) || 2,
  },
  async redirects() {
    return [
      {
        source: '/homepage',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // The old unique-names route was superseded by /unique-baby-names, which
      // matches the target keyword exactly. A permanent redirect consolidates
      // any existing signals onto the new URL instead of leaving two pages
      // competing for the same query.
      {
        source: '/unique-names',
        destination: '/unique-baby-names',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
