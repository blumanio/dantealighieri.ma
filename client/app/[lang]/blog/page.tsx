// app/[lang]/blog/page.tsx
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';
import { BlogIndexProps } from '@/types/types';

interface Post {
    slug: string;
    frontmatter: {
        title: string;
        date: string;
        excerpt: string;
        author: string; // <-- Added explicit author type
        [key: string]: any;
    };
}

async function ensureDirectory(dirPath: string): Promise<boolean> { // Added return type
    try {
        await fs.access(dirPath);
        return true;
    } catch {
        return false;
    }
}

async function getPosts(lang: string): Promise<Post[]> {
    try {
        const postsDirectory = path.join(process.cwd(), 'content', lang, 'blog');
        const directoryExists = await ensureDirectory(postsDirectory);

        if (!directoryExists) {
            console.warn(`Blog directory not found for language: ${lang}`);
            return [];
        }

        const files = await fs.readdir(postsDirectory);

        const postsPromises = files
            .filter(filename => filename.endsWith('.md'))
            .map(async (filename) => {
                try {
                    const slug = filename.replace('.md', '');
                    const markdownWithMeta = await fs.readFile(
                        path.join(postsDirectory, filename),
                        'utf-8'
                    );
                    const { data: frontmatter } = matter(markdownWithMeta);

                    // Ensure all required fields have fallbacks
                    return {
                        slug,
                        frontmatter: {
                            title: frontmatter.title || 'Untitled',
                            date: frontmatter.date || new Date().toISOString(),
                            excerpt: frontmatter.excerpt || 'No excerpt available.', // Added period
                            author: frontmatter.author || 'Studentitaly Staff', // <-- Read author with fallback
                            ...frontmatter // Keep other potential fields
                        }
                    };
                } catch (error) {
                    console.error(`Error processing file ${filename}:`, error);
                    return null;
                }
            });

        const posts = await Promise.all(postsPromises);

        // Filter out any null posts and sort by date
        return posts
            .filter((post): post is Post => post !== null)
            .sort((a, b) =>
                new Date(b.frontmatter.date).getTime() -
                new Date(a.frontmatter.date).getTime()
            );
    } catch (error) {
        console.error('Error getting posts:', error);
        return [];
    }
}

export default async function BlogPage({ params }: BlogIndexProps) {
    const resolvedParams = await params;
    const lang = resolvedParams.lang;
    const posts = await getPosts(lang);

    // --- Removed the hardcoded authorNames object and authorName variable ---

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-neutral-50">
            <header className="text-center mb-16 group">
                <h1 className="text-4xl sm:text-5xl font-poppins font-bold text-primary mb-4 group-hover:text-primary-dark transition-colors duration-300">
                    Blog Posts
                </h1>
                <p className="text-lg text-textSecondary font-poppins max-w-2xl mx-auto group-hover:text-primary transition-colors duration-300">
                    Discover our latest articles, insights, and updates
                </p>
            </header>

            {posts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/${lang}/blog/${post.slug}`}
                            className="group block"
                        >
                            <article className="h-full bg-white rounded-2xl shadow-soft
                                transition-all duration-300 ease-in-out transform
                                hover:shadow-medium hover:-translate-y-2
                                border border-neutral-200 overflow-hidden flex flex-col"> {/* Added flex flex-col */}
                                <div className="p-8 flex flex-col flex-grow"> {/* Added flex flex-col flex-grow */}
                                    <header className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <time
                                                dateTime={post.frontmatter.date}
                                                className="text-sm font-poppins text-textSecondary
                                                bg-neutral-100 rounded-full px-4 py-1
                                                group-hover:bg-primary-light/10 group-hover:text-primary
                                                transition-all duration-300"
                                            >
                                                {new Date(post.frontmatter.date).toLocaleDateString(
                                                    lang === 'en' ? 'en-US' : lang, // Use 'en-US' for reliable English formatting
                                                    {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }
                                                )}
                                            </time>
                                        </div>
                                        <h2 className="text-2xl font-poppins font-semibold text-primary
                                            mb-4 line-clamp-2 group-hover:text-primary-dark
                                            transition-colors duration-300">
                                            {post.frontmatter.title}
                                        </h2>
                                    </header>
                                    {/* Display excerpt (already correct) */}
                                    <p className="text-base font-poppins text-textSecondary mb-6 line-clamp-3
                                        flex-grow group-hover:text-textPrimary transition-colors duration-300">
                                        {post.frontmatter.excerpt}
                                    </p>

                                    {/* Footer pushed to bottom */}
                                    <div className="mt-auto pt-6 border-t border-neutral-200"> {/* Use mt-auto */}
                                        <div className="flex items-center">
                                            <div className="relative w-10 h-10 mr-4 rounded-full overflow-hidden
                                                ring-2 ring-primary-light/20 group-hover:ring-primary-light/40
                                                transition-all duration-300">
                                                <Image
                                                    // Using a placeholder image, update if you add author-specific images
                                                    src="/images/user-women.webp"
                                                    // --- Use dynamic author name for alt text ---
                                                    alt={post.frontmatter.author}
                                                    fill
                                                    className="rounded-full object-cover transition-transform duration-300
                                                        group-hover:scale-110"
                                                    sizes="40px"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                {/* --- Use dynamic author name from frontmatter --- */}
                                                <p className="text-sm font-poppins font-medium text-primary
                                                    group-hover:text-primary-dark transition-colors duration-300">
                                                    {post.frontmatter.author}
                                                </p>
                                            </div>
                                            <div className="ml-auto">
                                                <span className="inline-flex items-center text-sm font-poppins
                                                    text-primary group-hover:text-primary-dark transition-all duration-300">
                                                    <svg className="w-5 h-5 transform group-hover:translate-x-1
                                                        transition-all duration-300 ease-in-out"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                            strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
                    <p className="text-xl font-poppins text-textSecondary hover:text-primary transition-colors duration-300">
                        No blog posts found for this language.
                    </p>
                </div>
            )}
        </div>
    );
}

// generateMetadata function remains the same
export async function generateMetadata({ params }: BlogIndexProps) {
    const resolvedParams = await params;
    const lang = resolvedParams.lang;

    const titles = {
        en: 'Blog Posts - Studentitaly', // Added site name
        it: 'Articoli del Blog - Studentitaly',
        ar: 'مقالات المدونة - Studentitaly' // Ensure correct translation if needed
    };
    const descriptions = {
        en: 'Discover the latest articles, insights, and updates for international students planning to study in Italy.',
        it: 'Scopri gli ultimi articoli, approfondimenti e aggiornamenti per studenti internazionali che intendono studiare in Italia.',
        ar: 'اكتشف أحدث المقالات والأفكار والتحديثات للطلاب الدوليين الذين يخططون للدراسة في إيطاليا.' // Example
    };


    return {
        title: titles[lang as keyof typeof titles] || titles.en,
        description: descriptions[lang as keyof typeof descriptions] || descriptions.en
    };
}