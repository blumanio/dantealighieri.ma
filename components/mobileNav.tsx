'use client'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export const menu = [
  { name: 'services', href: '#services' },
  { name: 'work', href: '/#works' },
  { name: 'FAQ', href: '/#FAQ' },
  { name: 'Contact', href: '/#contact' }
]

const MobileNav = () => {
  console.log('111111111111', 'mobile')
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
      {' '}
      {/* Hide on larger screens */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button onClick={toggleMenu} className='p-2'>
            {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </button>
        </SheetTrigger>
        <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
          <div className='flex h-full flex-col'>
            <div className='flex justify-center py-6'>
              <Link href='/' onClick={() => setIsOpen(false)}>
                <Image src='/logo.svg' height={60} width={47} alt='logo' />
              </Link>
            </div>
            <nav className='flex flex-grow flex-col items-center justify-center gap-6'>
              {menu.map((item, index) => (
                <Link
                  href={item.href}
                  key={index}
                  className='text-lg font-medium capitalize'
                  onClick={() => setIsOpen(false)}
                >
                  <span className='hover:border-blue hover:text-blue border-b-2 border-transparent pb-1 transition-all'>
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav
