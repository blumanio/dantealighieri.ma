// app/[lang]/blog/[slug]/page.tsx

import { marked } from 'marked';
import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image'; // Import Image component
import Link from 'next/link'; // Import Link for tags if needed later
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { BlogNavigation } from '@/components/BlogNavigation'; // Assuming component path
import { Breadcrumb } from '@/components/Breadcrumb';       // Assuming component path
import { BlogPageProps } from '@/types/types';              // Assuming types path

// --- Interfaces ---
interface PostFrontmatter {
    title: string;
    date: string; // Expecting ISO string format from API/DB
    excerpt: string;
    author?: string;
    tags?: string[];
    language?: string; // Optional: specific language of the post from frontmatter
    coverImage?: string; // Optional: URL for a cover image
    // Add other potential frontmatter fields
    [key: string]: any;
}

interface BlogPost {
    frontmatter: PostFrontmatter;
    content: string; // HTML content after marked.parse()
    lang: string;    // Locale/language context from URL
    slug: string;
}

// --- API Fetching Functions ---
const API_URL = process.env.API_BASE_URL || 'http://localhost:5000';

// Fetch Single Post Data (Cached)
const getPost = cache(async (lang: string, slug: string): Promise<BlogPost> => {
    console.log(`[getPost] Fetching post for lang: ${lang}, slug: ${slug}`);
    const targetUrl = `${API_URL}/api/generated-posts/${slug}?lang=${lang}`; // Ensure API filters by lang
    console.log(`[getPost] Target URL: ${targetUrl}`);

    try {
        const res = await fetch(targetUrl, { next: { revalidate: 60 } }); // Revalidate every 60s

        if (res.status === 404) {
            console.log(`[getPost] Post not found (404) for slug: ${slug}, lang: ${lang}`);
            notFound(); // Trigger Next.js 404 page
        }

        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`[getPost] Failed fetch for ${slug}, lang ${lang} (Status: ${res.status}). URL: ${targetUrl}`);
            console.error("[getPost] Error response body:", errorBody);
            throw new Error(`Failed to fetch post: ${slug}`);
        }

        const postFromApi = await res.json();
        // console.log(`[getPost] Raw data received for ${slug}:`, JSON.stringify(postFromApi, null, 2));

        // Basic validation of received structure
        if (!postFromApi || typeof postFromApi.content !== 'string' || !postFromApi.frontmatter) {
            console.error(`[getPost] Invalid data structure received from API for ${slug}, lang ${lang}`);
            throw new Error(`Invalid data structure for post: ${slug}`);
        }

        const postData: BlogPost = postFromApi;

        // Parse markdown content to HTML
        // Ensure Marked is configured appropriately elsewhere or add options here if needed
        marked.setOptions({ gfm: true, breaks: true });
        const parsedContent = marked.parse(postData.content) as string;

        return {
            ...postData,
            content: parsedContent // Return with parsed HTML content
        };

    } catch (error) {
        console.error(`[getPost] Error processing post for ${slug}, lang ${lang}:`, error);
        notFound(); // Trigger 404 on any processing error
        // This throw satisfies TypeScript but won't be reached due to notFound()
        throw error;
    }
});

// Fetch Adjacent Posts Data (Cached)
const getAdjacentPosts = cache(async (lang: string, currentSlug: string): Promise<{ prev: any | null; next: any | null }> => {
    console.log(`[getAdjacentPosts] Fetching adjacent posts for lang: ${lang}, slug: ${currentSlug}`);
    const targetUrl = `${API_URL}/api/generated-posts/${currentSlug}/adjacent?lang=${lang}`;
    console.log(`[getAdjacentPosts] Target URL: ${targetUrl}`);

    try {
        const res = await fetch(targetUrl, { next: { revalidate: 60 } });

        if (!res.ok) {
            // It's okay if this fails (e.g., 404 Not Found if endpoint doesn't exist), just return nulls
            console.warn(`[getAdjacentPosts] Failed fetch for ${currentSlug}, lang ${lang} (Status: ${res.status}). URL: ${targetUrl}. Returning nulls.`);
            return { prev: null, next: null };
        }

        const data = await res.json();
        // console.log(`[getAdjacentPosts] Adjacent posts data received for ${currentSlug}:`, JSON.stringify(data, null, 2));
        // Basic validation (adjust based on actual API response for adjacent posts)
        return {
            prev: data.prev || null,
            next: data.next || null
        };

    } catch (error) {
        console.error('[getAdjacentPosts] Error getting adjacent posts:', error);
        return { prev: null, next: null }; // Return default on error
    }
});

// --- Metadata Generation ---
export async function generateMetadata(
    { params }: BlogPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { lang, slug } = await params; // Await params to resolve the Promise

    try {
        // Fetch post data (will use cache if getPost already called)
        const post = await getPost(lang, slug);

        // Extract potential cover image for Open Graph
        // Make sure the URL is absolute or provide base URL
        const coverImageUrl = post.frontmatter.coverImage;
        const ogImages = coverImageUrl ? [{ url: coverImageUrl }] : []; // Adjust URL if relative

        return {
            title: `${post.frontmatter.title} | Blog`, // Customize title structure if needed
            description: post.frontmatter.excerpt,
            openGraph: {
                title: `${post.frontmatter.title} | Blog`,
                description: post.frontmatter.excerpt,
                url: `/${lang}/blog/${slug}`, // Add canonical URL if domain is known
                type: 'article',
                publishedTime: post.frontmatter.date, // ISO string date
                authors: post.frontmatter.author ? [post.frontmatter.author] : undefined,
                tags: post.frontmatter.tags,
                images: ogImages,
            },
            // TODO: Add canonical URL
            // TODO: Add alternates with hreflang for different languages if applicable
            // alternates: {
            //   canonical: `/${lang}/blog/${slug}`,
            //   languages: {
            //     'en-US': `/en/blog/${slug}`, // Example
            //     'ar-AR': `/ar/blog/${slug}`, // Example
            //     'x-default': `/en/blog/${slug}`, // Example default
            //   },
            // },
        };
    } catch (error) {
        // Fallback metadata if post fetch fails
        console.error(`[generateMetadata] Error fetching post for metadata: ${slug}, lang ${lang}`, error);
        return {
            title: 'Blog Post | StudentItaly',
            description: 'Read articles and updates from StudentItaly.',
        };
    }
}

