// --- Backend API Route (Actual Implementation) ---
// Path: app/api/ai/course-advisor/route.ts
// Ensure this file is created at the correct path in your Next.js project.

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Course from '../../../../lib/models/Course'; // Adjust path as per your project structure
import University from '../../../../lib/models/University'; // Adjust path
import dbConnect from '../../../../lib/dbConnect'; // Adjust path

// --- Helper: Define the JSON schema for LLM to parse user interest ---
const userInterestSchema = {
    type: "OBJECT",
    properties: {
        field_of_study: { type: "STRING", description: "Main academic field, e.g., Computer Science, Data Science, History, Medicine. If multiple, pick the most prominent. If not clearly a field of study, use the main subject." },
        degree_level: { type: "STRING", description: "e.g., Bachelor, Master, PhD. Extract ONLY if explicitly mentioned by the user. If not mentioned, leave this field empty or null." },
        location_preferences: { type: "ARRAY", items: { type: "STRING" }, description: "Specific cities or regions in Italy, if mentioned by user." },
        language_preference: { type: "STRING", description: "e.g., English, Italian. Extract ONLY if explicitly mentioned by user. If not mentioned, leave this field empty or null." },
        keywords: { type: "ARRAY", items: { type: "STRING" }, description: "Other relevant keywords or specializations (e.g. 'cybersecurity', 'data analysis', 'machine learning'), 'online', 'part-time', 'affordable', 'scholarship'. Include terms from field_of_study if it's multi-word like 'data science'." },
        specific_university_mentioned: { type: "STRING", description: "Name of a specific university if the user mentioned one." }
    },
};

// --- Helper: Define the JSON schema for LLM to summarize course details ---
const courseSummarySchema = {
    type: "OBJECT",
    properties: {
        aiSummary: { type: "STRING", description: "A concise summary (2-3 sentences) of the course, highlighting its relevance to the user's original query. Mention key unique aspects." },
        curriculumSummary: { type: "STRING", description: "A brief overview of 3-4 key topics, modules, or skills covered in the curriculum. If course data is in Italian, summarize in English." },
        keyEntryRequirements: { type: "STRING", description: "Summarize the most important entry requirements (e.g., 'Bachelor in CS', 'IELTS 6.5'). Be brief. If course data is in Italian, summarize in English." },
        careerProspectsHighlight: { type: "STRING", description: "Mention 1-2 key career prospects or types of roles graduates can pursue. If course data is in Italian, summarize in English." }
    },
    required: ["aiSummary", "curriculumSummary", "keyEntryRequirements", "careerProspectsHighlight"]
};


