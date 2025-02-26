'use client'
import React, { useEffect, useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Clock, BadgeCheck, GraduationCap, ShieldCheck } from 'lucide-react';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    whatsapp: string;
    lastDegree: string;
    graduationYear: string;
    degreePoints: string;
    studyPreference: string;
    confirmed: boolean;
}

const MultiStepForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    // Add country code to the form data
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '+20', // Default to Egypt
        whatsapp: '',
        lastDegree: '',
        graduationYear: '',
        studyPreference: '',
        confirmed: false,
        degreePoints: ''
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // MENA country codes
    const countryCodes = [
        { code: '+20', country: 'Egypt 🇪🇬' },
        { code: '+966', country: 'Saudi Arabia 🇸🇦' },
        { code: '+971', country: 'UAE 🇦🇪' },
        { code: '+974', country: 'Qatar 🇶🇦' },
        { code: '+973', country: 'Bahrain 🇧🇭' },
        { code: '+968', country: 'Oman 🇴🇲' },
        { code: '+965', country: 'Kuwait 🇰🇼' },
        { code: '+962', country: 'Jordan 🇯🇴' },
        { code: '+961', country: 'Lebanon 🇱🇧' },
        { code: '+963', country: 'Syria 🇸🇾' },
        { code: '+964', country: 'Iraq 🇮🇶' },
        { code: '+967', country: 'Yemen 🇾🇪' },
        { code: '+216', country: 'Tunisia 🇹🇳' },
        { code: '+213', country: 'Algeria 🇩🇿' },
        { code: '+212', country: 'Morocco 🇲🇦' },
        { code: '+218', country: 'Libya 🇱🇾' }
    ];
    // Inside your MultiStepForm component
    // Inside your MultiStepForm component
    const handleSubmit = async (e?: React.SyntheticEvent) => {
        // if (e) {
        //     e.preventDefault();
        //     e.stopPropagation();
        // }

        if (!validateStep(5) || isSubmitting) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await fetch('https://backend-jxkf29se8-mohamed-el-aammaris-projects.vercel.app/api/applications', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            alert(`submitting: ${response.ok}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit application');
            }

            if (data.success) {
                setCurrentStep(6);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitError((error as Error).message || 'Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Prevent render until mounted to avoid hydration issues
    if (!isMounted) {
        return null;
    }
    const validateStep = (step: number) => {
        const newErrors: { [key: string]: string } = {};

        switch (step) {
            case 1:
                if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
                if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
                break;
            case 2:
                if (!formData.email.trim()) newErrors.email = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
                if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
                else if (!/^\d{8,}$/.test(formData.whatsapp)) newErrors.whatsapp = 'Please enter a valid phone number without country code';
                break;
            case 3:
                if (!formData.lastDegree.trim()) newErrors.lastDegree = 'Last degree is required';
                if (!formData.graduationYear.trim()) newErrors.graduationYear = 'Graduation year is required';
                if (!formData.degreePoints.trim()) newErrors.degreePoints = 'Degree points are required';
                break;
            case 4:
                if (!formData.studyPreference.trim()) newErrors.studyPreference = 'Study preference is required';
                break;
            case 5:
                if (!formData.confirmed) newErrors.confirmed = 'Please confirm your commitment to proceed';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        setFormData(prev => ({
            ...prev,
            whatsapp: value
        }));
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    // ... Previous render step cases remain the same except for case 2 (Contact Information)

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full p-4 border rounded-xl text-lg focus:ring-2 focus:ring-teal-500"
                                placeholder="Enter your first name"
                            />
                            {errors.firstName && <p className="text-red-500 text-base mt-2">{errors.firstName}</p>}
                        </div>
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-4 border rounded-xl text-lg focus:ring-2 focus:ring-teal-500"
                                placeholder="Enter your last name"
                            />
                            {errors.lastName && <p className="text-red-500 text-base mt-2">{errors.lastName}</p>}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-4 border rounded-xl text-lg focus:ring-2 focus:ring-teal-500"
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-500 text-base mt-2">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">WhatsApp Number</label>
                            <div className="flex gap-2">
                                <select
                                    name="countryCode"
                                    value={formData.countryCode}
                                    onChange={handleChange}
                                    className="p-4 border rounded-xl text-lg focus:ring-2 focus:ring-teal-500 bg-white"
                                >
                                    {countryCodes.map(({ code, country }) => (
                                        <option key={code} value={code}>
                                            {country} ({code})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleWhatsappChange}
                                    className="flex-1 p-4 border rounded-xl text-lg focus:ring-2 focus:ring-teal-500"
                                    placeholder="1234567890"
                                />
                            </div>
                            {errors.whatsapp && <p className="text-red-500 text-base mt-2">{errors.whatsapp}</p>}
                            <p className="text-gray-500 text-sm mt-2">Enter your number without the country code</p>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Education Details</h2>
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Last Degree</label>
                            <select
                                name="lastDegree"
                                value={formData.lastDegree}
                                onChange={handleChange}
                                className="w-full p-4 border rounded-xl text-lg focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="">Select your last degree</option>
                                <option value="High School">High School</option>
                                <option value="Bachelor">Bachelor's Degree</option>
                                <option value="Master">Master's Degree</option>
                                <option value="PhD">PhD</option>
                            </select>
                            {errors.lastDegree && <p className="text-red-500 text-base mt-2">{errors.lastDegree}</p>}
                        </div>
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Graduation Year</label>
                            <select
                                name="graduationYear"
                                value={formData.graduationYear}
                                onChange={handleChange}
                                className="w-full p-4 border rounded-xl text-lg focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="">Select graduation year</option>
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            {errors.graduationYear && <p className="text-red-500 text-base mt-2">{errors.graduationYear}</p>}
                        </div>
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Degree Points/Grade</label>
                            <input
                                type="text"
                                name="degreePoints"
                                value={formData.degreePoints}
                                onChange={handleChange}
                                className="w-full p-4 border rounded-xl text-lg focus:ring-2 focus:ring-teal-500"
                                placeholder="Enter your grade (e.g., 3.5/4.0)"
                            />
                            {errors.degreePoints && <p className="text-red-500 text-base mt-2">{errors.degreePoints}</p>}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Study Preferences</h2>
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">What do you want to study in Italy?</label>
                            <textarea
                                name="studyPreference"
                                value={formData.studyPreference}
                                onChange={handleChange}
                                className="w-full p-4 border rounded-xl text-lg focus:ring-2 focus:ring-teal-500 h-40"
                                placeholder="Describe what you would like to study"
                            />
                            {errors.studyPreference && <p className="text-red-500 text-base mt-2">{errors.studyPreference}</p>}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
                            <p className="text-gray-600 text-lg">Our premium service includes:</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Professional Guidance</h3>
                                    <p className="text-gray-600">Expert consultation throughout your application process with dedicated support</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">University Selection</h3>
                                    <p className="text-gray-600">Personalized university recommendations based on your profile and preferences</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-lg">
                                <Clock className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Time-Saving</h3>
                                    <p className="text-gray-600">We handle paperwork and communicate with universities on your behalf</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-lg">
                                <BadgeCheck className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Success Rate</h3>
                                    <p className="text-gray-600">Over 90% of our students successfully secure university admissions</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-b py-6 my-6">
                            <div className="text-center mb-6">
                                <p className="text-2xl font-bold text-gray-900">Service Fee: €500</p>
                                <p className="text-gray-600 mt-2">Investment in your educational future</p>
                            </div>

                            <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-lg">
                                <div className="min-w-4 mt-1">⚡</div>
                                <p className="text-sm text-gray-700">
                                    <strong>Early Bird Discount:</strong> Submit your application now and get a <span className="text-green-600 font-semibold">€100 discount</span> on our service fee!
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    name="confirmed"
                                    checked={formData.confirmed}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmed: e.target.checked }))}
                                    className="mt-1.5 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                />
                                <span className="text-gray-700">
                                    I understand this is a paid service and I'm committed to pursuing my education in Italy. I agree to pay the service fee once my application is accepted.
                                </span>
                            </label>
                            {errors.confirmed && <p className="text-red-500 text-sm mt-2">{errors.confirmed}</p>}
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="text-center space-y-6 py-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Check className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900">Thank You!</h3>
                        <p className="text-gray-600 text-lg">
                            We'll contact you soon via WhatsApp ({formData.countryCode} {formData.whatsapp}) or email with next steps.
                        </p>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                Our team will review your application and contact you within 24 hours to discuss your educational journey in Italy.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-xl mx-auto p-4 sm:p-6">
                <div className="mb-6">
                    <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={`flex flex-col items-center ${step <= currentStep ? 'text-teal-600' : 'text-gray-300'
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step < currentStep
                                        ? 'border-teal-600 bg-teal-600 text-white'
                                        : step === currentStep
                                            ? 'border-teal-600 text-teal-600'
                                            : 'border-gray-300'
                                        }`}
                                >
                                    {step < currentStep ? <Check className="w-5 h-5" /> : step}
                                </div>
                                <div className="h-1 w-full mt-2">
                                    <div
                                        className={`h-full ${step < currentStep ? 'bg-teal-600' : 'bg-gray-200'
                                            }`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    {renderStep()}
                </div>

                {currentStep < 6 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center z-50">
                        {currentStep > 1 ? (
                            <button
                                type="button"

                                onClick={(e) => {
                                    e.preventDefault();
                                    handleBack();
                                }}
                                className="flex items-center justify-center px-6 py-4 text-teal-600 font-medium 
                          cursor-pointer select-none touch-manipulation tap-highlight-transparent"
                                style={{
                                    WebkitTapHighlightColor: 'transparent',
                                    WebkitTouchCallout: 'none',
                                    WebkitUserSelect: 'none',
                                    userSelect: 'none'
                                }}
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Back
                            </button>
                        ) : (
                            <div className="w-20"></div>
                        )}
                        <button
                            type="button"

                            onClick={(e) => {
                                e.preventDefault();
                                if (currentStep === 5) {
                                    alert(`currentStep: ${currentStep}`);

                                    handleSubmit();
                                } else {
                                    handleNext();
                                }
                            }}
                            className={`flex items-center justify-center px-8 py-4 
                      ${currentStep === 5
                                    ? 'bg-blue-600 active:bg-blue-700'
                                    : 'bg-teal-600 active:bg-teal-700'
                                } text-white rounded-xl font-medium text-lg transition-colors
                      cursor-pointer select-none touch-manipulation tap-highlight-transparent
                      min-w-[140px] min-h-[56px]`}
                            style={{
                                WebkitTapHighlightColor: 'transparent',
                                WebkitTouchCallout: 'none',
                                WebkitUserSelect: 'none',
                                userSelect: 'none'
                            }}
                            disabled={currentStep === 5 && !formData.confirmed}
                        >
                            {currentStep === 5 ? (
                                <div className="flex items-center">
                                    Submit Application
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    Next
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </div>
                            )}
                        </button>
                    </div>
                )}

                {currentStep < 6 && <div className="h-20" />}
            </div>
        </div>
    );
};

export default MultiStepForm;