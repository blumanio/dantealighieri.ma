// app/[lang]/blog/[slug]/page.tsx
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { BlogNavigation } from '@/components/BlogNavigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Update Props to have optional searchParams and properly typed params
type Props = {
  params: {
    lang: string;
    slug: string;
  };
  searchParams?: Record<string, string | string[] | undefined>; // Made optional
};

async function getBlogPost(params: Props['params']) {
  try {
    const { lang, slug } = params;
    const markdownWithMeta = await fs.readFile(
      path.join(process.cwd(), 'posts', `${slug}.md`),
      'utf-8'
    );

    const { data: frontmatter, content } = matter(markdownWithMeta);
    return {
      frontmatter,
      content,
      lang,
    };
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const post = await getBlogPost(params);

  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
  };
}

export default async function Page({ params }: Props) {
  const post = await getBlogPost(params);

  if (!post) {
    notFound();
  }

  const { frontmatter, content, lang } = post;
  const htmlContent = marked(content);

  const breadcrumbItems = [
    { label: 'Home', href: `/${lang}` },
    { label: 'Blog', href: `/${lang}/blog` },
    { label: frontmatter.title, href: `/${lang}/blog/${params.slug}` },
  ];

  return (
    <div className="container py-12">
      <article className="max-w-4xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4 font-poppins">
            {frontmatter.title}
          </h1>
          <time dateTime={frontmatter.date} className="text-base text-textSecondary font-poppins">
            {new Date(frontmatter.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
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
            prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </div>
  );
}