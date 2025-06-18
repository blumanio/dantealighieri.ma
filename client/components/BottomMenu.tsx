// components/BottomMenu.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    MessageSquare,
    BookmarkCheck,
    Folder,
    Route,
} from 'lucide-react';

// Tip 2: Limit the number of tabs to 5 for a clean interface.
// Tip 6: Keep navigation labels short and sweet.
const bottomMenuItems = [
    { id: 'planner', icon: Route, label: 'Planner', href: '/dashboard#shortlisting' },
    { id: 'documents', icon: Folder, label: 'Docs', href: '/dashboard#documents' },
    { id: 'applications', icon: BookmarkCheck, label: 'Apps', href: '/dashboard#applications' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', href: '/dashboard#messages', notification: 3 },
    { id: 'profile', icon: User, label: 'Profile', href: '/dashboard#about' },
];

const BottomMenu = () => {
    const pathname = usePathname();

    // The component will only render on mobile, so no need for isMobile checks here.
    // This logic should be in your main layout component.

    return (
        <>
            {/* Add a placeholder div to prevent content from being hidden behind the fixed nav */}
            {/* <div className="h-20" />  */}

            {/* Tip 7 & 11: Keep it clean and separate bottom navigation from main content */}
            <motion.nav
                className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-lg border-t border-gray-200/80 z-50"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className="flex justify-around items-center h-full max-w-md mx-auto">
                    {bottomMenuItems.map((item) => {
                        // Tip 4: Differentiate active and inactive states.
                        // We check if the current path starts with the item's href.
                        const isActive = pathname + (window.location.hash || '') === item.href;

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="group flex flex-col items-center justify-center text-center p-2 rounded-lg h-full w-16 transition-colors duration-200"
                            >
                                {/* Tip 3: Design thumb-friendly tap areas (achieved via padding and item size) */}
                                <div className="relative">
                                    {/* Tip 8: Stick to one icon style */}
                                    <item.icon
                                        className={`
                h-6 w-6 mb-1 transition-colors duration-200
                ${isActive ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-500'}
            `}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    {/* Tip 10: Use notification badges to highlight updates */}
                                    <AnimatePresence>
                                        {item.notification && (
                                            <motion.div
                                                className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                            >
                                                {item.notification}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <span
                                    className={`
            text-xs transition-colors duration-200
            ${isActive ? 'font-bold text-orange-600' : 'text-gray-600 group-hover:text-orange-500'}
        `}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </motion.nav>
        </>
    );
};

export default BottomMenu;