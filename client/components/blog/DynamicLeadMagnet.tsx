'use client';

import React, { useState } from 'react';
import { LEAD_MAGNETS, LeadMagnetType } from '@/constants/lead-magnets';
import { ArrowRight, Download, Calculator, Lock } from 'lucide-react';
import ScholarshipCalculator from '@/components/ScholarshipCalculator'; // Ensure this path is correct

interface Props {
  type?: LeadMagnetType;
  className?: string;
  variant?: 'sidebar' | 'inline';
}

export default function DynamicLeadMagnet({ type = 'general', className = '', variant = 'sidebar' }: Props) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const content = LEAD_MAGNETS[type] || LEAD_MAGNETS.general;
  const Icon = content.icon;
  const isInline = variant === 'inline';

  // Define color styles based on the config
  const getColorStyles = (color: string) => {
    switch (color) {
      case 'orange': return {
        wrapper: "bg-orange-50 border-orange-200",
        iconBg: "bg-white text-orange-600",
        button: "bg-orange-600 hover:bg-orange-700 text-white",
        text: "text-orange-900"
      };
      case 'blue': return {
        wrapper: "bg-blue-50 border-blue-200",
        iconBg: "bg-white text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700 text-white",
        text: "text-blue-900"
      };
      case 'emerald': return {
        wrapper: "bg-emerald-50 border-emerald-200",
        iconBg: "bg-white text-emerald-600",
        button: "bg-emerald-600 hover:bg-emerald-700 text-white",
        text: "text-emerald-900"
      };
      default: return {
        wrapper: "bg-purple-50 border-purple-200",
        iconBg: "bg-white text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700 text-white",
        text: "text-purple-900"
      };
    }
  };

  const styles = getColorStyles(content.color);

  const handleAction = () => {
    if (content.action === 'open_calculator') {
      setIsCalculatorOpen(true);
    } else if (content.action === 'download_visa_pdf') {
      // Simulate download or redirect
      alert("Redirecting to Visa Kit Purchase/Download page...");
      // window.location.href = '/products/visa-kit';
    } else {
      // Fallback
      alert(`Action: ${content.action}`);
    }
  };

  return (
    <>
      <ScholarshipCalculator 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
      />
      
      <div className={`
        relative rounded-2xl border-2 p-6 overflow-hidden transition-all duration-300
        ${styles.wrapper}
        ${className}
        ${isInline ? 'my-8 shadow-sm' : 'shadow-md'}
      `}>
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/40 rounded-full blur-2xl pointer-events-none" />

        <div className={`flex ${isInline ? 'flex-col md:flex-row md:items-center gap-6' : 'flex-col gap-4'}`}>
          
          {/* Content */}
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${styles.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider opacity-70 ${styles.text}`}>
                Recommended Resource
              </span>
            </div>
            
            <h3 className={`font-black text-xl mb-2 text-slate-900 leading-tight`}>
              {content.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* CTA Button */}
          <div className={`${isInline ? 'md:w-auto w-full' : 'w-full'} relative z-10`}>
            <button 
              onClick={handleAction}
              className={`
                w-full py-3 px-6 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transform transition-all hover:scale-[1.02] active:scale-95
                ${styles.button}
              `}
            >
              {content.buttonText}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}