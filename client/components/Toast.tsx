'use client';
import React, { useState } from 'react';

/**
 * Minimal premium mobile-first work in progress header
 */
const WorkInProgressHeader = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (

    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-neutral-200 z-50 md:hidden">
      <a href='https://docs.google.com/spreadsheets/d/1aFVQkJeatoEE16MCv4ZNX374QYK3d4PY/edit?gid=2095688478#gid=2095688478'>
      <button className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2">
        GET ALL UNIVERSITIES
      </button>
      </a>
    </div>

  );
};

export default WorkInProgressHeader;