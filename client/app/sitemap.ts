import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const LANGS = ['en', 'ar'] as const;

const MAIN_ROUTES = [
  '/universities',
  '/scholarships',
  '/blog',
  '/pricing',
  '/program-search',
  '/ai-advisor',
  '/about',
  '/university-match',
];

function getBlogSlugs(): string[] {
  const dir = path.join(process.cwd(), 'content/en/blog');
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
      .map((f) => f.replace(/\.(md|mdx)$/, ''));
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://studentitaly.it';
  const slugs = getBlogSlugs();
  const entries: MetadataRoute.Sitemap = [];

  // Homepages
  for (const lang of LANGS) {
    entries.push({
      url: `${base}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    });
  }

  // Main pages
  for (const lang of LANGS) {
    for (const route of MAIN_ROUTES) {
      entries.push({
        url: `${base}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Blog posts
  for (const lang of LANGS) {
    for (const slug of slugs) {
      entries.push({
        url: `${base}/${lang}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
