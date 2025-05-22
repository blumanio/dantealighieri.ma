'use client'
import React, { useEffect, useState }
from 'react';
import { Check, ChevronRight, Clock, BadgeCheck, GraduationCap, ShieldCheck, X } from 'lucide-react'; // Added X for modal close

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
    confirmed: boolean; // This will be set via the modal
}

const SinglePageFormWithModal = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setGlobalSubmitError] = useState<string | null>(null); // For API errors
    const [isMounted, setIsMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null); // For errors within the modal
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const initialFormData: FormData = {
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
    };

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
        // Add more as needed or keep the full list from your original code
        { code: '+212', country: 'Morocco 🇲🇦' },
    ];

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
        else if (!/^\d{8,}$/.test(formData.whatsapp)) newErrors.whatsapp = 'Please enter a valid phone number (min 8 digits), without country code.';

        if (!formData.lastDegree.trim()) newErrors.lastDegree = 'Last degree is required';
        if (!formData.graduationYear.trim()) newErrors.graduationYear = 'Graduation year is required';
        if (!formData.degreePoints.trim()) newErrors.degreePoints = 'Degree points/grade is required';
        if (!formData.studyPreference.trim()) newErrors.studyPreference = 'Study preference is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked; // For checkbox

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear validation error for the field being changed
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        setFormData(prev => ({
            ...prev,
            whatsapp: value
        }));
        if (errors.whatsapp) {
            setErrors(prevErrors => ({ ...prevErrors, whatsapp: '' }));
        }
    };

    const executeApiSubmission = async () => {
        setIsSubmitting(true);
        setGlobalSubmitError(null);
        setShowSuccessMessage(false);

        try {
            // Ensure 'confirmed' is true before actual submission (should be, due to prior checks)
            if (!formData.confirmed) {
                // This case should ideally not be hit if logic is correct, but as a safeguard:
                setGlobalSubmitError("Confirmation was not properly set. Please try again.");
                setIsModalOpen(true); // Re-open modal if confirmation somehow lost
                setIsSubmitting(false);
                return;
            }

            const submissionData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                countryCode: formData.countryCode,
                whatsapp: formData.whatsapp,
                lastDegree: formData.lastDegree,
                graduationYear: formData.graduationYear,
                degreePoints: formData.degreePoints,
                studyPreference: formData.studyPreference
                // 'confirmed' is usually a client-side check, backend might not need it
            };

            console.log('Submission data:', submissionData);

            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });

            const responseText = await response.text();
            console.log('Response status:', response.status, 'Response text:', responseText);

            let responseData;
            try {
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error('Error parsing response as JSON:', parseError);
                throw new Error(responseText || 'Invalid response format from server');
            }

            if (!response.ok) {
                const errorMessage = responseData?.message || (responseText && responseText.length < 500 ? responseText : `Server error: ${response.status}`);
                throw new Error(errorMessage);
            }
            
            // Assuming backend returns a success indicator or created resource
            if (responseData.id || responseData.success || response.status === 200 || response.status === 201) {
                setShowSuccessMessage(true);
                setFormData(initialFormData); // Reset form
                setErrors({});
                window.scrollTo(0, 0);
            } else {
                throw new Error(responseData.message || 'Submission was not successful.');
            }

        } catch (error) {
            console.error('Submission error:', error);
            setGlobalSubmitError((error as Error).message || 'Failed to submit. Please try again.');
            setShowSuccessMessage(false); // Ensure success message is hidden on error
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMainFormSubmit = async (e?: React.SyntheticEvent) => {
        if (e) e.preventDefault();
        if (isSubmitting) return;

        setGlobalSubmitError(null); // Clear previous global errors
        setShowSuccessMessage(false); // Hide success message on new attempt

        const isFormValid = validateForm();
        if (!isFormValid) {
            // Scroll to the first error if possible (optional enhancement)
            const firstErrorKey = Object.keys(errors).find(key => errors[key]);
            if (firstErrorKey) {
                const errorElement = document.getElementsByName(firstErrorKey)[0];
                errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        if (!formData.confirmed) {
            setModalError(null); // Clear previous modal-specific errors
            setIsModalOpen(true);
            return; // Stop and let the modal handle confirmation
        }

        // If form is valid and already confirmed, proceed to submit
        await executeApiSubmission();
    };

    const handleModalConfirm = async () => {
        if (!formData.confirmed) { // Check if checkbox (bound to formData.confirmed) is ticked
            setModalError("You must agree to the terms by checking the box above.");
            return;
        }
        setModalError(null);
        setIsModalOpen(false);
        // Automatically proceed to submit the main form data
        await executeApiSubmission();
    };

    if (!isMounted) return null;

    if (showSuccessMessage) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">Thank You!</h3>
                    <p className="text-gray-600 text-lg">
                        We'll contact you soon via WhatsApp ({formData.countryCode} {initialFormData.whatsapp || formData.whatsapp}) or email with next steps.
                    </p>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            Our team will review your application and contact you within 24 hours to discuss your educational journey in Italy.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setShowSuccessMessage(false);
                            // Optionally, navigate away or offer another action
                        }}
                        className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                    >
                        Submit Another Application
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
            <div className="max-w-xl mx-auto p-4 sm:p-0">
                <form onSubmit={handleMainFormSubmit} className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-8">
                    <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Apply to Study in Italy</h1>

                    {submitError && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
                            <p className="font-semibold">Submission Failed</p>
                            <p>{submitError}</p>
                        </div>
                    )}

                    {/* Personal Information */}
                    <fieldset className="space-y-6">
                        <legend className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</legend>
                        <div>
                            <label htmlFor="firstName" className="block text-base font-medium text-gray-700 mb-1">First Name</label>
                            <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`w-full p-3 border rounded-lg text-base focus:ring-2 ${errors.firstName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-teal-500'}`} placeholder="Enter your first name" />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-base font-medium text-gray-700 mb-1">Last Name</label>
                            <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`w-full p-3 border rounded-lg text-base focus:ring-2 ${errors.lastName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-teal-500'}`} placeholder="Enter your last name" />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                    </fieldset>

                    {/* Contact Information */}
                    <fieldset className="space-y-6">
                        <legend className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Contact Information</legend>
                        <div>
                            <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">Email</label>
                            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full p-3 border rounded-lg text-base focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-teal-500'}`} placeholder="Enter your email" />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="whatsapp" className="block text-base font-medium text-gray-700 mb-1">WhatsApp Number</label>
                            <div className="flex gap-2">
                                <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-teal-500 bg-white">
                                    {countryCodes.map(({ code, country }) => ( <option key={code} value={code}>{country} ({code})</option> ))}
                                </select>
                                <input id="whatsapp" type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleWhatsappChange} className={`flex-1 p-3 border rounded-lg text-base focus:ring-2 ${errors.whatsapp ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-teal-500'}`} placeholder="1234567890" />
                            </div>
                            {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
                            <p className="text-gray-500 text-xs mt-1">Enter your number without the country code.</p>
                        </div>
                    </fieldset>

                    {/* Education Details */}
                    <fieldset className="space-y-6">
                        <legend className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Education Details</legend>
                        <div>
                            <label htmlFor="lastDegree" className="block text-base font-medium text-gray-700 mb-1">Last Degree</label>
                            <select id="lastDegree" name="lastDegree" value={formData.lastDegree} onChange={handleChange} className={`w-full p-3 border rounded-lg text-base focus:ring-2 bg-white ${errors.lastDegree ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-teal-500'}`}>
                                <option value="">Select your last degree</option>
                                <option value="High School">High School</option>
                                <option value="Bachelor">Bachelor's Degree</option>
                                <option value="Master">Master's Degree</option>
                                <option value="PhD">PhD</option>
                            </select>
                            {errors.lastDegree && <p className="text-red-500 text-sm mt-1">{errors.lastDegree}</p>}
                        </div>
                        <div>
                            <label htmlFor="graduationYear" className="block text-base font-medium text-gray-700 mb-1">Graduation Year</label>
                            <select id="graduationYear" name="graduationYear" value={formData.graduationYear} onChange={handleChange} className={`w-full p-3 border rounded-lg text-base focus:ring-2 bg-white ${errors.graduationYear ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-teal-500'}`}>
                                <option value="">Select graduation year</option>
                                {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(year => ( <option key={year} value={year}>{year}</option> ))}
                            </select>
                            {errors.graduationYear && <p className="text-red-500 text-sm mt-1">{errors.graduationYear}</p>}
                        </div>
                        <div>
                            <label htmlFor="degreePoints" className="block text-base font-medium text-gray-700 mb-1">Degree Points/Grade</label>
                            <input id="degreePoints" type="text" name="degreePoints" value={formData.degreePoints} onChange={handleChange} className={`w-full p-3 border rounded-lg text-base focus:ring-2 ${errors.degreePoints ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-teal-500'}`} placeholder="e.g., 3.5/4.0 or 88%" />
                            {errors.degreePoints && <p className="text-red-500 text-sm mt-1">{errors.degreePoints}</p>}
                        </div>
                    </fieldset>

                    {/* Study Preferences */}
                    <fieldset className="space-y-6">
                        <legend className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Study Preferences</legend>
                        <div>
                            <label htmlFor="studyPreference" className="block text-base font-medium text-gray-700 mb-1">What do you want to study in Italy?</label>
                            <textarea id="studyPreference" name="studyPreference" value={formData.studyPreference} onChange={handleChange} rows={4} className={`w-full p-3 border rounded-lg text-base focus:ring-2 ${errors.studyPreference ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-teal-500'}`} placeholder="Describe what you would like to study (e.g., subject, degree level, specific interests)"></textarea>
                            {errors.studyPreference && <p className="text-red-500 text-sm mt-1">{errors.studyPreference}</p>}
                        </div>
                    </fieldset>
                    
                    <div className="pt-6 border-t">
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-medium text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-70"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Proceed to Confirmation <ChevronRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Ready to Start Your Journey?</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <p className="text-gray-600 text-base">Our premium service includes:</p>
                        <div className="space-y-4">
                            {/* Service Details - copied from original step 5 */}
                            <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm">Professional Guidance</h3>
                                    <p className="text-gray-600 text-xs">Expert consultation throughout your application process.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm">University Selection</h3>
                                    <p className="text-gray-600 text-xs">Personalized university recommendations.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                                <Clock className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm">Time-Saving</h3>
                                    <p className="text-gray-600 text-xs">We handle paperwork and university communications.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                                <BadgeCheck className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm">High Success Rate</h3>
                                    <p className="text-gray-600 text-xs">Over 90% admission success for our students.</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-b py-4 my-4">
                            <div className="text-center mb-4">
                                <p className="text-xl font-bold text-gray-900">Service Fee: €500</p>
                                <p className="text-gray-600 text-sm mt-1">An investment in your educational future.</p>
                            </div>
                            <div className="flex items-start gap-2 bg-yellow-50 p-3 rounded-lg">
                                <div className="text-yellow-600 mt-0.5">⚡</div>
                                <p className="text-xs text-gray-700">
                                    <strong>Early Bird Discount:</strong> Apply now for a <span className="text-green-600 font-semibold">€100 discount!</span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="confirmed" // Binds to formData.confirmed
                                    checked={formData.confirmed}
                                    onChange={handleChange} // Uses the main handleChange
                                    className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                />
                                <span className="text-gray-700 text-sm">
                                    I understand this is a paid service and I'm committed to pursuing my education in Italy. I agree to pay the service fee once my application process begins with your team.
                                </span>
                            </label>
                            {modalError && <p className="text-red-500 text-xs mt-2 text-center">{modalError}</p>}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleModalConfirm}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 active:bg-teal-800 transition-colors disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                    </>
                                ) : (
                                    "Agree & Submit Application"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SinglePageFormWithModal;