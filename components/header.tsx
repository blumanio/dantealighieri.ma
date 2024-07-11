import Link from 'next/link'
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid'
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TiktokIcon,
  WhatsAppIcon
} from './SocialIcons.js'

const Header = () => {
  return (
    <header className='bg-teal-700 text-white'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center justify-between py-2 md:flex-row'>
          <div className='flex flex-col items-center space-y-2 md:flex-row md:space-x-4 md:space-y-0'>
            <a href='tel:05 2560-6262' className='flex items-center font-sans'>
              <WhatsAppIcon className='mr-1 h-4 w-4' />
              <span>+39 389 196 9024</span>
            </a>
            <a
              href='mailto:elaammari.consulting@gmail.com'
              className='flex items-center font-sans'
            >
              <EnvelopeIcon className='mr-1 h-4 w-4' />
              <span>elaammari.consulting@gmail.com</span>
            </a>
          </div>
          <div className='mt-2 flex space-x-4 md:mt-0'>
            <a
              href='https://www.facebook.com/etudesenitalie'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FacebookIcon className='h-5 w-5' />
            </a>
            <a
              href='https://www.instagram.com/dantealighieri.ma/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <InstagramIcon className='h-5 w-5' />
            </a>
            {/* <a
              href='https://youtube.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              <YoutubeIcon className='h-5 w-5' />
            </a>
            <a
              href='https://tiktok.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              <TiktokIcon className='h-5 w-5' />
            </a> */}
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
