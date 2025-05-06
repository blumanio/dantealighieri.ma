// client/app/api/generated-posts/route.js
import dbConnect from '@/lib/dbConnect';
import GeneratedPost from '@/lib/models/GeneratedPost';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const startTime = Date.now();
  const requestUrl = request.nextUrl.pathname + request.nextUrl.search;
  console.log(`${new Date().toISOString()} - GET ${requestUrl} - Request received.`);

  try {
    await dbConnect();

    const { searchParams } = request.nextUrl;
    const langParam = searchParams.get('lang');
    console.log('Query Params:', Object.fromEntries(searchParams));


    let filter = {};
    if (langParam) {
      filter.lang = langParam.toLowerCase();
    } else {
      filter.lang = 'it'; // Default to 'it' as in your original code
      console.warn("API Warning: No language specified in query, defaulting to 'it'.");
    }

    const postsFromDb = await GeneratedPost.find(filter)
      .sort({ "frontmatter.date": -1 })
      .select('slug lang frontmatter')
      .lean();

    const dbQueryTime = Date.now();
    console.log(`Found ${postsFromDb.length} posts in DB for filter: ${JSON.stringify(filter)} (Query Time: ${dbQueryTime - startTime}ms)`);

    const formattedPosts = postsFromDb.map(p => ({
      slug: p.slug,
      frontmatter: {
        title: p.frontmatter?.title || 'Untitled',
        date: p.frontmatter?.date?.toISOString() || null,
        excerpt: p.frontmatter?.excerpt || '',
        author: p.frontmatter?.author || 'Studentitaly Staff',
        tags: p.frontmatter?.tags || [],
        coverImage: p.frontmatter?.coverImage || null
      }
    }));

    const processingTime = Date.now();
    console.log(`Sending ${formattedPosts.length} formatted posts. (Processing Time: ${processingTime - dbQueryTime}ms, Total Time: ${processingTime - startTime}ms)`);
    return NextResponse.json(formattedPosts, { status: 200 });

  } catch (error) {
    const errorTime = Date.now();
    console.error(`[API Error] Error fetching generated posts list (Total Time: ${errorTime - startTime}ms):`, error.message, error.stack);
    return NextResponse.json({ success: false, error: 'Failed to fetch posts', details: error.message }, { status: 500 });
  }
}