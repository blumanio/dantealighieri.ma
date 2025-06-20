'use client';
import React, { useState } from 'react';
import { scholarships as scholarshipsData } from '@/lib/scholarshipsData'; // Renamed to avoid conflict

// --- Type Definitions ---

// Individual item types for arrays within the main scholarship object
interface BreakdownItem {
  status: string;
  isee: string;
  amount: string;
  services: string;
}

interface MeritItem {
  year: string;
  requirement: string;
}

interface TimelineItem {
  date: string;
  event: string;
  description: string;
}

interface Tier {
  name: string;
  popular?: boolean;
  price: string;
  features: string[];
  cta: string;
}

interface SuccessStory {
  name: string;
  story: string;
}

// The main Scholarship type
export interface Scholarship {
  id: number | string;
  title: string;
  provider: string;
  amount: string;
  keyInfo: {
    applicationDeadline: string;
  };
  overview: {
    description: string;
    valueHighlight: string;
  };
  financials: {
    breakdown: BreakdownItem[];
    additionalBenefits: string[];
  };
  eligibility: {
    merit: MeritItem[];
    bonus: string;
    economic: string;
  };
  application: {
    timeline: TimelineItem[];
    documents: {
      all: string[];
      international: string[];
    };
  };
  universities: string[];
  premiumServices: {
    title: string;
    description: string;
    contactLink: string;
    tiers: Tier[];
    successStories: SuccessStory[];
  };
  link: string;
  eligibilitySummary: string; // Added for displaying in the card
}

// Props types for the components
interface ScholarshipModalProps {
  scholarship: Scholarship;
  onClose: () => void;
}

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onOpen: (scholarship: Scholarship) => void;
}


// --- Icon Components (unchanged) ---
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const ExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;

