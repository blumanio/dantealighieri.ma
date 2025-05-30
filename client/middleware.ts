// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware, ClerkMiddlewareAuthObject } from '@clerk/nextjs/server';

// --- START OF YOUR i18n CONFIGURATION AND HELPER FUNCTIONS ---
const LANGUAGES = ['en', 'fr','it', 'ar'] as const;
type SupportedLanguage = typeof LANGUAGES[number];
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Paths that should explicitly NOT have an i18n language prefix.
const UNPREFIXED_PUBLIC_PATHS = [
  '/services',
  // Note: /favicon.ico and similar are usually excluded by the main matcher or Clerk's ignoredRoutes.
  // If they are caught by the matcher and not by Clerk's ignoredRoutes, you might list them here.
] as const;

const isUnprefixedPublicPath = (path: string): boolean => {
  return UNPREFIXED_PUBLIC_PATHS.some(route =>
    path === route || path.startsWith(`${route}/`)
  );
};

// This function checks paths that your i18n logic should specifically skip.
// API routes are skipped here because i18n prefixing is not needed for them.
// Clerk middleware will still run for API routes due to the updated matcher.
const isPathToSkipForI18nPrefixing = (pathname: string): boolean => {
  return (
    pathname.startsWith('/api/') || // Skip API routes for i18n prefixing
    pathname.startsWith('/_next/') || // Skip Next.js internal paths
    /\.(ico|png|jpg|jpeg|svg|css|js|json|txt|webmanifest|xml|mp3|mp4|woff|woff2|ttf|otf)$/i.test(pathname) // Skip common static assets
  );
};

// Your custom i18n routing logic, to be called from within clerkMiddleware
const i18nLogicHandler = (req: NextRequest) => {
  const { pathname, origin, search } = req.nextUrl;
  // eslint-disable-next-line no-console
  console.log(`[i18nLogicHandler] Path: ${pathname}`);

  // 1. Skip i18n prefixing for API routes, Next.js internals, and common assets
  if (isPathToSkipForI18nPrefixing(pathname)) {
    // eslint-disable-next-line no-console
    console.log(`[i18nLogicHandler] Path ${pathname} is an API route, internal, or asset. Skipping i18n prefixing.`);
    return NextResponse.next(); // Allow request to proceed without i18n modification
  }

  // 2. Skip for paths explicitly designated as unprefixed public paths
  if (isUnprefixedPublicPath(pathname)) {
    // eslint-disable-next-line no-console
    console.log(`[i18nLogicHandler] Unprefixed public path: ${pathname}. Skipping i18n prefixing.`);
    return NextResponse.next();
  }

  // 3. Check if the path already has a supported language prefix
  const pathLanguage = LANGUAGES.find(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathLanguage) {
    // This part handles if the prefix is not one of the supported languages.
    // Your original code had a check: `if (!LANGUAGES.includes(pathLanguage as SupportedLanguage))`
    // However, `LANGUAGES.find` already ensures `pathLanguage` is from `LANGUAGES`.
    // So, if `pathLanguage` is found, it's inherently a supported language.
    // If you meant to catch /xx/ where xx is not in LANGUAGES, the find would return undefined.
    // Assuming pathLanguage if found is valid:
    // eslint-disable-next-line no-console
    console.log(`[i18nLogicHandler] Path already has valid lang prefix: ${pathname}. Proceeding.`);
    return NextResponse.next(); // Path is valid, proceed
  }

  // 4. No language prefix found, and it's not an explicitly skipped or unprefixed path.
  // Prepend the default language.
  const newUrl = req.nextUrl.clone();
  newUrl.pathname = `/${DEFAULT_LANGUAGE}${pathname === '/' ? '' : pathname}`;
  // eslint-disable-next-line no-console
  console.log(`[i18nLogicHandler] Path needs lang prefix. Original: ${pathname}. Redirecting to: ${newUrl.pathname}`);
  return NextResponse.redirect(newUrl);
};
// --- END OF YOUR i18n LOGIC ---

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // eslint-disable-next-line no-console
  console.log(`[Clerk Middleware] Path: ${pathname}. User ID: ${userId || 'Not signed in'}.`);

  // Clerk authentication context is now established.
  // getAuth() will work in your API routes and server components.

  // You can implement route protection here if needed, for example:
  // if (pathname.startsWith('/dashboard') && !userId) {
  //   const signInUrl = new URL('/sign-in', req.url);
  //   return NextResponse.redirect(signInUrl);
  // }

  // Now, call your i18n logic.
  // If i18nLogicHandler returns a response (e.g., a redirect), that response will be used.
  // If it returns NextResponse.next(), the request proceeds to the route handler.
  return i18nLogicHandler(req);
}, {
  // debug: process.env.NODE_ENV === 'development', // Enable Clerk debug logs in development
  // Define public routes for Clerk. These routes will be accessible without authentication.
  // Paths should generally be the final paths (e.g., including locale if i18n runs first and redirects).
  // However, since i18n runs *after* Clerk's initial context setup here,
  // publicRoutes would apply to the path as Clerk first sees it.
  // Example:
  // publicRoutes: [
  //   "/", // Unprefixed root
  //   "/services", // Unprefixed public path
  //   "/en", "/it", "/ar", // Language roots
  //   "/en/contact", "/it/contact", "/ar/contact", // Example public pages with locales
  //   "/api/public-endpoint" // Example public API
  // ],
  // If a route is not listed in publicRoutes, auth().protect() would typically be used
  // or you would check auth().userId in the page/route handler.
  // For your /api/favorites, since it's not in publicRoutes (by default),
  // getAuth() in the API route can check for userId and deny access if not present.
});

// CRITICAL FIX: Update the matcher to include API routes and general pages,
// while excluding common static files and Next.js internals.
export const config = {
  matcher: [
    // Match all routes except Next.js internals, static files, and files with extensions (e.g., .ico, .png)
    "/((?!.*\\..*|_next).*)",
    // Explicitly re-include the root
    "/",
    // Explicitly re-include API and tRPC routes
    "/(api|trpc)(.*)",
  ],
};