'use client'
import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import {
  FaUser,
  FaSearch,
  FaClipboardCheck,
  FaGraduationCap,
  FaPassport,
  FaBars
} from 'react-icons/fa'
import GeneralInfoForm from './GeneralInfoForm'
import ProgramSearch from './ProgramSearch'
import ApplicationStatus from './ApplicationStatus'
import ScholarshipSearch from './ScholarshipSearch'
import VisaGuide from './VisaGuide'

const Dashboard: React.FC = () => {
  const { user } = useUser()
  const [activeSection, setActiveSection] = useState('general-info')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!user) {
    return (
      <div className='flex h-screen items-center justify-center px-4 text-center'>
        <p className='text-xl font-semibold text-gray-600'>
          Please log in to access the dashboard.
        </p>
      </div>
    )
  }

  const menuItems = [
    { id: 'general-info', label: 'General Information', icon: FaUser },
    { id: 'program-search', label: 'Program Search', icon: FaSearch },
    {
      id: 'application-status',
      label: 'Application Status',
      icon: FaClipboardCheck
    },
    {
      id: 'scholarship-search',
      label: 'Scholarship Search',
      icon: FaGraduationCap
    },
    { id: 'visa-guide', label: 'Visa Guide', icon: FaPassport }
  ]

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-800 sm:text-4xl'>
            Welcome, {user.firstName}!
          </h1>
          <button
            className='block rounded-md bg-blue-500 p-2 text-white md:hidden'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars />
          </button>
        </div>
        <div className='flex flex-col md:flex-row'>
          <nav
            className={`mb-6 w-full md:mb-0 md:w-1/4 md:pr-4 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}
          >
            <ul className='space-y-2 rounded-lg bg-white p-4 shadow-md'>
              {menuItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveSection(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-4 py-3 text-left transition-colors duration-200 ${
                      activeSection === item.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-blue-100'
                    }`}
                  >
                    <item.icon className='mr-3' />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <main className='w-full md:w-3/4 md:pl-4'>
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='rounded-lg bg-white p-4 shadow-md sm:p-6'
            >
              {activeSection === 'general-info' && <GeneralInfoForm />}
              {activeSection === 'program-search' && <ProgramSearch />}
              {activeSection === 'application-status' && <ApplicationStatus />}
              {activeSection === 'scholarship-search' && <ScholarshipSearch />}
              {activeSection === 'visa-guide' && <VisaGuide />}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
