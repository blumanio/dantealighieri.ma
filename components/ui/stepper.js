// components/ui/Stepper.js

import React from 'react'

const Stepper = ({ activeStep }) => {
  return (
    <div className='mt-4 flex justify-center'>
      <div className='flex space-x-4'>
        <StepItem stepNumber={1} activeStep={activeStep} />
        <StepItem stepNumber={2} activeStep={activeStep} />
        <StepItem stepNumber={3} activeStep={activeStep} />
      </div>
    </div>
  )
}

const StepItem = ({ stepNumber, activeStep }) => {
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
        stepNumber === activeStep ? 'border-blue-600' : 'border-gray-300'
      }`}
    >
      <span
        className={`text-sm font-semibold ${
          stepNumber === activeStep ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        {stepNumber}
      </span>
    </div>
  )
}

export default Stepper
