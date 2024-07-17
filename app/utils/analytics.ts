export const trackCustomEvent = (eventName: string, eventParams: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventParams);
    } else {
      console.warn('Google Analytics not initialized');
    }
  };