export async function POST(request: Request) {
    const startTime = Date.now();
    console.log("AI Course Advisor API route hit at:", new Date().toISOString());
    let debugInfo: any = {};

    try {
        await dbConnect();
        debugInfo.dbConnection = "Success";
        console.log("Database connected.");

        const body = await request.json();
        const { interest, userId } = body;
        debugInfo.originalQuery = interest;
        console.log("Received interest:", interest, "UserID:", userId);


        if (!interest || typeof interest !== 'string' || interest.trim() === '') {
            console.warn("User interest is missing or invalid.");
            return NextResponse.json({ message: 'User interest is required and must be a non-empty string.', error: true, debug: debugInfo }, { status: 400 });
        }

        // --- Step 1: Parse User Interest with LLM (Gemini) ---
        let parsedInterest: any = {};
        const apiKey = "AIzaSyB6vNAamjRK4QxkKYx8McI8ZXttUHZs2dw"; // Leave empty, Canvas will inject
        const parseInterestApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const parsePayload = {
            contents: [{ role: "user", parts: [{ text: `Parse the following user interest for studying in Italy into a structured JSON object. User interest: "${interest}"` }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: userInterestSchema,
                temperature: 0.1,
            }
        };

        console.log("Sending to Gemini for interest parsing...");
        const parseResponseStartTime = Date.now();
        const parseResponse = await fetch(parseInterestApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsePayload)
        });
        debugInfo.geminiParseRequestDurationMs = Date.now() - parseResponseStartTime;
        debugInfo.geminiParseStatus = parseResponse.status;

        if (!parseResponse.ok) {
            const errorText = await parseResponse.text();
            console.error("Gemini parsing API error:", parseResponse.status, errorText);
            parsedInterest.field_of_study = interest;
            parsedInterest.keywords = interest.toLowerCase().split(" ").filter(k => k.length > 2 && k.length < 25);
            debugInfo.geminiParseError = errorText.substring(0, 500);
            console.warn("LLM parsing failed, using fallback for parsedInterest:", parsedInterest);
        } else {
            const parseResult = await parseResponse.json();
            debugInfo.geminiParseResponse = parseResult;

            if (parseResult.candidates && parseResult.candidates[0]?.content?.parts[0]?.text) {
                try {
                    parsedInterest = JSON.parse(parseResult.candidates[0].content.parts[0].text);
                } catch (e) {
                    console.error("Error parsing Gemini JSON response for interest:", e, parseResult.candidates[0].content.parts[0].text);
                    parsedInterest.field_of_study = interest;
                    parsedInterest.keywords = interest.toLowerCase().split(" ").filter(k => k.length > 2 && k.length < 25);
                    debugInfo.geminiParseInternalError = (e as Error).message;
                    console.warn("Error parsing LLM JSON, using fallback for parsedInterest:", parsedInterest);
                }
            } else {
                console.warn("Gemini parsing did not return expected structure or content.");
                parsedInterest.field_of_study = interest;
                parsedInterest.keywords = interest.toLowerCase().split(" ").filter(k => k.length > 2 && k.length < 25);
                console.warn("LLM response malformed, using fallback for parsedInterest:", parsedInterest);
            }
        }

        parsedInterest.keywords = Array.isArray(parsedInterest.keywords) ? parsedInterest.keywords.map((kw: any) => String(kw).trim()).filter(Boolean) : [];

        if (parsedInterest.field_of_study && typeof parsedInterest.field_of_study === 'string') {
            const fieldStudyKeywords = parsedInterest.field_of_study.toLowerCase().split(" ").filter((k: string) => k.length > 2 && k.length < 25);
            parsedInterest.keywords = [...new Set([...parsedInterest.keywords, ...fieldStudyKeywords])];
        } else if (parsedInterest.keywords.length === 0 && interest) {
            parsedInterest.keywords = interest.toLowerCase().split(" ").filter(k => k.length > 2 && k.length < 25);
            if (!parsedInterest.field_of_study) parsedInterest.field_of_study = interest;
        }

        debugInfo.parsedInterest = parsedInterest;
        console.log("Final Parsed Interest for DB Query:", parsedInterest);

        // --- Step 2: Find Matching Courses from Your Database ---
        // IMPORTANT: Using Italian field names based on user's example document for querying
        const queryConditions: any = {};
        const orConditions = [];

        const createRegex = (term: string) => {
            const trimmedTerm = term.trim();
            if (!trimmedTerm) return null;
            return new RegExp(trimmedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        };

        const fieldOfStudyTerm = parsedInterest.field_of_study;
        if (fieldOfStudyTerm && typeof fieldOfStudyTerm === 'string' && fieldOfStudyTerm.trim() !== '') {
            const fieldRegex = createRegex(fieldOfStudyTerm);
            if (fieldRegex) {
                orConditions.push({ nome: fieldRegex }); // Italian field for title
                orConditions.push({ descrizione: fieldRegex }); // Assuming 'descrizione' for description
                // Add other relevant Italian fields if they exist and should be searched for field_of_study
                // e.g., if you have 'tags_italiano' or 'curriculum_italiano'
            }
        }

        if (parsedInterest.keywords && Array.isArray(parsedInterest.keywords)) {
            parsedInterest.keywords.forEach((keyword: any) => {
                if (typeof keyword === 'string' && keyword.trim() !== '') {
                    const keywordRegex = createRegex(keyword);
                    if (keywordRegex) {
                        if (!fieldOfStudyTerm || keyword.toLowerCase() !== fieldOfStudyTerm.toLowerCase()) {
                            orConditions.push({ nome: keywordRegex });
                            orConditions.push({ descrizione: keywordRegex });
                            // Add other relevant Italian fields for keywords
                        }
                    }
                }
            });
        }

        if (orConditions.length > 0) {
            queryConditions.$or = orConditions.filter(cond => cond !== null);
        } else if (interest.trim() !== '') {
            const interestRegex = createRegex(interest);
            if (interestRegex) {
                queryConditions.$or = [
                    { nome: interestRegex },
                    { descrizione: interestRegex },
                ];
            }
        }

        if (!queryConditions.$or || queryConditions.$or.length === 0) {
            console.warn("No valid $or search terms derived. Returning no results.");
            debugInfo.queryConditions = queryConditions;
            debugInfo.foundCoursesCount = 0;
            return NextResponse.json({ matchedCourses: [], aiGeneralAdvice: "Please provide more specific study interests.", error: false, debug: debugInfo });
        }

        const degreeLevelTerm = parsedInterest.degree_level;
        if (degreeLevelTerm && typeof degreeLevelTerm === 'string' && degreeLevelTerm.trim() !== '') {
            const degreeRegex = createRegex(degreeLevelTerm);
            if (degreeRegex) queryConditions.tipo = degreeRegex; // Italian field for degree type
        }

        const languagePreferenceTerm = parsedInterest.language_preference;
        if (languagePreferenceTerm && typeof languagePreferenceTerm === 'string' && languagePreferenceTerm.trim() !== '') {
            const langRegex = createRegex(languagePreferenceTerm);
            // The example 'lingua: "Più lingue"' needs careful handling.
            // A simple regex might not work well. If user searches "English", it won't match "Più lingue".
            // This might require more complex logic or better data in the 'lingua' field (e.g., an array).
            // For now, a direct regex match:
            if (langRegex) queryConditions.lingua = langRegex; // Italian field for language
        }

        const specificUniversityTerm = parsedInterest.specific_university_mentioned;
        if (specificUniversityTerm && typeof specificUniversityTerm === 'string' && specificUniversityTerm.trim() !== '') {
            const uniNameRegex = createRegex(specificUniversityTerm);
            if (uniNameRegex) {
                // Querying the 'uni' string field directly, as per example document
                queryConditions.uni = uniNameRegex;
            }
        }

        if (parsedInterest.location_preferences && Array.isArray(parsedInterest.location_preferences) && parsedInterest.location_preferences.length > 0) {
            const locationRegexes = parsedInterest.location_preferences
                .map((loc: string) => (typeof loc === 'string' && loc.trim() !== '') ? createRegex(loc) : null)
                .filter(Boolean);
            if (locationRegexes.length > 0) {
                queryConditions.comune = { $in: locationRegexes }; // Italian field for city/municipality
            }
        }

        debugInfo.queryConditions = queryConditions;
        console.log("Final MongoDB Query Conditions (using Italian fields):", JSON.stringify(queryConditions, null, 2));

        const dbQueryStartTime = Date.now();
        // Note: .populate() might not be relevant if 'uni' is a string and not an ObjectId ref.
        // If your Course.js schema (with English fields and ObjectId ref for university) is what you *want* to use,
        // then your data import/structure needs to align with that schema.
        // This query now assumes the schema of the *example document* you provided.
        const foundCourses = await Course.find(queryConditions)
            // .populate({ path: 'university', select: 'name officialName city' }) // This would fail if 'university' field doesn't exist or 'uni' is string
            .limit(5)
            .lean();
        debugInfo.dbQueryDurationMs = Date.now() - dbQueryStartTime;
        debugInfo.foundCoursesCount = foundCourses.length;

        console.log(`Found ${foundCourses.length} courses from DB with current query.`);
        if (foundCourses.length === 0) {
            console.log("No courses found. Check MongoDB query and database content for matches with (Italian fields):", queryConditions);
        }

        let processedCourses: any[] = [];
        const llmSummarizationStartTime = Date.now();

        for (const dbCourse of foundCourses) {
            // Map Italian field names from dbCourse to English field names for courseInfoForLLM
            const courseInfoForLLM = `
            Course Title: ${dbCourse.nome || 'N/A'} 
            University: ${dbCourse.uni || 'N/A'}
            City: ${dbCourse.comune || 'N/A'}
            Description: ${dbCourse.descrizione || dbCourse.nome || 'N/A'} 
            Language: ${dbCourse.lingua || 'N/A'}
            Degree Level: ${dbCourse.tipo || 'N/A'}
            Entry Requirements: ${dbCourse.accesso || 'N/A'} 
            Course Link: ${dbCourse.link || 'N/A'}
            Area Code: ${dbCourse.area || 'N/A'} 
            User's Original Interest: "${interest}"
        `;
            // Note: 'descrizione', 'curriculum', 'careerOpportunities', 'tuitionFee', 'duration', 'startDate', 'applicationDeadline', 'tags'
            // are not in the example document. If they exist in your actual DB docs with Italian names, add them here.

            const summarizePayload = {
                contents: [{ role: "user", parts: [{ text: `Based on the user's original interest and the following course details (which might be in Italian), provide a structured JSON summary IN ENGLISH. User interest: "${interest}". Course details: ${courseInfoForLLM}` }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: courseSummarySchema,
                    temperature: 0.3,
                }
            };

            const summarizeApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const summarizeResponse = await fetch(summarizeApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(summarizePayload)
            });

            let aiGeneratedSummaries = {
                aiSummary: "AI summary could not be generated.",
                curriculumSummary: "Details not specified.",
                keyEntryRequirements: dbCourse.accesso || "Details not specified.",
                careerProspectsHighlight: "Details not specified."
            };

            if (summarizeResponse.ok) {
                const summarizeResult = await summarizeResponse.json();
                if (summarizeResult.candidates && summarizeResult.candidates[0]?.content?.parts[0]?.text) {
                    try {
                        const parsedSummary = JSON.parse(summarizeResult.candidates[0].content.parts[0].text);
                        aiGeneratedSummaries = { ...aiGeneratedSummaries, ...parsedSummary };
                    } catch (e) {
                        console.error(`Error parsing Gemini JSON for course summary ${dbCourse.nome}:`, e, summarizeResult.candidates[0].content.parts[0].text);
                        aiGeneratedSummaries.aiSummary = (summarizeResult.candidates[0].content.parts[0].text || "Error in summary generation.").substring(0, 500);
                    }
                } else {
                    console.warn(`Gemini summarization (ok response) did not return expected structure for ${dbCourse.nome}:`, summarizeResult);
                }
            } else {
                const errorText = await summarizeResponse.text();
                console.error(`Gemini summarization API error for ${dbCourse.nome}: ${summarizeResponse.status} ${errorText.substring(0, 300)}`);
            }

            // Map from dbCourse (Italian fields) to frontend Course interface (English fields)
            processedCourses.push({
                _id: String(dbCourse._id),
                title: dbCourse.nome || "Title not available",
                universityName: dbCourse.uni || "University not available",
                description: dbCourse.descrizione || aiGeneratedSummaries.aiSummary, // Fallback to AI summary if no descrizione
                url: dbCourse.link,
                language: dbCourse.lingua || "Language not specified",
                degreeLevel: dbCourse.tipo || "Degree level not specified",
                tuitionFee: dbCourse.tasse_iscrizione, // Assuming Italian field name if it exists
                duration: dbCourse.durata, // Assuming Italian field name
                applicationDeadline: dbCourse.scadenza_iscrizione, // Assuming Italian field name
                startDate: dbCourse.data_inizio, // Assuming Italian field name
                entryRequirements: aiGeneratedSummaries.keyEntryRequirements,
                curriculumSummary: aiGeneratedSummaries.curriculumSummary,
                careerOpportunities: aiGeneratedSummaries.careerProspectsHighlight,
                city: dbCourse.comune || "City not available",
                aiSummary: aiGeneratedSummaries.aiSummary,
            });
        }
        debugInfo.llmSummarizationTotalDurationMs = Date.now() - llmSummarizationStartTime;

        let aiGeneralAdvice = `Found ${processedCourses.length} course(s) based on your interest. Review their details carefully.`;
        if (processedCourses.length === 0) {
            aiGeneralAdvice = `Sorry, I couldn't find any direct matches for "${interest}" with the current filters. Your database might use different terms or structures than expected. The AI parsed your interest as: ${JSON.stringify(parsedInterest, null, 2)}. The query attempted was (approximate): ${JSON.stringify(queryConditions, null, 2).substring(0, 200)}...`;
        }

        debugInfo.totalApiDurationMs = Date.now() - startTime;
        console.log("Returning response to client. Number of courses:", processedCourses.length, "Total API duration:", debugInfo.totalApiDurationMs, "ms");
        return NextResponse.json({ matchedCourses: processedCourses, aiGeneralAdvice, error: false, debug: debugInfo });

    } catch (error: any) {
        console.error('--- Critical API Error in AI Course Advisor ---:', error);
        const errorMessage = error.message || 'Internal Server Error';
        const errorStatus = error.status || 500;
        debugInfo.criticalError = errorMessage;
        debugInfo.totalApiDurationMs = Date.now() - startTime;
        return NextResponse.json({ message: `Critical error: ${errorMessage.substring(0, 200)}`, error: true, debug: debugInfo }, { status: errorStatus });
    }
}
