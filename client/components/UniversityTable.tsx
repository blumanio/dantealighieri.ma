'use client';

import React, { useState } from 'react';
import {
    Building2,
    Euro,
    Calendar,
    Globe,
    BookOpen,
    Users,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    MapPin,
    Clock,
    Library,
    Dumbbell,
    GraduationCap,
    Laptop
} from 'lucide-react';

// Interfaces
export interface University {
    id: number;
    name: string;
    location: string;
    tutorial: string | null;
    blog: string | null;
    admission_fee: number;
    english_requirement: string;
    admission_date: string;
    deadline: string;
    status: 'Open' | 'Closed' | 'Coming Soon';
    cgpa_requirement: string;
    student_population: number;
    acceptance_rate: string;
    housing_available: boolean;
    scholarship_available: boolean;
    virtual_tour_available: boolean;
    campus_facilities: string[];
    application_link: string;
    intakes: Array<{
      name: string;
      start_date: string;
      end_date: string;
      application_start: string;
      application_end: string;
      notes: string
    }>;
    programs_offered: Array<{
      name: string;
      type: 'Bachelor' | 'Master';
      language: string;
      duration: string;
      tuition_fee: number;
    }>;
    contact_info: {
      email: string;
      phone: string;
      website: string;
      address: string;
    };
    university_features: {
      library: boolean;
      sports_facilities: boolean;
      cafeteria: boolean;
      labs: boolean;
      research_centers: boolean;
      international_office: boolean;
    };
    rankings: {
      world_ranking: string;
      national_ranking: string;
      subject_rankings: Array<{
        subject: string;
        rank: string;
      }>;
    };
  }

interface UniversityTableProps {
    universities: University[];
    isSignedIn: boolean;
}

const formatCGPA = (requirement: string | null) => {
    if (!requirement) return 'No CGPA Required';
    if (requirement === 'NO CGPA REQUIREMENT') return 'No CGPA Required';
    return requirement
        .replace('MINIMUM ', '')
        .replace(' FOR PAKISTAN', '')
        .replace('DIFFERENT CGPA REQUIREMENTS', 'Various Requirements');
};

// Feature Icons component for reusability
const FeatureIcon = ({ feature }: { feature: string }) => {
    const iconClassName = "h-4 w-4 text-gray-500";
    switch (feature.toLowerCase()) {
        case 'library':
            return <Library className={iconClassName} />;
        case 'sports':
            return <Dumbbell className={iconClassName} />;
        case 'labs':
            return <Laptop className={iconClassName} />;
        default:
            return <Building2 className={iconClassName} />;
    }
};

