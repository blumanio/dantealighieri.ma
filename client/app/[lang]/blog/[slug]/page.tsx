// app/[lang]/blog/[slug]/page.tsx
import { marked } from 'marked';
import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { BlogNavigation } from '@/components/BlogNavigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BlogPageProps as SingleBlogPageProps } from '@/types/types';
import { PremiumBlogInteractions } from '@/components/blog/PremiumBlogInteractions';
import {
    Clock, User, Calendar, Eye, Heart, MessageCircle, Share2,
    Bookmark, Crown, Shield, Star, Award, TrendingUp, Sparkles
} from 'lucide-react';

interface PostFrontmatter {
    title: string;
    date: string;
    excerpt: string;
    author?: string;
    authorId?: string; // Clerk user ID
    authorRole?: string;
    tags?: string[];
    language?: string;
    coverImage?: string;
    readingTime?: number;
    [key: string]: any;
}

interface BlogPost {
    frontmatter: PostFrontmatter;
    content: string;
    lang: string;
    slug: string;
    _id?: string;
    viewCount?: number;
    likesCount?: number;
    commentsCount?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

// Calculate reading time from content
const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
};

const getPost = cache(async (lang: string, slug: string): Promise<BlogPost> => {
    console.log(`[SinglePost - getPost] Fetching post for lang: ${lang}, slug: ${slug}`);
    const targetUrl = `${API_BASE_URL}/api/generated-posts/${slug}?lang=${lang}`;

    try {
        const res = await fetch(targetUrl, { next: { revalidate: 60 } });
        if (res.status === 404) {
            console.log(`[SinglePost - getPost] Post not found (404) for slug: ${slug}, lang: ${lang}`);
            notFound();
        }
        if (!res.ok) {
            const errorBody = await res.text().catch(() => "Could not read error body");
            console.error(`[SinglePost - getPost] Failed fetch (Status: ${res.status}). Body: ${errorBody}`);
            throw new Error(`Failed to fetch post: ${slug}`);
        }

        const response = await res.json();

        let postFromApi: any;
        if (response.success && response.post) {
            postFromApi = response.post;
        } else if (response.slug && response.content) {
            postFromApi = response;
        } else {
            console.error(`[SinglePost - getPost] Unexpected API response structure:`, response);
            throw new Error(`Invalid response structure for post: ${slug}`);
        }

        const contentToProcess = typeof postFromApi.content === 'string' ? postFromApi.content : '';
        const isContentHtml = contentToProcess.includes('<') && contentToProcess.includes('>');
        marked.setOptions({ gfm: true, breaks: true });
        const parsedContent = isContentHtml ? contentToProcess : marked.parse(contentToProcess) as string;
        const frontmatter = postFromApi.frontmatter || {};

        // Calculate reading time if not provided
        const readingTime = frontmatter.readingTime || calculateReadingTime(contentToProcess);

        return {
            frontmatter: {
                title: frontmatter.title || postFromApi.title || 'Untitled Post',
                date: frontmatter.date || postFromApi.date || new Date().toISOString(),
                excerpt: frontmatter.excerpt || postFromApi.excerpt || 'No excerpt available.',
                author: frontmatter.author || postFromApi.author,
                authorId: frontmatter.authorId || postFromApi.authorId,
                authorRole: frontmatter.authorRole || postFromApi.authorRole,
                tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : (postFromApi.tags ? (Array.isArray(postFromApi.tags) ? postFromApi.tags : [postFromApi.tags]) : []),
                coverImage: frontmatter.coverImage || postFromApi.coverImage,
                language: lang,
                readingTime
            },
            content: parsedContent,
            lang: lang,
            slug: slug,
            _id: postFromApi._id,
            viewCount: postFromApi.viewCount || 0,
            likesCount: postFromApi.likesCount || 0,
            commentsCount: postFromApi.commentsCount || 0
        };
    } catch (error) {
        console.error(`[SinglePost - getPost] Error for ${slug}, lang ${lang}:`, error);
        notFound();
    }
});

