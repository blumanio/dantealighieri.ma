// ProgramSearch.tsx
import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { debounce } from 'lodash'
import { FaSearch, FaFilter, FaSpinner } from 'react-icons/fa'
import ProgramCard from './programCard'
import { academicAreas } from '../constants/constants'

interface Course {
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

const ITEMS_PER_PAGE = 9

const ProgramSearch: React.FC = () => {
  const [formData, setFormData] = useState({
    degreeType: '',
    accessType: '',
    courseLanguage: '',
    academicArea: ''
  })
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchCourses(true)
  }, [formData])

  const fetchCourses = async (reset = false) => {
    setIsLoading(true)
    try {
      console.log(process.env, 'ssssssssss')
      const params = new URLSearchParams({
        tipo: formData.degreeType,
        accesso: formData.accessType,
        lingua: formData.courseLanguage,
        area: formData.academicArea,
        page: reset ? '1' : page.toString(),
        limit: ITEMS_PER_PAGE.toString()
      })
      const response = await axios.get<Course[]>(
        `http://localhost:5000/api/courses?${params.toString()}`
      )

      if (reset) {
        setCourses(response.data)
        setPage(1)
      } else {
        setCourses(prev => [...prev, ...response.data])
        setPage(prev => prev + 1)
      }

      setHasMore(response.data.length === ITEMS_PER_PAGE)
    } catch (error) {
      console.error('Error fetching courses:', error)
      setCourses([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      Object.values(course).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [courses, searchTerm])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = debounce((term: string) => {
    setSearchTerm(term)
  }, 300)

  const handleLoadMore = () => {
    fetchCourses()
  }

  return (
    <div className='space-y-6 rounded-lg bg-gray-100 p-6'>
      <div className='rounded-lg bg-white p-4 shadow'>
        <h2 className='mb-4 text-2xl font-bold text-gray-800'>
          Search Programs
        </h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div>
            <label
              htmlFor='degreeType'
              className='mb-1 block text-sm font-medium text-gray-700'
            >
              Degree Type
            </label>
            <select
              id='degreeType'
              name='degreeType'
              value={formData.degreeType}
              onChange={handleChange}
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            >
              <option value=''>All Types</option>
              <option value='Triennale'>Triennale</option>
              <option value='Magistrale'>Magistrale</option>
              <option value='Ciclo Unico'>Ciclo Unico</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='accessType'
              className='mb-1 block text-sm font-medium text-gray-700'
            >
              Access Type
            </label>
            <select
              id='accessType'
              name='accessType'
              value={formData.accessType}
              onChange={handleChange}
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            >
              <option value=''>All Types</option>
              <option value='Libero'>Libero</option>
              <option value="Test d'ingresso">Test d'ingresso</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='courseLanguage'
              className='mb-1 block text-sm font-medium text-gray-700'
            >
              Course Language
            </label>
            <select
              id='courseLanguage'
              name='courseLanguage'
              value={formData.courseLanguage}
              onChange={handleChange}
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            >
              <option value=''>All Languages</option>
              <option value='IT'>Italian</option>
              <option value='EN'>English</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='academicArea'
              className='mb-1 block text-sm font-medium text-gray-700'
            >
              Academic Area
            </label>
            <select
              id='academicArea'
              name='academicArea'
              value={formData.academicArea}
              onChange={handleChange}
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            >
              <option value=''>Select Academic Area</option>
              {academicAreas.map(area => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='relative mt-4'>
          <input
            type='text'
            placeholder='Search programs...'
            onChange={e => handleSearch(e.target.value)}
            className='w-full rounded-full border p-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-300'
          />
          <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400' />
        </div>
      </div>

      {isLoading && page === 1 ? (
        <div className='flex h-64 items-center justify-center'>
          <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500'></div>
        </div>
      ) : filteredCourses.length > 0 ? (
        <>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredCourses.map(course => (
              <ProgramCard key={course._id} course={course} />
            ))}
          </div>
          {hasMore && (
            <div className='mt-8 flex justify-center'>
              <button
                onClick={handleLoadMore}
                className='flex items-center rounded-full bg-indigo-600 px-4 py-2 font-bold text-white transition duration-300 hover:bg-indigo-700'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className='mr-2 animate-spin' />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className='py-8 text-center text-gray-600'>
          <FaFilter className='mx-auto mb-4 text-4xl' />
          <p className='text-xl'>
            No courses found. Please adjust your search criteria.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProgramSearch
