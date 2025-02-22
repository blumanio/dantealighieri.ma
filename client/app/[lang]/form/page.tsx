// app/apply/page.tsx
import { Metadata } from 'next';
import MultiStepForm from '../../../components/MultiStepForm';

export const metadata: Metadata = {
  title: 'Study in Italy - Application Form',
  description: 'Apply to study in Italy with our professional guidance service. Fill out this application form to start your educational journey.',
};

export default function ApplicationPage() {
  return (
    <main>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Header Section */}
        <header className="relative bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Study in Italy
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Complete the form below to start your journey
                </p>
              </div>
              
              {/* Optional: Add your logo here */}
              {/* <Image
                src="/your-logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              /> */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Form Container */}
          <div className="px-4 py-6 sm:px-0">
            <MultiStepForm />
          </div>

          {/* Footer Information */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Need help? Contact us at support@example.com</p>
            <p className="mt-2">
              By submitting this form, you agree to our{' '}
              <a href="/terms" className="text-teal-600 hover:text-teal-700">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-teal-600 hover:text-teal-700">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}