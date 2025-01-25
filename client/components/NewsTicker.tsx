'use client'

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const NewsTicker = () => {
 const scrollRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
   const scroll = scrollRef.current;
   if (!scroll) return;
   
   scroll.scrollLeft = 0;
   const animateScroll = () => {
     if (!scroll) return;
     if (scroll.scrollLeft >= scroll.scrollWidth / 2) {
       scroll.scrollLeft = 0;
     } else {
       scroll.scrollLeft += 1;
     }
   };

   const timer = setInterval(animateScroll, 30);
   return () => clearInterval(timer);
 }, []);

 return (
   <div className="bg-teal-50 border-y border-teal-100">
     <div ref={scrollRef} className="py-2 flex overflow-hidden whitespace-nowrap">
       <div className="flex items-center pr-8">
         <span className="bg-teal-600 text-white px-2 py-0.5 rounded text-sm mr-3">Coming Soon</span>
         <p className="text-teal-800">
           IMAT and TOLC exam simulations arriving soon! Follow us on social media to stay updated 🎓✨
         </p>
       </div>
       <div className="flex items-center">
         <span className="bg-teal-600 text-white px-2 py-0.5 rounded text-sm mr-3">Coming Soon</span>
         <p className="text-teal-800">
           IMAT and TOLC exam simulations arriving soon! Follow us on social media to stay updated 🎓✨
         </p>
       </div>
     </div>
   </div>
 );
};

export default NewsTicker;