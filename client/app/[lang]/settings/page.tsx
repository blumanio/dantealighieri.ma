'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  Pen,
  Check,
  X,
  Loader2,
  User,
  Globe,
  Phone,
  GraduationCap,
  Calendar,
  Target,
  MapPin,
  BookOpen,
  Building,
  Lock,
  Unlock
} from 'lucide-react';
import { updatePublicMetadata } from '@/lib/actions/updateMetadata';

type MetadataSettingsFieldProps = {
  fieldKey: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  fieldType?: 'text' | 'number' | 'tel' | 'select' | 'multiselect';
  options?: Array<string | { id: string; name: string }>;
  placeholder?: string;
};

const MetadataSettingsField: React.FC<MetadataSettingsFieldProps> = ({
  fieldKey,
  label,
  icon: Icon,
  fieldType = 'text',
  options = [],
  placeholder = ''
}) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFieldDisabled, setIsFieldDisabled] = useState(false);

  // Helper function to extract display value from complex objects
  const extractDisplayValue = (data: any) => {
    if (!data) return '';

    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'object' && item.name) return item.name;
        return String(item);
      }).join(', ');
    }

    if (typeof data === 'object' && data.name) {
      return data.name;
    }

    return String(data);
  };

  // Helper function to extract edit value (for form inputs)
  const extractEditValue = (data: any) => {
    if (!data) return '';

    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'object' && item.name) return item.name;
        return String(item);
      }).join(', ');
    }

    if (typeof data === 'object' && data.name) {
      return data.name;
    }

    return String(data);
  };

  // Initialize value when user data loads
  useEffect(() => {
    if (user?.publicMetadata) {
      const fieldValue = user.publicMetadata[fieldKey];
      setValue(extractEditValue(fieldValue));
    }
  }, [user?.publicMetadata, fieldKey]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!value.trim() && fieldKey !== 'mobileNumber') {
        setError('Required');
        return;
      }

      // Phone number validation
      if (fieldKey === 'mobileNumber' && value.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s|-/g, ''))) {
          setError('Invalid phone');
          return;
        }
      }

      // Graduation year validation
      if (fieldKey === 'graduationYear' && value.trim()) {
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        if (year < 1950 || year > currentYear + 10) {
          setError(`Year: 1950-${currentYear + 10}`);
          return;
        }
      }

      let processedValue: any = value.trim();

      // Handle multiselect fields - convert to array
      if (fieldType === 'multiselect') {
        processedValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
      }

      // For single select fields, find matching option
      if (fieldType === 'select' && options.length > 0) {
        const matchingOption = options.find(opt => {
          if (typeof opt === 'string') return opt.toLowerCase() === value.toLowerCase();
          return opt.name.toLowerCase() === value.toLowerCase();
        });

        if (matchingOption && typeof matchingOption === 'object') {
          processedValue = matchingOption.id || matchingOption.name;
        }
      }

      // Use server action to update metadata
      await updatePublicMetadata({ [fieldKey]: processedValue });

      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      setError('Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user?.publicMetadata) {
      const fieldValue = user.publicMetadata[fieldKey];
      setValue(extractEditValue(fieldValue));
    }
    setIsEditing(false);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getDisplayValue = () => {
    if (!user?.publicMetadata) return 'Not set';

    const fieldValue = user.publicMetadata[fieldKey];
    const displayValue = extractDisplayValue(fieldValue);
    return displayValue || 'Not set';
  };

  // Render as list for multiselect fields
  const renderDisplayValue = () => {
    if (!user?.publicMetadata) return <span className="text-slate-500 italic">Not set</span>;

    const fieldValue = user.publicMetadata[fieldKey];

    if (fieldType === 'multiselect' && Array.isArray(fieldValue) && fieldValue.length > 0) {
      return (
        <ul className="text-sm space-y-1">
          {fieldValue.map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
              <span className="text-slate-800 font-medium">
                {typeof item === 'object' && item.name ? item.name : String(item)}
              </span>
            </li>
          ))}
        </ul>
      );
    }

    const displayValue = getDisplayValue();
    return (
      <span className={`text-sm font-semibold ${displayValue === 'Not set' ? 'text-slate-500 italic' : 'text-slate-800'}`}>
        {displayValue}
      </span>
    );
  };

  const renderInput = () => {
    if (fieldType === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="text-xs px-2 py-1 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[120px]"
          autoFocus
        >
          <option value="">Select...</option>
          {options.map((option, index) => {
            const optionValue = typeof option === 'string' ? option : option.name;
            const optionKey = typeof option === 'string' ? option : option.id;
            return (
              <option key={optionKey || index} value={optionValue}>
                {optionValue}
              </option>
            );
          })}
        </select>
      );
    }

    return (
      <input
        type={fieldType === 'number' ? 'number' : fieldType === 'tel' ? 'tel' : 'text'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        className="text-xs px-2 py-1 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[120px]"
        autoFocus
      />
    );
  };

  return (
    <div className="flex items-start justify-between py-2 px-3 hover:bg-orange-50 rounded-lg group">
      <div className="flex items-start space-x-2 min-w-0 flex-1">
        <Icon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <span className="text-xs text-slate-500 font-medium block mb-1">{label}:</span>
          {!isEditing ? (
            <div className="min-w-0">
              {renderDisplayValue()}
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1">
              {renderInput()}
              {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsFieldDisabled(!isFieldDisabled)}
              className="p-1 hover:bg-orange-500 rounded"
              title={isFieldDisabled ? 'Enable editing' : 'Disable editing'}
            >
              {isFieldDisabled ? (
                <Lock className="w-3 h-3 text-white" />
              ) : (
                <Unlock className="w-3 h-3 text-white" />
              )}
            </button>
            {!isFieldDisabled && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-blue-100 rounded"
                title={`Edit ${label}`}
              >
                <Pen className="w-3 h-3 text-slate-500 hover:text-blue-600" />
              </button>
            )}
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="p-1 text-emerald-600 hover:bg-emerald-100 rounded disabled:opacity-50"
              title="Save changes"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
              title="Cancel editing"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const UserMetadataSettings = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex justify-center items-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const metadataFields = [
    { fieldKey: 'userType', label: 'User Type', icon: User, fieldType: 'select',
      options: ['student', 'professional', 'academic', 'other'] },
    { fieldKey: 'countryOfOrigin', label: 'Country', icon: Globe, fieldType: 'select',
      options: [
        { id: 'MA', name: 'Morocco' },
        { id: 'AL', name: 'Algeria' },
        { id: 'TN', name: 'Tunisia' },
        { id: 'LY', name: 'Libya' },
        { id: 'EG', name: 'Egypt' },
      ] },
    { fieldKey: 'mobileNumber', label: 'Mobile', icon: Phone, fieldType: 'tel', placeholder: '123456789' },
    { fieldKey: 'currentEducationLevel', label: 'Current Level', icon: GraduationCap, fieldType: 'select',
      options: ['high_school', 'associate', 'bachelor', 'master', 'phd', 'other'] },
    { fieldKey: 'graduationYear', label: 'Graduation Year', icon: Calendar, fieldType: 'number', placeholder: '2024' },
    {
      fieldKey: 'desiredDegreeLevel', label: 'Looking For a', icon: Target, fieldType: 'select',
      options: ['Bachelor', 'Master', 'PhD', 'Medicine']
    },
    {
      fieldKey: 'targetCities', label: 'Target Cities', icon: MapPin, fieldType: 'multiselect',
      placeholder: 'London, Berlin, Paris'
    },
    {
      fieldKey: 'academicAreas', label: 'Academic Areas', icon: BookOpen, fieldType: 'multiselect',
      placeholder: 'Mathematics, Computer Science'
    },
    {
      fieldKey: 'targetUniversities', label: 'Target Universities', icon: Building, fieldType: 'multiselect',
      placeholder: 'Harvard, Oxford, MIT'
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
      <div className="mb-4 pb-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Profile Settings</h3>
        <p className="text-xs text-slate-500 mt-1">
          Manage your profile and study preferences
        </p>
      </div>

      <div className="space-y-1">
        {metadataFields.map(field => (
          <MetadataSettingsField
            key={field.fieldKey}
            fieldKey={field.fieldKey}
            label={field.label}
            icon={field.icon}
            fieldType={field.fieldType as 'number' | 'text' | 'tel' | 'select' | 'multiselect' | undefined}
            options={field.options}
            placeholder={field.placeholder}
          />
        ))}
      </div>
    </div>
  );
};

export { UserMetadataSettings };