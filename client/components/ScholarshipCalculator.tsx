'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight, Loader2, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScholarshipCalculator({ isOpen, onClose }: CalculatorProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    nationality: '',
    income: '',
    level: ''
  });

  const handleNext = () => setStep(step + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // STRATEGY NOTE: 
    // This is where you would call your API to save the lead to ConvertKit/MailerLite.
    // Example: await fetch('/api/lead-capture', { method: 'POST', body: JSON.stringify({ email, ...formData }) });
    
    // Simulate API delay for UX
    setTimeout(() => {
      setLoading(false);
      setStep(5); // Move to Success Screen
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-1 bg-white/50 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-orange-50 p-6 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calculator className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Scholarship Eligibility</h3>
              <p className="text-xs text-gray-600">Step {step > 4 ? 4 : step} of 4</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Nationality */}
            {step === 1 && (
              <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <h4 className="text-lg font-bold mb-4">Where are you from?</h4>
                <div className="space-y-3">
                  {['Morocco', 'Tunisia', 'Algeria', 'Egypt', 'Other'].map((country) => (
                    <button
                      key={country}
                      onClick={() => { setFormData({ ...formData, nationality: country }); handleNext(); }}
                      className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all font-medium text-gray-700 flex justify-between items-center group"
                    >
                      {country}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-orange-500 transition-opacity" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Income */}
            {step === 2 && (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <h4 className="text-lg font-bold mb-4">Family Annual Income (Approx.)</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Less than €10,000', value: 'low', subtitle: 'Likely full scholarship' },
                    { label: '€10,000 - €23,000', value: 'mid', subtitle: 'Partial scholarship likely' },
                    { label: 'More than €23,000', value: 'high', subtitle: 'Merit-based only' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setFormData({ ...formData, income: opt.value }); handleNext(); }}
                      className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
                    >
                      <div className="font-medium text-gray-900">{opt.label}</div>
                      <div className="text-xs text-gray-500 group-hover:text-orange-600">{opt.subtitle}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Degree */}
            {step === 3 && (
              <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <h4 className="text-lg font-bold mb-4">Degree Level</h4>
                <div className="space-y-3">
                  {['Bachelor\'s Degree (Laurea)', 'Master\'s Degree (Laurea Magistrale)'].map((level) => (
                    <button
                      key={level}
                      onClick={() => { setFormData({ ...formData, level: level }); handleNext(); }}
                      className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all font-medium text-gray-700"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Email Capture (The Gate) */}
            {step === 4 && (
              <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-black text-gray-900">You are eligible!</h4>
                  <p className="text-gray-600 mt-2 text-sm">
                    Based on your profile, you could qualify for up to <span className="font-bold text-green-600">€7,200/year</span> in scholarships + free housing.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Where should we send your custom report?</label>
                    <Input 
                      type="email" 
                      required 
                      placeholder="best@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-lg bg-gray-50"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200">
                    {loading ? <Loader2 className="animate-spin" /> : 'Reveal My Scholarships'}
                  </Button>
                  <p className="text-[10px] text-center text-gray-400">
                    We'll also send you our 2026 Visa-Proof Checklist PDF.
                  </p>
                </form>
              </motion.div>
            )}

            {/* STEP 5: Success & Upsell */}
            {step === 5 && (
              <motion.div key="step5" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-2">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Check your email!</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  We've sent your custom calculation and the Visa Checklist to <strong>{email}</strong>.
                </p>
                
                {/* THE UPSELL (Tier 1 Product) */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                    ONE-TIME OFFER
                  </div>
                  <h4 className="font-bold text-blue-900 mt-2 pr-16">Don't want to guess?</h4>
                  <p className="text-sm text-blue-800 mt-1 mb-3 leading-relaxed">
                    Get the exact <span className="font-bold">Motivation Letter templates</span> and <span className="font-bold">Bank Statement samples</span> I used to win my scholarship.
                  </p>
                  <Button 
                    variant="default"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white flex justify-between items-center h-auto py-3"
                    onClick={() => window.location.href = '/products/visa-kit'} // Update link
                  >
                    <span>Get the Visa-Proof Kit</span>
                    <span className="flex items-center opacity-90">€19 <ArrowRight className="w-4 h-4 ml-1" /></span>
                  </Button>
                </div>

                <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 underline">
                  No thanks, I'll figure it out myself
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}