'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DanteAlighieriLogo } from './SocialIcons.js'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

const menu = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Apply ', href: '' }
]

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // Adjust this breakpoint as needed
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  if (!isMobile) return null

  return (
    <div className='md:hidden'>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button onClick={toggleMenu} className='p-2'>
            {isOpen ? (
              <X className='h-6 w-6 text-white' />
            ) : (
              <Menu className='h-6 w-6 text-white' />
            )}
          </button>
        </SheetTrigger>
        <SheetContent side='right' className='w-[300px] bg-white sm:w-[400px]'>
          <div className='flex h-full flex-col'>
            <div className='flex justify-center bg-teal-700 py-6'>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              {/* <Link href='/' onClick={() => setIsOpen(false)}>
                <Image src='/logo.svg' height={60} width={47} alt='logo' />
              </Link> */}
            </div>
            <nav className='flex flex-grow flex-col items-center justify-center gap-6'>
              {menu.map((item, index) => (
                <Link
                  href={item.href}
                  key={index}
                  className='text-lg font-medium capitalize text-teal-700 transition-colors hover:text-teal-600'
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )) }
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav
