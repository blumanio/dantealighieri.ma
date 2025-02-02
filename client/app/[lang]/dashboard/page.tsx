import React from 'react'
// import { UserButton } from '@clerk/nextjs'
import Dashboard from '../../../components/Dashboard'

const DashboardPage: React.FC = () => {
  return (
    <div>
      {/* <header className='flex items-center justify-between bg-blue-500 p-4 text-white'>
        <h1 className='text-2xl font-bold'>dantealighieri.ma</h1>
        <UserButton afterSignOutUrl='/' />
      </header> */}
      <Dashboard />
    </div>
  )
}

export default DashboardPage
