// components/university-hub/EntranceExamsTab.tsx
'use client';

import React, { useState } from 'react';
import {
  FileText, AlertTriangle, ExternalLink, ChevronDown,
  ChevronUp, Clock, Globe, BookOpen, GraduationCap,
  CalendarDays, DollarSign, Monitor, Info
} from 'lucide-react';

interface EntranceExamsTabProps {
  universityName: string;
  universitySlug: string;
}

interface ExamSection {
  id: string;
  title: string;
  tag?: string;
  tagColor?: string;
  description: string;
  details: { label: string; value: string; icon: React.ElementType }[];
  sections?: string[];
  tips?: string[];
  links?: { label: string; url: string }[];
}

const EXAM_DATA: ExamSection[] = [
  {
    id: 'cent-s',
    title: 'CEnT-S (CISIA English Test — Sciences)',
    tag: 'NEW FOR 2025-26',
    tagColor: 'bg-red-100 text-red-700 border-red-200',
    description:
      'The CEnT-S replaces the English TOLC-I, TOLC-E, and TOLC-F starting late 2025. This is now the single unified entrance exam for English-taught bachelor\'s degrees in science, engineering, economics, and healthcare across Italy.',
    details: [
      { label: 'Questions', value: '55 multiple-choice', icon: FileText },
      { label: 'Duration', value: '1 hour 50 minutes', icon: Clock },
      { label: 'Fee', value: '€55', icon: DollarSign },
      { label: 'Language', value: 'English only', icon: Globe },
      { label: 'Format', value: '@UNI (in-person) or @HOME (remote)', icon: Monitor },
      { label: 'Frequency', value: 'Multiple dates per period (4 periods/year)', icon: CalendarDays },
    ],
    sections: [
      'Mathematics — 15 questions',
      'Reasoning on texts and data — 15 questions',
      'Biology — 10 questions',
      'Chemistry — 10 questions',
      'Physics — 5 questions',
    ],
    tips: [
      'No English language section — you still need IELTS/TOEFL separately.',
      'Period 1 and 2 results are safest for non-EU visa applicants. Period 3 (June 30 results) is often too late for visa processing.',
      'Some universities (Politecnico di Milano, Bologna) accept SAT scores (1200+) as a substitute — check the admission call.',
      'You can take CEnT-S at any university and use the score everywhere in Italy.',
      'Registration closes 5-7 days before the exam at 14:00 CET.',
    ],
    links: [
      { label: 'Official CISIA Registration', url: 'https://www.cisiaonline.it/' },
    ],
  },
  {
    id: 'tolc',
    title: 'TOLC (Test OnLine CISIA) — Italian-language exams',
    description:
      'TOLC exams are still used for Italian-taught programs. There are multiple types depending on your field of study. Each university specifies which TOLC you need in their admission notice (bando).',
    details: [
      { label: 'Fee', value: '€35 (2026)', icon: DollarSign },
      { label: 'Language', value: 'Italian (+ English section)', icon: Globe },
      { label: 'Format', value: '@UNI or @HOME', icon: Monitor },
      { label: 'Limit', value: 'Max 1 per type per month', icon: CalendarDays },
    ],
    sections: [
      'TOLC-I — Engineering & technical fields (Math, Logic, Science, Verbal)',
      'TOLC-E — Economics (Logic, Verbal, Math)',
      'TOLC-F — Pharmacy (Biology, Chemistry, Math, Physics, Logic)',
      'TOLC-S — Sciences (Math, Reasoning, Biology, Chemistry, Physics, Earth Sciences)',
      'TOLC-B — Biology (Math, Biology, Physics, Chemistry)',
      'TOLC-SU — Humanities (Italian comprehension, General knowledge, Logic)',
      'TOLC-AV — Agriculture & Veterinary',
      'TOLC-PSI — Psychology',
    ],
    tips: [
      'TOLC scores are valid nationally — take it at any university, use it anywhere.',
      'For open-access programs, a low TOLC score doesn\'t block enrollment but assigns OFA (additional learning requirements).',
      'For restricted-access programs, your TOLC score determines your ranking position.',
      'You can retake each TOLC type once per month — the best score counts.',
    ],
    links: [
      { label: 'TOLC Calendar & Registration', url: 'https://www.cisiaonline.it/' },
    ],
  },
  {
    id: 'medicine',
    title: 'Medicine & Dentistry — 2025-26 Reform',
    tag: 'MAJOR CHANGE',
    tagColor: 'bg-amber-100 text-amber-700 border-amber-200',
    description:
      'Starting in 2025-26, the traditional multiple-choice entrance exam for Medicine is GONE. Italy has replaced it with a "filter semester" system. All students can enroll in the first semester, but progression depends on exam results and a national ranking.',
    details: [
      { label: 'Old system', value: 'Single entrance exam → eliminated', icon: FileText },
      { label: 'New system', value: 'Filter semester + national ranking', icon: GraduationCap },
      { label: 'Admission caps', value: 'Still in place — limited spots remain', icon: AlertTriangle },
    ],
    sections: [
      'Step 1: Enroll in the first semester (open to all who meet prerequisites)',
      'Step 2: Take first-semester exams at your university',
      'Step 3: Your earned credits generate a score for the national ranking',
      'Step 4: National ranking determines who advances to the second semester',
      'Step 5: If you don\'t make the cut, credits transfer to other programs',
    ],
    tips: [
      'This is brand new — most students and even some universities are still figuring out the details.',
      'The IMAT (for English-taught Medicine) may follow different rules — check each private university separately.',
      'Private universities (San Raffaele, Cattolica, Humanitas) still run their own admission tests.',
      'If you\'re applying from outside the EU, you may still need Universitaly pre-enrollment.',
    ],
  },
  {
    id: 'imat',
    title: 'IMAT (International Medical Admissions Test)',
    description:
      'The IMAT is specifically for admission to English-taught Medicine and Dentistry at Italian public universities. Conducted entirely in English, it is extremely competitive.',
    details: [
      { label: 'Language', value: 'English', icon: Globe },
      { label: 'Subjects', value: 'Biology, Chemistry, Physics, Math, Logic', icon: BookOpen },
      { label: 'Format', value: 'Paper-based, at test centers', icon: FileText },
      { label: 'When', value: 'Typically September (check MUR)', icon: CalendarDays },
    ],
    tips: [
      'With the 2025-26 Medicine reform, the future of IMAT for public universities is uncertain. Monitor official MUR announcements.',
      'Private universities running English Medicine programs have their own separate entrance tests.',
      'Competition is extreme: some programs accept only 5-10% of applicants.',
    ],
  },
  {
    id: 'phd',
    title: 'PhD Admissions (Dottorato di Ricerca)',
    description:
      'PhD programs in Italy are fully funded (approximately €16,243/year as of 2025). Each university publishes its own "bando" (call for applications) with specific requirements. There is no national entrance exam.',
    details: [
      { label: 'Funding', value: '~€16,243/year (fully funded)', icon: DollarSign },
      { label: 'Duration', value: '3-4 years', icon: Clock },
      { label: 'Application', value: 'University-specific bando', icon: FileText },
      { label: 'Typical deadline', value: 'May-July for October start', icon: CalendarDays },
    ],
    tips: [
      'Each university sets its own process — some require research proposals, interviews, or written exams.',
      'Check Euraxess (euraxess.ec.europa.eu) for aggregated PhD listings across Europe.',
      'Many PhD programs accept international candidates and conduct interviews in English.',
      'MAECI scholarships can also fund PhD research.',
      'Contact potential supervisors BEFORE applying. A professor who wants you dramatically increases your chances.',
    ],
    links: [
      { label: 'Euraxess PhD Listings', url: 'https://euraxess.ec.europa.eu/' },
    ],
  },
];

