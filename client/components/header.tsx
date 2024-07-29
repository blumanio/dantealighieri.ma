import Link from 'next/link'
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid'
import MobileNav from '@/components/mobileNav'

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedInIcon,
  WhatsAppIcon,
  TikTokIcon,
  DanteAlighieriLogo
} from './SocialIcons.js'

const Header = () => {
  return (
    <>
      <header className='bg-teal-700 text-white'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-row items-center justify-between py-2 md:flex-row'>
            <div className='flex flex-col items-center space-y-2 md:flex-row md:space-x-4 md:space-y-0'>
              <a
                href='tel:+39 351 900 0615'
                className='flex items-center font-sans'
              >
                <WhatsAppIcon className='mr-1 h-4 w-4' />
                <span>+39 351 900 0615</span>
              </a>
              {/*<a
              href='mailto:elaammari.consulting@gmail.com'
              className='flex items-center font-sans'
            >
              <EnvelopeIcon className='mr-1 h-4 w-4' />
              <span>elaammari.consulting@gmail.com</span>
            </a>*/}
            </div>
            <div className='mt-2 flex space-x-4 md:mt-0'>
              <a
                href='https://www.linkedin.com/in/mohamedelaammari/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <LinkedInIcon className='h-5 w-5' />
              </a>
              <a
                href='https://www.facebook.com/groups/etudesenitalie'
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
              <a
                href='https://www.tiktok.com/@dantealighieri_ma'
                target='_blank'
                rel='noopener noreferrer'
              >
                <TikTokIcon className='h-5 w-5' />
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
      {true ? (
        <nav className='shadow-mdshadow-md headerDesktop bg-white'>
          <div className='container mx-auto px-4'>
            <div className='flex flex-col items-center justify-between py-4 md:flex-row'>
              <Link
                href='/'
                className='font-heading text-2xl font-bold text-teal-700'
              >
                <DanteAlighieriLogo className='logo' />
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

                <Link
                  href='/dashboard'
                  className='rounded bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700'
                >
                  apply
                </Link>
                <div className='rounded px-4 py-2 text-slate-700 transition-colors hover:text-teal-600'>
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </div>
          </div>
        </div>
        {true ? (
          <nav className='shadow-mdshadow-md headerDesktop bg-white'>
            <div className='container mx-auto px-4'>
              <div className='flex flex-col items-center justify-between py-4 md:flex-row'>
                <Link
                  href='/'
                  className='font-heading text-2xl font-bold text-teal-700'
                >
                  <DanteAlighieriLogo className='logo' />
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

                  <Link
                    href='/consultation'
                    className='rounded bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700'
                  >
                    apply
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        ) : null}
      </header>
      <MobileNav></MobileNav>
    </>
  )
}

export default Header
