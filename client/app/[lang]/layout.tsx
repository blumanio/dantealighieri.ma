import { LanguageProvider } from '@/context/LanguageContext';
import { getValidLanguage } from '@/app/config/i18n';
import { supportedLanguages, defaultLang } from '@/constants/constants'; // ✅ NEW
import Header from '@/components/header';
import Footer from '@/components/footer';
import UpgradeBanner from '@/components/Toast';

export default async function LangSpecificLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const langParam = (await params).lang;
  const validatedLang = getValidLanguage(langParam); // assumes this uses supportedLanguages internally

  console.log(`[LangLayout_LOG] Validated lang param: "${langParam}" -> "${validatedLang}"`);

  return (
    <LanguageProvider initialLang={validatedLang}>
      <Header />
            <UpgradeBanner />

      {children}
      <Footer />
    </LanguageProvider>
  );
}
