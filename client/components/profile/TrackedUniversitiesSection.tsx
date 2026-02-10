// // File: client/components/profile/TrackedUniversitiesSection.tsx
// // Create this new file

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useUser } from '@clerk/nextjs';
// import { Loader2, Info, CalendarPlus } from 'lucide-react';
// import TrackedUniversityItem from './TrackedUniversityItem';
// // import { University } from '@/components/UniversityCard'; // Re-use the extended University type
// //import { italianUniversities } from '@/lib/data'; // Using static data as a mock source
// import { useLanguage } from '@/context/LanguageContext';
// import Link from 'next/link';


// const TrackedUniversitiesSection: React.FC = () => {
//     const { user, isSignedIn, isLoaded } = useUser();
//     const { language, t } = useLanguage();
//     const [trackedUniversityItems, setTrackedUniversityItems] = useState<University[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [italianUniversities, setItalianUniversities] = useState<University[]>([]);
//     const _t :any = t
//     useEffect(() => {
//         const fetchUniversities = async () => {
//             try {
//                 const uniResponse = await fetch('/api/universities');
//                 if (!uniResponse.ok) {
//                     throw new Error(`Failed to fetch universities: ${uniResponse.statusText}`);
//                 }
//                 const fetchedUniData = await uniResponse.json();
//                 setItalianUniversities(fetchedUniData.data || []);
//                 // Ensure the data from API has _id and the count fields
//                 if (!fetchedUniData.success) {
//                     throw new Error(fetchedUniData.message || 'Failed to fetch universities from API.');
//                 }
//                 // You can use fetchedUniData here if needed
//             } catch (error) {
//                 // Handle error if needed
//             }
//         };
//         fetchUniversities();
//     }, [isLoaded, isSignedIn]);
//     useEffect(() => {
//         const fetchTrackedUniversities = async () => {
//             if (!user) return;
//             setIsLoading(true);
//             setError(null);

//             // --- MOCK FETCHING LOGIC ---
//             // In a real app, this would be an API call to get IDs/data of tracked universities for the user.
//             // For now, let's simulate that the user is tracking a few universities by their IDs from `italianUniversities`.
//             try {
//                 await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

//                 // Example: Assume user is tracking universities with ID 1, 3, 5
//                 const trackedIds = [1, 3, 5]; // This would come from your backend

//                 const foundTracked = italianUniversities
//                     .filter(uni => typeof uni.id === 'number' && trackedIds.includes(uni.id))
//                     .map(uni => ({
//                         ...uni,
//                         // Simulate that these come from a "tracked items" DB record for this user
//                         isFavoriteInitial: Math.random() > 0.5, // Random for demo
//                         isTrackedInitial: true, // Since they are tracked
//                         apiFavoriteId: Math.random() > 0.5 ? `mockfav-${uni.id}` : null,
//                         apiTrackedId: `mocktrack-${uni.id}`,
//                         // Counts would also ideally come from backend aggregate or course/uni data
//                         viewCount: Math.floor(Math.random() * 100),
//                         favoriteCount: Math.floor(Math.random() * 50),
//                         trackedCount: Math.floor(Math.random() * 20) + 1,
//                     }));

//                 setTrackedUniversityItems(foundTracked);

//             } catch (err: any) {
//                 setError(t('profile', 'trackedUniversitiesErrorFetch', { defaultValue: 'Failed to load tracked universities.' }));
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (isLoaded && isSignedIn) {
//             fetchTrackedUniversities();
//         } else if (isLoaded && !isSignedIn) {
//             setIsLoading(false);
//             setTrackedUniversityItems([]);
//         }
//     }, [isLoaded, isSignedIn, user, t]);

//     const handleUntrackUniversity = (universityId: number) => {
//         setTrackedUniversityItems(prev => prev.filter(uni => uni.id !== universityId));
//         // In a real app, you would also call an API to update the backend.
//         // Example: await fetch(`/api/tracked-items/university/${universityId}`, { method: 'DELETE' });
//         console.log(`[TrackedUnisSection] University ${universityId} untracked (UI update).`);
//     };

//     if (isLoading) {
//         return <div className="flex justify-center items-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
//     }

//     if (error) {
//         return <div className="p-4 my-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
//             <span className="font-medium">{t('common', 'errorOccurred', { defaultValue: 'Error:' })}</span> {error}
//         </div>;
//     }

//     if (!isSignedIn) {
//         return <div className="p-6 text-center text-neutral-600">{t('profile', 'signInToTrackUniversities', { defaultValue: "Please sign in to manage your tracked universities." })}</div>;
//     }


//     return (
//         <div>
//             <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-xl font-semibold text-neutral-800">
//                     {t('profile', 'trackedUniversitiesTitle', { defaultValue: 'Tracked Universities & Deadlines' })}
//                 </h3>
//                 <Link href={`/${language}/universities`}
//                     className="text-sm text-primary hover:underline flex items-center">
//                     <CalendarPlus size={16} className="mr-1" /> {t('profile', 'trackedUniversitiesAddMore', { defaultValue: 'Track More Universities' })}
//                 </Link>
//             </div>

//             {trackedUniversityItems.length === 0 ? (
//                 <div className="text-center py-10 border-2 border-dashed border-neutral-200 rounded-lg">
//                     <Info size={40} className="mx-auto text-neutral-400 mb-3" />
//                     <p className="text-neutral-600">{t('profile', 'trackedUniversitiesNone', { defaultValue: "You are not tracking any universities yet." })}</p>
//                 </div>
//             ) : (
//                 <div className="space-y-4">
//                     {trackedUniversityItems.map(uni => (
//                         <TrackedUniversityItem
//                             key={uni.id}
//                             university={uni}
//                             onUntrack={handleUntrackUniversity}
//                             t={_t}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TrackedUniversitiesSection;