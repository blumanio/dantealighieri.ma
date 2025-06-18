'use client'
import { Metadata } from 'next';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function OnboardingPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        interest: '',
        userType: 'student',
        currentStudyLevel: '',
        graduationYear: '',
        fieldOfInterest: '',
        studyAbroadStage: 'researching',
    });
    const [courseAreas, setCourseAreas] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseAreas = async () => {
            try {
                // This is a placeholder for the actual API endpoint
                // that should be created to fetch distinct course areas.
                // For now, using a static list.
                const areas = ["Engineering", "Business", "Arts & Humanities", "Health Sciences", "Social Sciences", "Natural Sciences"];
                setCourseAreas(areas);
            } catch (error) {
                console.error("Failed to fetch course areas", error);
            }
        };

        fetchCourseAreas();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/user-profile-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile.');
            }

            router.push('/dashboard'); // Redirect to a dashboard or home page after successful onboarding
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
            <header className="relative bg-white shadow-soft">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="group">
                            <h1 className="text-2xl md:text-3xl font-bold text-primary group-hover:text-primary-dark transition-colors duration-300">
                                Welcome! Tell us about yourself.
                            </h1>
                            <p className="mt-2 text-sm text-textSecondary group-hover:text-primary transition-colors duration-300">
                                This will help us customize your experience.
                            </p>
                        </div>
                        <Image
                            src="/images/logo.svg"
                            alt="Logo"
                            width={120}
                            height={40}
                            className="h-10 w-auto transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
            </header>

            <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="interest" className="block text-sm font-medium text-gray-700">What level of study are you interested in?</label>
                                <select id="interest" name="interest" value={formData.interest} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option value="">Select...</option>
                                    <option value="bachelor">Bachelor's Degree</option>
                                    <option value="master">Master's Degree</option>
                                    <option value="phd">PhD</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Are you a...</label>
                                <div className="mt-2 space-y-2">
                                    <label className="inline-flex items-center">
                                        <input type="radio" name="userType" value="student" checked={formData.userType === 'student'} onChange={handleChange} className="text-indigo-600"/>
                                        <span className="ml-2">Student</span>
                                    </label>
                                    <label className="inline-flex items-center ml-6">
                                        <input type="radio" name="userType" value="parent" checked={formData.userType === 'parent'} onChange={handleChange} className="text-indigo-600"/>
                                        <span className="ml-2">Parent</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="currentStudyLevel" className="block text-sm font-medium text-gray-700">What is your current level of study?</label>
                                <input type="text" name="currentStudyLevel" id="currentStudyLevel" value={formData.currentStudyLevel} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                            </div>

                            <div>
                                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">When do you expect to graduate?</label>
                                <input type="text" name="graduationYear" id="graduationYear" value={formData.graduationYear} onChange={handleChange} placeholder="e.g., 2025" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                            </div>

                            <div>
                                <label htmlFor="fieldOfInterest" className="block text-sm font-medium text-gray-700">What is your field of interest?</label>
                                <select id="fieldOfInterest" name="fieldOfInterest" value={formData.fieldOfInterest} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option value="">Select a field</option>
                                    {courseAreas.map(area => <option key={area} value={area}>{area}</option>)}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="studyAbroadStage" className="block text-sm font-medium text-gray-700">What stage are you at in your study abroad journey?</label>
                                <select id="studyAbroadStage" name="studyAbroadStage" value={formData.studyAbroadStage} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option value="researching">Just starting to research</option>
                                    <option value="shortlisting">Shortlisting universities</option>
                                    <option value="testing">Preparing for/taken tests</option>
                                    <option value="applied">Applied to universities</option>
                                </select>
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <div className="text-right">
                                <button type="submit" disabled={isSubmitting} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                    {isSubmitting ? 'Saving...' : 'Save and Continue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}