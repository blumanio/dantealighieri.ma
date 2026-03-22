'use client';

/**
 * useAnalytics
 *
 * Drop into any page or component to get:
 *  - Automatic page_view events (with user context)
 *  - Time-on-page measurement  (sent on unmount / visibility change)
 *  - Scroll depth milestones (25 / 50 / 75 / 90 %)
 *  - Typed tracking helpers for goals, discovery, funnels, engagement
 */

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  setUserProperties,
  identifyUser,
  goals,
  discovery,
  funnel,
  engagement,
  gamification,
  trackCustomEvent,
} from '@/app/utils/analytics';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseAnalyticsOptions {
  /** Human-readable name for the current page (e.g. "Program Search") */
  pageName?: string;
  /** Skip the scroll-depth tracker for scroll-less pages */
  skipScrollTracking?: boolean;
  /** Skip the time-on-page tracker */
  skipTimeTracking?: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { pageName, skipScrollTracking = false, skipTimeTracking = false } = options;
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const pageEnteredAt = useRef<number>(Date.now());
  const scrollMilestonesReached = useRef<Set<number>>(new Set());
  const hasSentPageView = useRef(false);

  // ── Identify user + set properties once loaded ──────────────────────────
  useEffect(() => {
    if (!isLoaded || !user) return;

    identifyUser(user.id);

    const tier = (user.publicMetadata?.tier as string) || 'Viaggiatore';
    const xp = (user.publicMetadata?.xp as number) || 0;
    const level = Math.floor(xp / 1000) + 1;

    setUserProperties({
      user_tier: tier as any,
      user_level: level,
      user_xp: xp,
      user_country: (user.publicMetadata?.countryOfOrigin as string) || '',
      language: (user.publicMetadata?.preferredLanguage as string) || 'en',
      onboarding_complete: Boolean(user.publicMetadata?.onboardingComplete),
    });
  }, [isLoaded, user]);

  // ── Page view ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (hasSentPageView.current) return;
    hasSentPageView.current = true;
    pageEnteredAt.current = Date.now();
    scrollMilestonesReached.current = new Set();

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_title: pageName || document.title,
      });
    }
  }, [pathname, pageName]);

  // ── Time on page ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (skipTimeTracking) return;

    const sendTimeOnPage = () => {
      const seconds = Math.round((Date.now() - pageEnteredAt.current) / 1000);
      if (seconds < 2) return; // ignore bounces
      trackCustomEvent('time_on_page', {
        page_path: pathname,
        page_name: pageName || pathname,
        seconds,
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendTimeOnPage();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      sendTimeOnPage();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname, pageName, skipTimeTracking]);

  // ── Scroll depth ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (skipScrollTracking) return;

    const MILESTONES = [25, 50, 75, 90];

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const milestone of MILESTONES) {
        if (pct >= milestone && !scrollMilestonesReached.current.has(milestone)) {
          scrollMilestonesReached.current.add(milestone);
          trackCustomEvent('scroll_depth', {
            page_path: pathname,
            page_name: pageName || pathname,
            depth_percent: milestone,
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, pageName, skipScrollTracking]);

  // ── Exposed tracking helpers ─────────────────────────────────────────────
  return {
    goals,
    discovery,
    funnel,
    engagement,
    gamification,
    /** Fire an arbitrary GA4 event */
    track: trackCustomEvent,
  };
}
