import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define supported languages as a const array for type safety
const LANGUAGES = ['en', 'it', 'ar'] as const;
type SupportedLanguage = typeof LANGUAGES[number];
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Define public routes as a const array for type safety
const PUBLIC_ROUTES = [
  '/',
  '/sign-in',
  '/sign-up',
  '/services',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/_next',
  '/api',
  '/images',
  '/static',
] as const;

// Type-safe route matcher
const isPublicPath = (path: string): boolean => {
  return PUBLIC_ROUTES.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
};

// Type-safe static file checker
const isStaticFile = (pathname: string): boolean => {
  const staticExtensions = [
    'ico', 'png', 'jpg', 'jpeg', 'svg', 
    'css', 'js', 'json'
  ] as const;
  
  const pattern = new RegExp(`\\.(${staticExtensions.join('|')})$`);
  return pattern.test(pathname);
};

const middleware = (auth: any, req: NextRequest) => {
  try {
    if (!req?.nextUrl) {  
      return NextResponse.next();
    }

    const hostname = req.headers.get('host');
    const { pathname, search } = req.nextUrl;
    
    // Handle domain redirect from dantealighieri.ma to studentitaly.it
    if (hostname === 'dantealighieri.ma' || hostname === 'www.dantealighieri.ma') {
      // Create the new URL with the same path and search params
      const newUrl = new URL(`https://studentitaly.it${pathname}${search}`);
      return NextResponse.redirect(newUrl, { status: 308 }); // 308 = Permanent Redirect
    }
    
    // Handle www to non-www redirect for canonical URLs
    if (hostname === 'www.studentitaly.it') {
      const newUrl = new URL(`https://studentitaly.it${pathname}${search}`);
      return NextResponse.redirect(newUrl, { status: 308 });
    }

    // Handle public routes and static files
    if (isPublicPath(pathname) || isStaticFile(pathname)) {
      return NextResponse.next();
    }

    // Check if path starts with a supported language
    const hasLanguagePrefix = LANGUAGES.some(lang => 
      pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
    );

    // Redirect to add language prefix if missing
    if (!hasLanguagePrefix) {
      const url = new URL(req.url);
      const newPath = pathname === '/' 
        ? `/${DEFAULT_LANGUAGE}` 
        : `/${DEFAULT_LANGUAGE}${pathname}`;
      
      url.pathname = newPath;
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.next();
  }
};

export default clerkMiddleware(middleware);

// Next.js middleware config
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};