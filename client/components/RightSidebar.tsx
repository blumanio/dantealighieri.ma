'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    MessageSquare,
    BookmarkCheck,
    Folder,
    Route,
    Star,
    Settings,
    LogOut,
    Menu,
    Lock,
    X,
    Video,
    DollarSign,
    GraduationCap, // Added for the new logo
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import Link from 'next/link';

// All original menu items are used for the mobile slide-out and desktop sidebar
const menuItems = [
    { id: 'myprofile', icon: User, label: 'My Profile', href: '/dashboard#about' },
    { id: 'myplanner', icon: Route, label: 'My Planner', href: '/dashboard#shortlisting' },
    { id: 'documents', icon: Folder, label: 'Documents', href: '/dashboard#documents' },
    { id: 'applications', icon: BookmarkCheck, label: 'Applications', href: '/dashboard#applications' },
    { id: 'scholarships', icon: DollarSign, label: 'Scholarships', href: '/scholarships', disabled: false },
    { id: 'messages', icon: MessageSquare, label: 'Messages', href: '/dashboard#messages' },
    { id: 'video', icon: Video, label: 'Videobook', href: '/video', disabled: true },
    { id: 'premium', icon: Star, label: 'Premium', href: '/dashboard#premium', disabled: true },
];

// New AnimatedLogo component with Graduation Cap and bouncing dot
const AnimatedLogo = () => {
    return (
        <Link href="/" className="flex items-center text-2xl font-bold text-gray-800" aria-label="StudentItaly Homepage">
            <span className="flex items-end">
                S
                {/* Letter T with animated Graduation Cap */}
                <div className="relative">
                    t
                    <motion.div
                        className="absolute -top-4 left-1/2 -translate-x-1/2"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    >
                        <GraduationCap className="w-6 h-6 text-orange-500" />
                    </motion.div>
                </div>
                udent
                <span className="w-1.5"></span> {/* Space */}
                <span className="flex items-end">
                    {/* Letter i with animated dot */}
                    {/* <div className="relative"> */}
                    i
                    {/* <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    /> */}
                    {/* </div> */}
                    taly
                </span>
            </span>
        </Link>
    );
};