// Render expanded content component
const renderExpandedContent = (uni: University, isSignedIn: boolean) => (

    <div className="space-y-6 p-6 bg-gray-50">
        {/* Intakes Section */}
        {uni.intakes && uni.intakes.length > 0 && (
            <div className="border-b pb-6">
                <h4 className="font-medium text-gray-900 mb-4">Available Intakes</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {uni.intakes.map((intake, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                            <h5 className="font-medium text-gray-900 mb-2">{intake.name}</h5>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-gray-600">Start:</span>
                                    <span>{intake.start_date}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-600">End:</span>
                                    <span>{intake.end_date}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-600">Notes:</span>
                                    <span className="text-teal-600">
                                        {intake.notes}  
                                    </span>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Main Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: University Details */}
            <div className="space-y-4">
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">University Information</h4>
                    <ul className="space-y-2 text-sm">
                        {uni.rankings && (
                            <>
                                <li className="flex justify-between">
                                    <span className="text-gray-600">World Ranking:</span>
                                    <span>{uni.rankings.world_ranking}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-600">National Ranking:</span>
                                    <span>{uni.rankings.national_ranking}</span>
                                </li>
                            </>
                        )}
                        <li className="flex justify-between">
                            <span className="text-gray-600">Student Population:</span>
                            <span>{uni.student_population?.toLocaleString() || 'Not specified'}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-600">Acceptance Rate:</span>
                            <span>{uni.acceptance_rate || 'Not specified'}</span>
                        </li>
                    </ul>
                </div>

                {uni.contact_info && isSignedIn && (
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                        <ul className="space-y-2 text-sm">
                            <li>{uni.contact_info.email}</li>
                            {uni.contact_info.phone && <li>{uni.contact_info.phone}</li>}
                            <li className="break-words">{uni.contact_info.address}</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Column 2: Academic Information */}
            <div className="space-y-4">
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Requirements</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                            <span className="text-gray-600">Academic:</span>
                            <span>{formatCGPA(uni.cgpa_requirement)}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-600">Language:</span>
                            <span>{uni.english_requirement}</span>
                        </li>
                        <li className={`flex justify-between ${!isSignedIn && 'blur-sm'}`}>
                            <span className="text-gray-600">Application Fee:</span>
                            <span>{uni.admission_fee === 0 ? 'Free' : `${uni.admission_fee}`}</span>
                        </li>
                        <li className={`flex justify-between ${!isSignedIn && 'blur-sm'}`}>
                            <span className="text-gray-600">Deadline:</span>
                            <span>{uni.deadline}</span>
                        </li>
                    </ul>
                </div>

                {uni.programs_offered && uni.programs_offered.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Featured Programs</h4>
                        <div className="space-y-2">
                            {uni.programs_offered.slice(0, 3).map((program, index) => (
                                <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="font-medium">{program.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {program.type} • {program.duration} • {program.language}
                                        {program.tuition_fee && isSignedIn &&
                                            ` • €${program.tuition_fee}/year`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Column 3: Facilities and Features */}
            <div className="space-y-4">
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Available Features</h4>
                    <div className="flex flex-wrap gap-2">
                        {uni.university_features?.library && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                                <Library className="h-3 w-3" />
                                <span>Library</span>
                            </span>
                        )}
                        {uni.housing_available && (
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs">
                                <Building2 className="h-3 w-3" />
                                <span>Housing</span>
                            </span>
                        )}
                        {uni.scholarship_available && (
                            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs">
                                <GraduationCap className="h-3 w-3" />
                                <span>Scholarships</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Resources Section */}
                {(uni.tutorial || uni.blog) && (
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Resources</h4>
                        <div className="space-y-2">
                            {uni.tutorial && (
                                <a
                                    href={uni.tutorial}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-teal-600 hover:text-teal-700"
                                >
                                    <span>Watch Tutorial</span>
                                </a>
                            )}
                            {uni.blog && (
                                <a
                                    href={uni.blog}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-teal-600 hover:text-teal-700"
                                >
                                    <span>Read Blog Post</span>
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {uni.application_link && (
                    <a
                        href={uni.application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mt-4"
                    >
                        <span>Visit University Website</span>
                        <ExternalLink className="h-4 w-4" />
                    </a>
                )}
            </div>
        </div>

        {/* Campus Facilities Tags */}
        {uni.campus_facilities && uni.campus_facilities.length > 0 && (
            <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Campus Facilities</h4>
                <div className="flex flex-wrap gap-2">
                    {uni.campus_facilities.map((facility, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                        >
                            <FeatureIcon feature={facility} />
                            <span>{facility}</span>
                        </span>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export function UniversityTable({ universities, isSignedIn }: UniversityTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());
    console.log('isSignedIn ccccccccccccccccc', isSignedIn);

    const toggleRow = (id: string | number) => {
        const newExpanded = new Set(expandedRows);
        if (expandedRows.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    return (
        <div className="space-y-4">
            {/* Last update indicator */}
            <div className="flex items-center justify-center mt-4 space-x-2">
                <span className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-2 py-1 text-sm font-semibold rounded-full animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                    <span>Last update: 11/02/2025 we're updating now </span>
                </span>
            </div>

            {/* Header */}
            <header className="mb-4 md:mb-8 text-center px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Italian Universities Courses 2025/2026
                </h1>
                <p className="mt-2 text-gray-600">Found {universities.length} universities</p>
            </header>

            {/* Sign in prompt */}
            {!isSignedIn && (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center mt-4">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-800">
                            <a href='./sign-in'>Log in</a>
                        </span> to unlock detailed information about programs, fees, and requirements.
                    </p>
                </div>
            )}

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
                {universities.map((uni) => (
                    <div key={uni.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 space-y-3">
                            {/* University Name and Status */}
                            <div className="flex justify-between items-start">
                                <h3 className="font-medium text-gray-900">{uni.name}</h3>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${uni.status === 'Open'
                                    ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                    : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                                    }`}>
                                    {uni.status}
                                </span>
                            </div>

                            {/* Quick Info Grid */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span>{uni.location || 'Location TBA'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className={!isSignedIn ? 'blur-sm' : ''}>
                                        {uni.deadline || 'TBA'}
                                    </span>
                                </div>
                                <div className={`flex items-center gap-2 ${!isSignedIn ? 'blur-sm' : ''}`}>
                                    <Euro className="h-4 w-4 text-gray-500" />
                                    <span>{uni.admission_fee === 0 ? 'Free' : `€${uni.admission_fee}`}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-gray-500" />
                                    <span>{formatCGPA(uni.cgpa_requirement)}</span>
                                </div>
                            </div>

                            {/* Expand/Collapse Button */}
                            <button
                                onClick={() => toggleRow(uni.id)}
                                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 pt-2"
                            >
                                <span>{expandedRows.has(uni.id) ? 'Show less' : 'Show more'}</span>
                                {expandedRows.has(uni.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {/* Expanded Content for Mobile */}
                        {expandedRows.has(uni.id) && (
                            <div className="border-t border-gray-100">
                                {renderExpandedContent(uni, isSignedIn)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:flex justify-center">
                <div className="w-full max-w-7xl overflow-x-auto">
                    <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">University</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Deadline</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Fee</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Requirements</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {universities.map((uni) => (
                                <React.Fragment key={uni.id}>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{uni.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                <span>{uni.location || 'TBA'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${uni.status === 'Open'
                                                ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                                : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                                                }`}>
                                                {uni.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-2 ${!isSignedIn ? 'blur-sm' : ''}`}>
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <span>{uni.deadline || 'TBA'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-2 ${!isSignedIn ? 'blur-sm' : ''}`}>
                                                <Euro className="h-4 w-4 text-gray-500" />
                                                <span>
                                                    {uni.admission_fee === 0 ? 'Free' : `${uni.admission_fee}`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4 text-gray-500" />
                                                <span>{formatCGPA(uni.cgpa_requirement)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleRow(uni.id)}
                                                className="text-teal-600 hover:text-teal-700"
                                            >
                                                {expandedRows.has(uni.id) ? (
                                                    <ChevronUp className="h-5 w-5 inline" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 inline" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expanded Row Content */}
                                    {expandedRows.has(uni.id) && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 bg-gray-50">
                                                {renderExpandedContent(uni, isSignedIn)}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}