import { headers } from 'next/headers';
import Header from '../../components/header';
import Footer from '../../components/footer';
import ClientLayout from './ClientLayout';
import ScrollToTop from '../../components/ScrollToTop';
//import BottomMenu from '@/components/MobileBottomNav';
import DomainChangePopup from '@/components/DomainChange';

const languages = ['en', 'it', 'ar'] as const;
type Lang = typeof languages[number];

export default async function LangLayout({
  children,
  params: paramsPromise
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const headersList = headers();
  const { lang } = await paramsPromise;
  const validLang = languages.includes(lang as Lang) ? lang : 'en';

  return (
    <ClientLayout lang={validLang as Lang}>
      <div className="flex min-h-screen flex-col bg-neutral-50">
        {/* Header with subtle shadow and transition */}
        <div className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-sm border-b border-neutral-200 transition-all duration-300">
          <Header />
        </div>
<BottomMenu menuItems={{}} />
        {/* Main content area with padding for bottom nav */}
        <main className="flex-grow w-full pb-[56px]"> {/* Added pb-[56px] for bottom nav height */}
          <div className="transition-all duration-300 ease-in-out">
            {children}
          </div>
        </main>

        {/* Footer with subtle top border */}
        <div className="relative mt-auto">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"></div>
          <div className="bg-white">
            <Footer />
          </div>
        </div>

        {/* Client-side scroll to top button */}
       
        <DomainChangePopup/>
          {/* Domain change popup (if needed) */}
        {/* Global loading indicator (adjusted z-index to avoid conflicts) */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-40 loading-bar"></div> {/* Lowered z-index */}
      </div>
    </ClientLayout>
  );
}