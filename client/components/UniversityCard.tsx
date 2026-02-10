import { MapPin, ArrowRight, Euro } from 'lucide-react';
import Link from 'next/link';

interface UniversityCardProps {
  university: {
    _id: string;
    name: string;
    location: string;
    admission_fee?: number;
    acceptance_rate?: string; // Optional field
  };
  index: number;
}

export default function UniversityCard({ university, index }: UniversityCardProps) {
  return (
    <div className="group relative p-6 hover:bg-slate-50 transition-colors">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        
        {/* Left: Info */}
        <div>
          {/* Badge for top results to make them look premium */}
          {index < 3 && (
            <span className="inline-block px-2 py-0.5 mb-2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
              Popular Choice
            </span>
          )}
          
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
            {university.name}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {university.location}
            </div>
            <div className="flex items-center gap-1">
              <Euro className="h-3.5 w-3.5" />
              {university.admission_fee ? `€${university.admission_fee} fee` : 'Free Application'}
            </div>
          </div>
        </div>

        {/* Right: Action */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3">
          {/* Fake "Insight" to build desire */}
          <div className="hidden sm:block text-right">
             <span className="block text-[10px] font-bold text-slate-400 uppercase">Acceptance</span>
             <span className="text-sm font-medium text-emerald-700">
               {university.acceptance_rate || 'High Probability'}
             </span>
          </div>

          <Link 
            href={`/university/${university.name}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-all"
          >
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}