// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' ? 'https://studentitaly.it' : 'http://localhost:3000',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
    ];
  },

  async redirects() {
    return []; // Keep empty, middleware handles i18n redirects
  },

  async rewrites() {
    return [
      // REMOVED: The rewrite for source: '/' because middleware now redirects to /en (URL changes)
      // {
      //   source: '/',
      //   destination: '/en',
      // },

      // These accept-language based rewrites can serve as a fallback for direct access
      // to non-prefixed paths if, for some reason, middleware didn't catch them or
      // if you want to support content negotiation for users who land on, e.g., /about directly.
      // However, with the robust middleware redirect, these become less critical.

    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app',
      },
    ],
  },
};


export default nextConfig;
