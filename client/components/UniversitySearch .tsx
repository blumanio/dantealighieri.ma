'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
    Building2,
    GraduationCap,
    Euro,
    Calendar,
    Globe,
    BookOpen,
    Users,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    MapPin,
    Clock
} from 'lucide-react';

interface University {
    id: string;
    name: string;
    status: string;
    admission_fee: number;
    cgpa_requirement: string;
    deadline: string;
    english_requirement: string;
    location?: string;
    programs_offered?: string[];
    student_population?: number;
    acceptance_rate?: string;
    housing_available?: boolean;
    scholarship_available?: boolean;
    application_link?: string;
    virtual_tour_available?: boolean;
    orientation_date?: string;
    course_start_date?: string;
    campus_facilities?: string[];
}

interface UniversityTableProps {
    universities: University[];
}

const formatCGPA = (requirement: string | null) => {
    if (!requirement) return 'No CGPA Required';
    if (requirement === 'NO CGPA REQUIREMENT') return 'No CGPA Required';
    return requirement
        .replace('MINIMUM ', '')
        .replace(' FOR PAKISTAN', '')
        .replace('DIFFERENT CGPA REQUIREMENTS', 'Various Requirements');
};

export function UniversityTable({ universities }: UniversityTableProps) {


    const { isSignedIn } = useUser();
    console.log('isSignedIn vvvvvvvvv', isSignedIn);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (expandedRows.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const renderExpandedContent = (uni: University) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Program Details</h4>
                <ul className="text-sm space-y-2">
                    <li className="flex items-center justify-between">
                        <span className="text-gray-600">Student Population:</span>
                        <span>{uni.student_population?.toLocaleString() || 'Not specified'}</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="text-gray-600">Acceptance Rate:</span>
                        <span>{uni.acceptance_rate || 'Not specified'}</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="text-gray-600">Course Start:</span>
                        <span>{uni.course_start_date || 'TBA'}</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="text-gray-600">Orientation:</span>
                        <span>{uni.orientation_date || 'TBA'}</span>
                    </li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Requirements</h4>
                <ul className="text-sm space-y-2">
                    <li className="flex items-center justify-between">
                        <span className="text-gray-600">Academic:</span>
                        <span>{formatCGPA(uni.cgpa_requirement)}</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span>{uni.english_requirement}</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="text-gray-600">Application Fee:</span>
                        <span>{uni.admission_fee === 0 ? 'Free' : `€${uni.admission_fee}`}</span>
                    </li>
                </ul>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="font-medium text-gray-900 mb-2">Available Features</h4>
                    <div className="flex flex-wrap gap-2">
                        {uni.housing_available && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                                Student Housing
                            </span>
                        )}
                        {uni.scholarship_available && (
                            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
                                Scholarships
                            </span>
                        )}
                        {uni.virtual_tour_available && (
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                                Virtual Tour
                            </span>
                        )}
                    </div>
                </div>

                {uni.application_link && (
                    <a
                        href={uni.application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700"
                    >
                        <span>Apply Now</span>
                        <ExternalLink className="h-4 w-4" />
                    </a>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Mobile View */}
            <div className="block md:hidden">
                {universities.map((uni) => (
                    <div key={uni.id} className="mb-4 bg-white rounded-lg shadow-sm">
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-medium text-gray-900">{uni.name}</h3>
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${uni.status === 'Open'
                                    ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                    : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                                    }`}>
                                    {uni.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span>{uni.location || 'TBA'}</span>
                                </div>
                                <div className={`flex items-center gap-2 ${!isSignedIn && 'blur-sm'}`}>
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span>{uni.deadline || 'TBA'}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleRow(uni.id)}
                                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                            >
                                {expandedRows.has(uni.id) ?
                                    <>Less details <ChevronUp className="h-4 w-4" /></> :
                                    <>More details <ChevronDown className="h-4 w-4" />
                                    </>}
                            </button>
                        </div>

                        {expandedRows.has(uni.id) && (
                            <div className="border-t border-gray-100">
                                {renderExpandedContent(uni)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-hidden bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left p-4 font-medium text-gray-900">University</th>
                                <th className="text-left p-4 font-medium text-gray-900">Location</th>
                                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                                <th className="text-left p-4 font-medium text-gray-900">Deadline</th>
                                <th className="text-left p-4 font-medium text-gray-900">Requirements</th>
                                <th className="text-center p-4 font-medium text-gray-900">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {universities.map((uni) => (
                                <React.Fragment key={uni.id}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{uni.name}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                {uni.location || 'TBA'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${uni.status === 'Open'
                                                ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                                : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                                                }`}>
                                                {uni.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className={`flex items-center gap-2 ${!isSignedIn && 'blur-sm'}`}>
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                {uni.deadline || 'TBA'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4 text-gray-500" />
                                                {formatCGPA(uni.cgpa_requirement)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => toggleRow(uni.id)}
                                                className="text-teal-600 hover:text-white"
                                            >
                                                {expandedRows.has(uni.id) ?
                                                    <ChevronUp className="text-white h-5 w-5 inline" /> :
                                                    <ChevronDown className="h-5 w-5 inline" />
                                                }
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRows.has(uni.id) && (
                                        <tr>
                                            <td colSpan={6} className="bg-gray-50">
                                                {renderExpandedContent(uni)}
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