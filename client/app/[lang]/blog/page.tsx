// app/[lang]/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { BlogIndexProps } from '@/types/types'; // Assuming BlogIndexProps is { params: { lang: string } }
import {
  Clock, User, Calendar, Eye, Heart, MessageCircle, Crown,
  Shield, Star, Award, TrendingUp, Sparkles, Filter, Search,
  BookOpen, ArrowRight, Target, Zap
} from 'lucide-react';

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
    author: string;
    authorId?: string;
    authorRole?: string;
    coverImage?: string;
    readingTime?: number;
    tags?: string[];
    [key: string]: any;
  };
  lang?: string;
  viewCount?: number;
  likesCount?: number;
  commentsCount?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Calculate reading time from content
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

async function getPosts(lang: string): Promise<Post[]> {
  console.log(`[BlogIndex - getPosts for ${lang}] Using API_BASE_URL: ${API_BASE_URL}`);
  const targetUrl = `${API_BASE_URL}/api/generated-posts?lang=${lang}`;

  try {
    const res = await fetch(targetUrl, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "Could not read error body");
      console.error(`[BlogIndex - getPosts for ${lang}] Fetch failed: ${res.status}. Body: ${errorBody}`);
      return [];
    }

    const response = await res.json();

    let postsFromApi = [];
    if (response.success && Array.isArray(response.posts)) {
      postsFromApi = response.posts;
    } else if (Array.isArray(response)) {
      postsFromApi = response;
    } else {
      console.error(`[BlogIndex - getPosts for ${lang}] Invalid API response structure:`, response);
      return [];
    }

    const posts: Post[] = postsFromApi.filter((p: any) => p && p.slug).map((p: any) => {
      const frontmatter = p.frontmatter || {};
      const readingTime = frontmatter.readingTime || calculateReadingTime(p.content || '');

      return {
        slug: p.slug,
        frontmatter: {
          title: frontmatter.title || p.title || 'Untitled',
          date: frontmatter.date || p.date || new Date().toISOString(),
          excerpt: frontmatter.excerpt || p.excerpt || 'No excerpt available.',
          author: frontmatter.author || p.author || 'Studentitaly Staff',
          authorId: frontmatter.authorId || p.authorId,
          authorRole: frontmatter.authorRole || p.authorRole,
          coverImage: frontmatter.coverImage || p.coverImage || undefined,
          readingTime,
          tags: frontmatter.tags || p.tags || []
        },
        lang: lang,
        viewCount: p.viewCount || 0,
        likesCount: p.likesCount || 0,
        commentsCount: p.commentsCount || 0
      };
    });

    const sortedPosts = posts.sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      if (isNaN(dateB)) return -1;
      if (isNaN(dateA)) return 1;
      return dateB - dateA;
    });

    console.log(`[BlogIndex - getPosts for ${lang}] Found ${sortedPosts.length} posts`);
    return sortedPosts;

  } catch (error) {
    console.error(`[BlogIndex - getPosts for ${lang}] Unexpected error:`, error);
    return [];
  }
}

export async function generateStaticParams() {
  const languages = ['en', 'it', 'fr', 'ar'];
  return languages.map(lang => ({ lang }));
}

export default async function BlogPage({ params }: BlogIndexProps) {
  // Corrected: params is an object, not a promise.
  const lang = (await params).lang;

  console.log(`[BlogPage] Fetching posts for lang: ${lang}`);
  const posts = await getPosts(lang);
  console.log(`[BlogPage] Number of posts received: ${posts.length}`);

  const textDir = lang === 'ar' ? 'rtl' : 'ltr';

  const formatDate = (dateString: string, locale: string) => {
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) { return "Invalid Date"; }
      return dateObj.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return "Invalid Date";
    }
  };

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

  // Get featured post (first post)
  const featuredPost = posts[9];
  const regularPosts = posts.slice(1);

  // Line 164 in the original error context.
  // Ensuring standard characters are used here for the return and JSX.
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden" dir={textDir}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative container mx-auto px-4 py-8 lg:py-16">
        {/* Premium Header */}
        <div className="text-center mb-16">
          {/* Premium Badge */}
          {/* <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200 rounded-full shadow-lg mb-8">
            <Crown className="h-5 w-5 text-emerald-600" />
            <span className="text-emerald-800 font-bold text-sm">Premium Blog Content</span>
            <Sparkles className="h-4 w-4 text-yellow-500 fill-current" />
          </div> */}

          {/* Main Title */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Blog
            </h1>
          </div>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover insights, tips, and stories from our community of students, mentors, and education experts
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 mb-3 group-hover:scale-110">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto" />
              </div>
              <div className="text-2xl font-black text-slate-900">{posts.length}</div>
              <div className="text-sm text-slate-600 font-semibold">Articles</div>
            </div>
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 mb-3 group-hover:scale-110">
                <User className="h-8 w-8 text-emerald-600 mx-auto" />
              </div>
              <div className="text-2xl font-black text-slate-900">{new Set(posts.map(p => p.frontmatter.author)).size}</div>
              <div className="text-sm text-slate-600 font-semibold">Writers</div>
            </div>
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 mb-3 group-hover:scale-110">
                <Eye className="h-8 w-8 text-purple-600 mx-auto" />
              </div>
              <div className="text-2xl font-black text-slate-900">{posts.reduce((sum, p) => sum + (p.viewCount || 0), 0)}</div>
              <div className="text-sm text-slate-600 font-semibold">Total Views</div>
            </div>
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 mb-3 group-hover:scale-110">
                <Heart className="h-8 w-8 text-red-600 mx-auto" />
              </div>
              <div className="text-2xl font-black text-slate-900">{posts.reduce((sum, p) => sum + (p.likesCount || 0), 0)}</div>
              <div className="text-sm text-slate-600 font-semibold">Total Likes</div>
            </div>
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-16">
            {/* Featured Post */}
            {featuredPost && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Featured Article</h2>
                </div>

                <Link href={`/${lang}/blog/${featuredPost.slug}`} className="group block">
                  <article className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-500 hover:-translate-y-2">
                    {/* Premium gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Premium accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                      {/* Image Section */}
                      {featuredPost.frontmatter.coverImage && (
                        <div className="relative h-64 lg:h-full overflow-hidden">
                          <Image
                            src={featuredPost.frontmatter.coverImage.startsWith('http')
                              ? featuredPost.frontmatter.coverImage
                              : `${API_BASE_URL}${featuredPost.frontmatter.coverImage.startsWith('/') ? '' : '/'}${featuredPost.frontmatter.coverImage}`
                            }
                            alt={`Cover image for ${featuredPost.frontmatter.title}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                          <div className="absolute top-4 left-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full shadow-lg">
                              <Crown className="h-3 w-3 text-white" />
                              <span className="text-white font-bold text-xs">Featured</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Content Section */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="space-y-6">
                          <h3 className="text-3xl lg:text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                            {featuredPost.frontmatter.title}
                          </h3>

                          <p className="text-lg text-slate-700 leading-relaxed">
                            {featuredPost.frontmatter.excerpt}
                          </p>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              {featuredPost.frontmatter.authorId ? (
                                <Link
                                  href={`/${lang}/users/${featuredPost.frontmatter.authorId}`}
                                  className="flex items-center gap-2 group/author"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center group-hover/author:scale-110 transition-transform duration-300">
                                    <User className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="font-bold text-slate-900 group-hover/author:text-blue-600 transition-colors">
                                    {featuredPost.frontmatter.author}
                                  </span>
                                </Link>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="font-bold text-slate-900">{featuredPost.frontmatter.author}</span>
                                </div>
                              )}

                              {(() => {
                                const roleConfig = getRoleConfig(featuredPost.frontmatter.authorRole);
                                if (!roleConfig) return null;
                                const Icon = roleConfig.icon;
                                return (
                                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${roleConfig.bgClass} ${roleConfig.textClass}`}>
                                    <Icon className="h-3 w-3" />
                                    {roleConfig.label}
                                  </div>
                                );
                              })()}
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-lg">
                                <Calendar className="h-4 w-4 text-slate-500" />
                                <time dateTime={featuredPost.frontmatter.date} className="font-semibold text-slate-700">
                                  {formatDate(featuredPost.frontmatter.date, lang === 'it' ? 'it-IT' : (lang === 'ar' ? 'ar-EG' : 'en-US'))}
                                </time>
                              </div>

                              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-lg">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span className="font-semibold text-blue-700">
                                  {featuredPost.frontmatter.readingTime} min
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          {featuredPost.frontmatter.tags && featuredPost.frontmatter.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {featuredPost.frontmatter.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold"
                                >
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Stats */}
                          <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-1 text-slate-500">
                              <Eye className="h-4 w-4" />
                              <span className="text-sm font-semibold">{featuredPost.viewCount}</span>
                            </div>
                            <div className="flex items-center gap-1 text-red-500">
                              <Heart className="h-4 w-4" />
                              <span className="text-sm font-semibold">{featuredPost.likesCount}</span>
                            </div>
                            <div className="flex items-center gap-1 text-blue-500">
                              <MessageCircle className="h-4 w-4" />
                              <span className="text-sm font-semibold">{featuredPost.commentsCount}</span>
                            </div>
                            <div className="ml-auto">
                              <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 font-bold">
                                <span>Read Article</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </section>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Latest Articles</h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {regularPosts.map((post) => {
                    let absoluteCoverImageUrl = post.frontmatter.coverImage;
                    if (post.frontmatter.coverImage && !post.frontmatter.coverImage.startsWith('http')) {
                      absoluteCoverImageUrl = `${API_BASE_URL}${post.frontmatter.coverImage.startsWith('/') ? '' : '/'}${post.frontmatter.coverImage}`;
                    }

                    const roleConfig = getRoleConfig(post.frontmatter.authorRole);

                    return (
                      <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className="group block">
                        <article className="h-full bg-white rounded-3xl shadow-lg hover:shadow-2xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                          {/* Premium gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Image */}
                          {absoluteCoverImageUrl && (
                            <div className="relative h-48 overflow-hidden">
                              <Image
                                src={absoluteCoverImageUrl}
                                alt={`Cover image for ${post.frontmatter.title}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="relative p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-black mb-3 text-slate-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight overflow-hidden">
                              <span className="line-clamp-2">{post.frontmatter.title}</span>
                            </h3>

                            {/* Author */}
                            <div className="flex items-center gap-2 mb-3">
                              {post.frontmatter.authorId ? (
                                <Link
                                  href={`/${lang}/users/${post.frontmatter.authorId}`}
                                  className="flex items-center gap-2 group/author"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center group-hover/author:scale-110 transition-transform duration-300">
                                    <User className="h-3 w-3 text-white" />
                                  </div>
                                  <span className="text-sm font-bold text-slate-700 group-hover/author:text-blue-600 transition-colors">
                                    {post.frontmatter.author}
                                  </span>
                                </Link>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                                    <User className="h-3 w-3 text-white" />
                                  </div>
                                  <span className="text-sm font-bold text-slate-700">{post.frontmatter.author}</span>
                                </div>
                              )}

                              {roleConfig && (
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${roleConfig.bgClass} ${roleConfig.textClass}`}>
                                  <roleConfig.icon className="h-2.5 w-2.5" />
                                  {roleConfig.label}
                                </div>
                              )}
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <time dateTime={post.frontmatter.date}>
                                  {formatDate(post.frontmatter.date, lang === 'it' ? 'it-IT' : (lang === 'ar' ? 'ar-EG' : 'en-US'))}
                                </time>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{post.frontmatter.readingTime} min</span>
                              </div>
                            </div>

                            {/* Excerpt */}
                            <p className="text-sm text-slate-700 mb-4 flex-grow leading-relaxed overflow-hidden">
                              <span className="line-clamp-3">{post.frontmatter.excerpt}</span>
                            </p>

                            {/* Tags */}
                            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {post.frontmatter.tags.slice(0, 2).map(tag => (
                                  <span
                                    key={tag}
                                    className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{post.viewCount}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  <span>{post.likesCount}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" />
                                  <span>{post.commentsCount}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 font-bold text-sm">
                                <span>Read</span>
                                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-8">
                <BookOpen className="h-16 w-16 text-slate-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                No blog posts found
              </h3>
              <p className="text-slate-600 mb-8">
                No blog posts found for this language ({lang}). Check back later for amazing content!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}