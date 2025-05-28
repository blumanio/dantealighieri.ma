// app/[lang]/pricing/page.tsx
'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext'; // Adjust path as needed
import { CheckCircle, XCircle, Aperture, ScrollText, Brain, ShoppingCart, Info } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/header'; // Adjust path as needed
import Footer from '@/components/footer'; // Adjust path as needed
import { motion } from 'framer-motion';

interface TierFeature {
  nameKey: string;
  michelangelo: boolean;
  dante: boolean;
  daVinci: boolean;
  descriptionKey?: string; // Optional detailed description for the table
}

const TIERS_DATA = [
  {
    id: 'michelangelo',
    nameKey: 'tier_michelangelo',
    inspirationKey: 'michelangeloInspiration',
    priceKey: 'tierPriceFree',
    priceDetailsKey: 'michelangeloPriceDetails',
    icon: Aperture,
    badgeShape: 'rounded-full',
    tierColors: {
      bgCard: 'bg-white', // Light stone grey effect achieved with white and subtle texture
      bgIcon: 'bg-stone-grey-light text-stone-grey-dark',
      border: 'border-stone-grey',
      buttonBg: 'bg-stone-grey hover:bg-stone-grey-dark',
      buttonText: 'text-white',
      accentText: 'text-stone-grey-dark'
    },
    hoverTooltipKey: 'michelangeloHoverTooltip',
    descriptionKey: 'michelangeloDescription',
    bgColorMotif: 'bg-marble-texture-light', // Custom class for subtle marble
    ctaKey: 'michelangeloCTAText',
    ctaLinkKey: 'michelangeloCTALink',
    highlightKey: 'michelangeloHighlight'
  },
  {
    id: 'dante',
    nameKey: 'tier_dante',
    inspirationKey: 'danteInspiration',
    price: '$19',
    priceDetailsKey: 'dantePriceDetails',
    icon: ScrollText,
    badgeShape: 'rounded-md',
    tierColors: {
      bgCard: 'bg-white',
      bgIcon: 'bg-deep-blue text-white',
      border: 'border-deep-blue',
      buttonBg: 'bg-deep-blue hover:bg-deep-blue-dark',
      buttonText: 'text-white',
      accentText: 'text-deep-blue'
    },
    hoverTooltipKey: 'danteHoverTooltip',
    descriptionKey: 'danteDescription',
    bgColorMotif: 'bg-parchment-texture-light', // Custom class
    ctaKey: 'danteCTAText',
    ctaLinkKey: 'danteCTALink',
    highlightKey: 'danteHighlight' // e.g., "Most Popular"
  },
  {
    id: 'davinci',
    nameKey: 'tier_davinci',
    inspirationKey: 'davinciInspiration',
    price: '$50',
    priceDetailsKey: 'davinciPriceDetails',
    icon: Brain,
    badgeShape: 'rounded-lg',
    tierColors: {
      bgCard: 'bg-white',
      bgIcon: 'bg-rich-gold text-neutral-800',
      border: 'border-rich-gold',
      buttonBg: 'bg-rich-gold hover:bg-rich-gold-dark',
      buttonText: 'text-neutral-800',
      accentText: 'text-rich-gold-dark'
    },
    hoverTooltipKey: 'davinciHoverTooltip',
    descriptionKey: 'davinciDescription',
    bgColorMotif: 'bg-blueprint-texture-light', // Custom class
    ctaKey: 'davinciCTAText',
    ctaLinkKey: 'davinciCTALink',
    highlightKey: 'davinciHighlight'
  }
];

