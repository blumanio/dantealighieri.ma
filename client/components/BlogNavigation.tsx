import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavPost {
  slug: string;
  title: string;
  date?: string;
}

interface BlogNavigationProps {
  prevPost: NavPost | null;
  nextPost: NavPost | null;
  lang: string;
}

export function BlogNavigation({ prevPost, nextPost, lang }: BlogNavigationProps) {
  if (!prevPost && !nextPost) return null;

  return (
    <nav className="mt-12 pt-8 border-t border-neutral-200">
      <div className="flex justify-between items-stretch gap-4">
        {/* Previous Post */}
        {prevPost ? (
          <Link
            href={`/${lang}/blog/${prevPost.slug}`}
            className="group flex items-center flex-1 p-4 rounded-xl bg-white hover:bg-primary/5 
                     border border-neutral-200 hover:border-primary/20
                     transition-all duration-300 hover:shadow-soft"
          >
            <ChevronLeft
              className="w-5 h-5 mr-3 text-primary transition-transform duration-300 
                       group-hover:-translate-x-1"
            />
            <div>
              <div className="text-sm text-textSecondary group-hover:text-primary transition-colors duration-300">
                Previous Post
              </div>
              <div className="font-heading font-semibold text-textPrimary group-hover:text-primary 
                           mt-1 line-clamp-1 transition-colors duration-300">
                {prevPost.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex-1" /> // Empty div for spacing
        )}

        {/* Next Post */}
        {nextPost ? (
          <Link
            href={`/${lang}/blog/${nextPost.slug}`}
            className="group flex items-center justify-end flex-1 p-4 rounded-xl bg-white 
                     hover:bg-primary/5 border border-neutral-200 hover:border-primary/20
                     transition-all duration-300 hover:shadow-soft text-right"
          >
            <div>
              <div className="text-sm text-textSecondary group-hover:text-primary transition-colors duration-300">
                Next Post
              </div>
              <div className="font-heading font-semibold text-textPrimary group-hover:text-primary 
                           mt-1 line-clamp-1 transition-colors duration-300">
                {nextPost.title}
              </div>
            </div>
            <ChevronRight
              className="w-5 h-5 ml-3 text-primary transition-transform duration-300 
                       group-hover:translate-x-1"
            />
          </Link>
        ) : (
          <div className="flex-1" /> // Empty div for spacing
        )}
      </div>

      {/* Mobile Navigation - Alternative compact view for small screens */}
      <div className="mt-4 flex justify-between gap-2 sm:hidden">
        {prevPost && (
          <Link
            href={`/${lang}/blog/${prevPost.slug}`}
            className="text-white flex-1 flex items-center justify-center p-3 rounded-lg bg-white 
                     hover:bg-primary/5 border border-neutral-200 hover:border-primary/20
                     transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
            <span className="sr-only">Previous Post</span>
          </Link>
        )}
        {nextPost && (
          <Link
            href={`/${lang}/blog/${nextPost.slug}`}
            className="flex-1 flex items-center justify-center p-3 rounded-lg bg-white 
                     hover:bg-primary/5 border border-neutral-200 hover:border-primary/20
                     transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
            <span className="sr-only">Next Post</span>
          </Link>
        )}
      </div>
    </nav>
  );
}