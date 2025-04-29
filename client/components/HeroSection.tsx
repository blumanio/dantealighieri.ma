'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useLanguage } from '../app/[lang]/LanguageContext';
import Image from 'next/image';
import AnimatedLogos from './AnimatedLogos';
import { motion } from 'framer-motion';
import { translations } from '../../client/app/i18n/translations';
import { Locale } from '../../client/app/i18n/types';

const HeroSection: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { language = 'en' } = useLanguage();
  const isRTL = language === 'ar';
  const currentTranslations = translations[language as Locale] || translations.en;

  const handleExplore = () => {
    router.push(`/${language}/program-search`);
  };

  const [imageNumber, setImageNumber] = useState(1);

  useEffect(() => {
    const randomNum = Math.floor(Math.random() * 11) + 1; // Random number from 1 to 11
    setImageNumber(randomNum);
  }, []);
  return (
    <section
      key={language}
      className="relative min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-6rem)] 
                 bg-gradient-to-b from-primary via-primary to-primary-dark overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-4 pt-8 sm:pt-12 lg:pt-16">
        <div className="max-w-7xl mx-auto w-full">
          {/* Hero Content */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Text Content - Mobile First */}
            <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <motion.h1
                key={`title-${language}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 
                         leading-tight tracking-tight"
              >
                {currentTranslations.hero.title}
              </motion.h1>

              <motion.p
                key={`subtitle-${language}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-white/90 mb-8 max-w-xl mx-auto lg:mx-0"
              >
                {currentTranslations.hero.subtitle}
              </motion.p>

              <motion.button
                key={`button-${language}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                onClick={handleExplore}
                className={`inline-flex items-center px-6 py-3 bg-white text-primary hover:bg-white/90
                         rounded-full transition-all duration-300 shadow-soft hover:shadow-medium 
                         focus:outline-none focus:ring-2 focus:ring-white/50 gap-3 transform 
                         hover:scale-105 active:scale-95 ${isRTL ? 'flex-row-reverse' : ''}`}
                aria-label={currentTranslations.common.search}
              >
                <Search className="w-5 h-5" aria-hidden="true" />
                <span className="text-base font-medium">
                  {currentTranslations.hero.ctaButton}
                </span>
              </motion.button>
            </div>

            {/* Graduation Image - Responsive */}
            <motion.div
              key={`image-${language}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full max-w-md lg:max-w-none mx-auto px-4 sm:px-6 lg:px-0"
            >
              <div className="relative w-full max-w-[500px] mx-auto aspect-[3/4] rounded-2xl 
                            overflow-hidden shadow-medium hover:shadow-hard transition-shadow duration-300">
                <Image
                  src={`/images/${imageNumber}.jpg`}
                  alt="Graduation celebration"
                  className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-700"
                  width={500}
                  height={667}
                  priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent 
                              opacity-75 transition-opacity duration-300 hover:opacity-50" />
              </div>
            </motion.div>
          </div>

          {/* Animated Logos Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="w-full relative mt-12 sm:mt-16 lg:mt-20"
          >
            <AnimatedLogos />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;