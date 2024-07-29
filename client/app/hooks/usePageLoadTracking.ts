'use client'
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const usePageLoadTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleLoadEvent = () => {
        const navigationStart = performance.timing.navigationStart;
        const loadTime = Date.now() - navigationStart;

        // Send the event to Google Analytics
        window.gtag('event', 'page_load_time', {
          page_path: pathname,
          load_time: loadTime,
        });
      };

      window.addEventListener('load', handleLoadEvent);

      return () => {
        window.removeEventListener('load', handleLoadEvent);
      };
    }
  }, [pathname, searchParams]);
};