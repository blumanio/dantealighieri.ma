// app/[lang]/layout.tsx
import { headers } from 'next/headers';
import Header from '../../components/header';
import Footer from '../../components/footer';
import ClientLayout from './ClientLayout';
import HeroCarousel from '@/components/HeroSection';
import HeroSection from '@/components/HeroSection';

// Define supported languages
const languages = ['en', 'it', 'ar'] as const;
type Lang = typeof languages[number];

export default async function LangLayout({
  children,
  params: paramsPromise
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // Get headers to ensure server-side execution
  const headersList = headers();

  // Await the language parameter
  const { lang } = await paramsPromise;
  const validLang = languages.includes(lang as Lang) ? lang : 'en';

  return (
    <ClientLayout lang={validLang as Lang}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <HeroCarousel/>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ClientLayout>
  );
}