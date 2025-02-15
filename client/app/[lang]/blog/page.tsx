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
        [key: string]: any;
    };
}

async function ensureDirectory(dirPath: string) {
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

                    return {
                        slug,
                        frontmatter: {
                            title: frontmatter.title || 'Untitled',
                            date: frontmatter.date || new Date().toISOString(),
                            excerpt: frontmatter.excerpt || 'No excerpt available',
                            ...frontmatter
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

    const authorNames = {
        en: 'DanteMa Team',
        it: 'DanteMa Team',
        ar: ' فريق دانتيما'
    };

    const authorName = authorNames[lang as keyof typeof authorNames] || authorNames.en;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <header className="text-center mb-16">
                <h1 className="text-4xl sm:text-5xl font-poppins font-bold text-primary mb-4">
                    Blog Posts
                </h1>
                <p className="text-lg text-textSecondary font-poppins max-w-2xl mx-auto">
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
                            <article className="h-full bg-white rounded-2xl shadow-soft hover:shadow-medium 
                                             transition-all duration-300 ease-in-out transform hover:-translate-y-1
                                             border border-gray-100 overflow-hidden">
                                <div className="p-8">
                                    <div className="flex flex-col h-full">
                                        <header>
                                            <time
                                                dateTime={post.frontmatter.date}
                                                className="inline-block mb-4 text-sm font-poppins text-textSecondary
                                                         bg-background rounded-full px-4 py-1"
                                            >
                                                {new Date(post.frontmatter.date).toLocaleDateString(
                                                    lang === 'en' ? 'en-US' : lang,
                                                    {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }
                                                )}
                                            </time>
                                            <h2 className="text-2xl font-poppins font-semibold text-primary 
                                                       mb-4 line-clamp-2 group-hover:text-primary-light
                                                       transition-colors duration-200">
                                                {post.frontmatter.title}
                                            </h2>
                                        </header>
                                        <p className="text-base font-poppins text-textPrimary mb-6 line-clamp-3
                                                   flex-grow">
                                            {post.frontmatter.excerpt}
                                        </p>

                                        {/* Author Section */}
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <div className="flex items-center">
                                                <div className="relative w-10 h-10 mr-4">
                                                    <Image
                                                        src="/images/mohamedelaammari.png"
                                                        alt={authorName}
                                                        fill
                                                        className="rounded-full object-cover"
                                                        sizes="40px"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-poppins font-medium text-primary">
                                                        {authorName}
                                                    </p>
                                                    <p className="text-xs font-poppins text-textSecondary">
                                                        Founder
                                                    </p>
                                                </div>
                                                <div className="ml-auto">
                                                    <span className="inline-flex items-center text-sm font-poppins
                                                                 text-primary group-hover:text-primary-light
                                                                 transition-colors duration-200">
                                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl font-poppins text-textSecondary">
                        No blog posts found.
                    </p>
                </div>
            )}
        </div>
    );
}

export async function generateMetadata({ params }: BlogIndexProps) {
    const resolvedParams = await params;
    const lang = resolvedParams.lang;

    const titles = {
        en: 'Blog Posts',
        it: 'Articoli del Blog',
        ar: 'مقالات المدونة'
    };

    return {
        title: titles[lang as keyof typeof titles] || titles.en
    };
}