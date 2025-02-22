// app/apply/loading.tsx
export default function Loading() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="h-12 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
  
            {/* Form skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }