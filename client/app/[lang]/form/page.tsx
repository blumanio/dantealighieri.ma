'use client';
import React, { useState } from 'react';
import {
    GraduationCap,
    ChevronLeft,
    ChevronRight,
    Info,
    Crown,
    Star,
    CheckCircle,
    BookOpen,
    Brain,
    Calculator,
    PenTool,
    Award,
    Target,
    Search,
    Plus,
    Globe,
    School,
    MapPin,
    FileText,
    Languages,
} from 'lucide-react';

export default function TestScoresForm() {
    const [currentStep, setCurrentStep] = useState(1);
    type FormData = {
        degreeType: string;
        studyLocation: string;
        coursesOfInterest: string[];
        courseSearch: string;
        undergradCollege: string;
        undergradMajor: string;
        undergradScore: string;
        undergradScoreType: string;
        backlogs: string;
        languageTest: string;
        languageTestScore: string;
        aptitudeTest: string;
        verbalScore: string;
        quantsScore: string;
        awaScore: string;
        preferences: string;
        additionalInfo: string;
        complete: boolean;
    };

    type Errors = Partial<Record<keyof FormData, string>>;

    const [formData, setFormData] = useState<FormData>({
        // Step 1: Study Plans
        degreeType: '',
        studyLocation: '',
        coursesOfInterest: [],
        courseSearch: '',

        // Step 2: Undergraduate Info
        undergradCollege: '',
        undergradMajor: '',
        undergradScore: '',
        undergradScoreType: '10 CGPA',
        backlogs: '',

        // Step 3: Test Scores Step
        languageTest: '',
        languageTestScore: '',
        aptitudeTest: '',
        verbalScore: '',
        quantsScore: '',
        awaScore: '',

        // Step 4: Academic Goals
        preferences: '',

        // Step 5: Preferences
        additionalInfo: '',

        // Step 6: Complete
        complete: false,
    });

    const [errors, setErrors] = useState<Errors>({});

    const steps = [
        { id: 1, title: 'Study Plans', icon: Target },
        { id: 2, title: 'Undergrad Info', icon: School },
        { id: 3, title: 'Test Scores', icon: Award },
        { id: 4, title: 'Academic Goals', icon: Brain },
        { id: 5, title: 'Preferences', icon: Star },
        { id: 6, title: 'Complete', icon: CheckCircle },
    ];
    
    // Updated data for Step 3
    const englishTests = [
        { id: 'TOEFL', label: 'TOEFL', color: 'orange' },
        { id: 'IELTS', label: 'IELTS', color: 'blue' },
        { id: 'PTE', label: 'PTE', color: 'purple' },
        { id: 'Duolingo', label: 'Duolingo', color: 'green' },
    ];
    
    const italianTests = [
        { id: 'B1_CERT', label: 'B1 Certificate', color: 'red' },
        { id: 'B2_CERT', label: 'B2 Certificate', color: 'red' },
        { id: 'CISIA', label: 'CISIA', color: 'red' },
        { id: 'RECOGNIZED_DIPLOMA', label: 'Recognized Diploma', color: 'red' },
    ];

    const aptitudeTests = [
        { id: 'GRE', label: 'GRE', color: 'teal' },
        { id: 'GMAT', label: 'GMAT', color: 'indigo' },
        { id: 'None', label: 'None', color: 'slate' },
    ];
    
    const isEnglishTest = englishTests.some(test => test.id === formData.languageTest);

    const degreeTypes = [
        { id: 'bachelors', label: 'Bachelors', color: 'orange' },
        { id: 'masters', label: 'Masters/MBA', color: 'orange' },
    ];

    const studyLocations = [
        'United States',
        'United Kingdom',
        'Canada',
        'Australia',
        'Germany',
        'Italy',
        'France',
        'Netherlands',
        'Sweden',
        'Other',
    ];

    const undergradMajors = [
        'Computer Science',
        'Engineering',
        'Business Administration',
        'Accounting',
        'Finance',
        'Economics',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Psychology',
        'Other',
    ];

    const availableCourses = [
        'Computer Science',
        'Data Science and Data Analytics',
        'Business Analytics',
        'Mechanical Engineering',
        'Management Information Systems',
        'Artificial Intelligence',
        'Software Engineering',
        'Business Administration',
        'Finance',
        'Marketing',
        'Psychology',
        'Biology',
        'Chemistry',
        'Physics',
        'Mathematics',
    ];

    const filteredCourses = availableCourses.filter(
        course =>
            course.toLowerCase().includes(formData.courseSearch.toLowerCase()) &&
            !formData.coursesOfInterest.includes(course)
    );

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: '',
            }));
        }
    };
    
    const handleTestSelection = (field: keyof FormData, value: string) => {
        const isSameValue = formData[field] === value;
        
        handleInputChange(field, isSameValue ? '' : value);

        // Reset scores if test type changes
        if (field === 'languageTest' && !isSameValue) {
            handleInputChange('languageTestScore', '');
        }
        if (field === 'aptitudeTest' && !isSameValue) {
            handleInputChange('verbalScore', '');
            handleInputChange('quantsScore', '');
            handleInputChange('awaScore', '');
        }
    };

    const handleCourseToggle = (course: string) => {
        if (formData.coursesOfInterest.includes(course)) {
            handleInputChange(
                'coursesOfInterest',
                formData.coursesOfInterest.filter(c => c !== course)
            );
        } else if (formData.coursesOfInterest.length < 3) {
            handleInputChange('coursesOfInterest', [...formData.coursesOfInterest, course]);
        }
    };

    const validateStep = (step: number) => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        switch (step) {
            case 1:
                if (!formData.degreeType) newErrors.degreeType = 'Please select a degree type';
                if (!formData.studyLocation) newErrors.studyLocation = 'Please select a study location';
                if (formData.coursesOfInterest.length === 0)
                    newErrors.coursesOfInterest = 'Please select at least one course';
                break;
            case 2:
                if (!formData.undergradCollege)
                    newErrors.undergradCollege = 'Please enter your undergraduate college';
                if (!formData.undergradMajor) newErrors.undergradMajor = 'Please select your major';
                if (!formData.undergradScore) newErrors.undergradScore = 'Please enter your score';
                break;
            case 3:
                if (!formData.languageTest) newErrors.languageTest = 'Please select a language test or certification';
                if (isEnglishTest && !formData.languageTestScore) {
                    newErrors.languageTestScore = 'Overall score is required';
                }
                if (formData.aptitudeTest === 'GRE' || formData.aptitudeTest === 'GMAT') {
                    if(!formData.verbalScore) newErrors.verbalScore = 'Required';
                    if(!formData.quantsScore) newErrors.quantsScore = 'Required';
                    if(!formData.awaScore) newErrors.awaScore = 'Required';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 6));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-8">
                        {/* Degree Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-xl">
                                    <GraduationCap className="h-5 w-5 text-emerald-700" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    What degree do you plan to study? <span className="text-red-500">*</span>
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {degreeTypes.map(degree => (
                                    <button
                                        key={degree.id}
                                        type="button"
                                        onClick={() => handleInputChange('degreeType', degree.id)}
                                        className={`p-6 rounded-2xl border-2 font-bold transition-all duration-300 hover:scale-[1.02] ${
                                            formData.degreeType === degree.id
                                                ? `border-${degree.color}-500 bg-${degree.color}-50 text-${degree.color}-700 shadow-lg`
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                        }`}
                                    >
                                        {degree.label}
                                    </button>
                                ))}
                            </div>

                            {errors.degreeType && (
                                <p className="text-red-500 text-sm font-semibold">{errors.degreeType}</p>
                            )}
                        </div>

                        {/* Study Location Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                    <MapPin className="h-5 w-5 text-blue-700" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    Where do you want to study? <span className="text-red-500">*</span>
                                </h3>
                            </div>

                            <select
                                value={formData.studyLocation}
                                onChange={e => handleInputChange('studyLocation', e.target.value)}
                                className={`w-full px-4 py-4 text-base font-medium border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all duration-300 hover:bg-white ${
                                    errors.studyLocation ? 'border-red-500' : 'border-slate-200 hover:border-blue-300'
                                }`}
                            >
                                <option value="">Select Country</option>
                                {studyLocations.map(location => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>

                            {errors.studyLocation && (
                                <p className="text-red-500 text-sm font-semibold">{errors.studyLocation}</p>
                            )}
                        </div>

                        {/* Courses Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-xl">
                                    <BookOpen className="h-5 w-5 text-purple-700" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    What are you planning to study? <span className="text-red-500">*</span>
                                </h3>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.courseSearch}
                                    onChange={e => handleInputChange('courseSearch', e.target.value)}
                                    placeholder="Search Courses"
                                    className="w-full pl-12 pr-4 py-4 text-base font-medium border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all duration-300 hover:bg-white"
                                />
                            </div>

                            <div className="text-sm text-slate-600 font-semibold">
                                Choose up to 3 courses ({formData.coursesOfInterest.length}/3 selected)
                            </div>

                            {formData.coursesOfInterest.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-slate-700">Selected Courses:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.coursesOfInterest.map(course => (
                                            <button
                                                key={course}
                                                type="button"
                                                onClick={() => handleCourseToggle(course)}
                                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl border border-blue-200 font-semibold hover:bg-blue-200 transition-colors duration-300"
                                            >
                                                {course} ×
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2">
                                    {filteredCourses.slice(0, 10).map(course => (
                                        <button
                                            key={course}
                                            type="button"
                                            onClick={() => handleCourseToggle(course)}
                                            disabled={formData.coursesOfInterest.length >= 3}
                                            className={`px-4 py-2 rounded-xl border font-semibold transition-all duration-300 hover:scale-[1.02] ${
                                                formData.coursesOfInterest.length >= 3
                                                    ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                        >
                                            {course}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {errors.coursesOfInterest && (
                                <p className="text-red-500 text-sm font-semibold">{errors.coursesOfInterest}</p>
                            )}
                        </div>
                    </div>
                );

            case 2:
                 return (
                    <div className="space-y-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Tell us all about your undergrad</h2>
                            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700">
                                What was your undergraduate college name? <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.undergradCollege}
                                onChange={e => handleInputChange('undergradCollege', e.target.value)}
                                placeholder="e.g., Gurukul Institute of Engineering & Technology"
                                className={`w-full px-4 py-4 text-base font-medium border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all duration-300 hover:bg-white ${
                                    errors.undergradCollege ? 'border-red-500' : 'border-slate-200 hover:border-blue-300'
                                }`}
                            />
                            {errors.undergradCollege && (
                                <p className="text-red-500 text-sm font-semibold">{errors.undergradCollege}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700">
                                Which course did you major in? <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.undergradMajor}
                                onChange={e => handleInputChange('undergradMajor', e.target.value)}
                                className={`w-full px-4 py-4 text-base font-medium border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all duration-300 hover:bg-white ${
                                    errors.undergradMajor ? 'border-red-500' : 'border-slate-200 hover:border-blue-300'
                                }`}
                            >
                                <option value="">Select Major</option>
                                {undergradMajors.map(major => (
                                    <option key={major} value={major}>
                                        {major}
                                    </option>
                                ))}
                            </select>
                            {errors.undergradMajor && (
                                <p className="text-red-500 text-sm font-semibold">{errors.undergradMajor}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-slate-700">
                                    What is your score/expected score? <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.undergradScore}
                                    onChange={e => handleInputChange('undergradScore', e.target.value)}
                                    placeholder="8"
                                    className={`w-full px-4 py-4 text-base font-medium border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all duration-300 hover:bg-white ${
                                        errors.undergradScore ? 'border-red-500' : 'border-slate-200 hover:border-blue-300'
                                    }`}
                                />
                                {errors.undergradScore && (
                                    <p className="text-red-500 text-sm font-semibold">{errors.undergradScore}</p>
                                )}
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-slate-700">Score Type</label>
                                <select
                                    value={formData.undergradScoreType}
                                    onChange={e => handleInputChange('undergradScoreType', e.target.value)}
                                    className="w-full px-4 py-4 text-base font-medium border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all duration-300 hover:bg-white hover:border-blue-300"
                                >
                                    <option value="10 CGPA">10 CGPA</option>
                                    <option value="4 GPA">4 GPA</option>
                                    <option value="Percentage">Percentage</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700">Do you have any backlogs?</label>
                            <input
                                type="text"
                                value={formData.backlogs}
                                onChange={e => handleInputChange('backlogs', e.target.value)}
                                placeholder="e.g: 0"
                                className="w-full px-4 py-4 text-base font-medium border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all duration-300 hover:bg-white hover:border-blue-300"
                            />
                        </div>
                    </div>
                );


            case 3:
                return (
                    <div className="space-y-10">
                        {/* Language Proficiency Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-xl"><Globe className="h-5 w-5 text-blue-700" /></div>
                                <h3 className="text-lg font-bold text-slate-800">Language Proficiency <span className="text-red-500">*</span></h3>
                            </div>
                            {errors.languageTest && <p className="!mt-2 text-red-500 text-sm font-semibold">{errors.languageTest}</p>}

                            {/* English Tests */}
                            <div>
                                <h4 className="font-bold text-slate-600 mb-3">English Language Tests</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {englishTests.map(test => (
                                        <button key={test.id} type="button" onClick={() => handleTestSelection('languageTest', test.id)}
                                            className={`p-4 rounded-2xl border-2 font-bold transition-all duration-300 hover:scale-[1.02] ${formData.languageTest === test.id
                                                    ? `border-${test.color}-500 bg-${test.color}-50 text-${test.color}-700 shadow-lg`
                                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                                }`}>
                                            {test.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Italian Tests */}
                            <div>
                                <h4 className="font-bold text-slate-600 mb-3">Italian Language Certifications</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {italianTests.map(test => (
                                        <button key={test.id} type="button" onClick={() => handleTestSelection('languageTest', test.id)}
                                            className={`p-4 rounded-2xl border-2 font-bold transition-all duration-300 hover:scale-[1.02] text-sm md:text-base ${formData.languageTest === test.id
                                                    ? `border-${test.color}-500 bg-${test.color}-50 text-${test.color}-700 shadow-lg`
                                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                                }`}>
                                            {test.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {isEnglishTest && (
                                <div className="space-y-3 pt-4">
                                    <label className="block text-sm font-bold text-slate-700">Overall score <span className="text-red-500">*</span></label>
                                    <input type="text" value={formData.languageTestScore} onChange={e => handleInputChange('languageTestScore', e.target.value)}
                                        placeholder={formData.languageTest === 'TOEFL' ? 'e.g., 95' : formData.languageTest === 'IELTS' ? 'e.g., 7.0' : 'e.g., 120'}
                                        className={`w-full max-w-xs px-4 py-4 text-base font-medium border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all duration-300 hover:bg-white ${errors.languageTestScore ? 'border-red-500' : 'border-slate-200 hover:border-blue-300'
                                            }`}
                                    />
                                    {errors.languageTestScore && <p className="text-red-500 text-sm font-semibold">{errors.languageTestScore}</p>}
                                </div>
                            )}
                        </div>

                        {/* Aptitude Test Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-xl"><Brain className="h-5 w-5 text-purple-700" /></div>
                                <h3 className="text-lg font-bold text-slate-800">Any additional aptitude tests?</h3>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {aptitudeTests.map(test => (
                                    <button key={test.id} type="button" onClick={() => handleTestSelection('aptitudeTest', test.id)}
                                        className={`p-4 rounded-2xl border-2 font-bold transition-all duration-300 hover:scale-[1.02] ${formData.aptitudeTest === test.id
                                                ? `border-${test.color}-500 bg-${test.color}-50 text-${test.color}-700 shadow-lg`
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                            }`}>
                                        {test.label}
                                    </button>
                                ))}
                            </div>

                            {(formData.aptitudeTest === 'GRE' || formData.aptitudeTest === 'GMAT') && (
                                <div className="grid md:grid-cols-3 gap-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700">Verbal</label>
                                        <input type="text" value={formData.verbalScore} onChange={e => handleInputChange('verbalScore', e.target.value)} placeholder="160"
                                            className={`w-full px-4 py-3 text-base font-medium border-2 rounded-xl focus:ring-2 bg-slate-50 ${errors.verbalScore ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'}`} />
                                         {errors.verbalScore && <p className="text-red-500 text-xs font-semibold">{errors.verbalScore}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700">Quants</label>
                                        <input type="text" value={formData.quantsScore} onChange={e => handleInputChange('quantsScore', e.target.value)} placeholder="165"
                                            className={`w-full px-4 py-3 text-base font-medium border-2 rounded-xl focus:ring-2 bg-slate-50 ${errors.quantsScore ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'}`} />
                                         {errors.quantsScore && <p className="text-red-500 text-xs font-semibold">{errors.quantsScore}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700">AWA</label>
                                        <input type="text" value={formData.awaScore} onChange={e => handleInputChange('awaScore', e.target.value)} placeholder="4.5"
                                            className={`w-full px-4 py-3 text-base font-medium border-2 rounded-xl focus:ring-2 bg-slate-50 ${errors.awaScore ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'}`} />
                                         {errors.awaScore && <p className="text-red-500 text-xs font-semibold">{errors.awaScore}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="text-center space-y-8">
                        <div className="p-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl mx-auto w-24 h-24 flex items-center justify-center mb-8">
                            <Brain className="h-12 w-12 text-white" />
                        </div>

                        <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent mb-4">
                            Academic Goals
                        </h2>

                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Tell us about your academic aspirations and career goals.
                        </p>

                        <div className="space-y-6 max-w-2xl mx-auto text-left">
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-slate-700">
                                    What are your main academic and career objectives?
                                </label>
                                <textarea
                                    value={formData.preferences}
                                    onChange={e => handleInputChange('preferences', e.target.value)}
                                    placeholder="Describe your goals, interests, and what you hope to achieve..."
                                    rows={4}
                                    className="w-full px-4 py-4 text-base font-medium border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all duration-300 hover:bg-white hover:border-blue-300 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="text-center space-y-8">
                        <div className="p-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl mx-auto w-24 h-24 flex items-center justify-center mb-8">
                            <Star className="h-12 w-12 text-white" />
                        </div>

                        <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-purple-800 bg-clip-text text-transparent mb-4">
                            Preferences & Additional Info
                        </h2>

                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Any specific preferences or additional information you'd like to share?
                        </p>

                        <div className="space-y-6 max-w-2xl mx-auto text-left">
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-slate-700">
                                    Additional Information (Optional)
                                </label>
                                <textarea
                                    value={formData.additionalInfo}
                                    onChange={e => handleInputChange('additionalInfo', e.target.value)}
                                    placeholder="Any specific university preferences, budget considerations, or other relevant information..."
                                    rows={4}
                                    className="w-full px-4 py-4 text-base font-medium border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-slate-50 transition-all duration-300 hover:bg-white hover:border-purple-300 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="text-center space-y-8">
                        <div className="p-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl shadow-2xl mx-auto w-24 h-24 flex items-center justify-center mb-8">
                            <CheckCircle className="h-12 w-12 text-white" />
                        </div>

                        <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent mb-4">
                            Profile Complete!
                        </h2>

                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
                            Your comprehensive university recommendations are ready. Let's explore your perfect matches!
                        </p>

                        <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <div className="relative flex items-center gap-3">
                                <Crown className="h-5 w-5" />
                                View My Recommendations
                            </div>
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200 rounded-full shadow-lg mb-8 hover:shadow-xl transition-all duration-300">
                        <Crown className="h-5 w-5 text-emerald-600" />
                        <span className="text-emerald-800 font-bold text-sm">College Finder Tool: Find Your Dream College Abroad</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                            Craft Your Profile
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Answer a few questions to get personalized university recommendations.
                    </p>
                </div>

                <div className="mt-12 max-w-4xl mx-auto bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="flex items-center justify-center mb-12 space-x-2 md:space-x-4">
                            {steps.map((step, index) => {
                                const isActive = currentStep === step.id;
                                const isCompleted = currentStep > step.id;
                                const Icon = step.icon;
                                return (
                                    <React.Fragment key={step.id}>
                                        <div className="flex flex-col items-center w-20">
                                            <div
                                                className={`
                                                w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300
                                                ${isActive ? 'bg-blue-600 border-blue-200 shadow-lg scale-110' : ''}
                                                ${isCompleted ? 'bg-emerald-500 border-emerald-200' : ''}
                                                ${!isActive && !isCompleted ? 'bg-slate-200 border-slate-100' : ''}
                                            `}
                                            >
                                                <Icon
                                                    className={`
                                                    h-6 w-6
                                                    ${isActive || isCompleted ? 'text-white' : 'text-slate-500'}
                                                `}
                                                />
                                            </div>
                                            <p
                                                className={`
                                                mt-2 text-xs font-bold text-center
                                                ${isActive ? 'text-blue-700' : 'text-slate-500'}
                                            `}
                                            >
                                                {step.title}
                                            </p>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`
                                                flex-1 h-1 rounded-full transition-all duration-500
                                                ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}
                                            `}
                                            ></div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        <div className="mt-8">{renderStepContent()}</div>

                        {currentStep < 6 && (
                            <div className="mt-12 pt-8 border-t border-slate-200/80 flex justify-between items-center">
                                <button
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="group relative flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                                    <span className="relative">{currentStep === 5 ? 'Finish & See Results' : 'Next'}</span>
                                    <ChevronRight className="h-5 w-5 relative" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}