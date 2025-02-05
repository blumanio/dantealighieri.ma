// components/AboutPage.tsx
import React from 'react'
import Image from 'next/image'
import { FaGraduationCap, FaHandshake, FaGlobe, FaUsers } from 'react-icons/fa'

interface FeatureItem {
  icon: React.ReactNode
  title: string
  description: string
}

const features: FeatureItem[] = [
  {
    icon: <FaGraduationCap />,
    title: 'Specialized Expertise',
    description:
      'Deep understanding of both Moroccan and Italian educational systems'
  },
  {
    icon: <FaHandshake />,
    title: 'Personalized Approach',
    description: "Tailored guidance for each student's unique circumstances"
  },
  {
    icon: <FaGlobe />,
    title: 'Extensive Network',
    description: 'Direct partnerships with leading Italian universities'
  },
  {
    icon: <FaUsers />,
    title: 'Proven Track Record',
    description:
      'High success rates in university admissions and scholarship applications'
  }
]

const AboutPage: React.FC = () => {
  return (
    <div className='bg-white px-4 py-16 sm:px-6 lg:px-32'>
      <div className='mx-auto max-w-7xl'>
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl'>
            About dantealighieri.ma Educational Services
          </h2>
          <p className='mt-4 text-xl text-gray-500'>
            Your Gateway to Italian Higher Education
          </p>
        </div>

        <div className='mt-20'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div>
              <h3 className='mb-4 text-2xl font-bold text-gray-900'>
                Our Mission
              </h3>
              <p className='text-gray-600'>
                At dantealighieri.ma, we are dedicated to bridging the gap
                between international students and prestigious Italian universities.
                Our mission is to empower students with the knowledge,
                resources, and support they need to successfully pursue their
                academic dreams in Italy.
              </p>
            </div>
            <div className='relative h-64 md:h-auto'>
              <Image
                src='/images/italian-university.jpg'
                alt='Italian University'
                layout='fill'
                objectFit='cover'
                className='rounded-lg'
              />
            </div>
          </div>
        </div>

        <div className='mt-20'>
          <h3 className='mb-8 text-center text-2xl font-bold text-gray-900'>
            Why Choose Us?
          </h3>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {features.map((item, index) => (
              <div key={index} className='text-center'>
                <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-2xl text-white'>
                  {item.icon}
                </div>
                <h4 className='mt-4 text-lg font-medium text-gray-900'>
                  {item.title}
                </h4>
                <p className='mt-2 text-base text-gray-500'>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-20'>
          <h3 className='mb-4 text-2xl font-bold text-gray-900'>Our Story</h3>
          <p className='text-gray-600'>
            Founded in 2020, dantealighieri.ma Educational Services was born out
            of a passion for education and a desire to create opportunities for
            Moroccan students. Our founders, having experienced the
            transformative power of studying abroad, recognized the need for
            specialized support for students aspiring to study in Italy.
          </p>
          <p className='mt-4 text-gray-600'>
            Over the years, we have helped hundreds of students navigate the
            complex process of applying to Italian universities, securing
            scholarships, and adapting to life in Italy. Our team of experienced
            advisors, many of whom have studied in Italy themselves, bring a
            wealth of knowledge and personal insights to guide students through
            every step of their journey.
          </p>
        </div>

        <div className='mt-20 text-center'>
          <h3 className='mb-4 text-2xl font-bold text-gray-900'>
            Ready to Start Your Italian Academic Journey?
          </h3>
          <a
            href='/contact'
            className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700'
          >
            Contact Us Today
          </a>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
