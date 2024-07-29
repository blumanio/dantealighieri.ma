// src/components/PaymentForm.tsx
import React from 'react'
import { PaymentFormProps } from '../types/types'

const PaymentForm: React.FC<PaymentFormProps> = ({
  formData,
  handleChange,
  handleFileChange
}) => {
  return (
    <form className='space-y-4'>
      <h2 className='mb-4 text-2xl font-semibold'>Payment</h2>
      <div>
        <label
          htmlFor='paymentOption'
          className='block text-sm font-medium text-gray-700'
        >
          Payment Option
        </label>
        <select
          name='paymentOption'
          id='paymentOption'
          value={formData.paymentOption}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          required
        >
          <option value=''>Select Payment Option</option>
          <option value='creditCard'>Credit Card</option>
          <option value='bankTransfer'>Bank Transfer</option>
          <option value='paypal'>PayPal</option>
        </select>
      </div>
      <div>
        <label
          htmlFor='receipt'
          className='block text-sm font-medium text-gray-700'
        >
          Upload Receipt (PDF only)
        </label>
        <input
          type='file'
          id='receipt'
          name='receipt'
          accept='.pdf'
          onChange={handleFileChange}
          className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100'
        />
      </div>
    </form>
  )
}

export default PaymentForm
