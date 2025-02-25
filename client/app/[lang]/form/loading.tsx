export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col items-start space-y-4 mb-8">
            <div className="h-12 bg-primary/10 rounded-lg w-1/3 mb-4 animate-shimmer"></div>
            <div className="h-4 bg-primary/5 rounded-full w-1/4"></div>
          </div>

          {/* Form skeleton */}
          <div className="bg-white rounded-xl shadow-soft p-8 space-y-8">
            {/* Form fields skeleton */}
            <div className="space-y-6">
              {/* Field 1 */}
              <div className="space-y-2">
                <div className="h-4 bg-primary/10 rounded-full w-1/4"></div>
                <div className="h-12 bg-primary/5 rounded-lg w-full"></div>
              </div>

              {/* Field 2 */}
              <div className="space-y-2">
                <div className="h-4 bg-primary/10 rounded-full w-1/3"></div>
                <div className="h-12 bg-primary/5 rounded-lg w-full"></div>
              </div>

              {/* Field 3 */}
              <div className="space-y-2">
                <div className="h-4 bg-primary/10 rounded-full w-1/5"></div>
                <div className="h-24 bg-primary/5 rounded-lg w-full"></div>
              </div>
            </div>

            {/* Button skeleton */}
            <div className="flex justify-end">
              <div className="h-12 bg-primary/20 rounded-full w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}