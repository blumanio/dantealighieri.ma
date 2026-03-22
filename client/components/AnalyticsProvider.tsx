'use client';

/**
 * AnalyticsProvider
 *
 * Mounts inside the authenticated layout. On every page navigation:
 *  - Sends a page_view to GA4 with page_path + page_title
 *  - Sets GA4 user properties (tier, level, XP, country, language)
 *  - Tracks initial page load performance timing
 *
 * This component is intentionally invisible — no UI output.
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { setUserProperties, identifyUser } from '@/app/utils/analytics';

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const prevPathname = useRef<string>('');
  const userIdentified = useRef(false);

  // ── Identify user once per session ────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || !user || userIdentified.current) return;
    userIdentified.current = true;

    identifyUser(user.id);

    const xp = (user.publicMetadata?.xp as number) || 0;
    setUserProperties({
      user_tier: (user.publicMetadata?.tier as any) || 'Viaggiatore',
      user_level: Math.floor(xp / 1000) + 1,
      user_xp: xp,
      user_country: (user.publicMetadata?.countryOfOrigin as string) || '',
      language: (user.publicMetadata?.preferredLanguage as string) || 'en',
      onboarding_complete: Boolean(user.publicMetadata?.onboardingComplete),
    });
  }, [isLoaded, user]);

  // ── Page view on every route change ───────────────────────────────────────
  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname]);

  // ── Initial page load performance ─────────────────────────────────────────
  useEffect(() => {
    const trackTiming = () => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (!nav || typeof window.gtag !== 'function') return;

      const loadTime = Math.round(nav.loadEventEnd - nav.startTime);
      if (loadTime <= 0) return;

      window.gtag('event', 'page_load_time', {
        page_path: pathname,
        load_time: loadTime,
        navigation_type: nav.type,
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(trackTiming);
    } else {
      setTimeout(trackTiming, 0);
    }
    // only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
