// client/app/api/generated-posts/[slug]/route.js
import dbConnect from '@/lib/dbConnect';
import GeneratedPost from '@/lib/models/GeneratedPost';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) { // { params } gives access to dynamic segments
  const startTime = Date.now();
  const requestUrl = request.nextUrl.pathname + request.nextUrl.search;
  console.log(`${new Date().toISOString()} - GET ${requestUrl} - Request received.`);

  const { slug } = params; // Get slug from the URL path
  const { searchParams } = request.nextUrl;
  const langParam = searchParams.get('lang');

  console.log('Path Params:', params);
  console.log('Query Params:', Object.fromEntries(searchParams));

  try {
    await dbConnect();

    let filter = { slug: slug.toLowerCase() };
    if (langParam) {
      filter.lang = langParam.toLowerCase();
    } else {
      // As in your original code, lang is required for a specific post
      console.warn(`API Error: Language parameter ?lang= is required for fetching post with slug: ${slug}`);
      return NextResponse.json({ success: false, error: 'Language parameter ?lang= is required for fetching a specific post.' }, { status: 400 });
    }

    const postFromDb = await GeneratedPost.findOne(filter).lean();
    const dbQueryTime = Date.now();

    if (!postFromDb) {
      console.log(`Post not found for filter: ${JSON.stringify(filter)} (Query Time: ${dbQueryTime - startTime}ms)`);
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    console.log(`Found post ID: ${postFromDb._id} (Query Time: ${dbQueryTime - startTime}ms)`);

    const formattedPost = {
      slug: postFromDb.slug,
      lang: postFromDb.lang,
      content: postFromDb.content || '',
      frontmatter: {
        title: postFromDb.frontmatter?.title || 'Untitled',
        date: postFromDb.frontmatter?.date?.toISOString() || null,
        excerpt: postFromDb.frontmatter?.excerpt || '',
        author: postFromDb.frontmatter?.author || 'Ammari',
        tags: postFromDb.frontmatter?.tags || [],
        coverImage: postFromDb.frontmatter?.coverImage || null
      }
    };

    const processingTime = Date.now();
    console.log(`Sending formatted post ID: ${postFromDb._id}. (Processing Time: ${processingTime - dbQueryTime}ms, Total Time: ${processingTime - startTime}ms)`);
    return NextResponse.json(formattedPost, { status: 200 });

  } catch (error) {
    const errorTime = Date.now();
    console.error(`[API Error] Error fetching post ${slug} (Total Time: ${errorTime - startTime}ms):`, error.message, error.stack);
    return NextResponse.json({ success: false, error: 'Failed to fetch post', details: error.message }, { status: 500 });
  }
}