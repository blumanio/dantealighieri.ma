'use client';
import React, { useState } from 'react';

/**
 * Minimal premium mobile-first work in progress header
 */
const WorkInProgressHeader = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <header className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white sticky top-0 z-50 border-b border-amber-500/20">
      {/* Subtle animated accent */}
      <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 w-full opacity-60 animate-pulse"></div>
      
      <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        {/* Mobile-first content */}
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Minimal icon */}
          <span className="text-amber-500 text-xl mt-0.5 flex-shrink-0">🚧</span>
          
          {/* Responsive text content */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm sm:text-base text-white leading-tight">
              StudentItaly.it is upgrading
            </p>
            
            {/* Mobile message */}
            <p className="text-slate-300 text-xs sm:hidden mt-0.5 leading-tight">
              Use desktop for best experience
            </p>
            
            {/* Desktop message */}
            <p className="hidden sm:block text-slate-300 text-sm mt-0.5 leading-tight">
              For the best experience, please use desktop. We're actively working on our mobile version.
            </p>
          </div>
        </div>

        {/* Minimal status and close */}
        <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
          {/* Compact status - hidden on small mobile */}
          <div className="hidden xs:flex items-center space-x-1.5 bg-slate-800/60 backdrop-blur-sm rounded-full px-2.5 py-1">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-slate-300">
              Active
            </span>
          </div>

          {/* Clean close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 hover:bg-slate-700/50 rounded-full transition-colors duration-200"
            aria-label="Dismiss"
          >
            <svg 
              className="w-3.5 h-3.5 text-slate-400 hover:text-white transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default WorkInProgressHeader;