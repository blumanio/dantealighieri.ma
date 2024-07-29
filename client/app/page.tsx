import FAQ from '@/components/FAQ'
import Contact from '@/components/contact'
import Hero from '@/components/hero'
import Services from '@/components/services'
import Blog from '@/components/work'
import Image from 'next/image'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ConstructionToast from '../components/ConstructionToast'

export default function Home() {
  return (
    <main>
      <ToastContainer />
      <ConstructionToast />
      <Hero />
      <Services />

      <Blog />
      {/* <FAQ /> */}
      {/* <Contact /> */}
    </main>
  )
}
