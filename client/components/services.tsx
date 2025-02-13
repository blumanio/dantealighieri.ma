'use client'

import { motion } from 'framer-motion'
import FadeIn from '../lib/variants'
import AnimatedCounter from '../lib/animatedCounter'

const Services = () => {
  return (
    <section id='services' className='bg-background z-30 -translate-y-1 overflow-hidden'>
      <div className='mx-auto max-w-full py-16 lg:py-32'>
        <div className='flex flex-col justify-between gap-8 px-4 lg:flex-row lg:px-6'>
          <motion.div
            variants={FadeIn('right', 0.2)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: true, amount: 0.8 }}
            className='flex w-full flex-col justify-between lg:mr-6 lg:w-1/2'
          >
            <h1 className='text-textPrimary pb-4 text-4xl font-bold leading-tight'>
              Our Services
            </h1>
            <p className='text-textSecondary'>
              At our consultancy, we specialize in providing guidance for students seeking educational opportunities in Italy. Our services range from university admissions to scholarship assistance.
            </p>
            <div className='flex justify-between space-x-4 py-6'>
              <div className='flex flex-col items-center justify-center'>
                <p className='text-textPrimary text-lg font-semibold uppercase'>
                  helped more than
                </p>
                <p className='text-accent text-3xl font-bold'>
                  + <AnimatedCounter from={0} to={200} /> Students
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={FadeIn('left', 0.4)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: true, amount: 0.8 }}
            className='flex h-full flex-col gap-6'
          >
            <div className='flex items-center space-x-4 bg-teal-600 p-4'>
              <p className='text-5xl font-bold text-white'>01</p>
              <div>
                <h2 className='mb-2 text-xl font-bold text-white'>
                  University Admissions
                </h2>
                <p className='text-white'>
                  We help you navigate the admissions process and secure a spot at your dream university in Italy.
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-4 bg-teal-600 p-4'>
              <p className='text-5xl font-bold text-white'>02</p>
              <div>
                <h2 className='mb-2 text-xl font-bold text-white'>
                  Scholarship Assistance
                </h2>
                <p className='text-white'>
                  Our experts assist you in finding and applying for scholarships to support your studies in Italy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Services