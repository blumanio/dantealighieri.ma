// components/Breadcrumb.tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  items: {
    label: string;
    href: string;
  }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-textSecondary mb-6">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center last:font-medium">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
          {index === items.length - 1 ? (
            <span className="text-textPrimary">{item.label}</span>
          ) : (
            <Link 
              href={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}