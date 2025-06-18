// components/profile/DashboardLayout.js

import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
    leftSidebar: ReactNode;
    rightSidebar: ReactNode;
    children: ReactNode;
}

const DashboardLayout = ({ leftSidebar, rightSidebar, children }: DashboardLayoutProps) => (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8 py-8">
            {/* Left Sidebar (Navigation) */}
            <aside className="w-full lg:w-72 lg:flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-8 self-start">
                {leftSidebar}
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {children}
            </main>

            {/* Right Sidebar (User Info) */}
            <aside className="w-full lg:w-80 lg:flex-shrink-0 mt-8 lg:mt-0 lg:sticky lg:top-8 self-start">
                {rightSidebar}
            </aside>
        </div>
    </div>
);

export default DashboardLayout;