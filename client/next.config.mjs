// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://dantealighieri.ma'
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
            value: '(?!.*(it|fr|ar)).*'
          }
        ]
      }
    ]
  },
  // Enable image optimization for external images
  images: {
    domains: ['backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app']
  },
  // i18n configuration
  i18n: {
    locales: ['en', 'ar', 'it'],
    defaultLocale: 'en',
    localeDetection: false, // Prevent automatic locale detection
  }
}