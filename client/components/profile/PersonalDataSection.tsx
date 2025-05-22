'use client';

import React from 'react';
import { UserProfile } from '@clerk/nextjs';

// The `user` prop is generally not needed for the <UserProfile /> component itself,
// as it uses the active session. If you were displaying user data manually alongside it,
// you'd typically get it from the `useUser()` hook in a client component.
interface PersonalDataSectionProps {
    t: (namespace: string, key: string) => string;
    lang: string; // Add 'lang' prop to receive the current language
}

const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({ t, lang }) => {
    // Construct the base path for UserProfile dynamically using the current language
    const userProfileBasePath = `/${lang}/profile`;

    return (
        <div>
            <h2 className="text-2xl font-semibold text-neutral-700 mb-6">{t('profile', 'personalDataTitle')}</h2>
            <div className="p-1 border border-neutral-200 rounded-lg">
                <UserProfile
                    path={userProfileBasePath} // CRITICAL FIX: Use the dynamic, language-aware path
                    routing="path" // This is the default, but explicit is fine
                    appearance={{
                        elements: {
                            card: "shadow-none border-0", // Custom styling: remove default card visuals
                            navbar: "hidden",             // Hides Clerk's internal navigation (e.g., Account, Security tabs)
                            headerTitle: "hidden",        // Hides the default "User Profile" title from Clerk
                            pageScrollBox: "p-0",         // Adjusts padding of the content area
                        }
                        // Note on hiding navbar: If you hide the navbar, users cannot switch
                        // between different sections of their profile (Account, Security, Connected Accounts, etc.)
                        // using Clerk's built-in navigation. This might be intentional if this
                        // PersonalDataSection is meant to display only the primary profile page
                        // or if you are building custom navigation elsewhere.
                        // If full profile functionality is desired within this component, consider not hiding the navbar.
                    }}
                />
            </div>
            <p className="mt-4 text-xs text-neutral-500">
                {t('profile', 'personalDataClerkNote')}
            </p>
        </div>
    );
};

export default PersonalDataSection;