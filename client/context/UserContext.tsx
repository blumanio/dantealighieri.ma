import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';

// Assuming IUser is imported from a shared types folder
import { IUser }from '@/lib/models/User';
import { calculateLimits } from '@/app/config/gamification'; // Share config with frontend

interface IUserContext {
    user: IUser | null;
    isLoading: boolean;
    limits: { shortlist: number; tracking: number };
    addToShortlist: (universityId: string) => Promise<void>;
    // ... other actions
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user: clerkUser, isSignedIn } = useClerkUser();
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch full user profile from your backend
        const fetchUser = async () => {
            if (isSignedIn) {
                const res = await fetch('/api/users/me');
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                }
            }
            setIsLoading(false);
        };
        fetchUser();
    }, [isSignedIn]);
    
    const limits = user ? calculateLimits(user) : { shortlist: 0, tracking: 0 };

    const addToShortlist = async (universityId: string) => {
        // API call to your backend
        const res = await fetch(`/api/shortlist/${universityId}`, { method: 'POST' });
        if (!res.ok) {
            const errorData = await res.json();
            // IMPORTANT: Throw the specific error code for the UI to catch
            throw new Error(errorData.error || 'Failed to add to shortlist');
        }
        const updatedUser = await res.json();
        setUser(updatedUser); // Update global state
    };

    const value = { user, isLoading, limits, addToShortlist };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};