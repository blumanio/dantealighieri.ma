import FAQ from '@/components/FAQ'
import Contact from '@/components/contact'
import Hero from '@/components/hero'
import MobileNav from '@/components/mobileNav'
import Services from '@/components/services'
import Work from '@/components/work'
import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <MobileNav></MobileNav>
      <Hero />
      <Services />

      {/* <Work /> */}
      {/* <FAQ /> */}
      {/* <Contact /> */}
    </main>
  )
}