const ExamCard: React.FC<{ exam: ExamSection }> = ({ exam }) => {
  const [expanded, setExpanded] = useState(exam.id === 'cent-s');

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
            <FileText className="h-5 w-5 text-slate-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900">{exam.title}</h3>
              {exam.tag && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${exam.tagColor}`}>
                  {exam.tag}
                </span>
              )}
            </div>
            {!expanded && (
              <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{exam.description}</p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 ml-3">
          {expanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <p className="text-sm text-slate-600 leading-relaxed mt-4 mb-5">{exam.description}</p>

          {/* Key details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {exam.details.map((detail, i) => {
              const Icon = detail.icon;
              return (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{detail.label}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800">{detail.value}</p>
                </div>
              );
            })}
          </div>

          {/* Structure / Steps */}
          {exam.sections && exam.sections.length > 0 && (
            <div className="mb-5">
              <h4 className="text-sm font-bold text-slate-800 mb-2">
                {exam.id === 'medicine' ? 'How It Works' : 'Exam Structure'}
              </h4>
              <div className="space-y-1.5">
                {exam.sections.map((section, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="flex-shrink-0 w-5 h-5 bg-slate-200 rounded text-xs font-bold text-slate-600 flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{section}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {exam.tips && exam.tips.length > 0 && (
            <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" /> What Most Students Don't Know
              </h4>
              <ul className="space-y-2">
                {exam.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-amber-900 flex items-start gap-2">
                    <span className="text-amber-500 mt-1 flex-shrink-0">→</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          {exam.links && exam.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {exam.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const EntranceExamsTab: React.FC<EntranceExamsTabProps> = ({ universityName, universitySlug }) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-amber-100 rounded-xl">
          <FileText className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Entrance Exams</h2>
          <p className="text-sm text-slate-500">TOLC, CEnT-S, Medicine, and PhD admission requirements</p>
        </div>
      </div>

      {/* Update banner */}
      <div className="my-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-red-900 text-sm">Major Changes for 2025-26</h4>
          <p className="text-sm text-red-800 mt-1">
            The English TOLC has been replaced by <strong>CEnT-S</strong>. The Medicine entrance exam has been
            replaced by a <strong>filter semester</strong> system. Most online guides are outdated.
            The information below reflects the latest 2026 requirements.
          </p>
        </div>
      </div>

      {/* Exam cards */}
      <div className="space-y-3">
        {EXAM_DATA.map(exam => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 p-5 bg-slate-900 rounded-xl text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm">Confused about which exam you need?</h4>
            <p className="text-slate-400 text-xs mt-1">
              The exam depends on your program, language, and university.
              The Italy System course includes a complete exam matching guide.
            </p>
          </div>
          <a
            href="/en/shop"
            className="flex-shrink-0 px-5 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Get The Italy System →
          </a>
        </div>
      </div>
    </div>
  );
};

export default EntranceExamsTab;