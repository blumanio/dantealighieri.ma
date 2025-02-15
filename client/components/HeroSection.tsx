'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useLanguage } from '../app/[lang]/LanguageContext';
import AnimatedLogos from './AnimatedLogos';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
      className="relative min-h-screen bg-gradient-to-b from-teal-600/80 to-teal-700/80 overflow-hidden"
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
        <div className="max-w-7xl mx-auto w-full">
          {/* Hero Content */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
              >
                Start Your Italian Dream Education
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-teal-50 mb-6"
              >
                Get expert guidance, step-by-step resources, and premium services to make your 
                study journey to Italy simple, clear, and successful.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                onClick={handleExplore}
                className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-300 gap-3"
                aria-label="Explore all Italian programs"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
                <span className="text-base font-medium">Explore All Italian Programs</span>
              </motion.button>
            </div>

            {/* Graduation Image */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative"
            >
              <div className="relative w-full max-w-[500px] mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/graduation.jpg"
                  alt="Graduation"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/30 to-transparent" />
              </div>
            </motion.div>
          </div>

          {/* Animated Logos */}
          <div className="w-full relative mt-12">
            <AnimatedLogos />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;