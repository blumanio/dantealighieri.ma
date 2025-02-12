import fs from 'fs/promises';
import path from 'path';
import { Metadata, ResolvingMetadata } from 'next';
import matter from 'gray-matter';
import { marked } from 'marked';
import { BlogNavigation } from '@/components/BlogNavigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { BlogPageProps } from '@/types/types';

interface PostFrontmatter {
    title: string;
    date: string;
    excerpt: string;
    author?: string;
    tags?: string[];
    language?: string;
}

interface BlogPost {
    frontmatter: PostFrontmatter;
    content: string;
    lang: string;
    slug: string;
}

// app/[lang]/blog/[slug]/page.tsx
interface PageProps {
    params: Promise<{
        lang: string;
        slug: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined; }>;
}

async function ensureDirectory(dirPath: string) {
    try {
        await fs.access(dirPath);
        return true;
    } catch {
        return false;
    }
}

const getAdjacentPosts = cache(async (lang: string, currentSlug: string) => {
    try {
        const postsDirectory = path.join(process.cwd(), 'content', lang, 'blog');
        const directoryExists = await ensureDirectory(postsDirectory);

        if (!directoryExists) {
            console.warn(`Blog directory not found for language: ${lang}`);
            return { prev: null, next: null };
        }

        const files = await fs.readdir(postsDirectory);

        if (!files.length) {
            return { prev: null, next: null };
        }

        const posts = await Promise.all(
            files
                .filter(file => file.endsWith('.md'))
                .map(async file => {
                    try {
                        const content = await fs.readFile(path.join(postsDirectory, file), 'utf8');
                        const { data } = matter(content);
                        return {
                            slug: file.replace('.md', ''),
                            date: data.date || new Date().toISOString(),
                            title: data.title || 'Untitled'
                        };
                    } catch (error) {
                        console.error(`Error reading file ${file}:`, error);
                        return null;
                    }
                })
        );

        const validPosts = posts.filter((post): post is NonNullable<typeof post> => post !== null);

        if (!validPosts.length) {
            return { prev: null, next: null };
        }

        validPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const currentIndex = validPosts.findIndex(post => post.slug === currentSlug);
        return {
            prev: currentIndex < validPosts.length - 1 ? validPosts[currentIndex + 1] : null,
            next: currentIndex > 0 ? validPosts[currentIndex - 1] : null
        };
    } catch (error) {
        console.error('Error getting adjacent posts:', error);
        return { prev: null, next: null };
    }
});

const getPost = cache(async (lang: string, slug: string): Promise<BlogPost> => {
    try {
        const postsDirectory = path.join(process.cwd(), 'content', lang, 'blog');
        const directoryExists = await ensureDirectory(postsDirectory);

        if (!directoryExists) {
            notFound();
        }

        const markdownFile = path.join(postsDirectory, `${slug}.md`);
        const fileContents = await fs.readFile(markdownFile, 'utf8');
        const { data, content } = matter(fileContents);

        const frontmatter: PostFrontmatter = {
            title: data.title || 'Untitled',
            date: data.date || new Date().toISOString(),
            excerpt: data.excerpt || 'No excerpt available',
            author: data.author,
            tags: data.tags,
            language: data.language
        };

        // Configure marked
        marked.setOptions({
            gfm: true,
            breaks: true
        });

        // Convert markdown to HTML synchronously
        const parsedContent = marked.parse(content, { async: false }) as string;

        return {
            frontmatter,
            content: parsedContent,
            lang,
            slug
        };
    } catch (error) {
        notFound();
    }
});

export async function generateMetadata(
    { params }: BlogPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedParams = await params;
    const { lang, slug } = resolvedParams;

    try {
        const post = await getPost(lang, slug);

        return {
            title: `${post.frontmatter.title} | Blog`,
            description: post.frontmatter.excerpt,
            openGraph: {
                title: post.frontmatter.title,
                description: post.frontmatter.excerpt,
                type: 'article',
                publishedTime: post.frontmatter.date,
                authors: post.frontmatter.author ? [post.frontmatter.author] : undefined,
                locale: lang,
            },
            twitter: {
                card: 'summary_large_image',
                title: post.frontmatter.title,
                description: post.frontmatter.excerpt,
            },
            alternates: {
                languages: {
                    'en': `/en/blog/${slug}`,
                    'it': `/it/blog/${slug}`,
                    'ar': `/ar/blog/${slug}`,
                }
            }
        };
    } catch {
        return {
            title: 'Blog Post Not Found',
            description: 'The requested blog post could not be found.'
        };
    }
}

export default async function BlogPostPage({ params, searchParams }: BlogPageProps) {
    const resolvedParams = await params;
    const { lang, slug } = resolvedParams;

    try {
        const [post, adjacentPosts] = await Promise.all([
            getPost(lang, slug),
            getAdjacentPosts(lang, slug)
        ]);

        const { frontmatter, content } = post;

        const formattedDate = new Date(frontmatter.date).toLocaleDateString(
            lang === 'en' ? 'en-US' : lang,
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }
        );

        const breadcrumbItems = [
            { label: 'Home', href: `/${lang}` },
            { label: 'Blog', href: `/${lang}/blog` },
            { label: frontmatter.title, href: `/${lang}/blog/${slug}` },
        ];

        return (
            <div className="container py-12">
                <article className="max-w-4xl mx-auto">
                    <Breadcrumb items={breadcrumbItems} />

                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-primary mb-4 font-poppins">
                            {frontmatter.title}
                        </h1>
                        <div className="flex items-center gap-4 text-textSecondary">
                            <time dateTime={frontmatter.date} className="text-base font-poppins">
                                {formattedDate}
                            </time>
                            {frontmatter.author && (
                                <span className="text-base font-poppins">
                                    by {frontmatter.author}
                                </span>
                            )}
                        </div>
                        {frontmatter.tags && frontmatter.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {frontmatter.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-background rounded-full text-sm text-textSecondary"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    <div
                        className="prose prose-lg max-w-none font-poppins
              prose-headings:font-poppins prose-headings:text-primary
              prose-p:text-textPrimary prose-p:font-poppins
              prose-a:text-accent hover:prose-a:text-accent-light
              prose-strong:text-textPrimary prose-strong:font-medium
              prose-code:text-accent-dark prose-code:bg-background prose-code:px-1 prose-code:rounded
              prose-ul:text-textPrimary prose-ol:text-textPrimary
              prose-li:text-textPrimary prose-li:marker:text-primary
              prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6
              prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4
              prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3
              prose-pre:bg-background prose-pre:border prose-pre:border-border
              prose-img:rounded-lg prose-img:shadow-md
              rtl:prose-headings:font-arabic rtl:prose-p:font-arabic
              rtl:prose-ul:font-arabic rtl:prose-ol:font-arabic"
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                    <footer className="mt-8 pt-8 border-t border-border">
                        <BlogNavigation
                            prevPost={adjacentPosts.prev}
                            nextPost={adjacentPosts.next}
                            lang={lang}
                        />
                    </footer>
                </article>
            </div>
        );
    } catch {
        return {
            title: 'Blog Post Not Found',
            description: 'The requested blog post could not be found.'
        };
    }
}