// routes/generatedPosts.js (Corrected)
import express from 'express';
// Ensure this imports the UPDATED model with the nested frontmatter schema
import GeneratedPost from '../models/GeneratedPost.js';
const router = express.Router();

// --- GET /api/generated-posts?lang=en (List of posts) ---
router.get('/', async (req, res) => {
    const startTime = Date.now();
    console.log(`${new Date().toISOString()} - GET ${req.originalUrl} - Request received.`);
    console.log('Query:', req.query);

    try {
        const { lang } = req.query; // Get requested language

        // --- Query based on the CORRECT schema ---
        let filter = {};
        if (lang) {
            // Ensure lang is treated case-insensitively if needed, e.g., using regex or ensuring data is lowercase
            filter.lang = lang; // Filter by the top-level 'lang' field
        } else {
            // It's generally better to require a language or have a predictable default
            // Avoid returning all posts from all languages unless intended
            console.warn("API Warning: No language specified in ?lang query param. Consider adding a default or making it mandatory.");
            // Example: Default to 'en' if none provided
            // filter.lang = 'en';
            // Or return error: return res.status(400).json({ success: false, error: 'Language parameter ?lang= is required.' });
        }

        // Fetch posts matching the language
        const postsFromDb = await GeneratedPost.find(filter)
            // Sort by the date field inside frontmatter
            .sort({ "frontmatter.date": -1 })
            // Select necessary fields for the list view
            .select('slug lang frontmatter') // Select slug, lang, and the whole frontmatter object
            .lean(); // Use .lean() for plain JS objects for performance

        const dbQueryTime = Date.now();
        console.log(`Found ${postsFromDb.length} posts in DB for filter: ${JSON.stringify(filter)} (Query Time: ${dbQueryTime - startTime}ms)`);

        // --- Map to the structure expected by the frontend ---
        // This structure should match the Post interface in page.tsx
        const formattedPosts = postsFromDb.map(p => {
            // Provide defaults for safety, especially during/after migration
            const fm = p.frontmatter || {}; // Ensure frontmatter object exists

            // --- Safely handle date formatting ---
            let formattedDate = new Date().toISOString(); // Sensible default (or null)
            if (fm.date) { // Check if date exists in frontmatter
                try {
                    // Ensure it's a Date object or can be parsed into one
                    const dateObj = (fm.date instanceof Date) ? fm.date : new Date(fm.date);
                    if (!isNaN(dateObj.getTime())) { // Check if the date is valid
                        formattedDate = dateObj.toISOString();
                    } else {
                       console.warn(`[API Format Warning] Invalid date format found for post slug ${p.slug}, lang ${p.lang}: ${fm.date}. Using default.`);
                    }
                } catch (dateError) {
                     console.warn(`[API Format Error] Error processing date for post slug ${p.slug}, lang ${p.lang}: ${dateError.message}. Using default.`);
                }
            } else {
                 console.warn(`[API Format Warning] Missing 'date' in frontmatter for post slug ${p.slug}, lang ${p.lang}. Using default.`);
            }
            // --- End Safe Date Handling ---

            return {
                slug: p.slug || 'missing-slug', // Add fallback
                // No lang needed at top level for list view, only frontmatter
                frontmatter: {
                    title: fm.title || 'Untitled', // Use defaults if missing
                    date: formattedDate, // Use safely formatted date
                    excerpt: fm.excerpt || '',
                    author: fm.author || 'Studentitaly Staff', // Use correct 'author' field
                    tags: fm.tags || [], // Include tags
                    language: fm.language || p.lang, // Optional: include language info if needed
                    coverImage: fm.coverImage // Include if present
                    // Add other fields needed by the list view card here
                }
            };
        });

        const processingTime = Date.now();
        console.log(`Sending ${formattedPosts.length} formatted posts. (Processing Time: ${processingTime - dbQueryTime}ms, Total Time: ${processingTime - startTime}ms)`);
        res.status(200).json(formattedPosts);

    } catch (error) {
        const errorTime = Date.now();
        console.error(`[API Error] Error fetching generated posts (Total Time: ${errorTime - startTime}ms):`, error); // Log the full error
        res.status(500).json({ success: false, error: 'Failed to fetch posts' });
    }
});

// --- GET /api/generated-posts/:slug?lang=en (Single post) ---
router.get('/:slug', async (req, res) => {
    const startTime = Date.now();
    console.log(`${new Date().toISOString()} - GET ${req.originalUrl} - Request received.`);
    console.log('Params:', req.params);
    console.log('Query:', req.query);

    try {
        const { slug } = req.params;
        const { lang } = req.query; // Get lang from query string

        // --- Query based on the CORRECT schema ---
        let filter = { slug: slug };
        if (lang) {
            filter.lang = lang; // <<< Filter by lang if provided! Essential if slugs repeat.
        } else {
            console.warn(`[API Warning] Fetching slug '${slug}' without specific language '?lang='. Result might be ambiguous.`);
            // If lang is absolutely required for uniqueness, return an error:
            // return res.status(400).json({ success: false, error: 'Language parameter ?lang= is required for fetching a specific post.' });
        }

        // Fetch the single post - select all fields needed
        const postFromDb = await GeneratedPost.findOne(filter)
             // No .select() needed - get all fields for the detail page
             .lean(); // Use .lean() for plain JS object

        const dbQueryTime = Date.now();

        if (!postFromDb) {
             console.log(`Post not found for filter: ${JSON.stringify(filter)} (Query Time: ${dbQueryTime - startTime}ms)`);
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        console.log(`Found post ID: ${postFromDb._id} (Query Time: ${dbQueryTime - startTime}ms)`);

        // --- Format the response structure expected by the single post page ---
        // This should match the BlogPost interface in [slug]/page.tsx
        const fm = postFromDb.frontmatter || {}; // Ensure frontmatter object exists

        // --- Safely format date ---
        let formattedDate = new Date().toISOString(); // Default
         if (fm.date) {
             try {
                 const dateObj = (fm.date instanceof Date) ? fm.date : new Date(fm.date);
                 if (!isNaN(dateObj.getTime())) {
                     formattedDate = dateObj.toISOString();
                 } else {
                      console.warn(`[API Format Warning] Invalid date format found for post slug ${postFromDb.slug}, lang ${postFromDb.lang}: ${fm.date}. Using default.`);
                 }
             } catch (dateError) {
                  console.warn(`[API Format Error] Error processing date for post slug ${postFromDb.slug}, lang ${postFromDb.lang}: ${dateError.message}. Using default.`);
             }
         } else {
             console.warn(`[API Format Warning] Missing 'date' in frontmatter for post slug ${postFromDb.slug}, lang ${postFromDb.lang}. Using default.`);
         }
        // --- End Safe Date Handling ---

        const formattedPost = {
            slug: postFromDb.slug, // Top-level
            lang: postFromDb.lang, // Top-level (use correct field name)
            content: postFromDb.content || '', // Top-level
            frontmatter: { // Nested
                title: fm.title || 'Untitled',
                date: formattedDate, // Use safely formatted date
                excerpt: fm.excerpt || '',
                author: fm.author || 'Studentitaly Staff', // Use correct 'author' field
                tags: fm.tags || [],
                language: fm.language || postFromDb.lang, // Optional language info
                originalUrl: fm.originalUrl, // Include if present
                coverImage: fm.coverImage // Include if present
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


// You would also add the GET /:slug/adjacent endpoint logic here if needed

export default router;