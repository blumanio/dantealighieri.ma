// components/PricingTiers.tsx
'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle, XCircle, Aperture, ScrollText, Brain } from 'lucide-react';
import Link from 'next/link';

interface TierFeature {
  nameKey: string; // Key for translation
  michelangelo: boolean;
  dante: boolean;
  daVinci: boolean;
}

const TIERS_DATA = [
  {
    id: 'michelangelo',
    nameKey: 'tier_michelangelo',
    inspirationKey: 'michelangeloInspiration',
    priceKey: 'tierPriceFree', // For "Free"
    priceDetailsKey: 'michelangeloPriceDetails', // e.g., "Basic Access"
    icon: Aperture,
    badgeShape: 'rounded-full',
    tierColors: {
      bg: 'bg-stone-grey-light',
      text: 'text-stone-grey-dark',
      border: 'border-stone-grey',
      buttonBg: 'bg-stone-grey hover:bg-stone-grey-dark',
      buttonText: 'text-white'
    },
    hoverTooltipKey: 'michelangeloHoverTooltip',
    descriptionKey: 'michelangeloDescription',
    bgColorMotif: 'bg-white', // Placeholder, use actual texture class if available
    ctaKey: 'michelangeloCTAText',
    ctaLinkKey: 'michelangeloCTALink' // Key for link URL
  },
  {
    id: 'dante',
    nameKey: 'tier_dante',
    inspirationKey: 'danteInspiration',
    price: '$19', // Can be a key if it needs translation: priceNineteen
    priceDetailsKey: 'dantePriceDetails', // e.g., "/month"
    icon: ScrollText,
    badgeShape: 'rounded-md',
    tierColors: {
      bg: 'bg-deep-blue',
      text: 'text-white',
      border: 'border-deep-blue-dark',
      buttonBg: 'bg-white hover:bg-deep-blue-light',
      buttonText: 'text-deep-blue-dark hover:text-white'
    },
    hoverTooltipKey: 'danteHoverTooltip',
    descriptionKey: 'danteDescription',
    bgColorMotif: 'bg-white', // Placeholder
    ctaKey: 'danteCTAText',
    ctaLinkKey: 'danteCTALink'
  },
  {
    id: 'davinci', // Consistent key name
    nameKey: 'tier_davinci',
    inspirationKey: 'davinciInspiration',
    price: '$50', // Or priceKey: 'priceFifty'
    priceDetailsKey: 'davinciPriceDetails',
    icon: Brain,
    badgeShape: 'rounded-lg',
    tierColors: {
      bg: 'bg-rich-gold',
      text: 'text-neutral-800', // Dark text on gold
      border: 'border-rich-gold-dark',
      buttonBg: 'bg-neutral-800 hover:bg-neutral-700',
      buttonText: 'text-white'
    },
    hoverTooltipKey: 'davinciHoverTooltip',
    descriptionKey: 'davinciDescription',
    bgColorMotif: 'bg-white', // Placeholder
    ctaKey: 'davinciCTAText',
    ctaLinkKey: 'davinciCTALink'
  }
];

const FEATURES_ADDONS: TierFeature[] = [
  { nameKey: 'feature_view_basic_programs', michelangelo: true, dante: true, daVinci: true },
  { nameKey: 'feature_app_tools', michelangelo: false, dante: true, daVinci: true },
  { nameKey: 'feature_live_webinars', michelangelo: false, dante: true, daVinci: true },
  { nameKey: 'feature_language_mini_course', michelangelo: false, dante: true, daVinci: true },
  { nameKey: 'feature_mentorship', michelangelo: false, dante: false, daVinci: true },
  { nameKey: 'feature_job_board', michelangelo: false, dante: false, daVinci: true },
];