const getAdjacentPosts = cache(async (lang: string, currentSlug: string): Promise<{ prev: any | null; next: any | null }> => {
    console.log(`[SinglePost - getAdjacentPosts] For lang: ${lang}, slug: ${currentSlug}`);
    if (!API_BASE_URL) {
        console.error("[SinglePost - getAdjacentPosts] API_BASE_URL is not defined.");
        return { prev: null, next: null };
    }

    const targetUrl = `${API_BASE_URL}/api/generated-posts/${currentSlug}/adjacent?lang=${lang}`;
    try {
        const res = await fetch(targetUrl, { next: { revalidate: 60 } });
        if (!res.ok) {
            console.warn(`[SinglePost - getAdjacentPosts] Failed fetch (Status: ${res.status})`);
            return { prev: null, next: null };
        }
        const response = await res.json();

        if (response.success) {
            return { prev: response.prev || null, next: response.next || null };
        } else if (response.prev !== undefined || response.next !== undefined) {
            return { prev: response.prev || null, next: response.next || null };
        }
        console.warn(`[SinglePost - getAdjacentPosts] Unexpected API response structure:`, response);
        return { prev: null, next: null };
    } catch (error) {
        console.error(`[SinglePost - getAdjacentPosts] Error:`, error);
        return { prev: null, next: null };
    }
});

