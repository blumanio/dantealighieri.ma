'use client'

import { motion } from 'framer-motion'
import FadeIn from '../lib/variants'
import AnimatedCounter from '../lib/animatedCounter'

const Services = () => {
  return (
    <section id='services' className='bg-background z-30 -translate-y-1 overflow-hidden'>
      {/* Container with max-width constraints */}
      <div className='container mx-auto max-w-[540px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] px-4 py-8 md:py-12 lg:py-16'>
        {/* Main content wrapper */}
        <div className='flex flex-col gap-8 lg:flex-row lg:justify-between'>
          {/* Left column */}
          <motion.div
            variants={FadeIn('right', 0.2)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: true, amount: 0.8 }}
            className='w-full lg:w-1/2 lg:mr-6'
          >
            <h1 className='text-textPrimary text-3xl md:text-4xl font-bold leading-tight pb-4'>
              Our Services
            </h1>
            <p className='text-textSecondary text-sm md:text-base'>
              At our consultancy, we specialize in providing guidance for students seeking educational opportunities in Italy. Our services range from university admissions to scholarship assistance.
            </p>
            <div className='flex flex-col sm:flex-row justify-between py-6 space-y-4 sm:space-y-0 sm:space-x-4'>
              <div className='flex flex-col items-center justify-center'>
                <p className='text-textPrimary text-base md:text-lg font-semibold uppercase text-center'>
                  helped more than
                </p>
                <p className='text-accent text-2xl md:text-3xl font-bold'>
                  + <AnimatedCounter from={0} to={200} /> Students
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div
            variants={FadeIn('left', 0.4)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: true, amount: 0.8 }}
            className='flex flex-col gap-4 md:gap-6 lg:w-1/2'
          >
            {/* Service cards */}
            <div className='flex flex-col md:flex-row lg:flex-col gap-4 md:gap-6'>
              <div className='flex flex-col md:flex-row items-start space-y-3 md:space-y-0 md:space-x-4 bg-teal-600 p-4 rounded-lg'>
                <p className='text-4xl md:text-5xl font-bold text-white'>01</p>
                <div>
                  <h2 className='mb-2 text-lg md:text-xl font-bold text-white'>
                    University Admissions
                  </h2>
                  <p className='text-white text-sm md:text-base'>
                    We help you navigate the admissions process and secure a spot at your dream university in Italy.
                  </p>
                </div>
              </div>

              <div className='flex flex-col md:flex-row items-start space-y-3 md:space-y-0 md:space-x-4 bg-teal-600 p-4 rounded-lg'>
                <p className='text-4xl md:text-5xl font-bold text-white'>02</p>
                <div>
                  <h2 className='mb-2 text-lg md:text-xl font-bold text-white'>
                    Scholarship Assistance
                  </h2>
                  <p className='text-white text-sm md:text-base'>
                    Our experts assist you in finding and applying for scholarships to support your studies in Italy.
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