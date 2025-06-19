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
  Unlock,
  Route,
  Search,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  Award
} from 'lucide-react';
import { clerkClient } from '@clerk/nextjs/server';
import { updatePublicMetadata } from '@/lib/actions/updateMetadata';

// Application Phase Modal Component
type ApplicationPhaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentPhase: string;
  onUpdate: (phase: string) => Promise<void>;
};

const ApplicationPhaseModal: React.FC<ApplicationPhaseModalProps> = ({ isOpen, onClose, currentPhase, onUpdate }) => {
  const [selectedPhase, setSelectedPhase] = useState(currentPhase || '');
  const [isLoading, setIsLoading] = useState(false);

  const phases = [
    {
      id: 'research',
      title: 'Just starting, research phase',
      icon: Search,
      description: 'Exploring options and gathering information'
    },
    {
      id: 'shortlisting',
      title: 'Shortlisting colleges, planning tests',
      icon: CheckCircle,
      description: 'Narrowing down choices and preparing for exams'
    },
    {
      id: 'finalizing',
      title: 'Tests done, finalising shortlist',
      icon: Clock,
      description: 'Completed tests, making final decisions'
    },
    {
      id: 'applied',
      title: 'Applied to a few colleges',
      icon: FileText,
      description: 'Submitted applications, waiting for responses'
    },
    {
      id: 'awaiting',
      title: 'Applications done, awaiting admit',
      icon: Mail,
      description: 'All applications submitted, waiting for decisions'
    },
    {
      id: 'admits',
      title: 'Admits received',
      icon: Award,
      description: 'Received acceptance letters from colleges'
    }
  ];

  useEffect(() => {
    setSelectedPhase(currentPhase || '');
  }, [currentPhase]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await onUpdate(selectedPhase);
      onClose();
    } catch (error) {
      console.error('Failed to update phase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Journey So Far</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Where are you in your study abroad journey?
          </p>

          <div className="space-y-3">
            {phases.map((phase) => {
              const IconComponent = phase.icon;
              const isSelected = selectedPhase === phase.id;

              return (
                <div
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase.id)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`
                      p-2 rounded-lg flex-shrink-0
                      ${isSelected
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-gray-100 text-gray-500'
                      }
                    `}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`
                        text-sm font-medium
                        ${isSelected ? 'text-orange-900' : 'text-gray-900'}
                      `}>
                        {phase.title}
                      </h3>
                      <p className={`
                        text-xs mt-1
                        ${isSelected ? 'text-orange-700' : 'text-gray-500'}
                      `}>
                        {phase.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleUpdate}
            disabled={isLoading || !selectedPhase}
            className="
              px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg
              hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200 flex items-center space-x-2
            "
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Update</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated MetadataField component with modal integration
type MetadataFieldProps = {
  fieldKey: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isEditingEnabled: boolean;
  fieldType?: 'text' | 'number' | 'tel' | 'select' | 'multiselect' | 'modal';
  options?: Array<string | { id: string; name: string }>;
  placeholder?: string;
  isCompact?: boolean;
};

const MetadataField: React.FC<MetadataFieldProps> = ({
  fieldKey,
  label,
  icon: Icon,
  isEditingEnabled,
  fieldType = 'text',
  options = [],
  placeholder = '',
  isCompact = true
}) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFieldDisabled, setIsFieldDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  // Map phase IDs to display names
  const getPhaseDisplayName = (phaseId: string) => {
    const phaseMap: Record<string, string> = {
      'research': 'Just starting, research phase',
      'shortlisting': 'Shortlisting colleges, planning tests',
      'finalizing': 'Tests done, finalising shortlist',
      'applied': 'Applied to a few colleges',
      'awaiting': 'Applications done, awaiting admit',
      'admits': 'Admits received'
    };
    return phaseMap[phaseId] || phaseId;
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

  const handleModalUpdate = async (newPhase: string) => {
    if (!user) return;

    try {
      // Use server action to update metadata
      await updatePublicMetadata({ [fieldKey]: newPhase });
      setValue(newPhase);
    } catch (err) {
      console.error("Update failed:", err);
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

    // Special handling for application phase
    if (fieldKey === 'applicationPhase') {
      return fieldValue ? getPhaseDisplayName(String(fieldValue)) : 'Not set';
    }

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

  const handleEditClick = () => {
    if (fieldKey === 'applicationPhase') {
      setShowModal(true);
    } else {
      setIsEditing(true);
    }
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

  if (isCompact) {
    return (
      <>
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
                {isEditingEnabled && !isFieldDisabled && (
                  <button
                    onClick={handleEditClick}
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

        {/* Application Phase Modal */}
        {fieldKey === 'applicationPhase' && (
          <ApplicationPhaseModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            currentPhase={String(user?.publicMetadata?.[fieldKey] ?? '')}
            onUpdate={handleModalUpdate}
          />
        )}
      </>
    );
  }

  // Original non-compact layout for backward compatibility
  return (
    <>
      <div className="flex items-start space-x-4 py-3">
        <Icon className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          {!isEditing ? (
            <div className="flex justify-between items-center group">
              <div className="min-w-0 flex-1">
                {renderDisplayValue()}
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsFieldDisabled(!isFieldDisabled)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  title={isFieldDisabled ? 'Enable editing' : 'Disable editing'}
                >
                  {isFieldDisabled ? (
                    <Lock className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Unlock className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {isEditingEnabled && !isFieldDisabled && (
                  <button
                    onClick={handleEditClick}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title={`Edit ${label}`}
                  >
                    <Pen className="w-4 h-4 text-slate-500 hover:text-blue-600" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-1">
              <div className="flex items-center space-x-2">
                {renderInput()}
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-full flex-shrink-0 disabled:opacity-50"
                  title="Save changes"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 text-red-600 hover:bg-red-100 rounded-full flex-shrink-0"
                  title="Cancel editing"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Application Phase Modal */}
      {fieldKey === 'applicationPhase' && (
        <ApplicationPhaseModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          currentPhase={String(user?.publicMetadata?.[fieldKey] ?? '')}
          onUpdate={handleModalUpdate}
        />
      )}
    </>
  );
};

// Updated UserInfoSidebar component
const UserInfoSidebar = ({ isEditingEnabled = true }) => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex justify-center items-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  // Enhanced metadata fields with application phase and updated structure
  const metadataFields = [
    { fieldKey: 'applicationPhase', label: 'Application Phase', icon: Route, fieldType: 'modal', options: undefined },
    // { fieldKey: 'userType', label: 'User Type', icon: User, fieldType: 'select',
    // options: ['student', 'professional', 'academic', 'other'] },
    // { fieldKey: 'countryOfOrigin', label: 'Country', icon: Globe, fieldType: 'select',
    //   options: [
    //     { id: 'MA', name: 'Morocco' },
    //     { id: 'AL', name: 'Algeria' },
    //     { id: 'TN', name: 'Tunisia' },
    //     { id: 'LY', name: 'Libya' },
    //     { id: 'EG', name: 'Egypt' },
    //     // { id: 'FR', name: 'France' },
    //     // { id: 'IT', name: 'Italy' }
    //   ] },
    // { fieldKey: 'mobileNumber', label: 'Mobile', icon: Phone, fieldType: 'tel', placeholder: '123456789' },
    // { fieldKey: 'currentEducationLevel', label: 'Current Level', icon: GraduationCap, fieldType: 'select',
    // options: ['high_school', 'associate', 'bachelor', 'master', 'phd', 'other'] },
    // { fieldKey: 'graduationYear', label: 'Graduation Year', icon: Calendar, fieldType: 'number', placeholder: '2024' },
    // { fieldKey: 'desiredDegreeLevel', label: 'Desired Level', icon: Target, fieldType: 'select',
    //   options: ['associate', 'bachelor', 'master', 'phd', 'certificate'] },
    {
      fieldKey: 'targetCities', label: 'Target Cities', icon: MapPin, fieldType: 'multiselect',
      placeholder: 'London, Berlin, Paris', options: undefined
    },
    {
      fieldKey: 'academicAreas', label: 'Academic Areas', icon: BookOpen, fieldType: 'multiselect',
      placeholder: 'Mathematics, Computer Science', options: undefined
    },
    {
      fieldKey: 'targetUniversities', label: 'Target Universities', icon: Building, fieldType: 'multiselect',
      placeholder: 'Harvard, Oxford, MIT', options: undefined
    },
    {
      fieldKey: 'coursesOfInterest', label: 'Courses of Interest', icon: BookOpen, fieldType: 'multiselect',
      placeholder: 'Medicine, Engineering', options: undefined
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
      <div className="mb-4 pb-4 border-b border-slate-100">
        <MetadataField
          key={metadataFields[0].fieldKey}
          fieldKey={metadataFields[0].fieldKey}
          label={metadataFields[0].label}
          icon={metadataFields[0].icon}
          isEditingEnabled={false}
          fieldType={metadataFields[0].fieldType as 'number' | 'modal' | 'multiselect' | 'select' | 'text' | 'tel' | undefined}
          // options={metadataFields[0].options || []}
          placeholder={metadataFields[0].placeholder || ''}
          isCompact={true}
        />
      </div>
      <div className="mb-4 pb-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Your Preferences</h3>
        <p className="text-xs text-slate-500 mt-1">
          Manage your profile and study preferences
        </p>
      </div>

      <div className="space-y-1">
        {metadataFields.map(field => (
          <MetadataField
            key={field.fieldKey}
            fieldKey={field.fieldKey}
            label={field.label}
            icon={field.icon}
            isEditingEnabled={false}
            fieldType={field.fieldType as 'number' | 'text' | 'tel' | 'select' | 'multiselect' | 'modal' | undefined}
            options={field.options}
            placeholder={field.placeholder}
            isCompact={true}
          />
        ))}
      </div>
    </div>
  );
};

export { MetadataField, UserInfoSidebar, ApplicationPhaseModal };