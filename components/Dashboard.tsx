'use client'
import React, { useState } from 'react'
import Stepper from '../components/ui/Stepper'

const Dashboard: React.FC = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    country: '',
    city: '',
    degreeType: '',
    program: '',
    documents: ['', '', '', '', '', '', ''], // Array to hold file inputs
    paymentOption: '',
    receipt: ''
  })

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleDocumentUpload = (e, index) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      let updatedDocuments = [...formData.documents]
      updatedDocuments[index] = file
      setFormData({
        ...formData,
        documents: updatedDocuments
      })
    } else {
      alert('Please upload a PDF file.')
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    // Handle form submission logic here
    console.log(formData)
    // Assuming form submission success, move to next step
    handleNextStep()
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-6 text-3xl font-bold'>Study Abroad Application Form</h1>
      <Stepper activeStep={step} />
      {step === 1 && (
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='firstName' className='block text-sm font-medium'>
              First Name
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='lastName' className='block text-sm font-medium'>
              Last Name
            </label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='birthDate' className='block text-sm font-medium'>
              Date of Birth
            </label>
            <input
              type='date'
              id='birthDate'
              name='birthDate'
              value={formData.birthDate}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='country' className='block text-sm font-medium'>
              Country
            </label>
            <input
              type='text'
              id='country'
              name='country'
              value={formData.country}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='city' className='block text-sm font-medium'>
              City with University
            </label>
            <input
              type='text'
              id='city'
              name='city'
              value={formData.city}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='degreeType' className='block text-sm font-medium'>
              Degree Type
            </label>
            <select
              name='degreeType'
              id='degreeType'
              value={formData.degreeType}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 p-2'
              required
            >
              <option value=''>Select Degree Type</option>
              <option value='bachelor'>Bachelor</option>
              <option value='master'>Master</option>
              <option value='phd'>PhD</option>
            </select>
          </div>
          <div className='mb-4'>
            <label htmlFor='program' className='block text-sm font-medium'>
              Program
            </label>
            <input
              type='text'
              id='program'
              name='program'
              value={formData.program}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 p-2'
              required
            />
          </div>
          <div className='mt-6'>
            <button
              type='button'
              onClick={handleNextStep}
              className='rounded bg-blue-600 px-4 py-2 text-white'
            >
              Next
            </button>
          </div>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <h2 className='mb-4 text-2xl font-semibold'>Document Upload</h2>
          <p className='mb-4'>
            Please upload the following documents (PDF only):
          </p>
          <div className='mb-4'>
            {formData.documents.map((document, index) => (
              <div key={index} className='mb-2'>
                <label
                  htmlFor={`document${index + 1}`}
                  className='block text-sm font-medium'
                >
                  Document {index + 1}
                </label>
                <input
                  type='file'
                  id={`document${index + 1}`}
                  name={`document${index + 1}`}
                  accept='.pdf'
                  onChange={e => handleDocumentUpload(e, index)}
                  className='w-full rounded border border-gray-300 p-2'
                  required
                />
              </div>
            ))}
          </div>
          <div className='mt-6'>
            <button
              type='button'
              onClick={handlePrevStep}
              className='mr-4 rounded bg-gray-300 px-4 py-2 text-gray-700'
            >
              Previous
            </button>
            <button
              type='submit'
              className='rounded bg-blue-600 px-4 py-2 text-white'
            >
              Next
            </button>
          </div>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <h2 className='mb-4 text-2xl font-semibold'>Payment</h2>
          <div className='mb-4'>
            <label className='block text-sm font-medium'>Payment Option</label>
            <select
              name='paymentOption'
              value={formData.paymentOption}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 p-2'
              required
            >
              <option value=''>Select Payment Option</option>
              <option value='card'>Pay with Card</option>
              <option value='receipt'>Upload Receipt</option>
            </select>
          </div>
          {/* Payment inputs based on selection */}
          {/* Step navigation */}
          <div className='mt-6'>
            <button
              type='button'
              onClick={handlePrevStep}
              className='mr-4 rounded bg-gray-300 px-4 py-2 text-gray-700'
            >
              Previous
            </button>
            <button
              type='submit'
              className='rounded bg-blue-600 px-4 py-2 text-white'
            >
              Submit Application
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Dashboard
