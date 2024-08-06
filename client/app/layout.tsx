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

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dante Alighieri Consulting',
  description: 'by Mohamed El Aammari'
}

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
          <MobileNav></MobileNav>
          {children}
          <Footer />
        </ClerkWrapper>
        <GoogleAnalytics gaId='G-845LV1ZMN9' />
        <GoogleTagManager gtmId='GTM-5PXD8C8K' />
      </body>
    </html>
  )
}
