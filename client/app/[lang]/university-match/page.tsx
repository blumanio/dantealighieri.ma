// app/[lang]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import {
    Sparkles, Award, TrendingUp, Users, Target, Clock, Shield,
    Zap, Star, Globe, Crown, CheckCircle, ArrowRight, BookOpen,
    GraduationCap, MapPin, Heart, MessageCircle, Search, Filter,
    PlayCircle, Download, ExternalLink, Calendar, Euro, School,
    ChevronRight, Check, X, Loader2, Mail, Phone, ChevronDown
} from 'lucide-react';

interface LandingPageProps {
    params: { lang: string };
}

interface UniversityMatch {
    id: string;
    name: string;
    location: string;
    programs: number;
    matchPercentage: number;
    tuitionRange: string;
    image: string;
    ranking: string;
    highlights: string[];
}

interface Testimonial {
    id: string;
    name: string;
    country: string;
    university: string;
    image: string;
    quote: string;
    program: string;
    year: string;
}

interface PricingPlan {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    popular?: boolean;
    cta: string;
}

export default function LandingPage({ params }: LandingPageProps) {
    const { language, t } = useLanguage();
    const { isSignedIn, user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [showMatches, setShowMatches] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [stats, setStats] = useState({
        universities: 0,
        students: 0,
        scholarships: 0,
        successRate: 0
    });

    const lang = params.lang;
    const textDir = lang === 'ar' ? 'rtl' : 'ltr';

    // Mock data - replace with actual API calls
    const interests = [
        { id: 'engineering', label: 'Engineering & Technology', icon: Zap },
        { id: 'medicine', label: 'Medicine & Health Sciences', icon: Heart },
        { id: 'business', label: 'Business & Economics', icon: TrendingUp },
        { id: 'arts', label: 'Arts & Design', icon: Star },
        { id: 'science', label: 'Natural Sciences', icon: Target },
        { id: 'humanities', label: 'Humanities & Social Sciences', icon: BookOpen }
    ];

    const mockMatches: UniversityMatch[] = [
        {
            id: '1',
            name: 'University of Bologna',
            location: 'Bologna, Emilia-Romagna',
            programs: 87,
            matchPercentage: 95,
            tuitionRange: '€2,000 - €4,000',
            image: '/api/placeholder/400/300', // Placeholder image path
            ranking: 'Top 5 in Italy',
            highlights: ['Oldest University in Europe', 'Excellence in Research', 'Strong Industry Connections']
        },
        {
            id: '2',
            name: 'Politecnico di Milano',
            location: 'Milan, Lombardy',
            programs: 65,
            matchPercentage: 92,
            tuitionRange: '€3,500 - €5,500',
            image: '/api/placeholder/400/300', // Placeholder image path
            ranking: 'Top Technical University',
            highlights: ['Engineering Excellence', 'Innovation Hub', 'Global Partnerships']
        },
        {
            id: '3',
            name: 'Sapienza University',
            location: 'Rome, Lazio',
            programs: 120,
            matchPercentage: 88,
            tuitionRange: '€1,500 - €3,500',
            image: '/api/placeholder/400/300', // Placeholder image path
            ranking: 'Top 3 in Italy',
            highlights: ['Comprehensive Programs', 'Historic Campus', 'Research Excellence']
        }
    ];

    const testimonials: Testimonial[] = [
        {
            id: '1',
            name: 'Fatima Al-Zahra',
            country: 'Morocco',
            university: 'University of Bologna',
            image: '/api/placeholder/100/100', // Placeholder image path
            quote: 'I had no idea where to start. This platform helped me choose my course and guided me through the entire visa process. The personalized matching was incredible!',
            program: 'International Relations',
            year: '2024'
        },
        {
            id: '2',
            name: 'Ahmed Hassan',
            country: 'Egypt',
            university: 'Politecnico di Milano',
            image: '/api/placeholder/100/100', // Placeholder image path
            quote: 'I saved weeks of research. The AI matching tool is spot on and the scholarship finder helped me secure €8,000 in funding. Highly recommended!',
            program: 'Computer Engineering',
            year: '2023'
        },
        {
            id: '3',
            name: 'Maria Santos',
            country: 'Brazil',
            university: 'Sapienza University',
            image: '/api/placeholder/100/100', // Placeholder image path
            quote: 'The premium support was worth every penny. My advisor helped me with everything from application essays to finding accommodation in Rome.',
            program: 'Medicine',
            year: '2024'
        }
    ];

    const pricingPlans: PricingPlan[] = [
        {
            id: 'free',
            name: 'Free Explorer',
            price: '€0',
            period: 'forever',
            description: 'Perfect for initial exploration',
            features: [
                'Top 3 university matches',
                'Basic program information',
                'General admission requirements',
                'Community forum access',
                'Basic search filters'
            ],
            cta: 'Start Free'
        },
        {
            id: 'premium',
            name: 'Premium Achiever',
            price: '€29',
            period: 'month',
            description: 'Everything you need to succeed',
            features: [
                'Unlimited university matches',
                'AI-powered scholarship finder',
                'Complete visa guidance',
                'Personalized application timeline',
                'Priority support chat',
                'Document templates',
                'Interview preparation',
                'Accommodation finder'
            ],
            popular: true,
            cta: 'Upgrade to Premium'
        },
        {
            id: 'elite',
            name: 'Elite Success',
            price: '€99',
            period: 'month',
            description: 'White-glove service for guaranteed success',
            features: [
                'Everything in Premium',
                '1:1 dedicated advisor',
                'Application essay review',
                'Mock interviews',
                'Direct university contacts',
                'Scholarship application assistance',
                'Post-arrival support',
                'Success guarantee'
            ],
            cta: 'Go Elite'
        }
    ];

    // Animate stats on mount
    useEffect(() => {
        const animateStats = () => {
            const targets = { universities: 120, students: 15000, scholarships: 450, successRate: 97 };
            const duration = 2000;
            const steps = 60;
            const interval = duration / steps;

            let step = 0;
            const timer = setInterval(() => {
                step++;
                const progress = step / steps;
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);

                setStats({
                    universities: Math.round(targets.universities * easeOutQuart),
                    students: Math.round(targets.students * easeOutQuart),
                    scholarships: Math.round(targets.scholarships * easeOutQuart),
                    successRate: Math.round(targets.successRate * easeOutQuart)
                });

                if (step >= steps) clearInterval(timer);
            }, interval);
        };

        const timer = setTimeout(animateStats, 500);
        return () => clearTimeout(timer);
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const handleInterestToggle = (interestId: string) => {
        setSelectedInterests(prev =>
            prev.includes(interestId)
                ? prev.filter(id => id !== interestId)
                : [...prev, interestId]
        );
    };

    const handleFindMatches = async () => {
        if (selectedInterests.length === 0) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setShowMatches(true);
        setIsLoading(false);

        // Scroll to matches section
        const matchesSection = document.getElementById('university-matches-section');
        if (matchesSection) {
            matchesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden" dir={textDir}>
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Premium Badge */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200 rounded-full shadow-lg">
                            <Crown className="h-5 w-5 text-emerald-600" />
                            <span className="text-emerald-800 font-bold text-sm">Premium University Matching Platform</span>
                            <Sparkles className="h-4 w-4 text-yellow-500 fill-current" />
                        </div>
                    </div>

                    {/* Main Hero Content */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                                Study in Italy
                            </span>
                            <br />
                            <span className="text-slate-700">Find Your Perfect</span>
                            <br />
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                University Match
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-12">
                            AI-powered platform that matches international students with Italian universities,
                            scholarships, and provides complete visa guidance. Join <span className="font-bold text-blue-600">15,000+ students</span> who found their dream university.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <button
                                onClick={() => {
                                    const getStartedSection = document.getElementById('get-started');
                                    if (getStartedSection) {
                                        getStartedSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <div className="relative flex items-center gap-3">
                                    <Target className="h-6 w-6" />
                                    Get Started Now
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            <button className="group flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg border border-slate-200">
                                <PlayCircle className="h-6 w-6 text-blue-600" />
                                Watch How It Works
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-emerald-500" />
                                <span className="font-semibold">100% Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                                <span className="font-semibold">Verified Universities</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-purple-500" />
                                <span className="font-semibold">97% Success Rate</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mx-auto w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <School className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-3xl font-black text-slate-900 mb-2">{stats.universities}+</div>
                            <div className="text-sm text-slate-600 font-semibold">Universities</div>
                        </div>

                        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mx-auto w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-3xl font-black text-slate-900 mb-2">{stats.students.toLocaleString()}+</div>
                            <div className="text-sm text-slate-600 font-semibold">Students Helped</div>
                        </div>

                        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                            <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg mx-auto w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Award className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-3xl font-black text-slate-900 mb-2">{stats.scholarships}+</div>
                            <div className="text-sm text-slate-600 font-semibold">Scholarships</div>
                        </div>

                        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                            <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg mx-auto w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-3xl font-black text-slate-900 mb-2">{stats.successRate}%</div>
                            <div className="text-sm text-slate-600 font-semibold">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interest Selection Section */}
            <section className="py-20 px-4 bg-white/50 backdrop-blur-sm" id="get-started">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
                            <Target className="h-5 w-5 text-blue-600" />
                            <span className="text-blue-800 font-bold text-sm">Step 1: Tell Us Your Interests</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            What Do You Want to Study?
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Select your areas of interest and we'll find the perfect Italian universities for you
                        </p>
                    </div>

                    {/* Interest Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {interests.map((interest) => {
                            const isSelected = selectedInterests.includes(interest.id);
                            const Icon = interest.icon;

                            return (
                                <button
                                    key={interest.id}
                                    onClick={() => handleInterestToggle(interest.id)}
                                    className={`group p-6 rounded-3xl border-2 transition-all duration-300 transform hover:scale-105 ${isSelected
                                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-500 text-white shadow-xl'
                                            : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700 hover:shadow-lg'
                                        }`}
                                >
                                    <div className={`p-4 rounded-2xl mb-4 inline-block transition-all duration-300 ${isSelected
                                            ? 'bg-white/20'
                                            : 'bg-slate-100 group-hover:bg-blue-100'
                                        }`}>
                                        <Icon className={`h-8 w-8 ${isSelected ? 'text-white' : 'text-slate-600 group-hover:text-blue-600'}`} />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{interest.label}</h3>
                                    {isSelected && (
                                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-sm font-semibold">Selected</span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Find Matches Button */}
                    {selectedInterests.length > 0 && (
                        <div className="text-center">
                            <button
                                onClick={handleFindMatches}
                                disabled={isLoading}
                                className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-70 disabled:transform-none"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        Finding Your Matches...
                                    </div>
                                ) : (
                                    <div className="relative flex items-center gap-3">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        <Zap className="h-6 w-6" />
                                        Find My Perfect Matches ({selectedInterests.length} selected)
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* University Matches Section */}
            {showMatches && (
                <section className="py-20 px-4" id="university-matches-section">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
                                <Star className="h-5 w-5 text-emerald-600" />
                                <span className="text-emerald-800 font-bold text-sm">Step 2: Your Perfect Matches</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                                We Found {mockMatches.length} Perfect Universities
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Based on your interests, here are the top universities that match your profile
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {mockMatches.map((match, index) => (
                                <div
                                    key={match.id}
                                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-slate-200 hover:border-blue-300 transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-fadeInUp"
                                    style={{ animationDelay: `${index * 200}ms` }}
                                >
                                    {/* Premium gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Match percentage badge */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-xs font-bold">{match.matchPercentage}% Match</span>
                                        </div>
                                    </div>

                                    {/* University Image - Using a placeholder div as Image component might need configuration for external URLs or /api paths */}
                                    <div className="relative h-48 overflow-hidden">
                                        {/* You can replace this div with an <Image /> component if your image source is set up */}
                                        <div
                                            className="w-full h-full bg-cover bg-center"
                                            style={{ backgroundImage: `url(${match.image})` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                                                    {match.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-slate-600 mb-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="font-semibold">{match.location}</span>
                                                </div>
                                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full">
                                                    <Award className="h-3 w-3 text-blue-600" />
                                                    <span className="text-xs font-bold text-blue-800">{match.ranking}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="text-center p-3 bg-slate-50 rounded-xl">
                                                <div className="text-lg font-black text-slate-900">{match.programs}</div>
                                                <div className="text-xs text-slate-600 font-semibold">Programs</div>
                                            </div>
                                            <div className="text-center p-3 bg-emerald-50 rounded-xl">
                                                <div className="text-lg font-black text-emerald-800">{match.tuitionRange}</div>
                                                <div className="text-xs text-emerald-600 font-semibold">Tuition/Year</div>
                                            </div>
                                        </div>

                                        {/* Highlights */}
                                        <div className="space-y-2 mb-6">
                                            {match.highlights.map((highlight, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                                    <span className="text-slate-700 font-medium">{highlight}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* CTA */}
                                        <Link
                                            href={`/${lang}/university/${match.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                        >
                                            View Details
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Upgrade Prompt */}
                        <div className="mt-16 text-center">
                            <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-200 shadow-xl">
                                <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg mx-auto w-16 h-16 flex items-center justify-center mb-6">
                                    <Crown className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">Want to See More Matches?</h3>
                                <p className="text-slate-600 mb-6">
                                    Unlock unlimited university matches, scholarship finder, and personalized support with Premium
                                </p>
                                <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl">
                                    Upgrade to Premium
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Pricing Section */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6">
                            <Euro className="h-5 w-5 text-indigo-600" />
                            <span className="text-indigo-800 font-bold text-sm">Choose Your Plan</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            Flexible Pricing for Every Student
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            From basic exploration to comprehensive support, find the plan that fits your journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        {pricingPlans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col p-8 rounded-3xl shadow-lg transition-all duration-300 border-2 ${plan.popular
                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-700 text-white transform scale-105 shadow-2xl z-10'
                                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xl'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-bold shadow-md">
                                            <Sparkles className="h-4 w-4" />
                                            Most Popular
                                        </div>
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <h3 className={`text-2xl font-black mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                        {plan.name}
                                    </h3>
                                    <p className={`mb-6 ${plan.popular ? 'text-indigo-100' : 'text-slate-600'}`}>
                                        {plan.description}
                                    </p>
                                    <div className="mb-8">
                                        <span className={`text-5xl font-black ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                            {plan.price}
                                        </span>
                                        <span className={`text-lg font-semibold ml-1 ${plan.popular ? 'text-indigo-200' : 'text-slate-500'}`}>
                                            / {plan.period}
                                        </span>
                                    </div>
                                    <ul className="space-y-3 mb-10">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-3">
                                                <CheckCircle className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-yellow-400' : 'text-emerald-500'}`} />
                                                <span className={plan.popular ? 'text-indigo-50' : 'text-slate-700'}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    className={`w-full py-4 px-6 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ${plan.popular
                                            ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg'
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md'
                                        }`}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-full mb-6">
                            <MessageCircle className="h-5 w-5 text-sky-400" />
                            <span className="text-sky-300 font-bold text-sm">Student Voices</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            Trusted by Students Worldwide
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Hear what our students say about their journey with us to study in Italy.
                        </p>
                    </div>

                    <div className="relative max-w-3xl mx-auto">
                        <div className="overflow-hidden rounded-3xl shadow-2xl bg-slate-800/70 backdrop-blur-md border border-slate-700">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.id}
                                    className={`transition-opacity duration-500 ease-in-out ${index === currentTestimonial ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                                        }`}
                                >
                                    <div className="p-8 md:p-12">
                                        <div className="flex items-center mb-6">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-sky-400 shadow-lg mr-6 flex-shrink-0">
                                                <Image src={testimonial.image} alt={testimonial.name} width={80} height={80} className="object-cover w-full h-full" />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-bold text-white mb-1">{testimonial.name}</h4>
                                                <p className="text-sky-300 font-medium">{testimonial.program} at {testimonial.university}</p>
                                                <p className="text-sm text-slate-400">{testimonial.country} - Class of {testimonial.year}</p>
                                            </div>
                                        </div>
                                        <blockquote className="text-lg md:text-xl leading-relaxed text-slate-200 italic border-l-4 border-sky-500 pl-6">
                                            "{testimonial.quote}"
                                        </blockquote>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Dots */}
                        <div className="flex justify-center mt-8 space-x-3">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-sky-400 scale-125' : 'bg-slate-600 hover:bg-slate-500'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="py-20 px-4 bg-slate-900 text-slate-300">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* About */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-6">UniItalia Connect</h4>
                            <p className="text-sm leading-relaxed mb-4">
                                Your premier AI-powered guide to studying in Italy. We simplify your journey from selection to enrollment.
                            </p>
                            <div className="flex space-x-4">
                                {/* Social Media Icons - Add actual links */}
                                <a href="#" aria-label="Twitter" className="hover:text-sky-400 transition-colors"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.9-.53 1.59-1.37 1.92-2.38-.84.5-1.78.86-2.79 1.07A4.486 4.486 0 0016.1 4c-2.38 0-4.31 1.93-4.31 4.31 0 .34.04.67.11.99C8.24 9.09 5.03 7.28 2.9 4.52c-.38.65-.6 1.41-.6 2.22 0 1.5.76 2.82 1.92 3.6A4.467 4.467 0 012.8 9.66v.05c0 2.09 1.49 3.84 3.47 4.23-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.55 1.71 2.14 2.96 4.03 3-1.48 1.16-3.35 1.85-5.38 1.85-.35 0-.69-.02-1.03-.06C4.42 20.02 6.56 21 8.91 21c7.09 0 10.97-5.87 10.97-10.97 0-.17 0-.33-.01-.5.75-.54 1.4-1.22 1.92-1.99z" /></svg></a>
                                <a href="#" aria-label="Instagram" className="hover:text-sky-400 transition-colors"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.172.052 1.796.166 2.274.346.478.184.887.437 1.303.853.418.414.67.821.854 1.302.18.478.294 1.104.346 2.276.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.052 1.172-.166 1.796-.346 2.274a3.896 3.896 0 01-.853 1.303c-.414.418-.821.67-1.302.854-.478.18-.901.293-2.276.346A48.097 48.097 0 0112 21.837c-3.204 0-3.584-.012-4.85-.07a10.492 10.492 0 01-2.274-.346 3.896 3.896 0 01-1.303-.853A3.896 3.896 0 012.163 19.15c-.18-.478-.294-1.104-.346-2.276A48.097 48.097 0 011.74 12c0-3.204.012-3.584.07-4.85.052-1.172.166-1.796.346-2.274.18-.478.437-.887.853-1.303.414-.418.821-.67 1.302-.854.478-.18.901-.293 2.276-.346A48.097 48.097 0 0112 2.163zm0 1.802C9.04 3.965 8.68 3.977 7.38 4.028c-1.11.05-1.584.154-1.914.284-.398.153-.69.365-.976.65-.288.287-.498.578-.65.976-.13.33-.234.804-.284 1.914-.052 1.298-.063 1.66-.063 4.144s.01 2.846.063 4.144c.05.901.154 1.584.284 1.914.153.398.365.69.65.976.287.288.578.498.976.65.33.13.804.234 1.914.284 1.298.052 1.66.063 4.144.063s2.846-.01 4.144-.063c1.11-.05 1.584-.154 1.914-.284.398-.153.69-.365.976-.65.288-.287.498-.578.65-.976.13-.33.234.804-.284-1.914.052-1.298.063-1.66.063-4.144s-.01-2.846-.063-4.144c-.05-.901-.154-1.584-.284-1.914a2.802 2.802 0 00-.65-.976 2.802 2.802 0 00-.976-.65c-.33-.13-.804-.234-1.914-.284A46.27 46.27 0 0012 3.965zM12 7.188a4.812 4.812 0 100 9.624 4.812 4.812 0 000-9.624zm0 7.822a3.01 3.01 0 110-6.02 3.01 3.01 0 010 6.02zm6.275-7.656a1.148 1.148 0 100-2.296 1.148 1.148 0 000 2.296z" /></svg></a>
                                <a href="#" aria-label="LinkedIn" className="hover:text-sky-400 transition-colors"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-6">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><Link href={`/${lang}/university-hubs`} className="hover:text-sky-400 transition-colors text-sm">University Hubs</Link></li>
                                <li><Link href={`/${lang}/scholarships`} className="hover:text-sky-400 transition-colors text-sm">Scholarships</Link></li>
                                <li><Link href={`/${lang}/visa-guide`} className="hover:text-sky-400 transition-colors text-sm">Visa Guide</Link></li>
                                <li><Link href={`/${lang}/blog`} className="hover:text-sky-400 transition-colors text-sm">Blog</Link></li>
                                <li><Link href={`/${lang}/faq`} className="hover:text-sky-400 transition-colors text-sm">FAQ</Link></li>
                                <li><Link href={`/${lang}/contact`} className="hover:text-sky-400 transition-colors text-sm">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-6">Legal</h4>
                            <ul className="space-y-3">
                                <li><Link href={`/${lang}/terms-of-service`} className="hover:text-sky-400 transition-colors text-sm">Terms of Service</Link></li>
                                <li><Link href={`/${lang}/privacy-policy`} className="hover:text-sky-400 transition-colors text-sm">Privacy Policy</Link></li>
                                <li><Link href={`/${lang}/cookie-policy`} className="hover:text-sky-400 transition-colors text-sm">Cookie Policy</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-6">Get in Touch</h4>
                            <address className="not-italic space-y-3 text-sm">
                                <p className="flex items-start gap-2">
                                    <MapPin className="h-5 w-5 text-sky-400 mt-0.5 flex-shrink-0" />
                                    <span>123 Via Roma, Florence, Italy 50123</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-sky-400" />
                                    <a href="mailto:info@uniitalia-connect.it" className="hover:text-sky-400 transition-colors">info@uniitalia-connect.it</a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-sky-400" />
                                    <a href="tel:+390551234567" className="hover:text-sky-400 transition-colors">+39 055 123 4567</a>
                                </p>
                            </address>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-center border-t border-slate-700 pt-8">
                        <p className="text-sm">
                            &copy; {new Date().getFullYear()} UniItalia Connect. All rights reserved.
                            <br />
                            Made with <Heart className="inline h-4 w-4 text-red-500 fill-current" /> in Italy.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}