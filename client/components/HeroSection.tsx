'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const router = useRouter();

  return (
    
    <section className="relative min-h-[90vh] bg-neutral-50 pt-20 overflow-hidden">
    
      <div className="max-w-7xl mx-auto px-4 lg:flex items-center gap-12">
        
        {/* Left: Conversion Column */}
        <div className="lg:w-3/5 z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-bold text-sm mb-6">
            <ShieldAlert className="w-4 h-4" /> 
            Stop guessing your way into Italy
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black text-textPrimary leading-[1.1] mb-6">
            I Came to Italy With <span className="text-primary italic underline decoration-accent">Zero Italian</span> — And Won €30,000 in Scholarships.
          </h1>

          <p className="text-xl text-textSecondary mb-8 max-w-2xl">
            Don't waste months on a rejected visa. I'll show you the exact system I used to move from Morocco to Italy, graduate 110/110, and get paid to study.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {/* THE NEW PRIMARY CTA: LEAD MAGNET */}
            <button className="px-8 py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-3">
              GET THE FREE VISA CHECKLIST 
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="px-8 py-5 bg-white text-textPrimary font-bold rounded-2xl border-2 border-neutral-200 hover:border-primary transition-all flex items-center justify-center">
              Book Consultation (€47)
            </button>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-textSecondary">
            <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-primary" /> No generic advice</div>
            <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-primary" /> Real 2026 Strategy</div>
          </div>
        </div>

        {/* Right: The Proof Column */}
        <div className="lg:w-2/5 mt-12 lg:mt-0 relative">
          <div className="relative rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl rotate-2">
            <Image src="/images/graduation.jpg" width={500} height={600} alt="My Graduation" className="object-cover" />
            <div className="absolute top-4 right-4 bg-accent text-textPrimary font-black px-4 py-2 rounded-lg shadow-lg">
              €30,000 WON
            </div>
          </div>
          {/* Social Proof Teaser */}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-neutral-100">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white" />)}
            </div>
            <p className="text-xs font-bold tracking-tight">Joined by 100+ students</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;