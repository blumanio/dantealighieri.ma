// components/BlogNavigation.tsx
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavPost {
  slug: string;
  frontmatter: {
    title: string;
  };
}

interface BlogNavigationProps {
  prevPost: NavPost | null;
  nextPost: NavPost | null;
  lang: string;
}

export function BlogNavigation({ prevPost, nextPost, lang }: BlogNavigationProps) {
  if (!prevPost && !nextPost) return null;

  return (
    <nav className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
      {prevPost ? (
        <Link
          href={`/${lang}/blog/${prevPost.slug}`}
          className="group flex items-center text-primary hover:text-primary-light transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          <div>
            <div className="text-sm text-textSecondary">Previous</div>
            <div className="font-heading font-semibold">{prevPost.frontmatter.title}</div>
          </div>
        </Link>
      ) : (
        <div /> // Empty div for spacing
      )}

      {nextPost ? (
        <Link
          href={`/${lang}/blog/${nextPost.slug}`}
          className="group flex items-center text-right text-primary hover:text-primary-light transition-colors"
        >
          <div>
            <div className="text-sm text-textSecondary">Next</div>
            <div className="font-heading font-semibold">{nextPost.frontmatter.title}</div>
          </div>
          <ChevronRight className="w-5 h-5 ml-2" />
        </Link>
      ) : (
        <div /> // Empty div for spacing
      )}
    </nav>
  );
}