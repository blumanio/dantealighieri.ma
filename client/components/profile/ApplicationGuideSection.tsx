'use client';

import React, { useState, useEffect } from 'react';
import { italyChecklistData as checklistDataMock } from '@/lib/italyChecklistData';
import {
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Circle,
    Clock,
    AlertCircle,
    Trophy,
    Target,
    Calendar,
    Users,
    BookOpen,
    Sparkles,
    ArrowRight,
    Info
} from 'lucide-react';
import ChecklistItemUI from './ChecklistItemUI';
// import type { ChecklistPhase } from '@/app/[lang]/profile/[[...userProfile]]/page';

interface ApplicationGuideSectionProps {
    checklistData: any
    onToggleItem: (phaseId: string, itemId: string, subItemId?: string) => void;
    onPhaseToggle: (phaseId: string) => void; // This is the prop, not the local state setter
    t: (namespace: string, key: string) => string;
    language: string;
}

const ApplicationGuideSection: React.FC<ApplicationGuideSectionProps> = ({
    checklistData: initialChecklistData, // Renamed to avoid conflict with local state
    onToggleItem:onToggleItem,
    onPhaseToggle: parentOnPhaseToggle, // Renamed to avoid conflict with local handler
    t,
    language
}) => {
    const [activePhase, setActivePhase] = useState<string | null>(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [checklistData, setChecklistData] = useState(initialChecklistData); // Local state for checklist data

    // Update local state when initialChecklistData prop changes
    useEffect(() => {
        setChecklistData(initialChecklistData);
    }, [initialChecklistData]);

    // Calculate overall progress
    const calculateProgress = () => {
        const totalItems = checklistData?.reduce((acc, phase) => acc + phase.items.length, 0);
        const completedItems = checklistData?.reduce((acc, phase) =>
            acc + phase.items.filter(item => item.completed).length, 0
        );
        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    };

    // Calculate phase progress
    const calculatePhaseProgress = (phase: any) => { // Changed ChecklistPhase to any for broader compatibility
        const totalItems = phase.items.length;
        const completedItems = phase.items.filter(item => item.completed).length;
        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    };

    // Get phase status
    const getPhaseStatus = (phase: any) => { // Changed ChecklistPhase to any for broader compatibility
        const progress = calculatePhaseProgress(phase);
        if (progress === 100) return 'completed';
        if (progress > 0) return 'in-progress';
        return 'not-started';
    };
    console.log('checklistData',checklistData)
    // Get next action item
    const getNextAction = () => {
        for (const phase of checklistData) {
            const nextItem = phase.items.find(item => !item.completed);
            if (nextItem) {
                return { phase: phase.id, item: nextItem };
            }
        }
        return null;
    };

    const overallProgress = calculateProgress();
    const nextAction = getNextAction();

    // --- Start of the missing onPhaseToggle logic ---
    const handlePhaseToggle = (phaseId: string) => {
        // Toggle active phase for UI expansion/collapse
        setActivePhase(activePhase === phaseId ? null : phaseId);

        // Call the parent's onPhaseToggle if it's provided,
        // which might handle updating the checklist data in a parent component
        parentOnPhaseToggle(phaseId);
    };
    // --- End of the missing onPhaseToggle logic ---

    // Auto-expand current phase
    useEffect(() => {
        if (nextAction && !activePhase) {
            setActivePhase(nextAction.phase);
        }
    }, [nextAction, activePhase]);

    // Celebration effect
    useEffect(() => {
        if (overallProgress === 100) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
        }
    }, [overallProgress]);

    const phaseIcons = {
        research: BookOpen,
        application: Target,
        documentation: Users,
        preparation: Calendar,
        arrival: Trophy
    };
    const handleToggleItem = (phaseId: string, itemId: string, subItemId?: string) => {
        setChecklistData(currentData =>
            currentData.map(phase => {
                if (phase.id !== phaseId) {
                    return phase;
                }
                const updatedItems = phase.items.map(item => {
                    if (item.id !== itemId) {
                        return item;
                    }
                    return { ...item, completed: !item.completed };
                });
                return { ...phase, items: updatedItems };
            })
        );
        // Also call the parent's onToggleItem for external state updates
        onToggleItem(phaseId, itemId, subItemId);
    };


    return (
        <div className="relative bg-white">
            {/* Celebration Overlay */}
            {showCelebration && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 z-10 rounded-2xl flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl text-center animate-bounce">
                        <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-gray-900">🎉 Congratulations!</h3>
                        <p className="text-gray-600">You've completed your study abroad checklist!</p>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">
                            {t('profile', 'applicationGuideTitle')}
                        </h2>
                        <p className="text-blue-100 text-sm">
                            {t('profile', 'applicationGuideSubtitle')}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">{overallProgress}%</div>
                        <div className="text-xs text-blue-100">Complete</div>
                    </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="bg-white/20 rounded-full h-3 mb-4">
                    <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>

                {/* Next Action Card */}
                {nextAction && (
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-400 rounded-full p-2">
                                <Target className="w-4 h-4 text-yellow-900" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium">Next Step</div>
                                <div className="text-xs text-blue-100 truncate">
                                    {nextAction.item.title || 'Continue your journey'}
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                )}
            </div>

            {/* Phase List */}
            <div className="bg-white rounded-b-2xl overflow-hidden">
                {checklistData.map((phase, phaseIndex) => {
                    const phaseProgress = calculatePhaseProgress(phase);
                    const phaseStatus = getPhaseStatus(phase);
                    const isActive = activePhase === phase.id;
                    const PhaseIcon = phaseIcons[phase.id as keyof typeof phaseIcons] || BookOpen;

                    return (
                        <div key={phase.id} className="border-b border-gray-100 last:border-b-0">
                            {/* Phase Header */}
                            <button
                                onClick={() => handlePhaseToggle(phase.id)}
                                className={`w-full p-6 text-left transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 border-l-4 border-blue-500'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Phase Icon & Status */}
                                    <div className="relative">
                                        <div className={`p-3 rounded-xl ${phaseStatus === 'completed'
                                            ? 'bg-green-100 text-green-600'
                                            : phaseStatus === 'in-progress'
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {phaseStatus === 'completed' ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                <PhaseIcon className="w-5 h-5" />
                                            )}
                                        </div>
                                        {phaseStatus === 'in-progress' && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
                                        )}
                                    </div>

                                    {/* Phase Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                {t('profile', 'applicationGuidePhase')} {phaseIndex + 1}
                                            </span>
                                            {phaseStatus === 'completed' && (
                                                <Trophy className="w-4 h-4 text-yellow-500" />
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {t('profile', phase.titleKey)}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            {/* Progress Bar */}
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${phaseStatus === 'completed'
                                                        ? 'bg-green-500'
                                                        : 'bg-blue-500'
                                                        }`}
                                                    style={{ width: `${phaseProgress}%` }}
                                                />
                                            </div>
                                            {/* Progress Text */}
                                            <span className="text-xs text-gray-500 min-w-0">
                                                {phase.items.filter(item => item.completed).length}/{phase.items.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expand Icon */}
                                    <div className={`transform transition-transform duration-200 ${isActive ? 'rotate-90' : ''
                                        }`}>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </button>

                            {/* Phase Content */}
                            {isActive && (
                                <div className="bg-gray-50 px-6 pb-6">
                                    <div className="space-y-2">
                                        {phase.items.map((item: any, itemIndex: number) => (
                                            <div
                                                key={item.id}
                                                className={`bg-white rounded-lg border transition-all duration-200 ${item.completed
                                                    ? 'border-green-200 bg-green-50/50'
                                                    : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
                                                    }`}
                                            >
                                                <ChecklistItemUI
                                                    item={item}
                                                    onToggleItem={(itemId, subItemId) => handleToggleItem(phase.id, itemId, subItemId)} // Use local handler
                                                    t={t}
                                                    language={language}
                                                    isFirstIncomplete={!item.completed && itemIndex === phase.items.findIndex(i => !i.completed)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Phase Completion Message */}
                                    {phaseStatus === 'completed' && (
                                        <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-200">
                                            <div className="flex items-center gap-2 text-green-800">
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span className="font-medium">Phase Completed!</span>
                                            </div>
                                            <p className="text-sm text-green-700 mt-1">
                                                Great job! You've finished this phase of your study abroad journey.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Motivational Footer */}
                {overallProgress < 100 && (
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 text-center">
                        <div className="inline-flex items-center gap-2 text-purple-700 font-medium mb-2">
                            <Sparkles className="w-4 h-4" />
                            Keep Going!
                        </div>
                        <p className="text-sm text-purple-600">
                            You're {overallProgress}% of the way to studying in Italy.
                            Every step brings you closer to your dream!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationGuideSection;