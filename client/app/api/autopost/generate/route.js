// client/app/api/autopost/generate/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Your DB connection utility
import GeneratedPost from '@/lib/models/GeneratedPost'; // Your Mongoose model
import { italianAuthors, isValidHttpUrl, generateExcerpt } from '@/lib/autopostUtils'; // Helper functions
import * as cheerio from 'cheerio';
// import fetch from 'node-fetch'; // Uncomment if you installed and prefer to use node-fetch explicitly

export async function POST(request) {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

  try {
    // --- 1. Get Input ---
    const body = await request.json();
    const { blogUrl, lang = "en" } = body;

    // --- 2. Validate Input ---
    if (!blogUrl) {
      return NextResponse.json({ success: false, error: "Missing blogUrl in request body." }, { status: 400 });
    }
    if (typeof blogUrl !== "string" || !isValidHttpUrl(blogUrl)) {
      return NextResponse.json({ success: false, error: "Invalid blogUrl provided." }, { status: 400 });
    }
    if (!DEEPSEEK_API_KEY) {
      console.error("[AutoPost NextJS] Missing DeepSeek API key.");
      return NextResponse.json({ success: false, error: "Server configuration error." }, { status: 500 });
    }

    console.log(`[AutoPost NextJS] Received request: blogUrl=${blogUrl}, lang=${lang}`);

    // --- 3. Fetch and Parse External Content ---
    console.log(`[AutoPost NextJS] Fetching content from: ${blogUrl}`);
    const urlResponse = await fetch(blogUrl); // Global fetch or imported node-fetch
    if (!urlResponse.ok) {
      throw new Error(`Failed to fetch URL: ${urlResponse.status} ${urlResponse.statusText}`);
    }
    const htmlContent = await urlResponse.text();
    const $ = cheerio.load(htmlContent);

    let extractedTitle = $("title").text();
    if (!extractedTitle || extractedTitle.toLowerCase().includes("blog")) {
      const h1Text = $("h1").first().text();
      extractedTitle = h1Text ? h1Text : "AI Rewritten Post";
    }
    extractedTitle = extractedTitle.trim();
    console.log(`[AutoPost NextJS] Extracted Title: ${extractedTitle}`);

    let extractedText = "";
    const selectors = ["article", "main", ".post-content", ".entry-content", "body"];
    for (const selector of selectors) {
      if ($(selector).length > 0) {
        extractedText = $(selector).first().text();
         if (selector === "body" && extractedText.startsWith(extractedTitle)) {
           extractedText = extractedText.substring(extractedTitle.length).trim();
         }
        break;
      }
    }
    extractedText = extractedText.replace(/\s\s+/g, " ").trim();
    if (!extractedText) {
      throw new Error("Could not extract text content using common selectors.");
    }
    console.log(`[AutoPost NextJS] Extracted Text Length: ${extractedText.length}`);

    // --- 4. Call DeepSeek API ---
    console.log(`[AutoPost NextJS] Calling DeepSeek API for language: ${lang}`);
    const deepseekResponse = await fetch(DEEPSEEK_API_URL, {
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
            content: `Rewrite the following blog post content into unique content with a clear, friendly tone, translated into the language specified by the code: ${lang}. Keep the key ideas but use original wording in the target language (${lang}). Focus only on the main article content and ignore any headers, footers, navigation menus, sidebars, or advertising elements present in the input text. Make it sound as if it's written by a human working in the field of education for Studentitaly.it agency. Ensure the output is well-structured Markdown.`,
          },
          { role: "user", content: extractedText },
        ],
      }),
    });

    const deepseekData = await deepseekResponse.json();

    if (!deepseekResponse.ok) {
      console.error("[AutoPost NextJS] DeepSeek API Error Response:", deepseekData);
      throw new Error(
        `DeepSeek API request failed: ${deepseekResponse.status} ${
          deepseekResponse.statusText
        } - ${deepseekData?.error?.message || "Unknown API error"}`
      );
    }
    if (!deepseekData.choices?.[0]?.message?.content) {
      console.error("[AutoPost NextJS] Invalid DeepSeek Response Structure:", deepseekData);
      throw new Error("Invalid or empty response structure from DeepSeek API");
    }

    const rewrittenContent = deepseekData.choices[0].message.content;
    console.log(`[AutoPost NextJS] Rewritten Content Length: ${rewrittenContent.length}`);

    // --- 5. Prepare Data for MongoDB ---
    const slug = extractedTitle
      .toLowerCase()
      .replace(/[_\s]+/g, '-')
      .replace(/[^\p{L}\p{N}-]+/gu, "")
      .replace(/^-+|-+$/g, "")
      .substring(0, 75);
    const randomAuthor = italianAuthors[Math.floor(Math.random() * italianAuthors.length)];
    const excerpt = generateExcerpt(rewrittenContent);
    const tags = ["study in italy", "international students"];
    const generatedDate = new Date();

    // --- 6. Save to MongoDB ---
    await dbConnect(); // Ensure database connection
    console.log(`[AutoPost NextJS] Attempting to save post with slug: ${slug}, lang: ${lang}`);

    const newPostDocument = {
      slug: slug,
      lang: lang,
      content: rewrittenContent,
      frontmatter: {
        title: extractedTitle,
        date: generatedDate,
        excerpt: excerpt,
        author: randomAuthor,
        tags: tags,
        language: lang,
        originalUrl: blogUrl
      }
    };

    const newPost = new GeneratedPost(newPostDocument);
    const savedPost = await newPost.save();
    console.log(`[AutoPost NextJS] Post saved successfully with ID: ${savedPost._id}`);

    // --- 7. Send Success Response ---
    return NextResponse.json({
      success: true,
      message: "Post generated and saved successfully.",
      post: {
        id: savedPost._id,
        slug: savedPost.slug,
        lang: savedPost.lang,
        frontmatter: savedPost.frontmatter,
      },
    }, { status: 201 });

  } catch (error) {
    // --- 8. Handle Errors ---
    console.error("[AutoPost NextJS] Error in /api/autopost/generate:", error.message, error.stack);

    if (error.code === 11000 && error.keyPattern) {
      const conflictingKey = JSON.stringify(error.keyValue);
      console.error(`[AutoPost NextJS] Duplicate key error for key: ${conflictingKey}`);
      return NextResponse.json({
        success: false,
        error: `A post with conflicting key ${conflictingKey} already exists. Possibly duplicate slug ('${error.keyValue?.slug}') for language ('${error.keyValue?.lang}'). Please choose a different source URL or check existing posts.`,
      }, { status: 409 }); // 409 Conflict
    }

    return NextResponse.json({
      success: false,
      error: error.message || "An unexpected error occurred during post generation.",
    }, { status: 500 });
  }
}