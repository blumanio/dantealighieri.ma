'use client';

import { useEffect } from 'react';

type Lang = 'en' | 'it' | 'ar';

export default function ClientLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: Lang;
}) {
  useEffect(() => {
    // Update HTML attributes on the client side
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return <>{children}</>;   
}