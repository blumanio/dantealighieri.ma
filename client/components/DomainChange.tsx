'use client';
import { useState, useEffect } from 'react';
import { X, ExternalLink, Check } from 'lucide-react';

export default function DomainChangePopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasVisited, setHasVisited] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Show popup only on first visit, after a short delay, and only on dantealighieri.ma domain
    useEffect(() => {
        // Only activate on the specific domain
        const currentDomain = window.location.hostname;
        console.log('Current domain:', currentDomain);  // Debugging line

        const isDanteAlighieriDomain = currentDomain === 'dantealighieri.ma' ||
            currentDomain.includes('dante');

        // Don't show popup if not on the target domain
        if (!isDanteAlighieriDomain) {
            console.log('Not on dantealighieri.ma domain, popup will not show.');
            return;
        }

        const timer = setTimeout(() => {
            // Check if this is user's first visit
            const isFirstVisit = !localStorage.getItem('has-visited-site');
            const hasAcknowledged = localStorage.getItem('domain-change-acknowledged');

            setHasVisited(!!hasAcknowledged);

            // Only show on first visit and if not already acknowledged
            if (isFirstVisit && !hasAcknowledged) {
                setIsOpen(true);
                // Mark that user has visited the site
                localStorage.setItem('has-visited-site', 'true');
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Handle countdown for auto-redirect
    useEffect(() => {
        let timer: any;
        if (isRedirecting && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (isRedirecting && countdown === 0) {
            // Redirect to the new domain
            window.location.href = "https://studentitaly.it";
        }
    }, [isRedirecting, countdown]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('domain-change-acknowledged', 'true');
    };

    const handleRedirectNow = () => {
        setIsRedirecting(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
            <div
                className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 overflow-hidden transform transition-all animate-fadeIn"
                style={{ animationDuration: '0.5s' }}
            >
                {/* Top banner */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">We've Moved!</h3>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                        aria-label="Close notification"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4 flex items-start">
                        <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                            <ExternalLink className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h4 className="text-gray-900 font-medium text-lg mb-2">Our domain has changed</h4>
                            <p className="text-gray-600 mb-3">
                                We've moved to a new home at <a href="https://studentitaly.it" className="text-blue-600 font-medium hover:underline">studentitaly.it</a>.
                                Please update your bookmarks.
                            </p>
                            <p className="text-gray-500 text-sm mb-4">
                                You'll be automatically redirected to our new site on your next visit.
                            </p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        {isRedirecting ? (
                            <button
                                className="flex-1 bg-blue-50 text-blue-600 font-medium py-2 px-4 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center"
                                disabled
                            >
                                Redirecting in {countdown}s...
                            </button>
                        ) : (
                            <button
                                onClick={handleRedirectNow}
                                className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                Take me there now
                                <ExternalLink size={16} className="ml-2" />
                            </button>
                        )}
                        <button
                            onClick={handleClose}
                            className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                            I'll update later
                            <Check size={16} className="ml-2" />
                        </button>
                    </div>
                </div>

                {/* Progress bar for redirection */}
                {isRedirecting && (
                    <div
                        className="bg-blue-600 h-1"
                        style={{
                            width: `${((5 - countdown) / 5) * 100}%`,
                            transition: 'width 1s linear'
                        }}
                    />
                )}
            </div>
        </div>
    );
}