'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useLanguage } from '../app/[lang]/LanguageContext';
import AnimatedLogos from './AnimatedLogos';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { language = 'en', t } = useLanguage();
  const isRTL = language === 'ar';

  const handleExplore = () => {
    router.push(`/${language}/program-search`);
  };

  return (
    <section
      className="relative min-h-screen bg-gradient-to-b from-teal-600/80 to-teal-700/80"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Map - Bottom Layer */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="w-full h-full">
          <img
            src="/italy-map.svg"
            alt=""
            className="w-full h-full object-contain opacity-40"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-4 pt-20">
        <div className="max-w-4xl mx-auto w-full">
          {/* Hero Content */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Discover Your Future in Italy
            </h1>
            <p className="text-lg text-teal-50 mb-6">
              Explore world-class academic programs at Italy's prestigious universities. 
              Your journey to excellence starts here.
            </p>
            <button
              onClick={handleExplore}
              className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-300 gap-3"
              aria-label="Explore all Italian programs"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
              <span className="text-base font-medium">Explore All Italian Programs</span>
            </button>
          </div>

          {/* Animated Logos */}
          <div className="w-full h-32 relative">
            <AnimatedLogos />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;