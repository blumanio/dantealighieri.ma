import React, { FormEvent, useMemo, useState } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { useUser } from '@clerk/nextjs'
import { toast } from 'react-toastify'
import axios from 'axios'
import { GFormData } from '../types/types'
import {
  arabCountries,
  degreeTypes,
  APPLICATIONS_ENDPOINT,
  academicAreas,
  accessTypes,
  courseLanguages
} from '../constants/constants'
import { useForm, useCourses } from '../hooks'

const GeneralInfoForm: React.FC = () => {
  toast.success('Application submitted successfully!')

  const { user, isLoaded } = useUser()
  console.log('uuuuuuuuuuuuser', user)
  const initialFormData: GFormData = {
    firstName: '',
    lastName: '',
    birthDate: '',
    country: '',
    city: '',
    degreeType: '',
    program: '',
    userId: '',
    academicArea: undefined,
    courseLanguage: undefined,
    accessType: undefined,
    paymentOption: undefined
  }
  // const [isLoading, setIsLoading] = useState(true)

  const { formData, handleChange } = useForm(initialFormData)

  const { courses } = useCourses(formData)

  const isProgramSelectDisabled = useMemo(
    () =>
      !formData.degreeType ||
      !formData.accessType ||
      !formData.courseLanguage ||
      !formData.academicArea,
    [
      formData.degreeType,
      formData.accessType,
      formData.courseLanguage,
      formData.academicArea
    ]
  )
  const userId: any = user && user.id
  toast.error('Failed to submit application. Please try again.')

  // .post('http://localhost:5000/applications', formData, {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // setIsLoading(true)
    try {
      formData.userId = 'user_2jNmV22CJZDBT2yLw49Bczhxr3kxxxxxxx'
      const response = await axios
        .post(
          // 'https://backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app/applications',
          'http://localhost:5000/applications',
          formData
        )
        .catch(error => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error data:', error.response.data)
            console.error('Error status:', error.response.status)
            console.error('Error headers:', error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message)
          }
          console.error('Error config:', error.config)
        })
      toast.success('Application submitted successfully!')
      // Reset form or perform any other actions on success
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application. Please try again.')
    } finally {
      // setIsLoading(false)
    }
  }

  if (!isLoaded) return <div>Loading...</div>
  if (!user) return <div>Please sign in to access this page.</div>

  return (
    <div className='container mx-auto max-w-3xl p-4'>
      <h1 className='mb-6 text-center text-3xl font-bold'>
        Study Abroad Application Form
      </h1>

      <div className='mb-4 mt-8 rounded bg-white px-8 pb-8 pt-6 shadow-md'>
        <form onSubmit={handleSubmit}>
          <PersonalInfoStep
            formData={formData}
            handleChange={handleChange}
            courses={courses}
            isProgramSelectDisabled={false}
          />

          <div className='mt-6 flex justify-between'>
            <button
              type='submit'
              className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default GeneralInfoForm

// Separate component for Personal Info Step
const PersonalInfoStep: React.FC<{
  formData: GFormData
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  courses: any[]
  isProgramSelectDisabled: boolean
}> = ({ formData, handleChange, courses, isProgramSelectDisabled }) => {
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <label
            htmlFor='firstName'
            className='block text-sm font-medium text-gray-700'
          >
            First Name
          </label>
          <input
            type='text'
            id='firstName'
            name='firstName'
            value={formData.firstName}
            onChange={handleChange}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          />
        </div>
        <div>
          <label
            htmlFor='lastName'
            className='block text-sm font-medium text-gray-700'
          >
            Last Name
          </label>
          <input
            type='text'
            id='lastName'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          />
        </div>
      </div>

      <div>
        <label
          htmlFor='birthDate'
          className='block text-sm font-medium text-gray-700'
        >
          Date of Birth
        </label>
        <input
          type='date'
          id='birthDate'
          name='birthDate'
          value={formData.birthDate}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
      </div>

      <div>
        <label
          htmlFor='country'
          className='block text-sm font-medium text-gray-700'
        >
          Country
        </label>
        <div className='relative'>
          <select
            id='country'
            name='country'
            value={formData.country}
            onChange={handleChange}
            className='mt-1 block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          >
            <option value=''>Select Country</option>
            {arabCountries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          {formData.country && (
            <div className='absolute left-2 top-1/2 -translate-y-1/2 transform'>
              <ReactCountryFlag countryCode={formData.country} svg />
            </div>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor='city'
          className='block text-sm font-medium text-gray-700'
        >
          City with University
        </label>
        <input
          type='text'
          id='city'
          name='city'
          value={formData.city}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
      </div>

      <div>
        <label
          htmlFor='degreeType'
          className='block text-sm font-medium text-gray-700'
        >
          Degree Type
        </label>
        <select
          name='degreeType'
          id='degreeType'
          value={formData.degreeType}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        >
          <option value=''>Select Degree Type</option>
          {degreeTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor='academicArea'
          className='block text-sm font-medium text-gray-700'
        >
          Academic Area
        </label>
        <select
          name='academicArea'
          id='academicArea'
          value={formData.academicArea}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        >
          <option value=''>Select Academic Area</option>
          {academicAreas.map(area => (
            <option key={area.value} value={area.value}>
              {area.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor='accessType'
          className='block text-sm font-medium text-gray-700'
        >
          Access Type
        </label>
        <select
          name='accessType'
          id='accessType'
          value={formData.accessType}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        >
          <option value=''>Select Access Type</option>
          {accessTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor='courseLanguage'
          className='block text-sm font-medium text-gray-700'
        >
          Course Language
        </label>
        <select
          name='courseLanguage'
          id='courseLanguage'
          value={formData.courseLanguage}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        >
          <option value=''>Select Course Language</option>
          {courseLanguages.map(language => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor='program'
          className='block text-sm font-medium text-gray-700'
        >
          Program
        </label>
        <select
          name='program'
          id='program'
          value={formData.program}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          disabled={isProgramSelectDisabled}
        >
          <option value=''>Select Program</option>
          {courses.map((course, index) => (
            <option key={index} value={course.nome}>
              {course.comune + ' | ' + course.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
