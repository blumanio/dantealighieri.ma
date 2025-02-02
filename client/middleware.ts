import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const languages = ['en', 'it', 'ar'];
const defaultLanguage = 'en';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/services(.*)',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/_next/(.*)',
  '/api/(.*)',
  '/images/(.*)',
  '/static/(.*)',
]);

export default clerkMiddleware(async (request) => {
  try {
    // Ensure we have a valid request object
    if (!request || !request.nextUrl) {
      return NextResponse.next();
    }

    const pathname = request.nextUrl.pathname;

    // Handle static files and public paths
    if (isPublicRoute(request) || /\.(ico|png|jpg|jpeg|svg|css|js|json)$/.test(pathname)) {
      return NextResponse.next();
    }

    // Handle language redirect
    const pathnameIsMissingLanguage = languages.every(
      lang => !pathname.startsWith(`/${lang}/`) && pathname !== `/${lang}`
    );

    if (pathnameIsMissingLanguage) {
      const newUrl = new URL(
        `/${defaultLanguage}${pathname === '/' ? '' : pathname}`,
        request.url
      );
      newUrl.search = request.nextUrl.search;
      return NextResponse.redirect(newUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify these matchers if you need to add more paths
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};