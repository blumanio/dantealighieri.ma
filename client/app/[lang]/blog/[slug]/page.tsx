// app/[lang]/blog/[slug]/page.tsx
import { marked } from 'marked';
import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { BlogNavigation } from '@/components/BlogNavigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BlogPageProps as SingleBlogPageProps } from '@/types/types'; // Assuming this type is { params: { lang: string, slug: string } }

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const getPost = cache(async (lang: string, slug: string): Promise<BlogPost> => {
    console.log(`[SinglePost - getPost] Fetching post for lang: ${lang}, slug: ${slug}, Using API_BASE_URL: ${API_BASE_URL}`);
    const targetUrl = `${API_BASE_URL}/api/generated-posts/${slug}?lang=${lang}`; // Ensure this API endpoint exists
    console.log(`[SinglePost - getPost] Target URL (absolute): ${targetUrl}`);

    try {
        const res = await fetch(targetUrl, { next: { revalidate: 60 } });
        if (res.status === 404) {
            console.log(`[SinglePost - getPost] Post not found (404) for slug: ${slug}, lang: ${lang}. URL: ${targetUrl}`);
            notFound();
        }
        if (!res.ok) {
            const errorBody = await res.text().catch(() => "Could not read error body");
            console.error(`[SinglePost - getPost] Failed fetch (Status: ${res.status}). URL: ${targetUrl}. Body: ${errorBody}`);
            throw new Error(`Failed to fetch post: ${slug} from ${targetUrl}`);
        }
        const response = await res.json(); // Assume this returns a single post object

        let postFromApi: any;
        // Adapt this logic based on your actual single post API response structure
        if (response.success && response.post) {
            postFromApi = response.post;
        } else if (response.slug && response.content) { // If API returns the post directly
            postFromApi = response;
        } else {
            console.error(`[SinglePost - getPost] Unexpected API response structure from ${targetUrl}:`, response);
            throw new Error(`Invalid response structure for post: ${slug}`);
        }

        const contentToProcess = typeof postFromApi.content === 'string' ? postFromApi.content : '';
        const isContentHtml = contentToProcess.includes('<') && contentToProcess.includes('>');
        marked.setOptions({ gfm: true, breaks: true });
        const parsedContent = isContentHtml ? contentToProcess : marked.parse(contentToProcess) as string;
        const frontmatter = postFromApi.frontmatter || {};

        return {
            frontmatter: {
                title: frontmatter.title || postFromApi.title || 'Untitled Post',
                date: frontmatter.date || postFromApi.date || new Date().toISOString(),
                excerpt: frontmatter.excerpt || postFromApi.excerpt || 'No excerpt available.',
                author: frontmatter.author || postFromApi.author,
                tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : (postFromApi.tags ? (Array.isArray(postFromApi.tags) ? postFromApi.tags : [postFromApi.tags]) : []),
                coverImage: frontmatter.coverImage || postFromApi.coverImage,
                language: lang
            },
            content: parsedContent,
            lang: lang,
            slug: slug
        };
    } catch (error) {
        console.error(`[SinglePost - getPost] Error for ${slug}, lang ${lang} (URL: ${targetUrl}):`, error);
        notFound(); // Call notFound for any critical error
        // throw error; // notFound() should stop execution, re-throw might be redundant
    }
});