export async function generateStaticParams() {
    console.warn("[SinglePost - generateStaticParams] Implement fetching of all lang/slug combinations.");
    const exampleParams = [
        { lang: 'en', slug: 'example-post' },
        { lang: 'ar', slug: 'مثال-مشاركة' },
        { lang: 'fr', slug: 'exemple-partage' },
    ];

    try {
        const defaultLangs = ['en','fr', 'ar'];
        // In production, fetch actual slugs from API
        return exampleParams;
    } catch (error) {
        console.error("Error in generateStaticParams for blog slugs:", error);
        return exampleParams;
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
        }
    } catch (e) {
        console.error("[BlogPost Render] Error formatting date:", e);
    }

    const textDir = lang === 'ar' ? 'rtl' : 'ltr';

    let absoluteCoverImageUrl = frontmatter.coverImage;
    if (frontmatter.coverImage && !frontmatter.coverImage.startsWith('http')) {
        absoluteCoverImageUrl = `${API_BASE_URL}${frontmatter.coverImage.startsWith('/') ? '' : '/'}${frontmatter.coverImage}`;
    }

    const getRoleConfig = (role?: string) => {
        switch (role) {
            case 'editor':
                return {
                    label: 'Editor',
                    bgClass: 'bg-purple-100 border-purple-200',
                    textClass: 'text-purple-700',
                    icon: Crown
                };
            case 'author':
                return {
                    label: 'Author',
                    bgClass: 'bg-blue-100 border-blue-200',
                    textClass: 'text-blue-700',
                    icon: Award
                };
            case 'contributor':
                return {
                    label: 'Contributor',
                    bgClass: 'bg-emerald-100 border-emerald-200',
                    textClass: 'text-emerald-700',
                    icon: Star
                };
            default:
                return null;
        }
    };

    const roleConfig = getRoleConfig(frontmatter.authorRole);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden" dir={textDir}>
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative container mx-auto px-4 py-8 lg:py-16">
                {/* Premium Breadcrumb */}
                <div className="mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-4">
                        <Breadcrumb
                            items={[
                                { label: 'Home', href: `/${lang}` },
                                { label: 'Blog', href: `/${lang}/blog` },
                                { label: frontmatter.title.length > 50 ? `${frontmatter.title.substring(0, 50)}...` : frontmatter.title, href: `/${lang}/blog/${slug}` }
                            ]}
                        />
                    </div>
                </div>

                {/* Premium Article Container */}
                <article className="max-w-5xl mx-auto">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-200 mb-8">
                        {/* Premium Badge */}
                        {/* <div className="absolute top-6 right-6 z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full shadow-lg">
                                <Sparkles className="h-4 w-4 text-white" />
                                <span className="text-white font-bold text-sm">Premium Content</span>
                            </div>
                        </div> */}

                        {/* Cover Image */}
                        {absoluteCoverImageUrl && (
                            <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                                <Image
                                    src={absoluteCoverImageUrl}
                                    alt={`Cover image for ${frontmatter.title}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1024px"
                                    className="transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                            </div>
                        )}

                        {/* Article Header */}
                        <div className="p-8 lg:p-12">
                            <header className="space-y-6">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                                    <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                                        {frontmatter.title}
                                    </span>
                                </h1>

                                {/* Article Meta */}
                                <div className="flex flex-wrap items-center gap-6 text-slate-600">
                                    {/* Author Section */}
                                    <div className="flex items-center gap-3">
                                        {frontmatter.authorId ? (
                                            <Link href={`/${lang}/users/${frontmatter.authorId}`} className="group/author flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover/author:scale-110 transition-transform duration-300">
                                                        <User className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                                                        <Shield className="h-2 w-2 text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 group-hover/author:text-blue-600 transition-colors duration-300">
                                                            {frontmatter.author || 'Anonymous'}
                                                        </span>
                                                        {roleConfig && (
                                                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${roleConfig.bgClass} ${roleConfig.textClass}`}>
                                                                <roleConfig.icon className="h-3 w-3" />
                                                                {roleConfig.label}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-slate-500">Author Profile</div>
                                                </div>
                                            </Link>
                                        ) : frontmatter.author && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center shadow-lg">
                                                    <User className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900">{frontmatter.author}</span>
                                                        {roleConfig && (
                                                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${roleConfig.bgClass} ${roleConfig.textClass}`}>
                                                                <roleConfig.icon className="h-3 w-3" />
                                                                {roleConfig.label}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-slate-500">Staff Writer</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Article Stats */}
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                                            <Calendar className="h-4 w-4 text-slate-500" />
                                            <time dateTime={frontmatter.date} className="font-semibold">
                                                {formattedDate}
                                            </time>
                                        </div>

                                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-xl">
                                            <Clock className="h-4 w-4 text-blue-500" />
                                            <span className="font-semibold text-blue-700">
                                                {frontmatter.readingTime} min read
                                            </span>
                                        </div>

                                        {/* <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 rounded-xl">
                                            <Eye className="h-4 w-4 text-emerald-500" />
                                            <span className="font-semibold text-emerald-700">
                                                {post.viewCount || 0} views
                                            </span>
                                        </div> */}
                                    </div>
                                </div>

                                {/* Tags */}
                                {frontmatter.tags && frontmatter.tags.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-slate-400" />
                                            <span className="text-sm font-semibold text-slate-600">Topics:</span>
                                        </div>
                                        {frontmatter.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 text-blue-800 rounded-full text-sm font-bold hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 cursor-pointer"
                                            >
                                                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </header>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 lg:p-12">
                                <div
                                    className="prose prose-lg lg:prose-xl max-w-none prose-p:leading-relaxed prose-headings:mt-12 prose-headings:mb-6 prose-headings:font-black prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-li:my-2 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-a:font-semibold prose-img:rounded-2xl prose-img:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-xl"
                                    dangerouslySetInnerHTML={{ __html: content || '<p>No content available</p>' }}
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Article Actions */}
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sticky top-6">
                                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    Engage
                                </h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center p-3 bg-red-50 rounded-xl border border-red-200">
                                            <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                                            <div className="text-lg font-black text-red-700">{post.likesCount || 0}</div>
                                            <div className="text-xs text-red-600 font-semibold">Likes</div>
                                        </div>
                                        <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                                            <MessageCircle className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                                            <div className="text-lg font-black text-blue-700">{post.commentsCount || 0}</div>
                                            <div className="text-xs text-blue-600 font-semibold">Comments</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105">
                                            <Heart className="h-4 w-4" />
                                            Like
                                        </button>
                                        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105">
                                            <Share2 className="h-4 w-4" />
                                            Share
                                        </button>
                                        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105">
                                            <Bookmark className="h-4 w-4" />
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                    Article Stats
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Reading Time:</span>
                                        <span className="font-bold text-slate-900">{frontmatter.readingTime} min</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Views:</span>
                                        <span className="font-bold text-slate-900">{post.viewCount || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Published:</span>
                                        <span className="font-bold text-slate-900">{formattedDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    {post._id && (
                        <div className="mt-12">
                            <PremiumBlogInteractions
                                postId={post._id}
                                postType="blog"
                                lang={lang}
                                initialLikes={post.likesCount || 0}
                                initialComments={post.commentsCount || 0}
                            />
                        </div>
                    )}

                    {/* Navigation */}
                    {(prev || next) && (
                        <div className="mt-16">
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                                <BlogNavigation prevPost={prev} nextPost={next} lang={lang} />
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
}