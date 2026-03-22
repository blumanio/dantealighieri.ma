'use client';

import { useEffect, useState } from 'react';
import { Loader2, GraduationCap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppLoadingFallback() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ml-4 flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-white text-gray-700">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GraduationCap className="w-16 h-16 text-blue-600 animate-bounce" />
        <h2 className="text-2xl font-bold">Preparing your journey to Italy{dots}</h2>
        <p className="text-md text-gray-500 max-w-md text-center">
          You&apos;re one step closer to your international study adventure
        </p>

        <AnimatePresence>
          <motion.div
            className="mt-6 flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
            <span className="text-blue-600 font-medium">Loading your personalized experience...</span>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 relative w-64 h-3 rounded-full bg-blue-100 overflow-hidden">
          <motion.div
            className="absolute h-full bg-blue-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
          />
        </div>

        <motion.div
          className="mt-6 flex items-center text-sm text-green-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Tip: Use this time to imagine your first espresso in Rome
        </motion.div>
      </motion.div>
    </div>
  );
}
