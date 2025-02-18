'use client';

import React from 'react';
import Image from 'next/image';
import { FaGraduationCap, FaHandshake, FaGlobe, FaUsers } from 'react-icons/fa';
import { useLanguage } from '../LanguageContext';

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
    <div className='bg-white px-4 py-16 sm:px-6 lg:px-32' dir={isRTL ? 'rtl' : 'ltr'}>
      <div className='mx-auto max-w-7xl'>
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl'>
            {t('about', 'pageTitle')}
          </h2>
          <p className='mt-4 text-xl text-gray-500'>
            {t('about', 'subtitle')}
          </p>
        </div>

        <div className='mt-20'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div>
              <h3 className='mb-4 text-2xl font-bold text-gray-900'>
                {t('about', 'missionTitle')}
              </h3>
              <p className='text-gray-600'>
                {t('about', 'missionDescription')}
              </p>
            </div>
            <div className='relative h-64 md:h-auto'>
              <Image
                src='/images/italian-university.jpg'
                alt={t('about', 'imageAltUniversity')}
                width={500}
                height={300}
                className='rounded-lg object-cover w-full h-full'
              />
            </div>
          </div>
        </div>

        <div className='mt-20'>
          <h3 className='mb-8 text-center text-2xl font-bold text-gray-900'>
            {t('about', 'whyChooseUsTitle')}
          </h3>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {features.map((item) => (
              <div key={item.index} className='text-center'>
                <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-teal-600 text-2xl text-white'>
                  {item.icon}
                </div>
                <h4 className='mt-4 text-lg font-medium text-gray-900'>
                  {t('about', `featureTitle${item.index}`)}
                </h4>
                <p className='mt-2 text-base text-gray-500'>
                  {t('about', `featureDescription${item.index}`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-20'>
          <h3 className='mb-4 text-2xl font-bold text-gray-900'>
            {t('about', 'ourStoryTitle')}
          </h3>
          <p className='text-gray-600'>
            {t('about', 'ourStoryFoundingStory')}
          </p>
          <p className='mt-4 text-gray-600'>
            {t('about', 'ourStoryImpact')}
          </p>
        </div>

        <div className='mt-20 text-center'>
          <h3 className='mb-4 text-2xl font-bold text-gray-900'>
            {t('about', 'ctaTitle')}
          </h3>
          <button className="bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 transition duration-300">
            <a href='https://calendly.com/dantema/dante-alighieri-consulting' target='_blank'> 
                {t('about', 'ctaButtonText')}
              </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;