'use client';

import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ScholarshipCalculator from './ScholarshipCalculator';

const HeroSection = () => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  return (
    <>
      <ScholarshipCalculator 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
      />

      <section className="relative min-h-[90vh] bg-neutral-50 pt-24 pb-12 overflow-hidden">
        
        {/* REAL URGENCY BANNER */}
        {/* <div className="absolute top-20 left-0 right-0 z-20 flex justify-center px-4">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-red-50 border border-red-100 text-red-800 px-4 py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Next critical deadline: ERSU Scholarship applications close March 15, 2026.</span>
          </motion.div>
        </div> */}

        <div className="max-w-7xl mx-auto px-4 lg:flex items-center gap-16 mt-8">

          {/* Left: Copy & Conversion */}
          <div className="lg:w-3/5 z-10 pt-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wide mb-6 border border-blue-100"
            >
              <ShieldCheck className="w-4 h-4" />
              For Students from Morocco, Tunisia, Algeria & Egypt
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
              Get Accepted, Win Scholarships, & Get Your Visa Approved — <span className="text-orange-600 underline decoration-orange-200 underline-offset-4">Without the Guesswork</span>.
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
              I moved from Morocco to Italy with <span className="font-bold text-slate-900">€500 and zero Italian</span>. 
              I won €25,000+ in scholarships and graduated 110/110. Now I’ll show you exactly how to do the same — step by step.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {/* PRIMARY CTA: Open Calculator */}
              <button 
                onClick={() => setIsCalculatorOpen(true)}
                className="px-8 py-4 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-700 transition-all transform hover:scale-[1.02] shadow-xl shadow-orange-200/50 flex items-center justify-center gap-3 text-lg"
              >
                Download Free Scholarship Calculator
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* SECONDARY CTA: Book Call */}
              <a
                href="https://calendly.com/dantema/dante-alighieri-consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center"
              >
                Book Strategy Call
              </a>
            </div>

            {/* TRUST INDICATORS */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> 
                Real 2026 Strategy
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> 
                Documents that actually work
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> 
                No AI-generated advice
              </div>
            </div>
          </div>

          {/* Right: The Proof Image */}
          <div className="lg:w-2/5 mt-16 lg:mt-0 relative hidden md:block">
            <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 group">
              <Image 
                src="/hero/laurea.jpg" 
                width={500} 
                height={650} 
                alt="Graduation Day in Italy" 
                className="object-cover h-[550px] w-full transform group-hover:scale-105 transition-transform duration-700" 
                priority
              />
              
              {/* Badge: The "Unfair Advantage" */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur text-slate-900 px-5 py-3 rounded-2xl shadow-lg border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Scholarships Won</p>
                <p className="text-2xl font-black text-green-600">€25,000+</p>
              </div>
            </div>

            {/* Social Proof Card */}
            <div className="absolute -bottom-8 -left-12 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-xs animate-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="flex items-start gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden relative">
                       {/* Placeholder avatars */}
                       <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400"></div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-yellow-400 text-xs">★★★★★</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">
                    &quot;I got my ERSU scholarship thanks to your guide!&quot;
                  </p>
                  <p className="text-xs text-slate-500 mt-1">— Ahmed, Morocco</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;