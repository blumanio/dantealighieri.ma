'use client';

import React from 'react';
import Image from 'next/image';
import { FaGraduationCap, FaHandshake, FaGlobe, FaUsers } from 'react-icons/fa';
import { useLanguage } from '../LanguageContext';
import { AboutTranslation } from '@/app/i18n/types';

interface FeatureItem {
  icon: React.ReactNode;
  index: number;
}

const AboutPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const features: FeatureItem[] = [
    {
      icon: <FaGraduationCap />,
      index: 1
    },
    {
      icon: <FaHandshake />,
      index: 2
    },
    {
      icon: <FaGlobe />,
      index: 3
    },
    {
      icon: <FaUsers />,
      index: 4
    }
  ];

  return (
    <div className='bg-neutral-50 px-4 py-16 sm:px-6 lg:px-32 transition-colors duration-300 hover:bg-white' dir={isRTL ? 'rtl' : 'ltr'}>
      <div className='mx-auto max-w-7xl'>
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold text-textPrimary sm:text-4xl hover:text-primary transition-colors duration-300'>
            {t('about', 'pageTitle')}
          </h2>
          <p className='mt-4 text-xl text-textSecondary hover:text-primary-dark transition-colors duration-300'>
            {t('about', 'subtitle')}
          </p>
        </div>

        <div className='mt-20'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div className='group p-6 rounded-lg hover:bg-neutral-100 transition-all duration-300'>
              <h3 className='mb-4 text-2xl font-bold text-textPrimary group-hover:text-primary transition-colors duration-300'>
                {t('about', 'missionTitle')}
              </h3>
              <p className='text-textSecondary group-hover:text-primary-dark transition-colors duration-300'>
                {t('about', 'missionDescription')}
              </p>
            </div>
            <div className='relative h-64 md:h-auto transform transition-transform duration-300 hover:scale-[1.02]'>
              <Image
                src='/images/italian-university.jpg'
                alt={t('about', 'imageAltUniversity')}
                width={500}
                height={300}
                className='rounded-lg object-cover w-full h-full shadow-medium hover:shadow-hard transition-shadow duration-300'
              />
            </div>
          </div>
        </div>

        <div className='mt-20'>
          <h3 className='mb-8 text-center text-2xl font-bold text-textPrimary hover:text-primary transition-colors duration-300'>
            {t('about', 'whyChooseUsTitle')}
          </h3>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {features.map((item) => (
              <div key={item.index} className='text-center group p-6 rounded-lg hover:bg-white hover:shadow-medium transition-all duration-300'>
                <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-primary text-2xl text-white group-hover:bg-secondary group-hover:rotate-6 transition-all duration-300'>
                  {item.icon}
                </div>
                <h4 className='mt-4 text-lg font-medium text-textPrimary group-hover:text-secondary-dark transition-colors duration-300'>
                  {t('about', `featureTitle${item.index}` as keyof AboutTranslation)}
                </h4>
                <p className='mt-2 text-base text-textSecondary group-hover:text-secondary'>
                  {t('about', `featureDescription${item.index}` as keyof AboutTranslation)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-20 p-6 rounded-lg hover:bg-white hover:shadow-soft transition-all duration-300'>
          <h3 className='mb-4 text-2xl font-bold text-textPrimary hover:text-primary transition-colors duration-300'>
            {t('about', 'ourStoryTitle')}
          </h3>
          <p className='text-textSecondary hover:text-primary-dark transition-colors duration-300'>
            {t('about', 'ourStoryFoundingStory')}
          </p>
          <p className='mt-4 text-textSecondary hover:text-primary-dark transition-colors duration-300'>
            {t('about', 'ourStoryImpact')}
          </p>
        </div>

        <div className='mt-20 text-center'>
          <h3 className='mb-4 text-2xl font-bold text-textPrimary hover:text-primary transition-colors duration-300'>
            {t('about', 'ctaTitle')}
          </h3>
          <div className='flex justify-center space-x-4'>
            <a 
              href='https://calendly.com/dantema/dante-alighieri-consulting' 
              target='_blank'
              className="inline-block bg-primary text-white px-8 py-4 rounded-full hover:bg-secondary hover:scale-105 hover:shadow-medium transform transition-all duration-300 shadow-soft"
            >
              {t('about', 'ctaButtonText')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;