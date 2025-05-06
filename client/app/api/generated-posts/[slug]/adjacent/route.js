// client/app/api/generated-posts/[slug]/adjacent/route.js
import dbConnect from '@/lib/dbConnect';
import GeneratedPost from '@/lib/models/GeneratedPost';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const startTime = Date.now();
  const requestUrl = request.nextUrl.pathname + request.nextUrl.search;
  console.log(`${new Date().toISOString()} - GET ${requestUrl} - Adjacent posts request received.`);

  const { slug } = params;
  const { searchParams } = request.nextUrl;
  const langParam = searchParams.get('lang');

  console.log('Path Params:', params);
  console.log('Query Params:', Object.fromEntries(searchParams));

  try {
    await dbConnect();

    if (!langParam) {
      console.warn(`API Error: Language parameter ?lang= is required for fetching adjacent posts for slug: ${slug}`);
      return NextResponse.json({ error: 'Language parameter ?lang= is required for adjacent posts' }, { status: 400 });
    }
    const currentLang = langParam.toLowerCase();

    const currentPost = await GeneratedPost.findOne({ slug: slug.toLowerCase(), lang: currentLang }).select('frontmatter.date').lean();
    const dbQueryTimeCurrent = Date.now();

    if (!currentPost || !currentPost.frontmatter || !currentPost.frontmatter.date) {
      console.log(`Adjacent: Current post or its date not found for slug=<span class="math-inline">\{slug\}, lang\=</span>{currentLang} (Query Time: ${dbQueryTimeCurrent - startTime}ms)`);
      return NextResponse.json({ error: 'Current post not found or missing date' }, { status: 404 });
    }
    console.log(`Adjacent: Found current post date for slug=<span class="math-inline">\{slug\}, lang\=</span>{currentLang} (Query Time: ${dbQueryTimeCurrent - startTime}ms)`);
    const currentDate = currentPost.frontmatter.date;

    // Find previous post
    const prevPost = await GeneratedPost.findOne({
      lang: currentLang,
      "frontmatter.date": { $lt: currentDate }
    })
    .sort({ "frontmatter.date": -1 })
    .select('slug frontmatter.title frontmatter.excerpt')
    .lean();
    const dbQueryTimePrev = Date.now();
    if(prevPost) console.log(`Adjacent: Found prev post (Query Time: ${dbQueryTimePrev - dbQueryTimeCurrent}ms)`);


    // Find next post
    const nextPost = await GeneratedPost.findOne({
      lang: currentLang,
      "frontmatter.date": { $gt: currentDate }
    })
    .sort({ "frontmatter.date": 1 })
    .select('slug frontmatter.title frontmatter.excerpt')
    .lean();
    const dbQueryTimeNext = Date.now();
    if(nextPost) console.log(`Adjacent: Found next post (Query Time: ${dbQueryTimeNext - dbQueryTimePrev}ms)`);


    const responsePayload = {
      prev: prevPost ? {
        slug: prevPost.slug,
        frontmatter: {
          title: prevPost.frontmatter?.title || 'Untitled',
          excerpt: prevPost.frontmatter?.excerpt || ''
        }
      } : null,
      next: nextPost ? {
        slug: nextPost.slug,
        frontmatter: {
          title: nextPost.frontmatter?.title || 'Untitled',
          excerpt: nextPost.frontmatter?.excerpt || ''
        }
      } : null
    };

    const processingTime = Date.now();
    console.log(`Adjacent: Sending response for slug=<span class="math-inline">\{slug\}, lang\=</span>{currentLang}. (Processing Time: ${processingTime - dbQueryTimeNext}ms, Total Time: ${processingTime - startTime}ms)`);
    return NextResponse.json(responsePayload, { status: 200 });

  } catch (error) {
    const errorTime = Date.now();
    console.error(`[API Error] Error fetching adjacent posts for slug ${slug} (Total Time: ${errorTime - startTime}ms):`, error.message, error.stack);
    return NextResponse.json({ error: "Failed to fetch adjacent posts", details: error.message }, { status: 500 });
  }
}