// --- Main BlogPost Component ---
export default async function BlogPost({ params }: BlogPageProps) {
    const { lang, slug } = await params; // Await params to resolve the Promise

    // Fetch post data and adjacent post data in parallel
    const [post, adjacentData] = await Promise.all([
        getPost(lang, slug),
        getAdjacentPosts(lang, slug)
    ]);
    const { prev, next } = adjacentData;
    const { frontmatter, content } = post; // Destructure post for easier access

    // Safely format the date for display
    let formattedDate = 'Date unavailable';
    try {
        const dateObj = new Date(frontmatter.date); // Assumes frontmatter.date is a valid ISO string or Date object
        if (!isNaN(dateObj.getTime())) { // Check if date is valid
            formattedDate = dateObj.toLocaleDateString(
                // Provide appropriate locales
                lang === 'it' ? 'it-IT' : (lang === 'ar' ? 'ar-EG' : 'en-US'),
                { year: 'numeric', month: 'long', day: 'numeric' }
            );
        } else {
             console.warn(`[BlogPost Render] Invalid date encountered: ${frontmatter.date}`);
        }
    } catch (e) { console.error("[BlogPost Render] Error formatting date:", e); }

    // Determine text direction for layout
    const textDir = lang === 'ar' ? 'rtl' : 'ltr';

    return (
        // Set text direction on the main container
        <div className="container mx-auto px-4 py-8 lg:py-12" dir={textDir}>

            {/* Breadcrumbs with margin */}
            <div className="mb-6 md:mb-8">
                <Breadcrumb
                    items={[
                        // Consider dynamically translating 'Home' and 'Blog' or passing them as props
                        { label: 'Home', href: `/${lang}` },
                        { label: 'Blog', href: `/${lang}/blog` },
                        { label: frontmatter.title.length > 50 ? `${frontmatter.title.substring(0, 50)}...` : frontmatter.title, href: `/${lang}/blog/${slug}` }
                    ]}
                />
            </div>

            {/* Article wrapper with background, padding, shadow */}
            <article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg">

                 {/* Optional Featured Image - Ensure API provides frontmatter.coverImage URL */}
                 {frontmatter.coverImage && (
                     <div className="mb-8 -mt-6 -mx-6 sm:-mt-8 sm:-mx-8 lg:-mt-10 lg:-mx-10 aspect-[16/9] relative w-[calc(100%+theme(space.12))] sm:w-[calc(100%+theme(space.16))] lg:w-[calc(100%+theme(space.20))] overflow-hidden rounded-t-lg shadow-md"> {/* Added shadow */}
                        <Image
                            src={frontmatter.coverImage}
                            alt={`Cover image for ${frontmatter.title}`}
                            fill
                            style={{ objectFit: 'cover' }} // Recommended over layout="fill" objectFit="cover"
                            priority // Important for LCP if image is above the fold
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1024px" // Example sizes, adjust as needed
                        />
                    </div>
                 )}

                {/* Article Header */}
                <header className="mb-8 border-b border-gray-200 pb-6">
                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-gray-900 leading-tight">
                        {frontmatter.title}
                    </h1>
                    {/* Metadata: Date & Author */}
                    <div className="text-base text-gray-500 mb-4 flex items-center flex-wrap gap-x-4 gap-y-2"> {/* Added gap-y-2 */}
                        {/* Date */}
                        <span className="flex items-center whitespace-nowrap">
                             {/* Calendar Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <time dateTime={frontmatter.date}>{formattedDate}</time>
                        </span>
                        {/* Author */}
                        {frontmatter.author && (
                             <span className="flex items-center whitespace-nowrap">
                                 {/* User Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {frontmatter.author}
                             </span>
                        )}
                    </div>
                    {/* Tags */}
                    {frontmatter.tags && frontmatter.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                             {/* Tag Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {frontmatter.tags.map(tag => (
                                // Consider making tags links if you have tag archive pages
                                // <Link key={tag} href={`/${lang}/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`} className="inline-block">
                                    <span key={tag} className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium transition hover:bg-teal-200 cursor-pointer">
                                        {tag}
                                    </span>
                                // </Link>
                            ))}
                        </div>
                    )}
                </header>

                {/* Main Content Area with Prose styling */}
                <div
                    // Customize prose further via tailwind.config.js if needed
                    className="prose prose-lg lg:prose-xl max-w-none prose-p:leading-relaxed prose-headings:mt-8 prose-headings:mb-4 prose-li:my-1 prose-a:text-teal-600 hover:prose-a:text-teal-700 prose-img:rounded-md prose-img:shadow-sm" // Added link colors, image styling
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                 {/* Previous/Next Navigation - only renders if prev or next exists */}
                 { (prev || next) && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <BlogNavigation prevPost={prev} nextPost={next} lang={lang} />
                    </div>
                 )}
            </article>

             {/* Optional: You might add a Related Posts component here */}
             {/* <RelatedPosts currentSlug={slug} lang={lang} className="mt-16" /> */}
        </div>
    );
}