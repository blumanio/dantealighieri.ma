'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
    PlusCircle, Send, Loader2, AlertTriangle,
    MessageSquare, CheckCircle2, Calendar, Download, Lock
} from 'lucide-react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import PostSkeleton from '@/components/community/feed/PostSkeleton';
import { IPostWithComments, IPostWithComments as IPostType } from '@/types/post';

import CommunityPostCard from '@/components/community/CommunityPostCard';
import UniversityHeader from '@/components/university-hub/UniversityHeader';
import TabNavigation, { TabId } from '@/components/university-hub/TabNavigation';
import CoursesTab from '@/components/university-hub/CoursesTab';
import DeadlinesTab from '@/components/university-hub/DeadlinesTab';
import EntranceExamsTab from '@/components/university-hub/EntranceExamsTab';

// --- Interfaces ---
interface Course {
    _id: string; nome: string; link: string; tipo: string; uni: string;
    accesso: string; area: string; lingua: string; comune: string;
    uniSlug?: string;
}

type PostCategory = 'discussion' | 'housing' | 'scholarships' | 'event' | 'other' | 'academic' | 'career' | 'visa_process' | 'housing_seeking' | 'housing_offering';

interface UniversityDetails {
    id?: string;
    name: string;
    slug: string;
    location?: string;
    description?: string;
    logoUrl?: string;
    bannerImageUrl?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INTERNAL COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Gated Overlay for restricted content */
const ContentGate = ({ count, type }: { count: number, type: string }) => (
    <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/95 to-transparent pt-32 pb-12 text-center z-10">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 max-w-md mx-4">
            <div className="mx-auto w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
                Unlock {count} More {type}
            </h3>
            <p className="text-slate-600 mb-6 text-sm">
                Join our student community to access the full directory, direct application links, and international student requirements.
            </p>
            <SignInButton mode="modal">
                <button className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-200">
                    Create Free Account to View All
                </button>
            </SignInButton>
            <p className="mt-4 text-xs text-slate-400">
                Quick 30-second sign up • No credit card required
            </p>
        </div>
    </div>
);

const CommunityEmptyState = ({ openForm, category }: { openForm: () => void; category: string }) => (
    <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
        <div className="max-w-md mx-auto px-4">
            <div className="p-3 bg-white rounded-full shadow-sm mb-4 inline-block">
                <MessageSquare className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
                {category === 'housing' ? 'No housing posts yet' : 'No discussions yet'}
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
                Be the first to start a conversation. Ask about admissions or connect with others.
            </p>
            <button onClick={openForm} className="px-6 py-2.5 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition-colors">
                {category === 'housing' ? 'Post a Housing Request' : 'Start a Discussion'}
            </button>
        </div>
    </div>
);

const DeadlineBanner = () => {
    const month = new Date().getMonth();
    let message = '';
    let urgency: 'info' | 'warning' | 'critical' = 'info';

    if (month >= 3 && month <= 5) {
        message = 'Application season is peak. Non-EU students: Consulate deadlines are approaching.';
        urgency = 'critical';
    } else if (month >= 6 && month <= 8) {
        message = 'Final rounds closing. Visa processing takes 4-8 weeks — act now.';
        urgency = 'critical';
    } else {
        message = '2026/27 Planning: Use this time to prepare translations and language certificates.';
        urgency = 'info';
    }

    const styles = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        critical: 'bg-red-50 border-red-100 text-red-900',
    };

    return (
        <div className={`mb-6 rounded-xl p-4 flex items-start gap-4 border shadow-sm ${styles[urgency]}`}>
            <div className="p-2 bg-white/50 rounded-lg"><Calendar className="h-5 w-5" /></div>
            <div>
                <h4 className="font-bold text-sm">Academic Calendar Alert</h4>
                <p className="text-sm mt-0.5 opacity-90">{message}</p>
            </div>
        </div>
    );
};

