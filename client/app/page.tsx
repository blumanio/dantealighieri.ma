'use client'
import FAQ from '@/components/FAQ'
import Contact from '@/components/contact'
import Hero from '@/components/hero'
import MobileNav from '@/components/mobileNav'
import Services from '@/components/services'
import HeroBanner from '@/components/heroBanner'

import Blog from '@/components/work'
import Image from 'next/image'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ConstructionToast from '../components/ConstructionToast'
import ProgramSearch from '@/components/ProgramSearch'




export default function Home() {
  return (
    <main>

     { /*<HeroBanner />
      <ToastContainer />*/}
      {/* <ConstructionToast /> */}
      <div className="flex justify-center w-full py-8">
      <div className="w-4/5">
        <ProgramSearch />
      </div>
    </div>
      {/*<Hero />*/}

      <Services />

      {/* <Blog />*/}
      {/* <FAQ />*/}
     {/* <Contact />*/}
    </main>
  )
}
