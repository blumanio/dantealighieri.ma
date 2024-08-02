import React, { useState, FormEvent, useCallback, useMemo } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { useUser } from '@clerk/nextjs'
import { toast } from 'react-toastify'
import axios from 'axios'
import Stepper from './ui/Stepper'
import DocumentUploadForm from './DocumentUploadForm'
import PaymentForm from './PaymentForm'
import { GFormData } from '../types/types'
import {
  academicAreas,
  arabCountries,
  degreeTypes,
  accessTypes,
  courseLanguages,
  steps,
  APPLICATIONS_ENDPOINT
} from '../constants/constants'
import { useForm, useCourses } from '../hooks'

const GeneralInfoForm: React.FC = () => {
  const [step, setStep] = useState<number>(1)
  const { user, isLoaded } = useUser()

  const initialFormData: GFormData = {
    firstName: '',
    lastName: '',
    birthDate: '',
    country: '',
    city: '',
    degreeType: '',
    accessType: '',
    courseLanguage: '',
    program: '',
    documents: Array().fill(''),
    paymentOption: '',
    receipt: '',
    academicArea: ''
  }

  const { formData, handleChange, handleDocumentUpload, handleFileChange } =
    useForm(initialFormData)

  const { courses, isLoadingCourses } = useCourses(formData)

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

  const handleNextStep = useCallback(() => {
    setStep(prevStep => prevStep + 1)
  }, [])

  const handlePrevStep = useCallback(() => {
    setStep(prevStep => prevStep - 1)
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData()

    // Append documents to FormData
    formData.documents.forEach((file, index) => {
      if (file instanceof File) {
        form.append(`document${index}`, file)
      }
    })

    // Append receipt to FormData
    if (formData.receipt instanceof File) {
      form.append('receipt', formData.receipt)
    }

    // Append other form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'documents' && key !== 'receipt') {
        form.append(key, value as string)
      }
    })

    try {
      const response = await axios.post(APPLICATIONS_ENDPOINT, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Application submitted successfully!')
      // Optionally, reset form or navigate to a success page
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application. Please try again.')
    }
  }

  if (!isLoaded) return <div>Loading...</div>
  if (!user) return <div>Please sign in to access this page.</div>

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            handleChange={handleChange}
            courses={courses}
            isProgramSelectDisabled={isProgramSelectDisabled}
          />
        )
      case 2:
        return (
          <DocumentUploadForm
            formData={formData}
            handleDocumentUpload={handleDocumentUpload}
            handleChange={handleChange}
          />
        )
      case 3:
        return (
          <PaymentForm
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className='container mx-auto max-w-3xl p-4'>
      <h1 className='mb-6 text-center text-3xl font-bold'>
        Study Abroad Application Form
      </h1>
      <Stepper activeStep={step} />

      <div className='mb-4 mt-8 rounded bg-white px-8 pb-8 pt-6 shadow-md'>
        <form onSubmit={handleSubmit}>
          {renderStep()}

          <div className='mt-6 flex justify-between'>
            {step > 1 && (
              <button
                type='button'
                onClick={handlePrevStep}
                className='rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50'
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type='button'
                onClick={handleNextStep}
                className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
              >
                Next
              </button>
            ) : (
              <button
                type='submit'
                className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
              >
                Submit Application
              </button>
            )}
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
  // Render personal info fields here (firstName, lastName, etc.)
  // This component would contain all the fields from the first step
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
            required
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
            required
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
          required
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
            required
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
          required
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
          required
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
          required
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
          required
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
          required
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
          required
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
