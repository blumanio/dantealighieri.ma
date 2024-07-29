// components/ui/Stepper.js

import React from 'react'

const Stepper = ({ activeStep }) => {
  const steps = [
    { number: 1, name: 'General Info' },
    { number: 2, name: 'Documents' },
    { number: 3, name: 'Payment' }
  ]

  return (
    <div className='mb-8 mt-4'>
      <div className='flex items-center justify-center'>
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <StepItem step={step} activeStep={activeStep} />
            {index < steps.length - 1 && (
              <Connector active={activeStep > step.number} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

const StepItem = ({ step, activeStep }) => {
  const isActive = step.number === activeStep
  const isCompleted = step.number < activeStep

  return (
    <div className='flex flex-col items-center'>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
          isActive
            ? 'border-blue-600 bg-blue-600 text-white'
            : isCompleted
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-gray-300 text-gray-500'
        }`}
      >
        {isCompleted ? (
          <CheckIcon className='h-6 w-6' />
        ) : (
          <span className='text-sm font-semibold'>{step.number}</span>
        )}
      </div>
      <span
        className={`mt-2 text-xs font-medium ${isActive || isCompleted ? 'text-blue-600' : 'text-gray-500'}`}
      >
        {step.name}
      </span>
    </div>
  )
}

const Connector = ({ active }) => (
  <div
    className={`mx-2 h-0.5 flex-1 ${active ? 'bg-blue-600' : 'bg-gray-300'}`}
  ></div>
)

const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M5 13l4 4L19 7'
    />
  </svg>
)

export default Stepper
