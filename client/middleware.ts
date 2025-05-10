// client/middleware.ts
// For Test 2: ClerkMiddleware is completely removed/commented out.
// We are only testing the i18nRouter logic.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define supported languages as a const array for type safety
const LANGUAGES = ['en', 'it', 'ar'] as const;
type SupportedLanguage = typeof LANGUAGES[number];
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Paths that should explicitly NOT have an i18n language prefix.
const UNPREFIXED_PUBLIC_PATHS = [
  '/services',      // Example: if /services is a page you want accessible without /en, /it prefix
  '/favicon.ico',   // Usually excluded by matcher anyway
  '/robots.txt',
  '/sitemap.xml',   // Sitemap path itself can be unprefixed
  // Add any other specific paths that should remain unprefixed
] as const;

// Type-safe route matcher for unprefixed public paths
const isUnprefixedPublicPath = (path: string): boolean => {
  return UNPREFIXED_PUBLIC_PATHS.some(route =>
    path === route || path.startsWith(`${route}/`)
  );
};

// Function to check for common static assets, Next.js internal paths, and API routes
const isAssetOrNextInternalOrApi = (pathname: string): boolean => {
  return /\.(ico|png|jpg|jpeg|svg|css|js|json|txt|webmanifest|xml|mp3|mp4|woff|woff2|ttf|otf)$/i.test(pathname) ||
    pathname.startsWith('/_next/') || // Next.js internals
    pathname.startsWith('/api/');     // Your API routes
};

// Your custom i18n routing logic (this is what we are testing in isolation)
const i18nRouter = (req: NextRequest) => {
  const { pathname, origin, search } = req.nextUrl;
  // eslint-disable-next-line no-console
  console.log(`[i18nRouter ONLY - TEST 2] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
  // eslint-disable-next-line no-console
  console.log(`[i18nRouter ONLY - TEST 2] Request IN: ${origin}${pathname}${search}`);


  // 1. Skip for common assets, Next.js internals, and API routes
  if (isAssetOrNextInternalOrApi(pathname)) {
    // eslint-disable-next-line no-console
    console.log(`[i18nRouter ONLY - TEST 2] Asset, internal, or API path: ${pathname}. Skipping i18n prefixing.`);
    // eslint-disable-next-line no-console
    console.log(`[i18nRouter ONLY - TEST 2] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
    return NextResponse.next();
  }

  // 2. Skip for paths explicitly designated as unprefixed public paths
  if (isUnprefixedPublicPath(pathname)) {
    // eslint-disable-next-line no-console
    console.log(`[i18nRouter ONLY - TEST 2] Unprefixed public path: ${pathname}. Skipping i18n prefixing.`);
    // eslint-disable-next-line no-console
    console.log(`[i18nRouter ONLY - TEST 2] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
    return NextResponse.next();
  }

  // 3. Check if the path already has a supported language prefix
  const pathLanguage = LANGUAGES.find(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathLanguage) {
    // If it has a prefix, ensure it's one of the supported languages
    if (!LANGUAGES.includes(pathLanguage as SupportedLanguage)) {
      const newUrl = req.nextUrl.clone();
      // Fallback to the root of the default language, or adapt path as needed
      newUrl.pathname = `/${DEFAULT_LANGUAGE}${pathname.substring(pathLanguage.length + 1)}`;
      // eslint-disable-next-line no-console
      console.warn(`[i18nRouter ONLY - TEST 2] Path ${pathname} has an unsupported language prefix "${pathLanguage}". Redirecting to ${newUrl.pathname}.`);
      // eslint-disable-next-line no-console
      console.log(`[i18nRouter ONLY - TEST 2] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
      return NextResponse.redirect(newUrl);
    }
    // eslint-disable-next-line no-console
    console.log(`[i18nRouter ONLY - TEST 2] Path already has valid lang prefix: ${pathname}. Proceeding.`);
    // eslint-disable-next-line no-console
    console.log(`[i18nRouter ONLY - TEST 2] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
    return NextResponse.next(); // Path is valid, proceed to Next.js router
  }

  // 4. No language prefix found, and it's not an asset or explicitly unprefixed public path.
  // Prepend the default language. This handles '/' and other paths like '/somepage'.
  const newUrl = req.nextUrl.clone();
  newUrl.pathname = `/${DEFAULT_LANGUAGE}${pathname === '/' ? '' : pathname}`;
  // eslint-disable-next-line no-console
  console.log(`[i18nRouter ONLY - TEST 2] Path needs lang prefix. Original: ${pathname}. Redirecting to: ${newUrl.pathname}`);
  // eslint-disable-next-line no-console
  console.log(`[i18nRouter ONLY - TEST 2] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
  return NextResponse.redirect(newUrl); // Redirect to the URL with the language prefix
};

// For Test 2, we directly export the i18nRouter as the middleware function.
export default function middleware(req: NextRequest) {
  return i18nRouter(req);
}

// The matcher configuration remains the same.
export const config = {
  matcher: [
    /*
     * Match all request paths except for _next/static (static files),
     * _next/image (image optimization files), api (API routes),
     * and static assets directly in /public (e.g., favicon.ico, images, etc.)
     * This ensures the middleware runs for actual pages and the root.
     */
    '/((?!api|_next/static|_next/image|images/|static/|assets/|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)',
  ],
};