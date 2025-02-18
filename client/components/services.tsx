'use client'

import { motion } from 'framer-motion'
import FadeIn from '../lib/variants'
import AnimatedCounter from '../lib/animatedCounter'
import { useLanguage } from '../app/[lang]/LanguageContext'

const Services = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <section id='services' className='bg-background z-30 -translate-y-1 overflow-hidden'>
      <div className='container mx-auto max-w-[540px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] px-4 py-8 md:py-12 lg:py-16'>
        <div className='flex flex-col gap-8 lg:flex-row lg:justify-between'>
          <motion.div
            variants={FadeIn(isRTL ? 'left' : 'right', 0.2)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: true, amount: 0.8 }}
            className='w-full lg:w-1/2 lg:mr-6'
          >
            <h1 className='text-textPrimary text-3xl md:text-4xl font-bold leading-tight pb-4'>
              {t('services', 'title')}
            </h1>
            <p className='text-textSecondary text-sm md:text-base'>
              {t('services', 'description')}
            </p>
            <div className='flex flex-col sm:flex-row justify-between py-6 space-y-4 sm:space-y-0 sm:space-x-4'>
              <div className='flex flex-col items-center justify-center'>
                <p className='text-textPrimary text-base md:text-lg font-semibold uppercase text-center'>
                  {t('services', 'helpedMoreThan')}
                </p>
                <p className='text-accent text-2xl md:text-3xl font-bold'>
                  + <AnimatedCounter from={0} to={200} /> {t('services', 'students')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={FadeIn(isRTL ? 'right' : 'left', 0.4)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: true, amount: 0.8 }}
            className='flex flex-col gap-4 md:gap-6 lg:w-1/2'
          >
            <div className='flex flex-col md:flex-row lg:flex-col gap-4 md:gap-6'>
              <div className='flex flex-col md:flex-row items-start space-y-3 md:space-y-0 md:space-x-4 bg-teal-600 p-4 rounded-lg'>
                <p className='text-4xl md:text-5xl font-bold text-white'>01</p>
                <div>
                  <h2 className='mb-2 text-lg md:text-xl font-bold text-white'>
                    {t('services', 'admissionsTitle')}
                  </h2>
                  <p className='text-white text-sm md:text-base'>
                    {t('services', 'admissionsDescription')}
                  </p>
                </div>
              </div>

              <div className='flex flex-col md:flex-row items-start space-y-3 md:space-y-0 md:space-x-4 bg-teal-600 p-4 rounded-lg'>
                <p className='text-4xl md:text-5xl font-bold text-white'>02</p>
                <div>
                  <h2 className='mb-2 text-lg md:text-xl font-bold text-white'>
                    {t('services', 'scholarshipTitle')}
                  </h2>
                  <p className='text-white text-sm md:text-base'>
                    {t('services', 'scholarshipDescription')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Services