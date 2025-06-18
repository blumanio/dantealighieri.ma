// Filename: app/api/ai/url-extractor/route.ts

import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { URL } from 'url'; // For robust URL resolution and hostname extraction

// --- (webpageCourseInfoSchema remains the same as defined previously) ---
const webpageCourseInfoSchema = {
    type: "OBJECT",
    properties: {
        courseTitle: { type: "STRING", description: "The official title or name of the course. Be precise." },
        universityName: { type: "STRING", description: "The name of the university, institution, or provider offering the course." },
        courseDescription: { type: "STRING", description: "A comprehensive description of the course, including its objectives, content, and learning outcomes. Extract as much relevant detail as possible from all provided text sections. If very long, summarize key aspects." },
        languageOfInstruction: { type: "STRING", description: "The primary language(s) the course is taught in (e.g., 'English', 'Italian', 'English and Italian'). If multiple, list them." },
        degreeLevel: { type: "STRING", description: "The academic level of the course (e.g., 'Bachelor's Degree', 'Master's Degree', 'PhD', 'Certificate', 'Laurea Triennale', 'Laurea Magistrale', 'Short course')." },
        tuitionFee: { type: "STRING", description: "Information about tuition fees, costs, or payment terms. Include currency and period if specified (e.g., '€10,000 per year', 'Contact for fee details', 'Free'). Synthesize from all provided texts if necessary." },
        courseDuration: { type: "STRING", description: "The typical length or duration of the course (e.g., '3 years', '2 semesters', '120 ECTS', '6 months part-time')." },
        applicationDeadlines: { type: "STRING", description: "Specific application deadlines, closing dates, or application periods. E.g., 'Non-EU: March 15, 2026; EU: July 1, 2026', 'Applications open October 1st - January 15th'. Consolidate if possible or list key dates from all provided texts." },
        startDate: { type: "STRING", description: "The typical start date, intake period, or semester for the course (e.g., 'September 2026', 'Fall Semester', 'Next intake: February 2027', 'Multiple start dates per year')." },
        entryRequirements: { type: "STRING", description: "Key academic prerequisites, language proficiency requirements (e.g., IELTS/TOEFL scores), or other criteria for admission. Consolidate from all provided texts." },
        curriculumHighlights: { type: "STRING", description: "A summary of key subjects, core modules, course structure, or specializations offered within the curriculum. List 3-5 main areas or provide a concise overview from all provided texts." },
        careerOpportunities: { type: "STRING", description: "Potential career paths, job roles, industries, or further study options available after completing the course." },
        scholarshipAndFundingInfo: { type: "STRING", description: "Details about available scholarships, grants, bursaries, or other financial aid opportunities. Include eligibility hints or how to find more information if mentioned in any provided text." },
        locationCity: { type: "STRING", description: "The primary city or campus location where the course is delivered. Specify if online or blended." },
        deliveryMode: { type: "STRING", description: "How the course is delivered (e.g., 'Online', 'On-campus', 'Blended', 'Part-time', 'Full-time')." },
        creditsAwarded: { type: "STRING", description: "Number and type of credits awarded upon completion (e.g., '180 ECTS', '60 CFU', '15 US credits')." },
        contactInfo: { type: "STRING", description: "A contact email, phone number, or link to a contact/enquiry page for more course information." },
        programUrl: { type: "STRING", description: "The specific URL of the primary course page from which the information is extracted (should match the initial input URL)." }
    },
    required: ["courseTitle", "universityName", "courseDescription", "languageOfInstruction", "degreeLevel"]
};

const MAX_SECONDARY_LINKS_TO_FOLLOW = 3;
const REQUEST_TIMEOUT = 10000; // 10 seconds for each fetch

const RELEVANT_LINK_KEYWORDS = [
    'admission', 'apply', 'application', 'requirements', 'entry', 'iscrizioni', 'ammissioni', 'requisiti', 'candidatura',
    'deadline', 'dates', 'calendar', 'scadenze', 'calendario', 'termini', 'important dates',
    'fees', 'tuition', 'cost', 'funding', 'scholarship', 'financial aid', 'tasse', 'costi', 'borse di studio', 'finanziamenti', 'rette',
    'program', 'curriculum', 'structure', 'modules', 'courses', 'piano di studi', 'programma', 'struttura', 'contenuti', 'insegnamenti',
    'contact', 'info', 'support', 'help', 'contatti', 'informazioni', 'supporto'
];

async function fetchAndExtractText(url: string, timeout: number): Promise<{ text: string, status: number, finalUrl: string }> {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; CourseInfoBot/1.0; +http://example.com/bot)', // Be a good bot citizen
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(timeout)
    });

    if (!response.ok) {
        return { text: '', status: response.status, finalUrl: response.url };
    }

    const htmlContent = await response.text();
    const $ = cheerio.load(htmlContent);
    let extractedText = '';
    // Prioritize main content areas, then broader elements
    $('main, article, section, .main-content, .course-details, #content, body').find('h1, h2, h3, h4, h5, h6, p, li, th, td, dt, dd, blockquote, pre').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text) {
            extractedText += text + "\n";
        }
    });

    extractedText = extractedText.replace(/\n\s*\n/g, '\n').trim();
    // If text is still too little, try a simpler body text extraction, less structured
    if (extractedText.length < 200 && $('body').length) {
        extractedText = $('body').text().replace(/\s\s+/g, ' ').replace(/\n\s*\n/g, '\n').trim();
    }

    return { text: extractedText, status: response.status, finalUrl: response.url };
}


