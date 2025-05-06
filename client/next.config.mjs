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
          { key: 'Access-Control-Allow-Origin', value: 'https://studentitaly.it' }, // Be cautious with '*' in production
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

    // =============== TEMPORARILY COMMENT OUT OR REMOVE THIS SECTION ===============
    /*
    if (isProduction) {
      redirectsList.push({
        source: '/:path((?!api/|_next/static/|_next/image/|images/|static/|favicon.ico|sitemap.xml|robots.txt).*)',
        destination: 'https://studentitaly.it/:path*',
        permanent: true,
      });
    }
    */
    // ==========================================================================

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
      // i18n Path Handling
      {
        source: '/',
        destination: '/en',
      },
      {
        source: '/:path((?!api/|_next/static/|_next/image/|favicon.ico|images/|static/|en/|it/|ar/).*)',
        destination: '/it/:path*',
        has: [{ type: 'header', key: 'accept-language', value: '^it.*'}],
      },
      {
        source: '/:path((?!api/|_next/static/|_next/image/|favicon.ico|images/|static/|en/|it/|ar/).*)',
        destination: '/ar/:path*',
        has: [{ type: 'header', key: 'accept-language', value: '^ar.*'}],
      },
      {
        source: '/:path((?!api/|_next/static/|_next/image/|favicon.ico|images/|static/|en/|it/|ar/).*)',
        destination: '/en/:path*', 
      },
    ];
  },

  images: {
    domains: ['backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app'],
  },

  // If you had the i18n block here and removed it for the build error, keep it removed or ensure it's correct for App Router.
  // For App Router [lang] segments, this block is often not needed for routing.
  /*
  i18n: {
    locales: ['en', 'ar', 'it'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  */
};

export default nextConfig;