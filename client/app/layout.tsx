import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import Header from '@/components/header'
import Footer from '@/components/footer'
import 'react-toastify/dist/ReactToastify.css'
import ConstructionToast from '../components/ConstructionToast'
import ClerkWrapper from './utils/clerck' // Import the Clerk wrapper
import MobileNav from '@/components/mobileNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import SocialmediLeft from '@/components/SocialmediLeft'

import Toast from '@/components/Toast'
import { SpeedInsights } from "@vercel/speed-insights/next"
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dante Alighieri Consulting',
  description: 'by Mohamed El Aammari'
}
const Announcement = () => (
  <div className="bg-yellow-50 border-b border-yellow-200">
    <div className="mx-auto max-w-7xl px-4 py-2">
      <p className="text-center text-sm text-yellow-800">
        🚧 Website under development - Some features may not work as expected
        <span className="hidden md:inline"> | We're working to improve your experience</span>
      </p>
    </div>
  </div>
);
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ClerkWrapper>
          {/* <ToastContainer /> */}
          <ConstructionToast />
          <Header />
          <Announcement />
          <Toast />
          {children}
          <Footer />
        </ClerkWrapper>
        <GoogleAnalytics gaId='G-845LV1ZMN9' />
        <GoogleTagManager gtmId='GTM-5PXD8C8K' />
        <WhatsAppButton />
        {/*<SocialmediLeft />*/}
        <SpeedInsights />
      </body>
    </html>
  )
}