export async function POST(request: Request) {
    const overallStartTime = Date.now();
    let debugInfo: any = { service: "url-extractor-v2-multipage" };
    const visitedUrls = new Set<string>();

    try {
        const body = await request.json();
        const initialUrlString = body.url;

        if (!initialUrlString || typeof initialUrlString !== 'string' || !initialUrlString.startsWith('http')) {
            return NextResponse.json({ message: 'A valid URL is required.', error: true, debug: debugInfo }, { status: 400 });
        }
        debugInfo.initialUrl = initialUrlString;
        const initialUrl = new URL(initialUrlString); // Use URL object for easier hostname comparison and resolution

        // 1. Fetch and process the initial URL
        console.log(`[${initialUrlString}] Fetching initial URL...`);
        const primaryPageFetchTime = Date.now();
        const { text: mainPageText, status: mainPageStatus, finalUrl: mainPageFinalUrl } = await fetchAndExtractText(initialUrl.href, REQUEST_TIMEOUT);
        debugInfo.mainPage = { url: initialUrl.href, status: mainPageStatus, fetchDurationMs: Date.now() - primaryPageFetchTime, textLength: mainPageText.length, finalUrl: mainPageFinalUrl };
        visitedUrls.add(mainPageFinalUrl); // Add final URL after redirects

        if (mainPageStatus !== 200 || !mainPageText) {
            return NextResponse.json({ message: `Failed to fetch or extract text from initial URL. Status: ${mainPageStatus}`, error: true, url: initialUrl.href, debug: debugInfo }, { status: mainPageStatus > 399 ? mainPageStatus : 500 });
        }

        // 2. Discover and prioritize relevant links on the initial page
        const $ = cheerio.load(await (await fetch(mainPageFinalUrl)).text()); // Re-fetch to load for cheerio if text was extracted differently, or pass html directly
        const links = new Map<string, { score: number, text: string, absoluteUrl: string }>();
        const baseHostname = new URL(mainPageFinalUrl).hostname;

        $('a').each((i, elem) => {
            const linkHref = $(elem).attr('href');
            const linkText = $(elem).text().toLowerCase().trim();

            if (linkHref) {
                try {
                    const absoluteUrl = new URL(linkHref, mainPageFinalUrl).href; // Resolve relative URLs
                    const urlHostname = new URL(absoluteUrl).hostname;

                    // Only consider links on the same primary domain or www subdomain to avoid crawling external sites extensively
                    // More sophisticated logic might allow specific related subdomains.
                    if (urlHostname === baseHostname || urlHostname === `www.${baseHostname}`) {
                        let score = 0;
                        RELEVANT_LINK_KEYWORDS.forEach(keyword => {
                            if (linkText.includes(keyword)) score += 2; // Higher score for keyword in link text
                            if (absoluteUrl.toLowerCase().includes(keyword.replace(/\s+/g, '-'))) score += 1; // Lower score for keyword in URL path
                        });

                        if (score > 0) {
                            if (!links.has(absoluteUrl) || (links.get(absoluteUrl)?.score || 0) < score) {
                                links.set(absoluteUrl, { score, text: linkText.substring(0, 100), absoluteUrl });
                            }
                        }
                    }
                } catch (urlError) {
                    // console.warn(`[${initialUrlString}] Invalid link URL found: ${linkHref}`, urlError);
                }
            }
        });

        const sortedLinks = Array.from(links.values()).sort((a, b) => b.score - a.score);
        const secondaryLinksToFollow = sortedLinks.slice(0, MAX_SECONDARY_LINKS_TO_FOLLOW);
        debugInfo.discoveredLinks = { count: links.size, sortedCount: sortedLinks.length, toFollowDetails: secondaryLinksToFollow };

        // 3. Fetch and process secondary links
        const secondaryPageContents: Array<{ url: string, linkText: string, text: string, status: number }> = [];
        for (const link of secondaryLinksToFollow) {
            if (visitedUrls.has(link.absoluteUrl)) {
                console.log(`[${initialUrlString}] Skipping already visited secondary URL: ${link.absoluteUrl}`);
                continue;
            }
            console.log(`[${initialUrlString}] Fetching secondary URL: ${link.absoluteUrl} (Score: ${link.score}, Text: "${link.text}")`);
            const secPageFetchTime = Date.now();
            const { text: secPageText, status: secPageStatus, finalUrl: secPageFinalUrl } = await fetchAndExtractText(link.absoluteUrl, REQUEST_TIMEOUT);
            debugInfo.secondaryPageFetch = debugInfo.secondaryPageFetch || [];
            debugInfo.secondaryPageFetch.push({ originalUrl: link.absoluteUrl, finalUrl: secPageFinalUrl, status: secPageStatus, fetchDurationMs: Date.now() - secPageFetchTime, textLength: secPageText.length });
            visitedUrls.add(secPageFinalUrl);

            if (secPageStatus === 200 && secPageText) {
                secondaryPageContents.push({ url: secPageFinalUrl, linkText: link.text, text: secPageText, status: secPageStatus });
            } else {
                console.warn(`[${initialUrlString}] Failed to fetch or extract text from secondary URL: ${link.absoluteUrl}, Status: ${secPageStatus}`);
            }
        }

        // 4. Combine text and prepare LLM prompt
        let combinedTextForLLM = `
        --- START OF TEXT FROM PRIMARY URL: ${mainPageFinalUrl} ---
        ${mainPageText}
        --- END OF TEXT FROM PRIMARY URL ---
    `;

        secondaryPageContents.forEach(secPage => {
            combinedTextForLLM += `

        --- START OF TEXT FROM LINKED PAGE: ${secPage.url} (Originally linked as: "${secPage.linkText}") ---
        ${secPage.text}
        --- END OF TEXT FROM LINKED PAGE ---
      `;
        });
        debugInfo.combinedTextLength = combinedTextForLLM.length;

        const MAX_LLM_INPUT_LENGTH = 100000; // Adjust based on Gemini 1.5 Flash's large context window, but be mindful of cost/performance.
        // Actual limit is much higher (e.g., 1M tokens), but this is a practical limit for cost/speed.
        if (combinedTextForLLM.length > MAX_LLM_INPUT_LENGTH) {
            combinedTextForLLM = combinedTextForLLM.substring(0, MAX_LLM_INPUT_LENGTH);
            debugInfo.combinedTextTruncated = true;
        }

        // 5. Use LLM (Gemini) to extract structured information
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("Gemini API Key is not configured.");

        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        const llmPrompt = `
        You are an expert academic course information extractor.
        The following text has been extracted from one or more web pages related to a specific academic course.
        The primary course page URL was: ${initialUrl.href}
        Additional relevant pages (like admissions, fees) might have also been crawled and their text is included below.
        Your goal is to meticulously extract the information based on the provided JSON schema, consolidating details from all provided text sections.
        Prioritize information that seems official or directly related to the main course described.
        If specific information is not found in the text, explicitly state "Not found in provided text" or similar for that field, or omit the field if not required.
        Ensure the output is a valid JSON object matching the schema.

        Schema to use for extraction:
        ${JSON.stringify(webpageCourseInfoSchema, null, 2)}

        Combined text to analyze:
        ${combinedTextForLLM}

        Extracted JSON:
    `;
        debugInfo.llmPromptLength = llmPrompt.length;

        console.log(`[${initialUrlString}] Sending combined text to Gemini for extraction...`);
        const llmStartTime = Date.now();
        const llmResponse = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: llmPrompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.05, // Very low temperature for factual extraction
                }
            })
        });
        debugInfo.llmDurationMs = Date.now() - llmStartTime;
        debugInfo.llmStatus = llmResponse.status;

        if (!llmResponse.ok) {
            const errorText = await llmResponse.text();
            debugInfo.llmError = errorText.substring(0, 500);
            throw new Error(`AI model failed to process the content. Status: ${llmResponse.status}. Error: ${errorText.substring(0, 100)}`);
        }

        const llmResult = await llmResponse.json();
        let extractedData;
        if (llmResult.candidates && llmResult.candidates[0]?.content?.parts[0]?.text) {
            try {
                extractedData = JSON.parse(llmResult.candidates[0].content.parts[0].text);
                if (typeof extractedData === 'object' && extractedData !== null) {
                    extractedData.sourceUrl = initialUrl.href; // Primary source URL
                    extractedData.crawledUrls = Array.from(visitedUrls);
                    extractedData.extractedAt = new Date().toISOString();
                }
            } catch (e: any) {
                debugInfo.llmParseError = e.message;
                debugInfo.rawLlmResponse = llmResult.candidates[0].content.parts[0].text.substring(0, 1000);
                throw new Error(`AI model returned an invalid JSON structure. Error: ${e.message}`);
            }
        } else {
            debugInfo.llmResponseStructureWarning = "No candidates or parsable text in LLM response.";
            throw new Error('AI model did not return usable data.');
        }

        debugInfo.totalServiceDurationMs = Date.now() - overallStartTime;
        console.log(`[${initialUrlString}] Successfully extracted information. Total time: ${debugInfo.totalServiceDurationMs}ms`);
        return NextResponse.json({ success: true, data: extractedData, debug: debugInfo });

    } catch (error: any) {
        console.error(`--- Critical Error in Multi-Page URL Extractor for URL: ${debugInfo.initialUrl || 'N/A'} ---:`, error.message);
        debugInfo.criticalError = error.message;
        debugInfo.stack = error.stack?.substring(0, 1000);
        debugInfo.totalServiceDurationMs = Date.now() - overallStartTime;
        return NextResponse.json({ message: `Critical error processing the URL: ${error.message}`, error: true, url: debugInfo.initialUrl, debug: debugInfo }, { status: 500 });
    }
}