import React, { useState, useEffect } from 'react';
import {
  Search, Clock, Award, Mail, FileText, X, Loader2, Pen, Route, Check
  , CheckCircle
} from 'lucide-react'
interface ApplicationPhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhase?: string;
  onUpdate: (phase: string) => Promise<void>;
}

const ApplicationPhaseModal: React.FC<ApplicationPhaseModalProps> = ({ isOpen, onClose, currentPhase, onUpdate }) => {
  const [selectedPhase, setSelectedPhase] = useState(currentPhase || '');
  const [isLoading, setIsLoading] = useState(false);

  const phases = [
    {
      id: 'research',
      title: 'Just starting, research phase',
      icon: Search,
      description: 'Exploring options and gathering information'
    },
    {
      id: 'shortlisting',
      title: 'Shortlisting colleges, planning tests',
      icon: CheckCircle,
      description: 'Narrowing down choices and preparing for exams'
    },
    {
      id: 'finalizing',
      title: 'Tests done, finalising shortlist',
      icon: Clock,
      description: 'Completed tests, making final decisions'
    },
    {
      id: 'applied',
      title: 'Applied to a few colleges',
      icon: FileText,
      description: 'Submitted applications, waiting for responses'
    },
    {
      id: 'awaiting',
      title: 'Applications done, awaiting admit',
      icon: Mail,
      description: 'All applications submitted, waiting for decisions'
    },
    {
      id: 'admits',
      title: 'Admits received',
      icon: Award,
      description: 'Received acceptance letters from colleges'
    }
  ];

  useEffect(() => {
    setSelectedPhase(currentPhase || '');
  }, [currentPhase]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await onUpdate(selectedPhase);
      onClose();
    } catch (error) {
      console.error('Failed to update phase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Journey So Far</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Where are you in your study abroad journey?
          </p>

          <div className="space-y-3">
            {phases.map((phase) => {
              const IconComponent = phase.icon;
              const isSelected = selectedPhase === phase.id;

              return (
                <div
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase.id)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`
                      p-2 rounded-lg flex-shrink-0
                      ${isSelected
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-gray-100 text-gray-500'
                      }
                    `}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`
                        text-sm font-medium
                        ${isSelected ? 'text-orange-900' : 'text-gray-900'}
                      `}>
                        {phase.title}
                      </h3>
                      <p className={`
                        text-xs mt-1
                        ${isSelected ? 'text-orange-700' : 'text-gray-500'}
                      `}>
                        {phase.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleUpdate}
            disabled={isLoading || !selectedPhase}
            className="
              px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg
              hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200 flex items-center space-x-2
            "
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Update</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPhaseModal;