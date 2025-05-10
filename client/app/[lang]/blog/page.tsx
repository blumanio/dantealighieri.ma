// app/[lang]/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { BlogIndexProps } from '@/types/types'; // Ensure this type is: { params: { lang: string } }

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string; 
    excerpt: string;
    author: string;
    coverImage?: string; 
    [key: string]: any;
  };
  lang?: string;
}

// Define API_BASE_URL for server-side fetches (consistent with other server components)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||
                     process.env.API_BASE_URL || 
                     (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');


async function getPosts(lang: string): Promise<Post[]> {
  console.log(`[BlogIndex - getPosts for ${lang}] Using API_BASE_URL: ${API_BASE_URL}`);
  // This API endpoint should list all posts for a given language
  // If your actual API is `/api/generated-posts?lang=${lang}` as before, use that.
  // If you created `/api/posts?lang=${lang}` or similar, use that.
  const targetUrl = `${API_BASE_URL}/api/generated-posts?lang=${lang}`; 
  console.log(`[BlogIndex - getPosts for ${lang}] Fetching posts from: ${targetUrl}`);
  
  try {
    const res = await fetch(targetUrl, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "Could not read error body");
      console.error(`[BlogIndex - getPosts for ${lang}] Fetch failed: ${res.status}. URL: ${targetUrl}. Body: ${errorBody}`);
      return [];
    }

    const response = await res.json(); // Assume this returns the structure you expect

    // Adapt this based on your actual API response for a list of posts
    let postsFromApi = [];
    if (response.success && Array.isArray(response.posts)) { // Example structure
        postsFromApi = response.posts;
    } else if (Array.isArray(response)) { // Another common structure: API directly returns an array
        postsFromApi = response;
    } else {
        console.error(`[BlogIndex - getPosts for ${lang}] Invalid API response structure from ${targetUrl}:`, response);
        return [];
    }

    const posts: Post[] = postsFromApi.filter((p: any) => p && p.slug).map((p: any) => {
      const frontmatter = p.frontmatter || {};
      return {
        slug: p.slug,
        frontmatter: {
          title: frontmatter.title || p.title || 'Untitled',
          date: frontmatter.date || p.date || new Date().toISOString(),
          excerpt: frontmatter.excerpt || p.excerpt || 'No excerpt available.',
          author: frontmatter.author || p.author || 'Studentitaly Staff',
          coverImage: frontmatter.coverImage || p.coverImage || undefined
        },
        lang: lang 
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
    console.error(`[BlogIndex - getPosts for ${lang}] Unexpected error fetching from ${targetUrl}:`, error);
    return []; // Return empty array on error
  }
}

// Ensure generateStaticParams is present if you want to pre-render blog index pages for each language
export async function generateStaticParams() {
  const languages = ['en', 'it', 'ar']; // Or from a central const
  return languages.map(lang => ({ lang }));
}

export default async function BlogPage({ params }: BlogIndexProps) {
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

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12" dir={textDir}>
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-10 lg:mb-16 text-center text-gray-900">
        Blog {/* TODO: Translate this title */}
      </h1>
      {posts.length > 0 ? (
        <div className="grid gap-8 md:gap-10 lg:gap-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            let absoluteCoverImageUrl = post.frontmatter.coverImage;
            if (post.frontmatter.coverImage && !post.frontmatter.coverImage.startsWith('http')) {
                absoluteCoverImageUrl = `${API_BASE_URL}${post.frontmatter.coverImage.startsWith('/') ? '' : '/'}${post.frontmatter.coverImage}`;
            }
            return (
            <div key={post.slug} className="bg-white rounded-lg overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-xl flex flex-col group">
              {absoluteCoverImageUrl && (
                <Link href={`/${lang}/blog/${post.slug}`} className="block overflow-hidden">
                  <div className="aspect-video relative w-full">
                    <Image
                      src={absoluteCoverImageUrl}
                      alt={`Cover image for ${post.frontmatter.title}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>
              )}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 hover:text-teal-700 transition-colors duration-200 line-clamp-2">
                  <Link href={`/${lang}/blog/${post.slug}`}>
                    {post.frontmatter.title}
                  </Link>
                </h2>
                <div className="text-xs text-gray-500 mb-3 flex items-center flex-wrap gap-x-3">
                  <span className="inline-flex items-center whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <time dateTime={post.frontmatter.date}>
                      {formatDate(post.frontmatter.date, lang === 'it' ? 'it-IT' : (lang === 'ar' ? 'ar-EG' : 'en-US'))}
                    </time>
                  </span>
                  {post.frontmatter.author && (
                    <span className="inline-flex items-center whitespace-nowrap">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {post.frontmatter.author}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-4 flex-grow line-clamp-3">
                  {post.frontmatter.excerpt}
                </p>
                <Link href={`/${lang}/blog/${post.slug}`} className="inline-block text-sm font-medium text-teal-600 hover:text-teal-800 self-start mt-auto group-[.card-hover]:text-teal-700 transition-all duration-200 ease-in-out hover:translate-x-1">
                  Read More <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
                </Link>
              </div>
            </div>
          )})}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-16 text-lg">
          No blog posts found for this language ({lang}). Check back later!
        </p>
      )}
    </div>
  );
}