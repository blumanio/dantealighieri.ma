// app/[lang]/blog/[slug]/page.tsx

import { marked } from 'marked';
import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { BlogNavigation } from '@/components/BlogNavigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BlogPageProps } from '@/types/types';

// --- Interfaces ---
interface PostFrontmatter {
    title: string;
    date: string;
    excerpt: string;
    author?: string;
    tags?: string[];
    language?: string;
    coverImage?: string;
    [key: string]: any;
}

interface BlogPost {
    frontmatter: PostFrontmatter;
    content: string;
    lang: string;
    slug: string;
}

// --- API Fetching Functions ---
const API_URL = process.env.NODE_ENV

// Fetch Single Post Data (Cached)
const getPost = cache(async (lang: string, slug: string): Promise<BlogPost> => {
    console.log(`[getPost] Fetching post for lang: ${lang}, slug: ${slug}`);
    const targetUrl = `${API_URL}/api/generated-posts/${slug}?lang=${lang}`;
    console.log(`[getPost] Target URL: ${targetUrl}`);

    try {
        const res = await fetch(targetUrl, { next: { revalidate: 60 } });

        if (res.status === 404) {
            console.log(`[getPost] Post not found (404) for slug: ${slug}, lang: ${lang}`);
            notFound();
        }

        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`[getPost] Failed fetch for ${slug}, lang ${lang} (Status: ${res.status}). URL: ${targetUrl}`);
            console.error("[getPost] Error response body:", errorBody);
            throw new Error(`Failed to fetch post: ${slug}`);
        }

        const response = await res.json();

        // Handle new API response format
        let postFromApi: any;
        if (response.success && response.post) {
            postFromApi = response.post;
        } else if (response.slug || response.content) {
            postFromApi = response;
        } else {
            console.error(`[getPost] Unexpected API response structure:`, response);
            throw new Error(`Invalid response structure for post: ${slug}`);
        }

        // Log the content format to debug
        console.log(`[getPost] Content type:`, typeof postFromApi.content);
        console.log(`[getPost] Content preview:`, postFromApi.content?.substring(0, 100));

        // Ensure content is a string before parsing
        const contentToProcess = typeof postFromApi.content === 'string'
            ? postFromApi.content
            : '';

        // Check if content is already HTML (basic check)
        const isContentHtml = contentToProcess.includes('<') && contentToProcess.includes('>');

        // Configure marked with more options for proper rendering
        marked.setOptions({
            gfm: true,
            breaks: true,
        });

        // Parse markdown to HTML only if it's not already HTML
        const parsedContent = isContentHtml
            ? contentToProcess
            : marked.parse(contentToProcess) as string;

        // Log a preview of the parsed HTML to debug
        console.log(`[getPost] Parsed HTML preview:`,
            typeof parsedContent === 'string'
                ? parsedContent.substring(0, 100)
                : 'Non-string content');

        // Construct the post data with proper content
        const frontmatter = postFromApi.frontmatter || {};
        const postData: BlogPost = {
            frontmatter: {
                title: frontmatter.title || postFromApi.title || 'Untitled Post',
                date: frontmatter.date || postFromApi.date || new Date().toISOString(),
                excerpt: frontmatter.excerpt || postFromApi.excerpt || 'No excerpt available.',
                author: frontmatter.author || postFromApi.author,
                tags: Array.isArray(frontmatter.tags) ? frontmatter.tags :
                    (postFromApi.tags ? postFromApi.tags : []),
                coverImage: frontmatter.coverImage || postFromApi.coverImage
            },
            content: parsedContent as string,
            lang: lang,
            slug: slug
        };

        return postData;

    } catch (error) {
        console.error(`[getPost] Error processing post for ${slug}, lang ${lang}:`, error);
        notFound();
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
            console.warn(`[getAdjacentPosts] Failed fetch for ${currentSlug}, lang ${lang} (Status: ${res.status}). URL: ${targetUrl}. Returning nulls.`);
            return { prev: null, next: null };
        }

        const response = await res.json();

        // Handle new API response format
        let adjacentData: any = { prev: null, next: null };

        if (response.success) {
            // New API format
            adjacentData.prev = response.prev || null;
            adjacentData.next = response.next || null;
        } else if (response.prev !== undefined || response.next !== undefined) {
            // Old direct format
            adjacentData = response;
        } else {
            console.warn(`[getAdjacentPosts] Unexpected API response structure:`, response);
        }

        return {
            prev: adjacentData.prev || null,
            next: adjacentData.next || null
        };

    } catch (error) {
        console.error('[getAdjacentPosts] Error getting adjacent posts:', error);
        return { prev: null, next: null };
    }
});

