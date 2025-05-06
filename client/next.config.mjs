/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: { // appDir is true by default in recent Next.js versions, can be removed.
  //   appDir: true,
  // },

  // Handles Cross-Origin Resource Sharing (CORS) headers for your API routes (proxied or local)
  // This is important if your frontend (studentitaly.it) is considered a different origin
  // from where the API responses are ultimately served, or for direct browser calls to the proxy.
  async headers() {
    return [
      {
        source: '/api/:path*', // Matches all API routes
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            // This should be your frontend's domain.
            // If you use subdomains for previews (e.g., *.studentitaly.it) or need localhost,
            // you might need a more dynamic value or multiple entries,
            // or handle this in your actual backend service if the rewrite points there.
            // For requests proxied by Next.js, this header is applied by Next.js.
            value: 'https://studentitaly.it', // Or '*' for development if issues persist, but be specific for production.
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },

  // Handles redirects for the application
  async redirects() {
    const redirectsList = [];

    // IMPORTANT: Canonical Domain Redirect (Production Only)
    // This redirect aims to enforce `https://studentitaly.it` as the canonical domain.
    // However, a broad redirect like this can interfere with Vercel preview URLs
    // and testing if not carefully managed.
    // It's often better to handle canonical domain redirection at the Vercel project
    // settings level (Domain > Redirects) or using Middleware for more complex logic
    // based on the HOST header.
    if (process.env.NODE_ENV === 'production') {
      redirectsList.push({
        // This source attempts to match any path that isn't an internal Next.js asset or API call.
        // The goal is to redirect users from other domains (e.g., the default *.vercel.app prod URL)
        // to your canonical domain.
        // CAUTION: Test this thoroughly. If API_BASE_URL for server-side fetches resolves
        // to a non-canonical domain (like the Vercel deployment URL) in production,
        // this redirect could intercept those server-side API calls to itself before the rewrite to the backend happens.
        // To avoid this, ensure NEXT_PUBLIC_API_BASE_URL in your production environment variables
        // is explicitly set to 'https://studentitaly.it'.
        source: '/:path((?!api/|_next/static/|_next/image/|images/|static/|favicon.ico|sitemap.xml|robots.txt).*)',
        destination: 'https://studentitaly.it/:path*',
        permanent: true,
      });
    }

    return redirectsList;
  },

  // Handles rewriting paths, acting as a proxy or for cleaner URLs
  async rewrites() {
    return [
      // API Rewrite: Proxies all /api/* calls to your external backend.
      // This means API logic is NOT handled by `app/api/*` routes in THIS Next.js project.
      // It must be implemented in the backend service specified below.
      {
        source: '/api/:path*',
        destination:
          'https://backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app/:path*',
      },

      // i18n Rewrites for default locale and language detection fallback
      {
        source: '/',
        destination: '/en', // Default to English for the root path
      },
      {
        source: '/:path((?!api/|_next/static/|_next/image/|favicon.ico|images/|static/).*)', // Exclude assets and API
        destination: '/en/:path*', // Fallback to English for paths without a locale prefix
        has: [ // Condition: only if 'accept-language' header does not primarily prefer 'it' or 'ar'
          {
            type: 'header',
            key: 'accept-language',
            value: '^(?!it|ar).*', // Regex: does not start with 'it' or 'ar'
          },
        ],
      },
      // You might need specific rewrites for 'it' and 'ar' if you want to support
      // language detection based on headers for non-prefixed paths.
      // Example for Italian:
      // {
      //   source: '/:path((?!api/|_next/static/|_next/image/|favicon.ico|images/|static/).*)',
      //   destination: '/it/:path*',
      //   has: [{ type: 'header', key: 'accept-language', value: '^it.*'}],
      // },
      // Example for Arabic:
      // {
      //   source: '/:path((?!api/|_next/static/|_next/image/|favicon.ico|images/|static/).*)',
      //   destination: '/ar/:path*',
      //   has: [{ type: 'header', key: 'accept-language', value: '^ar.*'}],
      // },
    ];
  },

  // Configuration for next/image optimization
  images: {
    // Allow optimizing images from your external backend domain
    domains: ['backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app'],
  },

  // Internationalization (i18n) configuration
  i18n: {
    locales: ['en', 'ar', 'it'],
    defaultLocale: 'en',
    localeDetection: false, // Set to false to rely on path prefixing (e.g., /en/blog, /it/blog)
    // If true, Next.js would try to detect from browser headers and redirect.
    // Your rewrites handle some aspects of this, but path prefixing is more explicit.
  },
};

export default nextConfig; // ES Module export