const PremiumSidebar = () => {
    const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const { signOut } = useClerk();

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleItemHover = (itemId: any) => {
        if (!isDesktopExpanded) {
            setHoveredItem(itemId);
        }
    };
    const handleItemLeave = () => setHoveredItem(null);

    const sidebarVariants = { collapsed: { width: '4.5rem' }, expanded: { width: '16rem' } };
    const mobileMenuVariants = { hidden: { x: '100%' }, visible: { x: '0%' } };
    const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const tooltipVariants = { hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } };


    return (
        <>
            {/* === DESKTOP SIDEBAR (UNCHANGED ON MOBILE) === */}
            <motion.aside
                className="hidden sm:flex fixed top-0 left-0 h-full bg-white/95 backdrop-blur-lg border-r border-gray-200/80 flex-col z-50 shadow-xl"
                animate={isDesktopExpanded ? 'expanded' : 'collapsed'}
                variants={sidebarVariants}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onMouseEnter={() => setIsDesktopExpanded(true)}
                onMouseLeave={() => setIsDesktopExpanded(false)}
            >
                {/* Desktop Header */}
                <div className="flex items-center h-20 px-4">
                    {isDesktopExpanded ? (
                        <motion.div key="logo-expanded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                            <AnimatedLogo />
                        </motion.div>
                    ) : (
                        <motion.div key="logo-collapsed" className="w-full flex justify-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">SI</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* === DESKTOP NAVIGATION (RESTORED) === */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const isDisabled = item.disabled;
                        return (
                            <div key={item.id} className="relative" onMouseEnter={() => handleItemHover(item.id)} onMouseLeave={handleItemLeave}>
                                <Link
                                    href={isDisabled ? '#' : item.href}
                                    onClick={e => isDisabled && e.preventDefault()}
                                    className={`group flex items-center p-3 rounded-xl transition-all duration-200 relative ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-100/80'}`}
                                >
                                    <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${isDisabled ? 'text-gray-400' : 'text-gray-600 group-hover:text-orange-600'}`} />
                                    <AnimatePresence>
                                        {isDesktopExpanded && (
                                            <motion.span
                                                className={`ml-4 font-medium group-hover:text-gray-900 whitespace-nowrap flex items-center gap-1 ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}
                                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                                            >
                                                {item.label}
                                                {isDisabled && <Lock className="w-4 h-4" />}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                                <AnimatePresence>
                                    {hoveredItem === item.id && !isDesktopExpanded && (
                                        <motion.div
                                            className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg z-60"
                                            initial="hidden" animate="visible" exit="hidden" variants={tooltipVariants} transition={{ duration: 0.15 }}
                                        >
                                            {item.label}
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </nav>

                {/* === DESKTOP FOOTER (RESTORED) === */}
                <div className="px-3 py-4 border-t border-gray-200/60 space-y-1">
                    {/* <div className="relative" onMouseEnter={() => handleItemHover('settings')} onMouseLeave={handleItemLeave}>
                        <a href="/settings" className="group flex items-center p-3 rounded-xl hover:bg-gray-100/80 transition-all duration-200">
                            <Settings className="h-5 w-5 flex-shrink-0 text-gray-600 group-hover:text-orange-600 transition-colors duration-200" />
                            {isDesktopExpanded && <span className="ml-4 font-medium text-gray-700 group-hover:text-gray-900">Settings</span>}
                        </a>
                        {hoveredItem === 'settings' && !isDesktopExpanded && (
                            <motion.div
                                className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
                                initial="hidden" animate="visible" exit="hidden" variants={tooltipVariants}
                            >
                                Settings <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                            </motion.div>
                        )}
                    </div> */}
                    <div className="relative" onMouseEnter={() => handleItemHover('logout')} onMouseLeave={handleItemLeave}>
                        <button onClick={() => signOut()} className="group w-full flex items-center p-3 rounded-xl hover:bg-red-50 transition-all duration-200">
                            <LogOut className="h-5 w-5 flex-shrink-0 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
                            {isDesktopExpanded && <span className="ml-4 font-medium text-gray-700 group-hover:text-red-600">Sign Out</span>}
                        </button>
                        {hoveredItem === 'logout' && !isDesktopExpanded && (
                            <motion.div
                                className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
                                initial="hidden" animate="visible" exit="hidden" variants={tooltipVariants}
                            >
                                Sign Out <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* === MOBILE "MORE" MENU (UNCHANGED ON DESKTOP) === */}
            <div className="sm:hidden">
                <motion.button
                    className="fixed top-55 right-4 z-[60] p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200"
                    onClick={() => setIsMobileMenuOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Menu className="h-6 w-6 text-gray-700" />
                </motion.button>
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                className="fixed inset-0 bg-black/50 z-50"
                                initial="hidden" animate="visible" exit="hidden"
                                variants={overlayVariants} onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <motion.div
                                className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-[60] flex flex-col shadow-2xl"
                                initial="hidden" animate="visible" exit="hidden"
                                variants={mobileMenuVariants} transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                            >
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    <AnimatedLogo />
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2">
                                        <X className="h-6 w-6 text-gray-500" />
                                    </button>
                                </div>
                                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                                    <h2 className="px-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">Menu</h2>
                                    {menuItems.map(item => (
                                        <Link
                                            key={item.id}
                                            href={item.disabled ? '#' : item.href}
                                            onClick={e => {
                                                if (item.disabled) e.preventDefault();
                                                else setIsMobileMenuOpen(false);
                                            }}
                                            className={`group flex items-center p-3 rounded-xl text-base font-medium transition-all duration-200 ${item.disabled
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <item.icon className={`h-5 w-5 mr-4 ${item.disabled
                                                    ? 'text-gray-400'
                                                    : 'text-gray-500 group-hover:text-orange-600'
                                                }`} />
                                            {item.label}
                                            {item.disabled && <Lock className="w-4 h-4 ml-auto text-gray-400" />}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="p-4 border-t border-gray-200 space-y-2">
                                    {/* <a href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center p-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
                                        <Settings className="h-5 w-5 mr-4 text-gray-500 group-hover:text-orange-600" />
                                        Settings
                                    </a> */}
                                    <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="group w-full flex items-center p-3 rounded-xl text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                                        <LogOut className="h-5 w-5 mr-4 text-gray-500 group-hover:text-red-600" />
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default PremiumSidebar;