const getAdjacentPosts = cache(async (lang: string, currentSlug: string): Promise<{ prev: any | null; next: any | null }> => {
    console.log(`[SinglePost - getAdjacentPosts] For lang: ${lang}, slug: ${currentSlug}, Using API_BASE_URL: ${API_BASE_URL}`);
    if (!API_BASE_URL) {
        console.error("[SinglePost - getAdjacentPosts] API_BASE_URL is not defined.");
        return { prev: null, next: null };
    }
    // Ensure this API endpoint exists and returns the correct structure
    const targetUrl = `${API_BASE_URL}/api/generated-posts/${currentSlug}/adjacent?lang=${lang}`;
    console.log(`[SinglePost - getAdjacentPosts] Target URL (absolute): ${targetUrl}`);
    try {
        const res = await fetch(targetUrl, { next: { revalidate: 60 } });
        if (!res.ok) {
            console.warn(`[SinglePost - getAdjacentPosts] Failed fetch (Status: ${res.status}). URL: ${targetUrl}.`);
            return { prev: null, next: null };
        }
        const response = await res.json();
        // Adapt based on your actual API response for adjacent posts
        if (response.success) {
            return { prev: response.prev || null, next: response.next || null };
        } else if (response.prev !== undefined || response.next !== undefined) {
            return { prev: response.prev || null, next: response.next || null };
        }
        console.warn(`[SinglePost - getAdjacentPosts] Unexpected API response structure from ${targetUrl}:`, response);
        return { prev: null, next: null };
    } catch (error) {
        console.error(`[SinglePost - getAdjacentPosts] Error from ${targetUrl}:`, error);
        return { prev: null, next: null };
    }
});

// You need to implement generateStaticParams for this dynamic route as well
export async function generateStaticParams() {
    // You'll need to fetch all possible lang/slug combinations here
    // This is a placeholder - replace with actual logic to get all slugs for all languages
    // Example: Fetch all posts, then map to params
    // const allPosts = await fetch(`${API_BASE_URL}/api/all-post-slugs-and-langs`).then(res => res.json());
    // return allPosts.map(post => ({ lang: post.lang, slug: post.slug }));
    console.warn("[SinglePost - generateStaticParams] Placeholder! Implement fetching of all lang/slug combinations.");
    // For now, returning a minimal set to avoid build errors, but this needs actual data.
    const exampleParams = [
        { lang: 'en', slug: 'example-post' }, // Replace with actual slugs
        { lang: 'it', slug: 'esempio-post' },
        { lang: 'ar', slug: 'مثال-مشاركة' },
        { lang: 'fr', slug: 'exemple-partage' },

    ];
    // Filter out or provide default params if your API for all slugs isn't ready
    // For a real build, you would fetch all lang/slug combinations from your API or a source
    try {
        const defaultLangs = ['en', 'it', 'fr', 'ar'];
        const tempParams: { lang: string; slug: string }[] = [];
        // In a real scenario, you'd fetch these from your CMS/backend
        // For example:
        // for (const lang of defaultLangs) {
        //   const postsForLang = await fetch(`${API_BASE_URL}/api/generated-posts?lang=${lang}&fields=slug`).then(res => res.json());
        //   postsForLang.forEach(post => tempParams.push({ lang, slug: post.slug }));
        // }
        // If tempParams is empty, provide at least one valid fallback or ensure your build handles it.
        // return tempParams.length > 0 ? tempParams : exampleParams; 
        return exampleParams; // Use placeholder if actual fetching isn't set up
    } catch (error) {
        console.error("Error in generateStaticParams for blog slugs:", error);
        return exampleParams; // Fallback
    }
}


export async function generateMetadata(
    { params }: SingleBlogPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const lang = (await params).lang;
    const slug = (await params).slug;
    try {
        const post = await getPost(lang, slug);
        let absoluteCoverImageUrl = post.frontmatter.coverImage;
        if (post.frontmatter.coverImage && !post.frontmatter.coverImage.startsWith('http')) {
            absoluteCoverImageUrl = `${API_BASE_URL}${post.frontmatter.coverImage.startsWith('/') ? '' : '/'}${post.frontmatter.coverImage}`;
        }
        const ogImages = absoluteCoverImageUrl ? [{ url: absoluteCoverImageUrl }] : [];
        const pageUrl = `${API_BASE_URL}/${lang}/blog/${slug}`;

        return {
            title: `${post.frontmatter.title} | Studentitaly Blog`,
            description: post.frontmatter.excerpt,
            openGraph: {
                title: `${post.frontmatter.title} | Studentitaly Blog`,
                description: post.frontmatter.excerpt,
                url: pageUrl,
                type: 'article',
                publishedTime: post.frontmatter.date,
                authors: post.frontmatter.author ? [post.frontmatter.author] : undefined,
                tags: post.frontmatter.tags,
                images: ogImages,
                locale: post.lang,
                siteName: 'Studentitaly',
            },
            alternates: {
                canonical: pageUrl,
                languages: {
                    [post.lang]: pageUrl,
                    // You could list other language versions of this *same* post if available
                },
            },
        };
    } catch (error) {
        console.error(`[generateMetadata] Error for: ${slug}, lang ${lang}`, error);
        return {
            title: 'Blog Post | Studentitaly',
            description: 'Read articles and updates from Studentitaly.',
        };
    }
}

