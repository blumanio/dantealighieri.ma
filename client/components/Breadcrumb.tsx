import Link from 'next/link';
import { ChevronRight, Home, ChevronLeft } from 'lucide-react';

interface BreadcrumbProps {
  items: {
    label: string;
    href: string;
  }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  // Show only current and previous page on mobile
  const getMobileItems = () => {
    if (items.length <= 2) return items;
    return [items[0], items[items.length - 1]];
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
      {/* Mobile View */}
      <div className="flex items-center sm:hidden">
        <Link
          href={items[Math.max(0, items.length - 2)].href}
          className="flex items-center text-sm text-textSecondary hover:text-primary 
                   transition-colors duration-300 p-2 -ml-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">Back</span>
        </Link>
        <span className="flex-1 text-sm text-textPrimary text-center font-medium line-clamp-1 px-2">
          {items[items.length - 1].label}
        </span>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex items-center flex-wrap">
        {items.map((item, index) => (
          <div
            key={item.href}
            className="flex items-center text-sm last:font-medium group"
          >
            {/* Separator */}
            {index > 0 && (
              <ChevronRight
                className="w-4 h-4 mx-2 text-textSecondary/50 flex-shrink-0"
              />
            )}

            {/* Home Icon for first item */}
            {index === 0 && (
              <Home className="w-4 h-4 text-textSecondary group-hover:text-primary 
                           transition-colors duration-300 mr-1"
              />
            )}

            {/* Link or Span */}
            {index === items.length - 1 ? (
              <span className="text-textPrimary line-clamp-1 py-1">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-textSecondary hover:text-primary transition-colors 
                         duration-300 line-clamp-1 py-1 px-1 rounded-md
                         hover:bg-primary/5"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Back Button Tooltip */}
      <div className="sm:hidden text-xs text-textSecondary text-center mt-1">
        <span className="line-clamp-1">
          {items.map(item => item.label).join(' > ')}
        </span>
      </div>
    </nav>
  );
}