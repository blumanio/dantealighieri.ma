'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { LanguageProvider } from '../context/LanguageContext';

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-soft">
        <div className="relative w-32 h-32">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            className="w-full h-full filter drop-shadow-md"
          >
            <circle fill="#008C45" stroke="#008C45" strokeWidth="15" r="15" cx="40" cy="65">
              <animate
                attributeName="cy"
                calcMode="spline"
                dur="2"
                values="65;135;65;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="-.4"
              />
            </circle>
            <circle fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="15" r="15" cx="100" cy="65">
              <animate
                attributeName="cy"
                calcMode="spline"
                dur="2"
                values="65;135;65;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="-.2"
              />
            </circle>
            <circle fill="#CD212A" stroke="#CD212A" strokeWidth="15" r="15" cx="160" cy="65">
              <animate
                attributeName="cy"
                calcMode="spline"
                dur="2"
                values="65;135;65;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="0"
              />
            </circle>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading page content...</div>}>
      <LanguageProvider initialLang="en">
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />

        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-soft p-8 md:p-12 text-center">
            {/* 404 Number */}
            <div className="relative mb-6">
              <h1 className="text-8xl md:text-9xl font-bold text-primary/10">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl md:text-7xl font-bold text-primary">404</span>
              </div>
            </div>

            {/* Message */}
            <h2 className="text-2xl md:text-3xl font-semibold text-textPrimary mb-4">
              Page Not Found
            </h2>
            <p className="text-textSecondary mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Navigation Options */}
            <div className="space-y-4">
              <Link
                href="/en"
                className="inline-block w-full md:w-auto bg-primary text-white px-8 py-3 rounded-full 
                          shadow-soft hover:bg-primary-dark hover:shadow-medium 
                          transform hover:-translate-y-1 transition-all duration-300"
              >
                Return Home
              </Link>

              <div className="flex items-center justify-center gap-2 mt-6 text-textSecondary">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">
                  If you think this is a mistake, please contact support
                </span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
          </div>
        </main>

        <Footer />
      </div>
      </LanguageProvider>
    </Suspense>
  );
}