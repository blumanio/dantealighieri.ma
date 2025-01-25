'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Toast = () => {
 const [isVisible, setIsVisible] = useState(true);

 useEffect(() => {
   const timer = setTimeout(() => {
     setIsVisible(true);
   }, 1000);
   return () => clearTimeout(timer);
 }, []);

 return (
   <AnimatePresence>
     {isVisible && (
       <motion.div
         initial={{ opacity: 0, y: 50 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: 50 }}
         className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md z-50"
       >
         <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg shadow-lg p-4">
           <div className="flex items-start justify-between">
             <div className="flex space-x-3">
               <div className="flex-shrink-0">
                 <span className="text-2xl">🚀</span>
               </div>
               <div className="flex-1">
                 <p className="text-white font-medium">
                   Coming Soon
                 </p>
                 <p className="mt-1 text-sm text-white/90">
                   IMAT and TOLC exam simulations arriving soon! Follow us for updates ✨
                 </p>
               </div>
             </div>
             <button
               onClick={() => setIsVisible(false)}
               className="flex-shrink-0 ml-4 text-white/80 hover:text-white transition-colors"
             >
               <X size={18} />
             </button>
           </div>
         </div>
       </motion.div>
     )}
   </AnimatePresence>
 );
};

export default Toast;