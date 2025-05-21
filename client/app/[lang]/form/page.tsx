import { Metadata } from 'next';
import MultiStepForm from '../../../components/MultiStepForm';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Study in Italy - Application Form',
  description: 'Apply to study in Italy with our professional guidance service. Fill out this application form to start your educational journey.',
};

export default function ApplicationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Header Section */}
      <header className="relative bg-white shadow-soft">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="group">
              <h1 className="text-2xl md:text-3xl font-bold text-primary group-hover:text-primary-dark transition-colors duration-300">
                Study in Italy
              </h1>
              <p className="mt-2 text-sm text-textSecondary group-hover:text-primary transition-colors duration-300">
                Complete the form below to start your journey
              </p>
            </div>

            {/* Optional: Add your logo here */}
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={120}
              height={40}
              className="h-10 w-auto transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Form Container */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300">
            <MultiStepForm />
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-textSecondary">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="hover:text-primary transition-colors duration-300">
              Need help? Contact us at support@example.com
            </p>
          </div>

          <p className="text-sm text-textSecondary">
            By submitting this form, you agree to our{' '}
            <a
              href="/terms"
              className="text-secondary hover:text-secondary-dark transition-colors duration-300 underline-offset-2 hover:underline"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              className="text-secondary hover:text-secondary-dark transition-colors duration-300 underline-offset-2 hover:underline"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
    </main>
  );
}