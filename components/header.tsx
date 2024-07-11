import Link from 'next/link'
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid'
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TiktokIcon
} from './SocialIcons.js'

const Header = () => {
  return (
    <header className='bg-teal-700 text-white'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center justify-between py-2 md:flex-row'>
          <div className='flex flex-col items-center space-y-2 md:flex-row md:space-x-4 md:space-y-0'>
            <a href='tel:05 2560-6262' className='flex items-center font-sans'>
              <PhoneIcon className='mr-1 h-4 w-4' />
              <span>05 2560-6262</span>
            </a>
            <a
              href='mailto:contact@tawjeeh.ma'
              className='flex items-center font-sans'
            >
              <EnvelopeIcon className='mr-1 h-4 w-4' />
              <span>contact@tawjeeh.ma</span>
            </a>
          </div>
          <div className='mt-2 flex space-x-4 md:mt-0'>
            <FacebookIcon className='h-5 w-5' />
            <InstagramIcon className='h-5 w-5' />
            <YoutubeIcon className='h-5 w-5' />
            <TiktokIcon className='h-5 w-5' />
          </div>
        </div>
      </div>
      <nav className='bg-white shadow-md'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col items-center justify-between py-4 md:flex-row'>
            <Link
              href='/'
              className='font-heading text-2xl font-bold text-teal-700'
            >
              Dantealighieri.ma
            </Link>
            <div className='mt-2 flex flex-col items-center space-y-2 font-sans md:mt-0 md:flex-row md:space-x-6 md:space-y-0'>
              <Link
                href='/about'
                className='text-slate-700 hover:text-teal-600'
              >
                About
              </Link>
              <Link
                href='/services'
                className='text-slate-700 hover:text-teal-600'
              >
                Services
              </Link>
              <Link href='/blog' className='text-slate-700 hover:text-teal-600'>
                Blog
              </Link>
              <Link
                href='/contact'
                className='text-slate-700 hover:text-teal-600'
              >
                Contact us
              </Link>
              <Link
                href='/apply'
                className='rounded bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700'
              >
                Apply
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
