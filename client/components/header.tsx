'use client'

import Link from 'next/link'
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid'
import MobileNav from '@/components/mobileNav'
import {
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
    <header className="sticky top-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between w-full">
          <div className="flex items-center justify-between w-full h-20 md:h-24 px-4 md:px-8 lg:px-12">
            <Link href="/" className="font-heading text-2xl font-bold text-teal-700">
              <DanteAlighieriLogo className="logo h-14 md:h-16" />
            </Link>
            <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
              <Link href="/about" className="text-slate-700 hover:text-teal-600">
                About
              </Link>
              <Link href="/services" className="text-red-600 relative animate-pulse font-semibold">
                Universities deadline
              </Link>
              <Link
                href=""
                className="relative flex items-center rounded bg-gray-400 px-5 py-2 text-white opacity-70 cursor-not-allowed pointer-events-none transition-colors"
                aria-disabled="true"
              >
                apply
                <span className="absolute -top-3 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full animate-pulse">
                  Soon
                </span>
              </Link>
              <div className="text-slate-700 transition-colors hover:text-teal-600">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>
          <MobileNav />
        </nav>
      </div>
    </header>)
}
export default Header