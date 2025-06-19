// components/profile/UserInfoSidebar.js

'use client';
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Pen, Check, X, Loader2, User, Target, Calendar } from 'lucide-react';
import { updatePublicMetadata } from '@/lib/actions/updateMetadata';

// This sub-component handles the logic for a single editable field.
type MetadataFieldProps = {
    fieldKey: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isEditingEnabled: boolean;
};

const MetadataField: React.FC<MetadataFieldProps> = ({ fieldKey, label, icon: Icon, isEditingEnabled }) => {
    const { user } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // Initialize value from user.publicMetadata or set to an empty string
    const [value, setValue] = useState(
        user && user.publicMetadata && typeof user.publicMetadata[fieldKey] === 'string'
            ? user.publicMetadata[fieldKey] as string
            : ''
    );

    const handleSave = async () => {
        setIsLoading(true);

        try {
            // Merge with existing metadata and update
            const updatedMetadata = {
                ...(user?.publicMetadata ?? {}),
                [fieldKey]: value,
            };

            await updatePublicMetadata(updatedMetadata);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update user metadata:", error);
            // Optionally, show an error toast to the user
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Revert to the original value on cancel
        setValue(
            user && user.publicMetadata && typeof user.publicMetadata[fieldKey] === 'string'
                ? user.publicMetadata[fieldKey] as string
                : ''
        );
        setIsEditing(false);
    };

    return (
        <div className="flex items-start space-x-4 py-3">
            <Icon className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                {!isEditing ? (
                    <div className="flex justify-between items-center group">
                        <p className="text-sm text-slate-800 font-semibold truncate">
                            {typeof user?.publicMetadata?.[fieldKey] === 'string' && user.publicMetadata[fieldKey]
                                ? user.publicMetadata[fieldKey] as string
                                : 'Not set'}
                        </p>
                        {isEditingEnabled && (
                            <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1">
                                <Pen className="w-4 h-4 text-slate-500 hover:text-blue-600" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 mt-1">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full text-sm px-2 py-1 border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={handleSave} disabled={isLoading} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-full flex-shrink-0">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button onClick={handleCancel} className="p-1 text-red-600 hover:bg-red-100 rounded-full flex-shrink-0">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

type UserInfoSidebarProps = {
    isEditingEnabled: boolean;
};

const UserInfoSidebar: React.FC<UserInfoSidebarProps> = ({ isEditingEnabled }) => {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded || !isSignedIn) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex justify-center items-center h-96">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    // Define the fields from Clerk publicMetadata you want to display
    const metadataFields = [
        { key: 'targetCountry', label: 'Target Country', icon: Target },
        { key: 'studyLevel', label: 'Level of Study', icon: User },
        { key: 'intakeYear', label: 'Target Intake Year', icon: Calendar }
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <div className="flex items-center space-x-4 mb-4">
                <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-16 h-16 rounded-full" />
                <div>
                    <h3 className="text-lg font-bold text-slate-900">{user.fullName}</h3>
                    <p className="text-sm text-slate-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {metadataFields.map(field => (
                    <MetadataField
                        key={field.key}
                        fieldKey={field.key}
                        label={field.label}
                        icon={field.icon}
                        isEditingEnabled={isEditingEnabled}
                    />
                ))}
            </div>
        </div>
    );
};

export default UserInfoSidebar;