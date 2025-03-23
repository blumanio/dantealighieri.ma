// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // SEO-optimized redirects from old domain to new domain
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://studentitaly.it/:path*',
        permanent: true, // 308 status code (best for SEO)
        has: [
          {
            type: 'host',
            value: 'dantealighieri.ma',
          },
        ],
      },
      // Redirect www to non-www for canonical URLs (better for SEO)
      {
        source: '/:path*',
        destination: 'https://studentitaly.it/:path*',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'www.studentitaly.it',
          },
        ],
      },
    ]
  },
  async headers() {
    return [
      {
        // Add security and SEO-related headers to all routes
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://studentitaly.it'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      // API rewrites
      {
        source: '/api/:path*',
        destination:
          'https://backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app/:path*'
      },
      // Handle root path
      {
        source: '/',
        destination: '/en'
      },
      // Handle paths without language prefix
      {
        source: '/:path*',
        destination: '/en/:path*',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '(?!.*(it|ar)).*'
          }
        ]
      }
    ]
  },
  // Enable image optimization for external images
  images: {
    domains: ['backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app'],
    // Add image optimization options for SEO
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // i18n configuration
  i18n: {
    locales: ['en', 'ar', 'it'],
    defaultLocale: 'en',
    localeDetection: false, // Prevent automatic locale detection
  },
  // Improve build performance and SEO
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable gzip compression for better performance
}

module.exports = nextConfig;