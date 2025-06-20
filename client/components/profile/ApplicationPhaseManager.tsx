import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Route, Pen, Loader2 } from 'lucide-react';
import { updatePublicMetadata } from '@/lib/actions/updateMetadata';
import ApplicationPhaseModal from './ApplicationPhaseModal'; // Import the modal component

const ApplicationPhaseManager = () => {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);

  // Map phase IDs to display names
  const getPhaseDisplayName = (phaseId: string) => {
    const phaseMap: Record<string, string> = {
      'research': 'Just starting, research phase',
      'shortlisting': 'Shortlisting colleges, planning tests',
      'finalizing': 'Tests done, finalising shortlist',
      'applied': 'Applied to a few colleges',
      'awaiting': 'Applications done, awaiting admit',
      'admits': 'Admits received'
    };
    return phaseMap[phaseId] || phaseId;
  };

  const handleModalUpdate = async (newPhase: string) => {
    if (!user) return;

    try {
      await updatePublicMetadata({ applicationPhase: newPhase });
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const currentPhase = user?.publicMetadata?.applicationPhase as string;
  const displayValue = currentPhase ? getPhaseDisplayName(currentPhase) : 'Not set';

  return (
    <>
      <div className="flex items-start justify-between py-2 px-3 hover:bg-orange-50 rounded-lg group">
        <div className="flex items-start space-x-2 min-w-0 flex-1">
          <Route className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="text-xs text-slate-500 font-medium block mb-1">Application Phase:</span>
            <span className={`text-sm font-semibold ${displayValue === 'Not set' ? 'text-slate-500 italic' : 'text-slate-800'}`}>
              {displayValue}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowModal(true)}
            className="p-1 hover:bg-blue-100 rounded"
            title="Edit Application Phase"
          >
            <Pen className="w-3 h-3 text-slate-500 hover:text-blue-600" />
          </button>
        </div>
      </div>

      <ApplicationPhaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        currentPhase={currentPhase || ''}
        onUpdate={handleModalUpdate}
      />
    </>
  );
};

export { ApplicationPhaseManager };