// --- Scholarship Modal Component ---
const ScholarshipModal = ({ scholarship, onClose }: ScholarshipModalProps) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Financial Details', 'Eligibility & Merit', 'Application Guide', 'Universities', 'Premium Support'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div>
            <p className="text-gray-700 leading-relaxed">{scholarship.overview.description}</p>
            <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
              <p className="font-semibold text-indigo-800">Value Highlight:</p>
              <p className="text-indigo-700">{scholarship.overview.valueHighlight}</p>
            </div>
          </div>
        );
      case 'Financial Details':
        return (
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-3">Scholarship Value Breakdown</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISEE Range</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scholarship.financials.breakdown.map((item: BreakdownItem, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.status}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.isee}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-semibold">{item.amount}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.services}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mt-6 mb-3">Additional Benefits</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {scholarship.financials.additionalBenefits.map((benefit: string, i: number) => <li key={i}>{benefit}</li>)}
            </ul>
          </div>
        );
      case 'Eligibility & Merit':
        return (
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-3">Merit Requirements (by August 10th)</h4>
            <ul className="space-y-3 mb-6">
              {scholarship.eligibility.merit.map((item: MeritItem, i: number) => (
                <li key={i} className="p-3 bg-gray-50 rounded-md">
                  <p className="font-semibold text-gray-800">{item.year}:</p>
                  <p className="text-gray-600">{item.requirement}</p>
                </li>
              ))}
            </ul>
            <h4 className="text-lg font-bold text-gray-800 mb-3">Bonus Credits</h4>
            <p className="text-gray-700 mb-6">{scholarship.eligibility.bonus}</p>
            <h4 className="text-lg font-bold text-gray-800 mb-3">Economic Requirements</h4>
            <p className="text-gray-700">{scholarship.eligibility.economic}</p>
          </div>
        );
      case 'Application Guide':
        return (
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Application Timeline</h4>
            <div className="space-y-4 border-l-2 border-indigo-200 pl-4">
              {scholarship.application.timeline.map((item: TimelineItem, i: number) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[26px] top-1 h-4 w-4 bg-indigo-500 rounded-full border-2 border-white"></div>
                  <p className="font-bold text-indigo-700">{item.date}</p>
                  <p className="font-semibold text-gray-800">{item.event}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>

            <h4 className="text-lg font-bold text-gray-800 mt-8 mb-4">Required Documents Checklist</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">All Students</h5>
                <ul className="space-y-2">
                  {scholarship.application.documents.all.map((doc: string, i: number) => <li key={i} className="flex items-start"><CheckCircleIcon /><span>{doc}</span></li>)}
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">International / Non-Resident Students</h5>
                <ul className="space-y-2">
                  {scholarship.application.documents.international.map((doc: string, i: number) => <li key={i} className="flex items-start"><CheckCircleIcon /><span>{doc}</span></li>)}
                </ul>
              </div>
            </div>
          </div>
        );
      case 'Universities':
        return (
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-3">Eligible Universities in {scholarship.provider.replace('Government', '')}</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
              {scholarship.universities.map((uni: string, i: number) => <li key={i} className="flex items-center"><CheckCircleIcon />{uni}</li>)}
            </ul>
          </div>
        );
      // case 'Premium Support':
      //   const { premiumServices } = scholarship;
      //   return (
      //     <div className="bg-gray-50 p-6 rounded-lg">
      //       <div className="text-center">
      //         <h3 className="text-3xl font-extrabold text-indigo-900">{premiumServices.title}</h3>
      //         <p className="mt-2 max-w-2xl mx-auto text-gray-600">{premiumServices.description}</p>
      //       </div>

      //       <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      //         {premiumServices.tiers.map((tier: Tier) => (
      //           <div key={tier.name} className={`rounded-xl border ${tier.popular ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'} bg-white shadow-lg flex flex-col`}>
      //             {tier.popular && <div className="text-center py-1 bg-indigo-500 text-white font-bold text-sm rounded-t-xl">Most Popular</div>}
      //             <div className="p-6 flex-grow">
      //               <h4 className="text-2xl font-bold text-center text-gray-900">{tier.name}</h4>
      //               <p className="mt-2 text-4xl font-extrabold text-center text-gray-900">{tier.price}</p>
      //               <ul className="mt-6 space-y-3 text-gray-600">
      //                 {tier.features.map((feature: string) => (
      //                   <li key={feature} className="flex items-start">
      //                     <CheckCircleIcon />
      //                     <span dangerouslySetInnerHTML={{ __html: feature.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
      //                   </li>
      //                 ))}
      //               </ul>
      //             </div>
      //             <div className="p-6 bg-gray-50 rounded-b-xl mt-auto">
      //               <a href={premiumServices.contactLink} className={`w-full text-center block font-bold py-3 px-6 rounded-lg transition-colors ${tier.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}>
      //                 {tier.cta}
      //               </a>
      //             </div>
      //           </div>
      //         ))}
      //       </div>

      //       <div className="mt-12">
      //         {/* <h4 className="text-2xl font-bold text-center text-gray-800">Don't Just Apply. Succeed.</h4>
      //         <p className="text-center text-gray-600 mt-2">See how we've helped students just like you.</p> */}
      //         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      //           {premiumServices.successStories.map((story: SuccessStory, i: number) => (
      //             <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
      //               <p className="font-bold text-gray-700">{story.name}</p>
      //               <div className="flex my-1"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
      //               <p className="text-sm text-gray-600 italic">"{story.story}"</p>
      //               <p className="text-xs text-right mt-2 text-gray-400">- Illustrative Example</p>
      //             </div>
      //           ))}
      //         </div>
      //       </div>
      //     </div>
      //   );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 sticky top-0 bg-white border-b z-10 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{scholarship.title}</h2>
              <p className="text-lg font-semibold text-indigo-600">{scholarship.provider}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="py-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};


const ScholarshipCard = ({ scholarship, onOpen }: ScholarshipCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl mb-8 border border-gray-100">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div>
            <p className="text-md font-semibold text-indigo-600">{scholarship.provider}</p>
            <h3 className="text-2xl font-bold text-gray-900">{scholarship.title}</h3>
          </div>
          <div className="mt-3 sm:mt-0 text-left sm:text-right flex-shrink-0">
            <p className="text-2xl font-bold text-green-600">{scholarship.amount}</p>
            <p className="text-sm text-gray-500">Full tuition + Services</p>
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Main Benefits</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center text-gray-700"><BookOpenIcon /> Tuition Fee Exemption</div>
            <div className="flex items-center text-gray-700"><HomeIcon /> Accommodation Support</div>
            <div className="flex items-center text-gray-700"><CashIcon /> Living Stipend</div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center font-semibold text-red-600">
          <CalendarIcon />
          <span className="ml-2">Deadline: {scholarship.keyInfo.applicationDeadline}</span>
        </div>
        <button
          onClick={() => onOpen(scholarship)}
          className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105"
        >
          View Details & Apply
        </button>
      </div>
    </div>
  );
};

// Assuming the data imported as `scholarshipsData` is an array of `Scholarship`
// Ensure all scholarships have the required structure, especially eligibility.merit as an array
const scholarships = scholarshipsData
  .filter(
    (s: any) =>
      s.eligibility &&
      Array.isArray(s.eligibility.merit)
  )
  .map((s: any) => ({
    ...s,
    link: s.link ?? "#",
    eligibilitySummary: s.eligibilitySummary ?? "",
    premiumServices: s.premiumServices ?? {
      title: "",
      description: "",
      contactLink: "",
      tiers: [],
      successStories: [],
    },
  })) as Scholarship[];

const ScholarshipsPage = () => {
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  const handleOpenModal = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
  };

  const handleCloseModal = () => {
    setSelectedScholarship(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Scholarships in Italy
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Your detailed guide to securing financial aid for your studies in Italy.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {scholarships.map((scholarship: Scholarship) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} onOpen={handleOpenModal} />
          ))}
        </div>
      </div>

      {selectedScholarship && <ScholarshipModal scholarship={selectedScholarship} onClose={handleCloseModal} />}
    </div>
  );
};

export default ScholarshipsPage;