export default async function BlogPostPage({ params }: SingleBlogPageProps) {
    const lang = (await params).lang;
    const slug = (await params).slug;

    const [post, adjacentData] = await Promise.all([
        getPost(lang, slug),
        getAdjacentPosts(lang, slug)
    ]);

    // The notFound() in getPost should handle cases where post is not found.
    // If getPost completes (doesn't throw or call notFound), post will be valid.

    const { prev, next } = adjacentData;
    const { frontmatter, content } = post;

    let formattedDate = 'Date unavailable';
    try {
        const dateObj = new Date(frontmatter.date);
        if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toLocaleDateString(
                lang === 'it' ? 'it-IT' : (lang === 'fr' ? 'fr-FR' : (lang === 'ar' ? 'ar-EG' : 'en-US')),
                { year: 'numeric', month: 'long', day: 'numeric' }
            );
        } else {
            console.warn(`[BlogPost Render] Invalid date: ${frontmatter.date}`);
        }
    } catch (e) { console.error("[BlogPost Render] Error formatting date:", e); }

    const textDir = lang === 'ar' ? 'rtl' : 'ltr';

    let absoluteCoverImageUrl = frontmatter.coverImage;
    if (frontmatter.coverImage && !frontmatter.coverImage.startsWith('http')) {
        absoluteCoverImageUrl = `${API_BASE_URL}${frontmatter.coverImage.startsWith('/') ? '' : '/'}${frontmatter.coverImage}`;
    }

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12" dir={textDir}>
            <div className="mb-6 md:mb-8">
                <Breadcrumb
                    items={[
                        { label: 'Home', href: `/${lang}` },
                        { label: 'Blog', href: `/${lang}/blog` },
                        { label: frontmatter.title.length > 50 ? `${frontmatter.title.substring(0, 50)}...` : frontmatter.title, href: `/${lang}/blog/${slug}` }
                    ]}
                />
            </div>
            <article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg">
                {absoluteCoverImageUrl && (
                    <div className="mb-8 -mt-6 -mx-6 sm:-mt-8 sm:-mx-8 lg:-mt-10 lg:-mx-10 aspect-[16/9] relative w-[calc(100%+theme(space.12))] sm:w-[calc(100%+theme(space.16))] lg:w-[calc(100%+theme(space.20))] overflow-hidden rounded-t-lg shadow-md">
                        <Image
                            src={absoluteCoverImageUrl}
                            alt={`Cover image for ${frontmatter.title}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1024px"
                        />
                    </div>
                )}
                <header className="mb-8 border-b border-gray-200 pb-6">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-gray-900 leading-tight">
                        {frontmatter.title}
                    </h1>
                    <div className="text-base text-gray-500 mb-4 flex items-center flex-wrap gap-x-4 gap-y-2">
                        <span className="flex items-center whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <time dateTime={frontmatter.date}>{formattedDate}</time>
                        </span>
                        {frontmatter.author && (
                            <span className="flex items-center whitespace-nowrap">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {frontmatter.author}
                            </span>
                        )}
                    </div>
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
                <div
                    className="prose prose-lg lg:prose-xl max-w-none prose-p:leading-relaxed prose-headings:mt-8 prose-headings:mb-4 prose-li:my-1 prose-a:text-teal-600 hover:prose-a:text-teal-700 prose-img:rounded-md prose-img:shadow-sm"
                    dangerouslySetInnerHTML={{ __html: content || '<p>No content available</p>' }}
                />
                {(prev || next) && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <BlogNavigation prevPost={prev} nextPost={next} lang={lang} />
                    </div>
                )}
            </article>
        </div>
    );
}