// ProgramCard.tsx
import React from 'react'
import {
  FaGraduationCap,
  FaLanguage,
  FaMapMarkerAlt,
  FaUniversity,
  FaLock,
  FaLockOpen
} from 'react-icons/fa'

interface ProgramCardProps {
  course: {
    _id: string
    nome: string
    link: string
    tipo: string
    uni: string
    accesso: string
    area: string
    lingua: string
    comune: string
  }
}

const ProgramCard: React.FC<ProgramCardProps> = ({ course }) => {
  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg'>
      <div className='bg-gradient-to-r from-blue-500 to-indigo-600 p-4'>
        <h3 className='truncate text-xl font-bold text-white'>{course.nome}</h3>
      </div>
      <div className='space-y-2 p-4'>
        <div className='flex items-center text-gray-600'>
          <FaUniversity className='mr-2' />
          <span className='truncate'>{course.uni}</span>
        </div>
        <div className='flex items-center text-gray-600'>
          <FaMapMarkerAlt className='mr-2' />
          <span>{course.comune}</span>
        </div>
        <div className='flex items-center text-gray-600'>
          <FaGraduationCap className='mr-2' />
          <span>{course.tipo}</span>
        </div>
        <div className='flex items-center text-gray-600'>
          {course.accesso === 'Libero' ? (
            <FaLockOpen className='mr-2' />
          ) : (
            <FaLock className='mr-2' />
          )}
          <span>{course.accesso}</span>
        </div>
        <div className='flex items-center text-gray-600'>
          <FaLanguage className='mr-2' />
          <span>{course.lingua === 'IT' ? 'Italian' : 'English'}</span>
        </div>
      </div>
      <div className='bg-gray-50 p-4'>
        <a
          href={course.link}
          target='_blank'
          rel='noopener noreferrer'
          className='block w-full rounded bg-indigo-600 px-4 py-2 text-center font-bold text-white transition duration-300 hover:bg-indigo-700'
        >
          Learn More
        </a>
      </div>
    </div>
  )
}

export default ProgramCard