// --- Metadata Generation ---
export async function generateMetadata(
    { params }: BlogPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { lang, slug } = await params;

    try {
        const post = await getPost(lang, slug);

        const coverImageUrl = post.frontmatter.coverImage;
        const ogImages = coverImageUrl ? [{ url: coverImageUrl }] : [];

        return {
            title: `${post.frontmatter.title} | Blog`,
            description: post.frontmatter.excerpt,
            openGraph: {
                title: `${post.frontmatter.title} | Blog`,
                description: post.frontmatter.excerpt,
                url: `/${lang}/blog/${slug}`,
                type: 'article',
                publishedTime: post.frontmatter.date,
                authors: post.frontmatter.author ? [post.frontmatter.author] : undefined,
                tags: post.frontmatter.tags,
                images: ogImages,
            },
        };
    } catch (error) {
        console.error(`[generateMetadata] Error fetching post for metadata: ${slug}, lang ${lang}`, error);
        return {
            title: 'Blog Post | StudentItaly',
            description: 'Read articles and updates from StudentItaly.',
        };
    }
}

// --- Main BlogPost Component ---
export default async function BlogPost({ params }: BlogPageProps) {
    const { lang, slug } = await params;

    // Fetch post data and adjacent post data in parallel
    const [post, adjacentData] = await Promise.all([
        getPost(lang, slug),
        getAdjacentPosts(lang, slug)
    ]);
    const { prev, next } = adjacentData;
    const { frontmatter, content } = post;

    // Safely format the date for display
    let formattedDate = 'Date unavailable';
    try {
        const dateObj = new Date(frontmatter.date);
        if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toLocaleDateString(
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
        <div className="container mx-auto px-4 py-8 lg:py-12" dir={textDir}>
            {/* Breadcrumbs with margin */}
            <div className="mb-6 md:mb-8">
                <Breadcrumb
                    items={[
                        { label: 'Home', href: `/${lang}` },
                        { label: 'Blog', href: `/${lang}/blog` },
                        { label: frontmatter.title.length > 50 ? `${frontmatter.title.substring(0, 50)}...` : frontmatter.title, href: `/${lang}/blog/${slug}` }
                    ]}
                />
            </div>

            {/* Article wrapper with background, padding, shadow */}
            <article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg">
                {/* Optional Featured Image */}
                {frontmatter.coverImage && (
                    <div className="mb-8 -mt-6 -mx-6 sm:-mt-8 sm:-mx-8 lg:-mt-10 lg:-mx-10 aspect-[16/9] relative w-[calc(100%+theme(space.12))] sm:w-[calc(100%+theme(space.16))] lg:w-[calc(100%+theme(space.20))] overflow-hidden rounded-t-lg shadow-md">
                        <Image
                            src={frontmatter.coverImage}
                            alt={`Cover image for ${frontmatter.title}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1024px"
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
                    <div className="text-base text-gray-500 mb-4 flex items-center flex-wrap gap-x-4 gap-y-2">
                        {/* Date */}
                        <span className="flex items-center whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <time dateTime={frontmatter.date}>{formattedDate}</time>
                        </span>
                        {/* Author */}
                        {frontmatter.author && (
                            <span className="flex items-center whitespace-nowrap">
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {frontmatter.tags.map(tag => (
                                <span key={tag} className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium transition hover:bg-teal-200 cursor-pointer">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Main Content Area with Prose styling */}
                <div
                    className="prose prose-lg lg:prose-xl max-w-none prose-p:leading-relaxed prose-headings:mt-8 prose-headings:mb-4 prose-li:my-1 prose-a:text-teal-600 hover:prose-a:text-teal-700 prose-img:rounded-md prose-img:shadow-sm"
                    dangerouslySetInnerHTML={{ __html: content || '<p>No content available</p>' }}
                />



                {/* Previous/Next Navigation */}
                {(prev || next) && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <BlogNavigation prevPost={prev} nextPost={next} lang={lang} />
                    </div>
                )}
            </article>
        </div>
    );
}