// client/app/api/generated-posts/[slug]/route.js

import dbConnect from '@/lib/dbConnect';
import GeneratedPost from '@/lib/models/GeneratedPost';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const startTime = Date.now();
  const { pathname, searchParams } = request.nextUrl;

  console.log(
    `${new Date().toISOString()} - GET ${pathname}${request.nextUrl.search} - Request received.`
  );

  // ✅ SAFE slug extraction (Next 15-proof)
  const slug = pathname.split('/').pop();

  const langParam = searchParams.get('lang');

  console.log('Slug:', slug);
  console.log('Query Params:', Object.fromEntries(searchParams));

  if (!slug) {
    return NextResponse.json(
      { success: false, error: 'Missing slug in URL' },
      { status: 400 }
    );
  }

  if (!langParam) {
    return NextResponse.json(
      {
        success: false,
        error: 'Language parameter ?lang= is required',
      },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const filter = {
      slug: slug.toLowerCase(),
      lang: langParam.toLowerCase(),
    };

    const postFromDb = await GeneratedPost.findOne(filter).lean();
    const dbQueryTime = Date.now();

    if (!postFromDb) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    const formattedPost = {
      slug: postFromDb.slug,
      lang: postFromDb.lang,
      content: postFromDb.content || '',
      frontmatter: {
        title: postFromDb.frontmatter?.title || 'Untitled',
        date: postFromDb.frontmatter?.date
          ? postFromDb.frontmatter.date.toISOString()
          : null,
        excerpt: postFromDb.frontmatter?.excerpt || '',
        author: postFromDb.frontmatter?.author || 'Ammari',
        tags: postFromDb.frontmatter?.tags || [],
        coverImage: postFromDb.frontmatter?.coverImage || null,
      },
    };

    console.log(
      `Post ${postFromDb._id} served in ${Date.now() - startTime}ms`
    );

    return NextResponse.json(formattedPost, { status: 200 });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