const LeadMagnetCapture = ({ universityName }: { universityName: string }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (submitted) return (
        <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-emerald-900">Calculator Sent!</h3>
            <p className="text-sm text-emerald-700">Check your email for your personalized {universityName} report.</p>
        </div>
    );

    return (
        <div className="mt-12 p-8 bg-slate-900 rounded-2xl text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Download size={120} /></div>
            <div className="relative z-10 max-w-lg">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Free Tool</span>
                <h3 className="text-2xl font-bold mt-2 mb-3">2026 Scholarship Calculator</h3>
                <p className="text-slate-400 text-sm mb-6">
                    Calculate your ISEE-U score and see which regional scholarships you qualify for at {universityName}.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email" placeholder="Email address" required
                        className="flex-1 px-4 py-3 rounded-xl text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition-all whitespace-nowrap shadow-lg">
                        Send My Report
                    </button>
                </form>
            </div>
        </div>
    );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function UniversityHubPage() {
    const params = useParams();
    const universitySlug = decodeURIComponent(params?.universitySlug as string || '');
    const { t } = useLanguage();
    const { isSignedIn, isLoaded, user } = useUser();
    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';

    // State
    const [universityDetails, setUniversityDetails] = useState<UniversityDetails | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [posts, setPosts] = useState<IPostWithComments[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabId>('courses');

    // Post creation
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostCategory, setNewPostCategory] = useState<PostCategory>('discussion');
    const [isSubmittingPost, setIsSubmittingPost] = useState(false);

    // Gating Logic
    const FREE_COURSE_LIMIT = 4;
    const isLocked = isLoaded && !isSignedIn;

    const visibleCourses = useMemo(() => {
        return isLocked ? courses.slice(0, FREE_COURSE_LIMIT) : courses;
    }, [courses, isLocked]);

    const fetchPostsForTab = useCallback(async (tab: TabId) => {
        if (!universitySlug || !['network_discussion', 'network_housing'].includes(tab)) {
            setPosts([]);
            return;
        }
        const categories = tab === 'network_discussion' ? ['discussion'] : ['housing_seeking', 'housing_offering'];
        const query = categories.map(c => `category=${c}`).join('&');
        try {
            const res = await fetch(`${API_BASE_URL}/api/posts?communityType=University&communityId=${universitySlug}&${query}`);
            if (res.ok) {
                const data = await res.json();
                setPosts(Array.isArray(data) ? data : (data.posts || []));
            }
        } catch (err) { setPosts([]); }
    }, [universitySlug, API_BASE_URL]);

    useEffect(() => {
        const load = async () => {
            if (!universitySlug) return;
            setIsLoading(true);
            try {
                const [u, c] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/universities/${universitySlug}`),
                    fetch(`${API_BASE_URL}/api/courses?uni=${universitySlug}`)
                ]);
                if (u.ok) setUniversityDetails(await u.json());
                if (c.ok) setCourses(await c.json());
                await fetchPostsForTab(activeTab);
            } catch (err: any) { setError(err.message); }
            finally { setIsLoading(false); }
        };
        load();
    }, [universitySlug, API_BASE_URL, activeTab, fetchPostsForTab]);

    const universityName = universityDetails?.name || universitySlug.replace(/-/g, ' ');

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Syncing university data...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50">
            <UniversityHeader 
                universityDetails={universityDetails} 
                universityName={universityName}
                coursesCount={courses.length}
                communityPostsCount={posts.length}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} t={t} />

                <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-4 md:p-8 min-h-[600px] shadow-sm">
                    
                    {/* COURSES TAB WITH GATE */}
                    {activeTab === 'courses' && (
                        <div className="relative">
                            <div className={isLocked && courses.length > FREE_COURSE_LIMIT ? "blur-[2px] pointer-events-none select-none overflow-hidden max-h-[800px]" : ""}>
                                <CoursesTab courses={visibleCourses} isLoading={false} universityName={universityName} />
                                {isSignedIn && <LeadMagnetCapture universityName={universityName} />}
                            </div>
                            
                            {isLocked && courses.length > FREE_COURSE_LIMIT && (
                                <ContentGate count={courses.length - FREE_COURSE_LIMIT} type="Degree Programs" />
                            )}
                        </div>
                    )}

                    {/* DEADLINES TAB */}
                    {activeTab === 'deadlines' && (
                        <div className="animate-in fade-in duration-500">
                            <DeadlinesTab currentUniversityName={universityName} currentUniversitySlug={universitySlug} />
                            <LeadMagnetCapture universityName={universityName} />
                        </div>
                    )}

                    {/* ENTRANCE EXAMS */}
                    {activeTab === 'entrance_exams' && (
                        <EntranceExamsTab universityName={universityName} universitySlug={universitySlug} />
                    )}

                    {/* COMMUNITY TABS */}
                    {(activeTab === 'network_discussion' || activeTab === 'network_housing') && (
                        <div className="max-w-4xl mx-auto">
                            <DeadlineBanner />
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {activeTab === 'network_discussion' ? 'Student Discussions' : 'Housing Board'}
                                </h2>
                                {isSignedIn && (
                                    <button 
                                        onClick={() => setShowNewPostForm(true)}
                                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all font-medium shadow-md"
                                    >
                                        <PlusCircle size={18} /> New Post
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {posts.length > 0 ? (
                                    posts.map(post => (
                                        <CommunityPostCard 
                                            key={post._id} 
                                            post={post} 
                                            onCommentSubmit={() => {}} 
                                            onDeletePost={() => {}} 
                                        />
                                    ))
                                ) : (
                                    <CommunityEmptyState 
                                        category={activeTab === 'network_housing' ? 'housing' : 'discussion'} 
                                        openForm={() => setShowNewPostForm(true)} 
                                    />
                                )}
                            </div>
                            <LeadMagnetCapture universityName={universityName} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}