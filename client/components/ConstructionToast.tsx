// components/ConstructionToast.tsx
'use client'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

const ConstructionToast: React.FC = () => {
  useEffect(() => {
    const showConstructionToast = () => {
      toast.info(
        '🚧 Website under construction. Some features may be incomplete.',
        {
          position: 'top-center',
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        }
      )
    }

    showConstructionToast()
  }, [])

  return null
}

export default ConstructionToast
