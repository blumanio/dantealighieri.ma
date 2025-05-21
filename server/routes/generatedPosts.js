// routes/generatedPosts.js
import express from 'express';
import GeneratedPost from '../models/generatedPosts.js'; // Import the model

const router = express.Router();

// --- GET /generated-posts ---
// (Handles requests like GET /api/generated-posts?lang=en)
router.get('/', async (req, res) => {
  const startTime = Date.now();
  console.log(`${new Date().toISOString()} - GET ${req.originalUrl} - Request received.`);
  console.log('Query:', req.query);

  try {
    const { lang } = req.query; // Get requested language

    let filter = {};
    if (lang) {
      filter.lang = lang.toLowerCase(); // Filter by lang (lowercase)
    } else {
      // Decide: Default language? Error? Return all?
      // For now, let's require it or default (example: default to 'it')
      // return res.status(400).json({ success: false, error: 'Language parameter ?lang= is required.' });
       filter.lang = 'en'; // Example default
       console.warn("API Warning: No language specified, defaulting to 'it'.");
    }

    // Fetch posts matching the filter, sorted by date, selecting only needed fields
    console.log(`pppppppppppppFormatting post ID: ${postsFromDb}`); // Debug log
    const postsFromDb = await GeneratedPost.find(filter)
      .sort({ "frontmatter.date": -1 }) // Sort by nested date field
      .select('slug lang frontmatter') // Select needed fields
      .lean(); // Use plain JS objects

    const dbQueryTime = Date.now();
    console.log(`Found ${postsFromDb.length} posts in DB for filter: ${JSON.stringify(filter)} (Query Time: ${dbQueryTime - startTime}ms)`);

    // Map to the structure expected by the frontend list view
    const formattedPosts = postsFromDb.map(p => ({
      slug: p.slug,
      frontmatter: {
        title: p.frontmatter?.title || 'Untitled',
        date: p.frontmatter?.date?.toISOString() || null, // Safely format date
        excerpt: p.frontmatter?.excerpt || '',
        author: p.frontmatter?.author || 'Studentitaly Staff',
        tags: p.frontmatter?.tags || [],
        coverImage: p.frontmatter?.coverImage || null
        // Add other fields needed for list view
      }
    }));

    const processingTime = Date.now();
    console.log(`Sending ${formattedPosts.length} formatted posts. (Processing Time: ${processingTime - dbQueryTime}ms, Total Time: ${processingTime - startTime}ms)`);
    res.status(200).json(formattedPosts);

  } catch (error) {
    const errorTime = Date.now();
    console.error(`[API Error] Error fetching generated posts list (Total Time: ${errorTime - startTime}ms):`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
  }
});

// --- GET /generated-posts/:slug ---
// (Handles requests like GET /api/generated-posts/my-post-slug?lang=en)
router.get('/:slug', async (req, res) => {
  const startTime = Date.now();
  console.log(`${new Date().toISOString()} - GET ${req.originalUrl} - Request received.`);
  console.log('Params:', req.params);
  console.log('Query:', req.query);

  try {
    const { slug } = req.params;
    const { lang } = req.query; // Get lang from query string

    let filter = { slug: slug.toLowerCase() }; // Use lowercase slug
    if (lang) {
      filter.lang = lang.toLowerCase(); // Filter by lang if provided
    } else {
      // Decide if lang is required for single post fetch
       return res.status(400).json({ success: false, error: 'Language parameter ?lang= is required for fetching a specific post.' });
      // Or default: filter.lang = 'it'; console.warn(...)
    }

    // Fetch the single post
    const postFromDb = await GeneratedPost.findOne(filter).lean();
    const dbQueryTime = Date.now();

    if (!postFromDb) {
      console.log(`Post not found for filter: ${JSON.stringify(filter)} (Query Time: ${dbQueryTime - startTime}ms)`);
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    console.log(`Found post ID: ${postFromDb._id} (Query Time: ${dbQueryTime - startTime}ms)`);

    // Format the response structure expected by the single post page
    const formattedPost = {
      slug: postFromDb.slug,
      lang: postFromDb.lang,
      content: postFromDb.content || '',
      frontmatter: {
        title: postFromDb.frontmatter?.title || 'Untitled',
        date: postFromDb.frontmatter?.date?.toISOString() || null, // Safely format date
        excerpt: postFromDb.frontmatter?.excerpt || '',
        author: postFromDb.frontmatter?.author || 'Studentitaly Staff',
        tags: postFromDb.frontmatter?.tags || [],
        coverImage: postFromDb.frontmatter?.coverImage || null
        // Add any other frontmatter fields needed by the detail page
      }
    };

    const processingTime = Date.now();
    console.log(`Sending formatted post ID: ${postFromDb._id}. (Processing Time: ${processingTime - dbQueryTime}ms, Total Time: ${processingTime - startTime}ms)`);
    res.status(200).json(formattedPost);

  } catch (error) {
    const errorTime = Date.now();
    console.error(`[API Error] Error fetching post ${req.params.slug} (Total Time: ${errorTime - startTime}ms):`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch post' });
  }
});

// --- GET /generated-posts/:slug/adjacent ---
// (Handles requests like GET /api/generated-posts/my-post-slug/adjacent?lang=en)
router.get('/:slug/adjacent', async (req, res) => {
  console.log("Handling /:slug/adjacent endpoint");
  try {
    const { slug } = req.params;
    const { lang } = req.query;

    if (!lang) {
      return res.status(400).json({ error: 'Language parameter ?lang= is required for adjacent posts' });
    }
    const currentLang = lang.toLowerCase();

    // Get the current post's date to find prev/next
    const currentPost = await GeneratedPost.findOne({ slug: slug.toLowerCase(), lang: currentLang }).select('frontmatter.date').lean();

    if (!currentPost || !currentPost.frontmatter || !currentPost.frontmatter.date) {
      console.log(`Adjacent: Current post or its date not found for slug=${slug}, lang=${currentLang}`);
      return res.status(404).json({ error: 'Current post not found or missing date' });
    }
    const currentDate = currentPost.frontmatter.date;

    // Find previous post (published before this one in the same language)
    const prevPost = await GeneratedPost.findOne({
      lang: currentLang,
      "frontmatter.date": { $lt: currentDate }
    })
    .sort({ "frontmatter.date": -1 }) // Get the closest one before
    .select('slug frontmatter.title frontmatter.excerpt') // Select needed fields
    .lean();

    // Find next post (published after this one in the same language)
    const nextPost = await GeneratedPost.findOne({
      lang: currentLang,
      "frontmatter.date": { $gt: currentDate }
    })
    .sort({ "frontmatter.date": 1 }) // Get the closest one after
    .select('slug frontmatter.title frontmatter.excerpt') // Select needed fields
    .lean();

    // Format the response
    res.status(200).json({
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
    });
  } catch (error) {
    console.error("Error fetching adjacent posts:", error);
    res.status(500).json({ error: "Failed to fetch adjacent posts" });
  }
});


// Export the router
export default router;