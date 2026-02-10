import { FileText, Calculator, ShieldCheck, GraduationCap, LucideIcon } from 'lucide-react';

export type LeadMagnetType = 'scholarship' | 'visa' | 'university' | 'general';

interface LeadMagnetConfig {
  title: string;
  description: string;
  buttonText: string;
  icon: LucideIcon;
  color: 'orange' | 'blue' | 'emerald' | 'purple';
  action: string;
}

export const LEAD_MAGNETS: Record<LeadMagnetType, LeadMagnetConfig> = {
  scholarship: {
    title: "Calculate Your Scholarship Odds",
    description: "Find out exactly how much you can get from ERSU, DSU, and MAECI based on your profile.",
    buttonText: "Open Calculator",
    icon: Calculator,
    color: "orange",
    action: "open_calculator"
  },
  visa: {
    title: "The Visa-Proof Checklist",
    description: "Don't get rejected. Download the exact list of bank documents required for 2026.",
    buttonText: "Get the Checklist",
    icon: ShieldCheck,
    color: "blue",
    action: "download_visa_pdf"
  },
  university: {
    title: "Top 10 English Med-Schools",
    description: "A curated list of universities with the highest acceptance rates for non-EU students.",
    buttonText: "Unlock List",
    icon: GraduationCap,
    color: "emerald",
    action: "signup_university"
  },
  general: {
    title: "Free Italy Student Guide",
    description: "Join 100+ students getting weekly tips on surviving and thriving in Italy.",
    buttonText: "Join Newsletter",
    icon: FileText,
    color: "purple",
    action: "signup_general"
  }
};