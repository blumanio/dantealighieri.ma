// next.config.mjs
const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://studentitaly.it' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },

  async redirects() {
    const redirectsList = [];
    if (isProduction) {
      redirectsList.push({
        source: '/:path((?!api/|_next/static/|_next/image/|images/|static/|favicon.ico|sitemap.xml|robots.txt).*)',
        destination: 'https://studentitaly.it/:path*',
        permanent: true,
        // As discussed, ensure NEXT_PUBLIC_API_BASE_URL is your canonical domain in prod
        // to avoid issues if server-side fetches use VERCEL_URL as a base.
      });
    }
    return redirectsList;
  },

  async rewrites() {
    return [
      // API Rewrite to external backend
      {
        source: '/api/:path*',
        destination:
          'https://backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app/:path*',
      },

      // --- i18n Path Handling ---
      // 1. If someone lands on the root path `/`, serve the English version.
      {
        source: '/',
        destination: '/en',
      },
      // 2. For any other path that doesn't start with /api, /_next, static assets, 
      //    OR an existing language prefix (en, it, ar),
      //    try to determine language from accept-language header or default to 'en'.
      {
        source: '/:path((?!api/|_next/static/|_next/image/|favicon.ico|images/|static/|en/|it/|ar/).*)',
        destination: '/it/:path*', // Italian if preferred by browser
        has: [{ type: 'header', key: 'accept-language', value: '^it.*'}],
      },
      {
        source: '/:path((?!api/|_next/static/|_next/image/|favicon.ico|images/|static/|en/|it/|ar/).*)',
        destination: '/ar/:path*', // Arabic if preferred by browser
        has: [{ type: 'header', key: 'accept-language', value: '^ar.*'}],
      },
      {
        // Fallback to English for any other non-prefixed path if not it or ar
        source: '/:path((?!api/|_next/static/|_next/image/|favicon.ico|images/|static/|en/|it/|ar/).*)',
        destination: '/en/:path*', 
      },
    ];
  },

  images: {
    domains: ['backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app'],
  },

  // --- REMOVE OR COMMENT OUT THE i18n BLOCK ---
  // For App Router with [lang] segments, this block is often not needed for routing
  // and can conflict with static generation for such routes.
  // Your `generateStaticParams` in `app/[lang]/layout.js` or `page.js` should define locales.
  /*
  i18n: {
    locales: ['en', 'ar', 'it'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  */
};

export default nextConfig;