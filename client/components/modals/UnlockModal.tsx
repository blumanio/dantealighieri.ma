import React from 'react';
import { Zap, Star } from 'lucide-react';

interface UnlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName: string; // e.g., "Shortlist Slots"
    xpToUnlock?: number; // XP needed for next unlock
    currentXp?: number;
}

export const UnlockModal = ({ isOpen, onClose, featureName, xpToUnlock, currentXp }: UnlockModalProps) => {
    if (!isOpen) return null;

    const xpNeeded = xpToUnlock && currentXp ? xpToUnlock - currentXp : 0;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
                <Star className="h-12 w-12 mx-auto text-amber-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Unlock More {featureName}</h2>
                <p className="text-slate-600 mb-6">
                    You've reached your limit. Choose how you want to continue your journey.
                </p>

                <div className="space-y-4">
                    {/* Option 1: Upgrade Tier */}
                    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 rounded-xl">
                        Upgrade to Esploratore
                    </button>

                    {/* Option 2: Unlock with XP */}
                    {xpToUnlock && xpNeeded > 0 && (
                        <div className="text-center">
                            <p className="font-semibold">Or earn your way!</p>
                            <p className="text-sm text-slate-500">
                                Earn <span className="font-bold">{xpNeeded} more XP</span> to unlock the next slot.
                            </p>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                                <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: `${(currentXp! / xpToUnlock) * 100}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={onClose} className="mt-6 text-sm font-medium text-slate-500">
                    Maybe later
                </button>
            </div>
        </div>
    );
};