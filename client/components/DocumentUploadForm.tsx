// src/components/DocumentUploadForm.tsx

import React from 'react'
import { DocumentUploadFormProps } from '../types/types'

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  formData,
  handleDocumentUpload
}) => {
  return (
    <form className='space-y-4'>
      <h2 className='mb-4 text-2xl font-semibold'>Document Upload</h2>
      <p className='mb-4 text-gray-600'>
        Please upload the following documents (PDF only):
      </p>
      {formData.documents.map((_, index) => (
        <div key={index} className='mb-4'>
          <label
            htmlFor={`document-${index}`}
            className='block text-sm font-medium text-gray-700'
          >
            Document {index + 1}
          </label>
          <input
            type='file'
            id={`document-${index}`}
            name='documents'
            accept='.pdf'
            onChange={e => handleDocumentUpload(e, index)}
            className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100'
          />
        </div>
      ))}
    </form>
  )
}

export default DocumentUploadForm
