// routes/autoPost.js
import express from "express";
import fetch from "node-fetch"; // Or use global fetch if Node.js >= 18
import * as cheerio from "cheerio";
import GeneratedPost from '../models/generatedPosts.js'; // Import the model

const router = express.Router();

// --- Helper Functions (Unchanged) ---

const italianAuthors = ["Marco Bianchi", "Giulia Romano", "Sofia Conti"];

function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function generateExcerpt(content, maxLength = 150) {
  if (!content) {
    return "";
  }
  // Improved regex to handle markdown lists/quotes better at the start
  const plainText = content
    .replace(/^(#+\s*|>\s*|-\s*|\*\s*|\d+\.\s*)/gm, "") // Remove leading markdown markers
    .replace(/[\*_`~#\[\]]/g, "") // Remove other markdown chars
    .replace(/\s\s+/g, " ") // Collapse whitespace
    .trim();
  if (plainText.length <= maxLength) {
    return plainText;
  }
  const truncated = plainText.substring(0, maxLength);
  // Try to cut at the last sentence end or space
  const lastSentenceEnd = Math.max(truncated.lastIndexOf(". "), truncated.lastIndexOf("? "), truncated.lastIndexOf("! "));
  const lastSpace = truncated.lastIndexOf(" ");
  const cutOffPoint = lastSentenceEnd > 0 ? lastSentenceEnd : (lastSpace > 0 ? lastSpace : maxLength);

  return truncated.substring(0, cutOffPoint) + "...";
}


// --- API Endpoint ---

// POST /api/autopost/generate
router.post("/generate", async (req, res) => {
  // --- 1. Get Input ---
  const { blogUrl, lang = "en" } = req.body; // Get lang from body
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"; // Define URL

  // --- 2. Validate Input (Unchanged) ---
  if (!blogUrl) {
    return res
      .status(400)
      .json({ success: false, error: "Missing blogUrl in request body." });
  }
  if (typeof blogUrl !== "string" || !isValidHttpUrl(blogUrl)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid blogUrl provided." });
  }
  if (!DEEPSEEK_API_KEY) {
    console.error("Missing DeepSeek API key."); // Log server-side
    return res
      .status(500)
      .json({ success: false, error: "Server configuration error." }); // Don't expose key missing
  }

  try {
    // --- 3. Fetch and Parse External Content (Unchanged) ---
    console.log(`[AutoPost] Fetching content from: ${blogUrl}`);
    const urlResponse = await fetch(blogUrl);
    if (!urlResponse.ok) {
      throw new Error(
        `Failed to fetch URL: ${urlResponse.status} ${urlResponse.statusText}`
      );
    }
    const htmlContent = await urlResponse.text();
    const $ = cheerio.load(htmlContent);

    // Extract Title (same logic as before)
    let extractedTitle = $("title").text();
    if (!extractedTitle || extractedTitle.toLowerCase().includes("blog")) {
      const h1Text = $("h1").first().text();
      extractedTitle = h1Text ? h1Text : "AI Rewritten Post";
    }
    extractedTitle = extractedTitle.trim();
    console.log(`[AutoPost] Extracted Title: ${extractedTitle}`);

    // Extract Text (same logic as before)
    let extractedText = "";
    const selectors = [ "article", "main", ".post-content", ".entry-content", "body" ];
    for (const selector of selectors) {
      if ($(selector).length > 0) {
        extractedText = $(selector).first().text();
        if (selector === "body" && extractedText.startsWith(extractedTitle)) {
           extractedText = extractedText.substring(extractedTitle.length).trim();
        }
        break; // Stop after finding content
      }
    }
    extractedText = extractedText.replace(/\s\s+/g, " ").trim();
    if (!extractedText) {
      throw new Error( "Could not extract text content using common selectors." );
    }
    console.log(`[AutoPost] Extracted Text Length: ${extractedText.length}`);

    // --- 4. Call DeepSeek API (Unchanged) ---
    console.log(`[AutoPost] Calling DeepSeek API for language: ${lang}`);
    const deepseekResponse = await fetch(DEEPSEEK_API_URL, { /* ... fetch options ... */
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: `Rewrite the following blog post content into unique content with a clear, friendly tone, translated into the language specified by the code: ${lang}. Keep the key ideas but use original wording in the target language (${lang}). Focus only on the main article content and ignore any headers, footers, navigation menus, sidebars, or advertising elements present in the input text. Make it sound as if it's written by a human working in the field of education for Studentitaly.it agency. Ensure the output is well-structured Markdown.`, // Added Markdown instruction
              },
              { role: "user", content: extractedText },
            ],
            // Consider adding max_tokens if needed
          }),
    });

    const deepseekData = await deepseekResponse.json();

    if (!deepseekResponse.ok) { /* ... error handling ... */
        console.error("DeepSeek API Error Response:", deepseekData);
        throw new Error(
            `DeepSeek API request failed: ${deepseekResponse.status} ${
                deepseekResponse.statusText
            } - ${deepseekData?.error?.message || "Unknown API error"}`
        );
    }
    if (!deepseekData.choices?.[0]?.message?.content) { /* ... error handling ... */
        console.error("Invalid DeepSeek Response Structure:", deepseekData);
        throw new Error("Invalid or empty response structure from DeepSeek API");
    }

    const rewrittenContent = deepseekData.choices[0].message.content;
    console.log(`[AutoPost] Rewritten Content Length: ${rewrittenContent.length}`);

    // --- 5. Prepare Data for MongoDB (Unchanged logic, just variable prep) ---
    const slug = extractedTitle
      .toLowerCase()
      .replace(/[_\s]+/g, '-') // Replace underscores and spaces with hyphens
      .replace(/[^\p{L}\p{N}-]+/gu, "") // Remove non-letter, non-number, non-hyphen chars (Unicode safe)
      .replace(/^-+|-+$/g, "") // Trim leading/trailing hyphens
      .substring(0, 75); // Limit slug length
    const randomAuthor = italianAuthors[Math.floor(Math.random() * italianAuthors.length)];
    const excerpt = generateExcerpt(rewrittenContent); // Generate excerpt from AI content
    const tags = ["study in italy", "international students"]; // Default tags
    const generatedDate = new Date(); // Use current date/time

    // --- 6. Save to MongoDB (MODIFIED TO USE CORRECT STRUCTURE) ---
    console.log(`[AutoPost] Attempting to save post with slug: ${slug}, lang: ${lang}`);

    // Create the document matching the CORRECTED schema
    const newPostDocument = {
      slug: slug,
      lang: lang, // Use lang from request body
      content: rewrittenContent, // Use AI-generated content
      frontmatter: { // <<<--- NESTED frontmatter object
        title: extractedTitle,
        date: generatedDate, // Use generated date for 'date' field
        excerpt: excerpt,
        author: randomAuthor, // Use 'author' key name
        tags: tags,
        language: lang, // Optional: can store lang code here too if desired
        originalUrl: blogUrl // Optional: store original URL in frontmatter
      }
      // createdAt and updatedAt will be added by Mongoose (timestamps: true in schema)
    };

    // Save using the Mongoose model (ensure models/GeneratedPost.js is updated)
    const newPost = new GeneratedPost(newPostDocument);
    const savedPost = await newPost.save(); // savedPost will reflect the schema

    console.log(`[AutoPost] Post saved successfully with ID: ${savedPost._id}`);

    // --- 7. Send Success Response (Reflecting Correct Structure) ---
    res.status(201).json({
      success: true,
      message: "Post generated and saved successfully.",
      post: { // Return data matching the correct saved structure
        id: savedPost._id,
        slug: savedPost.slug,
        lang: savedPost.lang,
        frontmatter: savedPost.frontmatter, // Return the full frontmatter object
      },
    });

  } catch (error) {
    // --- 8. Handle Errors (Updated duplicate key message) ---
    console.error("[AutoPost] Error in /api/autopost/generate:", error);

    // Check for duplicate key error (likely on the {lang: 1, slug: 1} index)
    if (error.code === 11000 && error.keyPattern) {
         const conflictingKey = JSON.stringify(error.keyValue);
         console.error(`[AutoPost] Duplicate key error for key: ${conflictingKey}`);
         return res.status(409).json({ // 409 Conflict
             success: false,
             error: `A post with conflicting key ${conflictingKey} already exists. Possibly duplicate slug ('${error.keyValue?.slug}') for language ('${error.keyValue?.lang}'). Please choose a different source URL or check existing posts.`,
         });
     }

    // General error
    res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred during post generation.",
    });
  }
});

export default router;