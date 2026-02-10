import { LanguageProvider } from '@/context/LanguageContext';
import { getValidLanguage } from '@/app/config/i18n';
import { supportedLanguages, defaultLang } from '@/constants/constants';
import Header from '@/components/header';
import Footer from '@/components/footer';

// Imports required for the toast notification system
import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import RightSidebar from '@/components/RightSidebar';
import { Locale } from '../i18n/types';
import UrgencyBar from '@/components/UrgencyBar';

export default async function LangSpecificLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const langParam = (await params).lang;
  const validatedLang = getValidLanguage(langParam);

  console.log(`[LangLayout_LOG] Validated lang param: "${langParam}" -> "${validatedLang}"`);

  return (
    // The LanguageProvider remains as your top-level context provider
    <LanguageProvider initialLang={validatedLang as Locale}>
      {/* The ToastProvider must wrap all the components that will use toasts */}
      <ToastProvider>
        <Header />
        <UrgencyBar />

        {/* <UpgradeBanner /> */}

        {/* The RightSidebar is likely positioned independently (e.g., fixed or absolute)
                and does not need to be in a flex container with the main content. */}
        {/* <RightSidebar /> */}
        {/* The page content is rendered here */}
        <main className='lg:ml-12'>{children}</main>

        <Footer />

        {/* The Toaster component is responsible for rendering the actual toasts */}
        <Toaster />
      </ToastProvider>
    </LanguageProvider>
  );
}
