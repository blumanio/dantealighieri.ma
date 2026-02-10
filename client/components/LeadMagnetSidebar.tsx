import { FileText, Calendar, CheckCircle } from 'lucide-react';

export default function LeadMagnetSidebar() {
  return (
    <>
      {/* 1. The Upsell (Consulting) - High Priority */}
      <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl ring-1 ring-white/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Limited Spots</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2">
          Worried about rejection?
        </h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          The bureaucracy in Italy is complex. Book a 20-min strategy call with an expert to review your documents.
        </p>
        
        <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" />
          Book Audit (€29)
        </button>
        
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Money-back guarantee</span>
        </div>
      </div>

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
    </>
  );
}