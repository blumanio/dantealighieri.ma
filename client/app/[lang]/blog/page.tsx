// app/[lang]/blog/page.tsx
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { BasePageProps } from '@/types/types';

export default async function BlogPage({ params }: BasePageProps) {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const files = await fs.readdir(postsDirectory);

    const postsPromises = files.map(async (filename) => {
        const slug = filename.replace('.md', '');
        const markdownWithMeta = await fs.readFile(
            path.join(postsDirectory, filename),
            'utf-8'
        );
        const { data: frontmatter } = matter(markdownWithMeta);

        return {
            slug,
            frontmatter,
        };
    });

    const posts = await Promise.all(postsPromises);

    return (
        <div className="container py-12">
            <h1 className="text-4xl font-heading font-bold text-textPrimary mb-8">
                Blog Posts
            </h1>
            <div className="grid gap-6">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/${params.lang}/blog/${post.slug}`}
                        className="group p-6 bg-white rounded-lg shadow-soft hover:shadow-medium transition-shadow duration-300"
                    >
                        <article>
                            <h2 className="text-2xl font-heading font-semibold text-primary mb-2 group-hover:text-primary-light">
                                {post.frontmatter.title}
                            </h2>
                            <time className="text-sm font-body text-textSecondary">
                                {post.frontmatter.date}
                            </time>
                            <p className="mt-4 font-body text-base text-textPrimary">
                                {post.frontmatter.excerpt}
                            </p>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}