const PricingTiers: React.FC = () => {
  const { t, language } = useLanguage(); // Assuming language context provides current lang

  return (
    <section className="py-12 md:py-20 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-textPrimary mb-4">
          {t('pricing', 'title') || "Choose Your Path"}
        </h2>
        <p className="text-center text-textSecondary mb-10 md:mb-16 max-w-2xl mx-auto">
          {t('pricing', 'subtitle') || "Unlock the full potential of your Italian study adventure with our tailored plans."}
        </p>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {TIERS_DATA.map((tier) => {
            const TierIcon = tier.icon;
            const ctaLink = t('tiers', tier.ctaLinkKey) || '/contact'; // Default link if translation not found

            return (
              <div
                key={tier.id}
                className={`flex flex-col p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${tier.bgColorMotif} border-2 ${tier.tierColors.border}`}
                title={t('tiers', tier.hoverTooltipKey) || tier.id}
              >
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${tier.badgeShape} ${tier.tierColors.bg} mb-4 shadow-md`}>
                    <TierIcon size={32} className={tier.tierColors.text} />
                  </div>
                  <h3 className="text-2xl font-semibold text-textPrimary">{t('tiers', tier.nameKey)}</h3>
                  <p className="text-sm text-textSecondary mt-1 italic">{t('tiers', tier.inspirationKey)}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-textPrimary">{tier.priceKey ? t('tiers', tier.priceKey) : tier.price}</span>
                  <span className="text-textSecondary text-sm">{tier.priceDetailsKey ? t('tiers', tier.priceDetailsKey) : "/month"}</span>
                </div>
                
                <p className="text-textSecondary text-sm mb-6 text-center min-h-[60px] flex-grow">
                  {t('tiers', tier.descriptionKey)}
                </p>
                
                <ul className="space-y-2 mb-8 text-sm flex-grow">
                  {FEATURES_ADDONS.slice(0, 4).map(feature => ( // Show first 4 features for card brevity
                    <li key={feature.nameKey} className={`flex items-center ${feature[tier.id as keyof TierFeature] ? 'text-textPrimary' : 'text-neutral-400 line-through'}`}>
                      {feature[tier.id as keyof TierFeature] ? <CheckCircle size={16} className="mr-2 text-green-500 flex-shrink-0" /> : <XCircle size={16} className="mr-2 text-neutral-400 flex-shrink-0" />}
                      {t('tiers', feature.nameKey)}
                    </li>
                  ))}
                   {FEATURES_ADDONS.length > 4 && (
                    <li className="text-xs text-textSecondary pt-1">...and more!</li>
                  )}
                </ul>
                
                <Link
                  href={ctaLink.startsWith('/') ? `/${language}${ctaLink}` : ctaLink}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors duration-300 ${tier.tierColors.buttonBg} ${tier.tierColors.buttonText} hover:opacity-90`}
                >
                  {t('tiers', tier.ctaKey) || "Select Plan"}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Add-Ons Table */}
        <div className="mt-16 md:mt-24">
            <h3 className="text-2xl font-bold text-center text-textPrimary mb-8">
                {t('pricing', 'featuresComparisonTitle') || "Features at a Glance"}
            </h3>
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-1 sm:p-0"> {/* Reduced padding for table */}
                <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                        <tr>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider whitespace-nowrap">
                                {t('pricing', 'featureHeader') || "Feature"}
                            </th>
                            {TIERS_DATA.map(tier => (
                                <th key={tier.id} scope="col" className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-textSecondary uppercase tracking-wider whitespace-nowrap">
                                    {t('tiers', tier.nameKey)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                        {FEATURES_ADDONS.map((feature) => (
                            <tr key={feature.nameKey} className="hover:bg-neutral-50 transition-colors">
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-textPrimary">
                                    {t('tiers', feature.nameKey)}
                                </td>
                                {TIERS_DATA.map(tier => (
                                    <td key={`${feature.nameKey}-${tier.id}`} className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-center">
                                        {feature[tier.id as keyof TierFeature] ? (
                                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-neutral-300 mx-auto" />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </section>
  );
};

export default PricingTiers;