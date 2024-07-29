// components/ServicesOffered.tsx
import React from 'react'
import {
  FaGraduationCap,
  FaFileAlt,
  FaPassport,
  FaLanguage,
  FaHandshake
} from 'react-icons/fa'

interface Service {
  icon: React.ReactNode
  title: string
  description: string
}

const services: Service[] = [
  {
    icon: <FaGraduationCap className='text-4xl text-indigo-600' />,
    title: 'University Admissions Support',
    description:
      'Personalized program matching and application assistance for Italian universities.'
  },
  {
    icon: <FaFileAlt className='text-4xl text-indigo-600' />,
    title: 'Scholarship Application Assistance',
    description:
      'Access to scholarship databases and expert guidance on application processes.'
  },
  {
    icon: <FaPassport className='text-4xl text-indigo-600' />,
    title: 'Visa Documentation Support',
    description:
      'Comprehensive guidance on Italian student visa requirements and application procedures.'
  },
  {
    icon: <FaLanguage className='text-4xl text-indigo-600' />,
    title: 'Language and Cultural Preparation',
    description:
      'Resources for Italian language learning and cultural adaptation workshops.'
  },
  {
    icon: <FaHandshake className='text-4xl text-indigo-600' />,
    title: 'Ongoing Support',
    description:
      'Continuous assistance from application through arrival and settlement in Italy.'
  }
]

const ServicesOffered: React.FC = () => {
  return (
    <div className='bg-gray-100 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <h2 className='mb-12 text-center text-3xl font-extrabold text-gray-900'>
          Our Services for Moroccan Students
        </h2>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {services.map((service, index) => (
            <div
              key={index}
              className='overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl'
            >
              <div className='p-6'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100'>
                  {service.icon}
                </div>
                <h3 className='mt-4 text-center text-xl font-semibold text-gray-900'>
                  {service.title}
                </h3>
                <p className='mt-2 text-center text-gray-600'>
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className='mt-12 text-center'>
          <a
            href='#contact'
            className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700'
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  )
}

export default ServicesOffered
