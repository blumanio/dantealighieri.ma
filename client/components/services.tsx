'use client'

import { motion } from 'framer-motion'
import FadeIn from '../lib/variants'
import AnimatedCounter from '../lib/animatedCounter'
import { useLanguage } from '../app/[lang]/LanguageContext'
import { School, GraduationCap } from 'lucide-react'

const Services = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const serviceCards = [
    {
      number: "01",
      icon: School,
      title: t('services', 'admissionsTitle'),
      description: t('services', 'admissionsDescription')
    },
    {
      number: "02",
      icon: GraduationCap,
      title: t('services', 'scholarshipTitle'),
      description: t('services', 'scholarshipDescription')
    }
  ];

  return (
    <section 
      id='services' 
      className='relative bg-neutral-50 overflow-hidden py-12 sm:py-16 lg:py-20'
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>

      <div className='container mx-auto px-4'>
        <div className='flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16'>
          {/* Left Content */}
          <motion.div
            variants={FadeIn(isRTL ? 'left' : 'right', 0.2)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: true, amount: 0.3 }}
            className='w-full lg:w-5/12'
          >
            <h1 className='text-primary text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6'>
              {t('services', 'title')}
            </h1>
            
            <p className='text-textSecondary text-base sm:text-lg mb-8 max-w-xl'>
              {t('services', 'description')}
            </p>

            {/* Stats */}
            <div className='bg-white rounded-xl shadow-soft p-6 sm:p-8 
                          hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1'>
              <p className='text-textPrimary text-lg font-medium mb-4 uppercase tracking-wide'>
                {t('services', 'helpedMoreThan')}
              </p>
              <div className='flex items-baseline gap-2 text-primary'>
                <span className='text-4xl sm:text-5xl font-bold'>+</span>
                <span className='text-4xl sm:text-5xl font-bold'>
                  <AnimatedCounter from={0} to={200} />
                </span>
                <span className='text-xl sm:text-2xl font-semibold ml-2'>
                  {t('services', 'students')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Service Cards */}
          <motion.div
            variants={FadeIn(isRTL ? 'right' : 'left', 0.4)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: true, amount: 0.3 }}
            className='w-full lg:w-7/12'
          >
            <div className='grid gap-6 sm:grid-cols-2'>
              {serviceCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div 
                    key={card.number}
                    className='group bg-white rounded-xl shadow-soft hover:shadow-medium 
                             transition-all duration-300 overflow-hidden'
                  >
                    <div className='p-6 sm:p-8'>
                      <div className='flex items-center gap-4 mb-6'>
                        <div className='flex items-center justify-center w-12 h-12 rounded-lg 
                                    bg-primary/10 text-primary group-hover:scale-110 
                                    transition-transform duration-300'>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className='text-4xl font-bold text-primary/20'>
                          {card.number}
                        </span>
                      </div>
                      
                      <h2 className='text-xl font-bold text-primary mb-4 
                                 group-hover:text-primary-dark transition-colors duration-300'>
                        {card.title}
                      </h2>
                      
                      <p className='text-textSecondary group-hover:text-textPrimary 
                                transition-colors duration-300'>
                        {card.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Services