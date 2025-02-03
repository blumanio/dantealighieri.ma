import { Suspense } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>}>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mb-4 text-2xl font-medium text-gray-600">
            Page Not Found
          </h2>
          <p className="mb-8 text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/en"
            className="rounded-md bg-teal-600 px-6 py-3 text-white transition-colors hover:bg-teal-700"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </Suspense>
  )
}