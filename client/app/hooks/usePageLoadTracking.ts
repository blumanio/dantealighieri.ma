'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const usePageLoadTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTrackedInitialLoad = useRef(false);

  useEffect(() => {
    // Only track client-side navigation changes after initial load
    if (!hasTrackedInitialLoad.current) {
      hasTrackedInitialLoad.current = true;
      
      // Use Performance Navigation Timing API for more accurate measurements
      const trackTiming = () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const loadTime = Math.round(navigation.loadEventEnd - navigation.startTime);
          
          // Send the event to Google Analytics
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'page_load_time', {
              page_path: pathname,
              load_time: loadTime,
              navigation_type: navigation.type,
            });
          }
        }
      };

      // Use requestIdleCallback to avoid blocking the main thread
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => trackTiming());
      } else {
        setTimeout(trackTiming, 0);
      }
    }
  }, [pathname, searchParams]);
};