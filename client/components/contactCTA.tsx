'use client';

import React, { useState } from 'react';
import { BookOpen, Calendar, Mail, ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactCTA = () => {
  const [email, setEmail] = useState('');

  const handleBookingClick = () => {
    // Analytics tracking
    window.gtag?.('event', 'click', {
      event_category: 'CTA',
      event_label: 'Calendly Booking - Contact Section',
      value: 47,
    });
  };

  return (
    <div className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-textPrimary">
          Ready to Start Your Italy Journey?
        </h2>
        <p className="mt-4 text-lg text-textSecondary font-medium">You Have 3 Options:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* 1. FREE OPTION */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col"
        >
          {/* <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-4">1️⃣ FREE: Read Guides</h3>
          <ul className="space-y-3 mb-8 flex-grow">
            <li className="flex items-start gap-2 text-sm text-textSecondary">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              Learn everything at your own pace
            </li>
            <li className="flex items-start gap-2 text-sm text-textSecondary">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              Start with "How I Won 25K in Scholarships"
            </li>
          </ul>
          <a
            href="https://studentitaly.gumroad.com/l/EtudierenItalie"
            className="w-full py-3 text-center font-bold text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all"
          >
            SEE ALL GUIDES
          </a> */}
          {/* 2. The Lead Magnet (Free PDF) */}
          {/* 2. The Lead Magnet (Free PDF) */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Free 2025 Guide</h3>
            <p className="text-slate-600 text-sm mb-4">
              Download our cheat sheet with IMAT cut-off scores for every medical school.
            </p>

            {/* Simple Email Capture Form */}
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors">
                Send me the PDF
              </button>
            </div>
          </div>
        </motion.div>

        {/* 2. PAID OPTION (FEATURED) */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-primary p-8 rounded-3xl shadow-hard border-4 border-secondary/30 flex flex-col relative"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">
            {/* Most Popular */}
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-white">2️⃣ GUIDED: Consultation</h3>
          <p className="text-white/90 font-bold mb-4 text-lg">€47 <span className="text-sm font-normal">/ 60-min</span></p>
          <ul className="space-y-3 mb-8 flex-grow">
            <li className="flex items-start gap-2 text-sm text-white/90">
              <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              I'll analyze your specific situation
            </li>
            <li className="flex items-start gap-2 text-sm text-white/90">
              <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              Match you with best universities
            </li>
            <li className="flex items-start gap-2 text-sm text-white/90">
              <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              Give you a precise action plan
            </li>
          </ul>
          <a
            href="https://calendly.com/dantema/dante-alighieri-consulting"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBookingClick}
            className="w-full py-4 text-center font-black bg-secondary text-white rounded-xl hover:bg-white hover:text-primary transition-all shadow-lg flex items-center justify-center gap-2"
          >
            BOOK NOW <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-center mt-4 text-xs font-bold text-white/70 animate-pulse">
            ⏰ Invest in you future, not just your application.
          </p>
        </motion.div>

        {/* 3. EMAIL OPTION */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-neutral-50 p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col"
        >
          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-4">3️⃣ UPDATES: Email List</h3>
          <ul className="space-y-3 mb-8 flex-grow">
            <li className="flex items-start gap-2 text-sm text-textSecondary">
              <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              Weekly scholarship alerts
            </li>
            <li className="flex items-start gap-2 text-sm text-textSecondary">
              <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              Application deadline reminders
            </li>
            <li className="flex items-start gap-2 text-sm text-textSecondary">
              <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              Free tips & templates
            </li>
          </ul>

          <div className="space-y-2">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="w-full py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-secondary transition-all">
              SUBSCRIBE FREE
            </button>
            <p className="text-[10px] text-center text-textSecondary mt-2">Join 500+ students already inside</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ContactCTA;