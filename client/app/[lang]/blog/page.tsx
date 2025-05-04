// app/[lang]/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image'; // Make sure Image is imported
import { BlogIndexProps } from '@/types/types'; // Assuming this defines { params: { lang: string } }

// Keep the Post interface - ensure coverImage is potentially returned by API
interface Post {
    slug: string;
    frontmatter: {
        title: string;
        date: string; // Expecting ISO String
        excerpt: string;
        author: string;
        coverImage?: string; // Optional cover image URL
        [key: string]: any;
    };
    // Added optional lang property if needed directly on post object
    lang?: string;
}

// Define API Base URL
const API_URL = process.env.API_BASE_URL || 'http://localhost:5000';

// --- Data Fetching Function (getPosts) ---
async function getPosts(lang: string): Promise<Post[]> {
    console.log(`[getPosts] Attempting to fetch posts for lang: ${lang}`);
    try {
        const res = await fetch(`${API_URL}/api/generated-posts?lang=${lang}`, {
            next: { revalidate: 60 } // Revalidate every 60 seconds
        });

        if (!res.ok) { /* ... error handling ... */ console.error(`[getPosts for ${lang}] Fetch failed: ${res.status}`); return []; }

        let postsFromApi: any;
        try {
            postsFromApi = await res.json();
        } catch (jsonError) { /* ... error handling ... */ console.error(`[getPosts for ${lang}] JSON parse error:`, jsonError); return []; }

        if (!Array.isArray(postsFromApi)) { /* ... error handling ... */ console.error(`[getPosts for ${lang}] API response not array`); return []; }

        // Basic check and cast (more robust validation recommended)
        const posts: Post[] = postsFromApi.filter((p: any) => p && p.slug && p.frontmatter).map((p: any) => ({
             ...p,
             lang: lang // Optionally add lang to each post object if needed later
        })) as Post[];


        // Simplified fallback - API should ideally provide valid data
        // Or handle defaults more robustly during mapping below/in component
        posts.forEach(post => {
            post.frontmatter = post.frontmatter || {};
            post.frontmatter.title = post.frontmatter.title || 'Untitled';
            post.frontmatter.date = post.frontmatter.date || new Date(0).toISOString(); // Use epoch as default invalid date
            post.frontmatter.excerpt = post.frontmatter.excerpt || 'No excerpt available.';
            post.frontmatter.author = post.frontmatter.author || 'Studentitaly Staff';
        });

        // Sorting - Ensure date comparison is robust
        const sortedPosts = posts.sort((a, b) => {
             const dateA = new Date(a.frontmatter.date).getTime();
             const dateB = new Date(b.frontmatter.date).getTime();
             // Handle invalid dates if necessary (e.g., put them at the end)
             if (isNaN(dateB)) return -1;
             if (isNaN(dateA)) return 1;
             return dateB - dateA; // Newest first
        });

        // console.log(`[getPosts for ${lang}] Posts after processing:`, JSON.stringify(sortedPosts, null, 2));
        return sortedPosts;

    } catch (error) { /* ... error handling ... */ console.error(`[getPosts for ${lang}] Unexpected error:`, error); return []; }
}

// --- BlogPage Component (Updated UI/UX) ---
export default async function BlogPage({ params }: BlogIndexProps) {
    // Resolve params if needed, or directly access if not a promise
    const lang = (await params).lang;

    console.log(`[BlogPage] Fetching posts for lang: ${lang}`);
    const posts = await getPosts(lang);

    console.log(`[BlogPage] Number of posts received: ${posts.length}`);

    // Determine text direction
    const textDir = lang === 'ar' ? 'rtl' : 'ltr';

    // Helper function for date formatting (or create a separate component)
    const formatDate = (dateString: string, locale: string) => {
        try {
            const dateObj = new Date(dateString);
             if (isNaN(dateObj.getTime())) { return "Invalid Date"; } // Handle invalid date
            return dateObj.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
        } catch {
            return "Invalid Date";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12" dir={textDir}> {/* Added dir */}
            {/* Page Title */}
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-10 lg:mb-16 text-center text-gray-900">
                Blog {/* Consider translating this */}
            </h1>

            {/* Posts Grid / No Posts Message */}
            {posts.length > 0 ? (
                <div className="grid gap-8 md:gap-10 lg:gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        // Blog Post Card
                        <div key={post.slug} className="bg-white rounded-lg overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-xl flex flex-col group"> {/* Added group for hover effects */}

                            {/* Optional Cover Image */}
                            {post.frontmatter.coverImage ? (
                                <Link href={`/${lang}/blog/${post.slug}`} className="block overflow-hidden">
                                    <div className="aspect-video relative w-full"> {/* Consistent Aspect Ratio */}
                                        <Image
                                            src={post.frontmatter.coverImage}
                                            alt={`Cover image for ${post.frontmatter.title}`}
                                            fill
                                            style={{ objectFit: 'cover' }} // Use style for object-fit
                                            className="transition-transform duration-500 ease-in-out group-hover:scale-105" // Subtle zoom on hover
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes
                                        />
                                    </div>
                                </Link>
                            ) : (
                                // Optional: Placeholder if no image
                                <div className="aspect-video w-full bg-gray-100"></div>
                            )}

                            {/* Card Content */}
                            <div className="p-5 sm:p-6 flex flex-col flex-grow">
                                {/* Title */}
                                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 hover:text-teal-700 transition-colors duration-200 line-clamp-2"> {/* Added line-clamp */}
                                    <Link href={`/${lang}/blog/${post.slug}`}>
                                        {post.frontmatter.title}
                                    </Link>
                                </h2>

                                {/* Metadata (Date & Author) */}
                                <div className="text-xs text-gray-500 mb-3 flex items-center flex-wrap gap-x-3">
                                    {/* Date */}
                                    <span className="inline-flex items-center whitespace-nowrap">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <time dateTime={post.frontmatter.date}>
                                            {formatDate(post.frontmatter.date, lang === 'it' ? 'it-IT' : (lang === 'ar' ? 'ar-EG' : 'en-US'))}
                                        </time>
                                    </span>
                                    {/* Author */}
                                    <span className="inline-flex items-center whitespace-nowrap">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        {post.frontmatter.author}
                                    </span>
                                </div>

                                {/* Excerpt */}
                                <p className="text-sm text-gray-700 mb-4 flex-grow line-clamp-3"> {/* Added line-clamp */}
                                    {post.frontmatter.excerpt}
                                </p>

                                {/* Read More Link */}
                                <Link href={`/${lang}/blog/${post.slug}`} className="inline-block text-sm font-medium text-teal-600 hover:text-teal-800 self-start mt-auto group-[.card-hover]:text-teal-700 transition-all duration-200 ease-in-out hover:translate-x-1"> {/* Adjusted hover color & added arrow effect */}
                                    Read More <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 // Display message if no posts are found
                <p className="text-center text-gray-500 mt-16 text-lg">
                    No blog posts found for this language ({lang}). Check back later! {/* Increased top margin */}
                </p>
            )}
        </div>
    );
}

// --- Optional: generateMetadata for Blog Index Page ---
// export async function generateMetadata({ params }: BlogIndexProps) {
//   const lang = params.lang;
//   // Example static metadata - could be dynamic based on language
//   const titles = { en: 'Blog', ar: 'المدونة', it: 'Blog' };
//   const descriptions = { en: 'Latest articles...', ar: 'أحدث المقالات...', it: 'Ultimi articoli...'};
//   return {
//     title: titles[lang] || 'Blog',
//     description: descriptions[lang] || 'Read our latest posts.',
//     // Add canonical URL, alternates for hreflang if needed
//   };
// }