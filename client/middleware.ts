// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const LANGUAGES = ['en', 'fr', 'ar'] as const;
type SupportedLanguage = typeof LANGUAGES[number];
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

const UNPREFIXED_PUBLIC_PATHS = ['/services'] as const;

const isUnprefixedPublicPath = (path: string): boolean =>
  UNPREFIXED_PUBLIC_PATHS.some((route) => path === route || path.startsWith(`${route}/`));

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/forum(.*)',
  '/onboarding(.*)',
]);

const isPublicRoute = createRouteMatcher([]);

const isPathToSkipForI18nPrefixing = (pathname: string): boolean =>
  pathname.startsWith('/api/') ||
  pathname.startsWith('/_next/') ||
  /\.(ico|png|jpg|jpeg|svg|css|js|json|txt|webmanifest|xml|mp3|mp4|woff|woff2|ttf|otf)$/i.test(pathname);

const i18nLogicHandler = (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  if (isPathToSkipForI18nPrefixing(pathname)) {
    return NextResponse.next();
  }

  if (isUnprefixedPublicPath(pathname)) {
    return NextResponse.next();
  }

  const pathLanguage = LANGUAGES.find(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathLanguage) {
    return NextResponse.next();
  }

  const newUrl = req.nextUrl.clone();
  newUrl.pathname = `/${DEFAULT_LANGUAGE}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(newUrl);
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL(`/${DEFAULT_LANGUAGE}/sign-in`, req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (isPublicRoute(req)) return;

  return i18nLogicHandler(req);
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
