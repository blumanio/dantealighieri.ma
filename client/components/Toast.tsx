'use client';

// Using a rocket emoji for a more exciting "upgrade" feel.
// You could also use ✨ (sparkles) or 🪄 (magic wand).
import { Rocket } from 'lucide-react'; 

const UpgradeBanner = () => {
  return (
    // The background gradient is slightly adjusted for a fresh look.
    // A subtle shadow adds depth and separation from the content below.
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center">
          
          {/* Icon Column */}
          <div className="flex-shrink-0 pr-4">
            {/* Using lucide-react for a clean icon, with responsive size. */}
            <Rocket className="h-8 w-8 text-white/90" aria-hidden="true" />
          </div>

          {/* Text Column */}
          <div className="flex-1 text-white">
            <p className="font-bold text-base md:text-lg">
              Exciting changes are on the way!
            </p>
            <p className="text-sm text-white/80 mt-1">
              We're making things even better for you. Check back in a little while to discover our new features. It'll be worth the wait!
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UpgradeBanner;