const FEATURES_ADDONS: TierFeature[] = [
  { nameKey: 'feature_program_search', michelangelo: true, dante: true, daVinci: true, descriptionKey: 'feature_program_search_desc' },
  { nameKey: 'feature_basic_guides', michelangelo: true, dante: true, daVinci: true, descriptionKey: 'feature_basic_guides_desc' },
  { nameKey: 'feature_community_access', michelangelo: true, dante: true, daVinci: true, descriptionKey: 'feature_community_access_desc' },
  { nameKey: 'feature_application_tools', michelangelo: false, dante: true, daVinci: true, descriptionKey: 'feature_application_tools_desc' },
  { nameKey: 'feature_webinars_workshops', michelangelo: false, dante: true, daVinci: true, descriptionKey: 'feature_webinars_workshops_desc' },
  { nameKey: 'feature_cultural_guides', michelangelo: false, dante: true, daVinci: true, descriptionKey: 'feature_cultural_guides_desc' },
  { nameKey: 'feature_language_minicourse', michelangelo: false, dante: true, daVinci: true, descriptionKey: 'feature_language_minicourse_desc' },
  { nameKey: 'feature_personalized_roadmap', michelangelo: false, dante: false, daVinci: true, descriptionKey: 'feature_personalized_roadmap_desc' },
  { nameKey: 'feature_document_checklist', michelangelo: false, dante: false, daVinci: true, descriptionKey: 'feature_document_checklist_desc' },
  { nameKey: 'feature_mentorship_access', michelangelo: false, dante: false, daVinci: true, descriptionKey: 'feature_mentorship_access_desc' },
  { nameKey: 'feature_career_services', michelangelo: false, dante: false, daVinci: true, descriptionKey: 'feature_career_services_desc' },
  { nameKey: 'feature_priority_support', michelangelo: false, dante: false, daVinci: true, descriptionKey: 'feature_priority_support_desc' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const PricingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <>
      <Header />
      <main className="bg-neutral-100" dir={isRTL ? 'rtl' : 'ltr'}>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 md:mb-20"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-textPrimary mb-4">
                {t('pricing', 'mainTitle') || "Unlock Your Italian Dream"}
              </h1>
              <p className="text-lg md:text-xl text-textSecondary max-w-3xl mx-auto">
                {t('pricing', 'mainSubtitle') || "Choose the perfect plan to guide your study journey in Italy. Each tier is crafted to support you at every step, inspired by Italy's greatest minds."}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 items-stretch">
              {TIERS_DATA.map((tier, index) => {
                const TierIcon = tier.icon;
                // Construct the CTA link with the current language
                const rawCtaLink = t('tiers', tier.ctaLinkKey) || (tier.id === 'michelangelo' ? '/sign-up' : '/contact');
                const ctaLink = rawCtaLink.startsWith('/') ? `/${language}${rawCtaLink}` : rawCtaLink;
                const tierHighlightText = t('tiers', tier.highlightKey);

                return (
                  <motion.div
                    key={tier.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className={`relative flex flex-col p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${tier.bgColorMotif} ${tier.tierColors.bgCard} border-2 ${tier.tierColors.border} ${tier.id === 'dante' ? 'ring-4 ring-primary scale-105 z-10' : ''}`}
                  >
                    {tierHighlightText && (
                        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold shadow-md
                                        ${tier.id === 'dante' ? 'bg-primary text-white' : `${tier.tierColors.bgIcon} ${tier.tierColors.text}`}`}>
                            {tierHighlightText}
                        </div>
                    )}
                    <div className="text-center mb-6 pt-4">
                      <div className={`inline-flex items-center justify-center w-20 h-20 ${tier.badgeShape} ${tier.tierColors.bgIcon} mb-5 shadow-md`}>
                        <TierIcon size={40} className={tier.tierColors.text} />
                      </div>
                      <h3 className="text-3xl font-semibold text-textPrimary">{t('tiers', tier.nameKey)}</h3>
                      <p className="text-sm text-textSecondary mt-2 italic h-10">{t('tiers', tier.inspirationKey)}</p>
                    </div>

                    <div className="text-center mb-8">
                      <span className="text-5xl font-bold text-textPrimary">{tier.priceKey ? t('tiers', tier.priceKey) : tier.price}</span>
                      <span className="text-textSecondary text-base">{tier.priceDetailsKey ? t('tiers', tier.priceDetailsKey) : "/month"}</span>
                    </div>
                    
                    <p className="text-textSecondary text-sm mb-8 text-center min-h-[70px] flex-grow">
                      {t('tiers', tier.descriptionKey)}
                    </p>
                    
                    <ul className="space-y-3 mb-10 text-sm flex-grow">
                      {FEATURES_ADDONS.slice(0, 5).map(feature => ( // Show top 5 features
                        <li key={feature.nameKey} className={`flex items-start ${feature[tier.id as keyof TierFeature] ? 'text-textPrimary' : 'text-neutral-400 line-through'}`}>
                          {feature[tier.id as keyof TierFeature] ? 
                            <CheckCircle size={18} className={`mr-3 flex-shrink-0 ${tier.id === 'dante' ? 'text-primary' : tier.tierColors.accentText}`} /> : 
                            <XCircle size={18} className="mr-3 text-neutral-400 flex-shrink-0" />}
                          <span>{t('tiers', feature.nameKey)}</span>
                        </li>
                      ))}
                      {FEATURES_ADDONS.length > 5 && (
                        <li className="text-xs text-textSecondary pt-2 text-center">... {t('pricing','andMoreFeatures') || "and more in the full comparison below!"}</li>
                      )}
                    </ul>
                    
                    <Link
                      href={ctaLink}
                      className={`block w-full text-center py-3.5 px-8 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${tier.tierColors.buttonBg} ${tier.tierColors.buttonText} shadow-md hover:shadow-lg`}
                    >
                      {t('tiers', tier.ctaKey)}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Add-Ons Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }} // Delay after cards
              className="mt-16 md:mt-24"
            >
              <h3 className="text-3xl font-bold text-center text-textPrimary mb-10">
                  {t('pricing', 'featuresComparisonTitle') || "Detailed Features Comparison"}
              </h3>
              <div className="overflow-x-auto bg-white rounded-xl shadow-xl p-1 sm:p-0 border border-neutral-200">
                  <table className="min-w-full divide-y divide-neutral-200">
                      <thead className="bg-neutral-50 sticky top-0 z-10">
                          <tr>
                              <th scope="col" className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-textPrimary uppercase tracking-wider whitespace-nowrap">
                                  {t('pricing', 'featureHeader') || "Feature"}
                              </th>
                              {TIERS_DATA.map(tier => (
                                  <th key={tier.id} scope="col" className={`px-4 sm:px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider whitespace-nowrap ${tier.tierColors.accentText}`}>
                                      {t('tiers', tier.nameKey)}
                                  </th>
                              ))}
                          </tr>
                      </thead>  
                      <tbody className="bg-white divide-y divide-neutral-200">
                          {FEATURES_ADDONS.map((feature) => (
                              <tr key={feature.nameKey} className="hover:bg-neutral-50/50 transition-colors group">
                                  <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm font-medium text-textPrimary">
                                      {t('tiers', feature.nameKey)}
                                      {feature.descriptionKey && (
                                          <p className="text-xs text-textSecondary font-normal mt-1">{t('tiers', feature.descriptionKey)}</p>
                                      )}
                                  </td>
                                  {TIERS_DATA.map(tier => (
                                      <td key={`${feature.nameKey}-${tier.id}`} className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-center">
                                          {feature[tier.id as keyof TierFeature] ? (
                                              <CheckCircle className={`h-6 w-6 mx-auto ${tier.id === 'dante' ? 'text-primary' : tier.tierColors.accentText}`} />
                                          ) : (
                                              <XCircle className="h-6 w-6 text-neutral-300 mx-auto" />
                                          )}
                                      </td>
                                  ))}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-16 md:mt-24 max-w-3xl mx-auto"
            >
                <h3 className="text-3xl font-bold text-center text-textPrimary mb-10">
                    {t('pricing', 'faqTitle') || "Frequently Asked Questions"}
                </h3>
                <div className="space-y-4">
                    {/* Add 2-3 relevant FAQs here using an Accordion component if you have one, or simple divs */}
                    <div className="bg-white p-5 rounded-lg shadow-soft">
                        <h4 className="font-semibold text-textPrimary">{t('pricing', 'faq1_q') || "How do I choose the right plan?"}</h4>
                        <p className="text-sm text-textSecondary mt-2">{t('pricing', 'faq1_a') || "Consider your current stage. Michelangelo is great for exploration, Dante for active application, and da Vinci for comprehensive support including career services."}</p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-soft">
                        <h4 className="font-semibold text-textPrimary">{t('pricing', 'faq2_q') || "Can I upgrade my plan later?"}</h4>
                        <p className="text-sm text-textSecondary mt-2">{t('pricing', 'faq2_a') || "Yes, you can upgrade your plan at any time. Your progress and information will carry over."}</p>
                    </div>
                </div>
            </motion.div>

            {/* Final CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-16 md:mt-24 text-center"
            >
                <h3 className="text-2xl font-bold text-textPrimary mb-4">
                    {t('pricing', 'finalCtaTitle') || "Ready to Begin Your Masterpiece?"}
                </h3>
                <p className="text-textSecondary mb-8 max-w-xl mx-auto">
                    {t('pricing', 'finalCtaSubtitle') || "Select a plan and let us help you craft your successful academic story in Italy."}
                </p>
                <Link
                    href={`/${language}/contact`} // Or a more specific "get started" page
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full text-lg
                               hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl 
                               transform hover:scale-105 active:scale-95"
                >
                    <ShoppingCart size={20} />
                    {t('pricing', 'finalCtaButton') || "Choose Your Plan"}
                </Link>
            </motion.div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PricingPage;