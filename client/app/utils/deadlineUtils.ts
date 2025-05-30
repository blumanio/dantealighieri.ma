// client/lib/utils/deadlineUtils.ts
import mongoose from 'mongoose';
import type { IUniversity } from '@/lib/models/University'; // Assuming this is your API's university type
import { parseDeadlineDateString } from '@/lib/data'; // Adjust path as necessary

// Define PopulatedCourse type based on Course and selected fields
// This type is used by both API routes when populating course details.
import { Course } from '@/types/types';
export type PopulatedCourse = Omit<Course, '_id' | 'createdAt' | 'updatedAt' | 'deadlines'> & {
    _id: mongoose.Types.ObjectId;
    uni?: string;          // University name as potentially stored in the course
    comune?: string;       // Comune/City as potentially stored in the course
    academicYear?: string;
    nome?: string;         // Course name
    tipo?: string;
    intake?: string;
    link?: string;
    area?: string;
    lingua?: string;
    trackedCount?: number;
};

// This will be the type for university data fetched from your API
// Ensure it aligns with your actual IUniversity model structure for the fields used.
type ApiUniversity = Pick<IUniversity, '_id' | 'name' | 'city' | 'intakes' | 'application_link'> & {
    // Add any other fields from IUniversity if they are used by the matching or deadline processing logic
    // For example, if 'status' or 'scholarship_available' were used for filtering/logic.
    region?: string; // Add region as optional if you still want to use it in your logic
};

const MOCK_DEADLINE_ID_COUNTER = { count: 0 };

/**
 * Creates mock deadlines for a course.
 * @param courseName - Optional name of the course for customizing mock data.
 * @param referenceYear - The year to use for mock deadlines, defaults to current year.
 * @returns An array of mock deadline objects.
 */
export function createMockDeadlines(courseName?: string, referenceYear?: number): any[] {
    const today = new Date();
    MOCK_DEADLINE_ID_COUNTER.count = 0; // Reset counter for each call
    const yearForMock = referenceYear || today.getFullYear();

    console.log(`[Util Mock] Creating mock deadlines for "${courseName || 'Tracked Course'}" for year ${yearForMock}`);
    return [
        {
            deadlineType: `Mock Application: ${courseName || 'Course'}`,
            date: new Date(yearForMock, today.getUTCMonth() + 1, 15, 23, 59, 59).toISOString(),
            startDate: new Date(yearForMock, today.getUTCMonth(), 1, 0, 0, 0).toISOString(),
            description: "This is a sample application deadline (mock data). Please verify on the official university page.",
            isRollingAdmission: false,
            relatedLink: "#mock-application",
            _id: `mock-app-${MOCK_DEADLINE_ID_COUNTER.count++}`,
            isNearest: true,
            totalUpcomingIntakesCount: 2,
            source: "mock"
        },
        {
            deadlineType: `Mock Scholarship: ${courseName || 'Course'}`,
            date: new Date(yearForMock, today.getUTCMonth() + 3, 1, 23, 59, 59).toISOString(),
            startDate: null,
            description: "Sample scholarship deadline (mock data). Check official sources.",
            isRollingAdmission: false,
            relatedLink: "#mock-scholarship",
            _id: `mock-schol-${MOCK_DEADLINE_ID_COUNTER.count++}`,
            isNearest: false,
            totalUpcomingIntakesCount: 2,
            source: "mock"
        }
    ];
}

/**
 * Fetches universities from the API.
 * @param queryParams - URL query parameters string.
 * @returns A promise that resolves to an array of ApiUniversity objects.
 */
async function fetchUniversitiesFromApi(queryParams: string = ''): Promise<ApiUniversity[]> {
    const GUEST_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''; // Use environment variable
    const url = `${GUEST_API_BASE_URL}/api/universities?${queryParams}`;
    console.log(`[API Fetch] Fetching universities from: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`[API Fetch] Error fetching universities: ${response.status} ${response.statusText}`);
            return [];
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
            // Ensure the data matches the ApiUniversity structure, especially _id
            return result.data.map((uni: any) => ({
                ...uni,
                _id: uni._id.toString() // Ensure _id is a string for consistency if needed
            })) as ApiUniversity[];
        }
        if (result.success && result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
            return [{ ...result.data, _id: result.data._id.toString() }] as ApiUniversity[];
        }
        console.warn('[API Fetch] Universities data not found or in unexpected format:', result);
        return [];
    } catch (error) {
        console.error('[API Fetch] Exception fetching universities:', error);
        return [];
    }
}

/**
 * Finds the best university match from a list based on course name and comune.
 * This function contains the core matching logic, adapted for ApiUniversity type.
 */
function findBestMatchFromList(
    universities: ApiUniversity[],
    courseUniName?: string,
    courseComune?: string
): ApiUniversity | undefined {
    if (!courseUniName && !courseComune) {
        console.log("[Util Matcher] No university name or comune provided for matching.");
        return undefined;
    }

    const nameLower = courseUniName?.toLowerCase().trim();
    const comuneLower = courseComune?.toLowerCase().trim();
    // Consider making knownCities part of a shared constant if used elsewhere
    const knownCities = ["milan", "milano", "rome", "roma", "bologna", "florence", "firenze", "turin", "torino", "naples", "napoli", "pisa", "padua", "padova", "genoa", "genova", "venice", "venezia", "trento", "trieste", "palermo", "bari", "macerata", "camerino", "l'aquila", "ancona", "ferrara", "parma", "siena", "bergamo"];

    console.log(`[Util Matcher] Attempting to match from API list: DB Uni Name (course.uni) = "${nameLower}", DB Comune = "${comuneLower}"`);

    if (nameLower) {
        let found = universities.find(uni => uni.name.toLowerCase().trim() === nameLower);
        if (found) {
            console.log(`[Util Matcher] SUCCESS: Matched (exact) "${courseUniName}" with "${found.name}"`);
            return found;
        }
        found = universities.find(uni => uni.name.toLowerCase().trim().includes(nameLower));
        if (found) {
            console.log(`[Util Matcher] SUCCESS: Matched (DB name part of official) "${courseUniName}" in "${found.name}"`);
            return found;
        }
        found = universities.find(uni => nameLower.includes(uni.name.toLowerCase().trim()));
        if (found) {
            console.log(`[Util Matcher] SUCCESS: Matched (Official name part of DB name) "${found.name}" in "${courseUniName}"`);
            return found;
        }
    }

    // City matching using 'city' or 'region' fields from ApiUniversity
    const cityToSearchFor = comuneLower || (nameLower && knownCities.includes(nameLower) ? nameLower : undefined);

    if (cityToSearchFor && knownCities.includes(cityToSearchFor)) {
        console.log(`[Util Matcher] Trying city-based match with city: "${cityToSearchFor}"`);
        const cityMatches = universities.filter(uni =>
            (uni.city && uni.city.toLowerCase().includes(cityToSearchFor)) ||
            (uni.region && uni.region.toLowerCase().includes(cityToSearchFor))
        );

        if (cityMatches.length === 1) {
            console.log(`[Util Matcher] SUCCESS: Matched (unique by city) "${cityMatches[0].name}" for city "${cityToSearchFor}"`);
            return cityMatches[0];
        } else if (cityMatches.length > 1) {
            console.log(`[Util Matcher] Found ${cityMatches.length} universities in city "${cityToSearchFor}". Trying to disambiguate with course.uni: "${nameLower}"`);
            if (nameLower) {
                const specificMatchInCity = cityMatches.find(uni =>
                    uni.name.toLowerCase().includes(nameLower)
                );
                if (specificMatchInCity) {
                    console.log(`[Util Matcher] SUCCESS: Matched (disambiguated by course.uni in city) "${specificMatchInCity.name}"`);
                    return specificMatchInCity;
                }
            }
            console.log(`[Util Matcher] Ambiguous city match for "${cityToSearchFor}". Could not disambiguate using "${nameLower}".`);
            // Consider returning the first match or undefined based on desired strictness
            // return cityMatches[0]; 
        }
    }

    console.log(`[Util Matcher] No definitive match found from API list for course.uni: "${courseUniName}" and course.comune: "${courseComune}"`);
    return undefined;
}

/**
 * Finds a university by attempting to fetch from API and then matching.
 */
async function findUniversityViaApi(courseUniName?: string, courseComune?: string): Promise<ApiUniversity | undefined> {
    if (!courseUniName && !courseComune) {
        console.log("[Util FindAPI] No course university name or comune provided.");
        return undefined;
    }

    let queryParams = '';
    let fetchedUniversities: ApiUniversity[] = [];

    // Strategy:
    // 1. Try specific search by name and city if both provided
    // 2. Try search by name if only name provided
    // 3. Try search by city if only city provided
    // 4. If multiple results, apply further client-side matching logic

    if (courseUniName && courseComune) {
        queryParams = `search=${encodeURIComponent(courseUniName)}&city=${encodeURIComponent(courseComune)}&limit=10`;
    } else if (courseUniName) {
        queryParams = `search=${encodeURIComponent(courseUniName)}&limit=10`;
    } else if (courseComune) {
        queryParams = `city=${encodeURIComponent(courseComune)}&limit=20`; // City might return more, allow more for local filtering
    } else {
        return undefined; // Should not happen due to initial check
    }

    fetchedUniversities = await fetchUniversitiesFromApi(queryParams);

    if (fetchedUniversities.length === 0 && courseUniName && courseComune) {
        // Fallback: if combined search failed, try only by name if city was too restrictive
        console.log(`[Util FindAPI] Combined search yielded no results. Fallback to search by name only: "${courseUniName}"`);
        queryParams = `search=${encodeURIComponent(courseUniName)}&limit=10`;
        fetchedUniversities = await fetchUniversitiesFromApi(queryParams);
    }

    if (fetchedUniversities.length === 0 && courseUniName && courseComune) {
        // Fallback: if name search also failed, try only by city
        console.log(`[Util FindAPI] Name search yielded no results. Fallback to search by city only: "${courseComune}"`);
        queryParams = `city=${encodeURIComponent(courseComune)}&limit=20`;
        fetchedUniversities = await fetchUniversitiesFromApi(queryParams);
    }

    if (fetchedUniversities.length === 0) {
        console.log(`[Util FindAPI] No universities fetched from API with current strategy for: name="${courseUniName}", comune="${courseComune}"`);
        return undefined;
    }

    if (fetchedUniversities.length === 1) {
        console.log(`[Util FindAPI] Found 1 direct match from API: ${fetchedUniversities[0].name}`);
        return fetchedUniversities[0];
    }

    // If API returned multiple candidates, use the detailed matching logic
    console.log(`[Util FindAPI] API returned ${fetchedUniversities.length} candidates. Applying detailed matching...`);
    return findBestMatchFromList(fetchedUniversities, courseUniName, courseComune);
}

/**
 * Retrieves or generates university deadlines for a given course.
 * Now uses the API to find university data.
 */
export async function getUniversityDeadlinesForCourse(course?: PopulatedCourse | null): Promise<any[]> {
    let deadlines: Array<{
        deadlineType: string; date: string | null; startDate: string | null;
        description: string; isRollingAdmission?: boolean; relatedLink?: string; _id: string;
        isNearest?: boolean; totalUpcomingIntakesCount?: number; source: 'real' | 'mock';
    }> = [];

    const currentYear = new Date().getFullYear();
    let referenceYearForMock = currentYear;

    if (course?.academicYear) {
        const yearMatch = course.academicYear.match(/^(\d{4})/);
        if (yearMatch && yearMatch[1]) {
            referenceYearForMock = parseInt(yearMatch[1], 10);
        }
    }

    if (!course || (!course.uni && !course.comune)) {
        console.log("[Util GetDeadlines] No course data or (uni and comune) for lookup, returning mock.");
        return createMockDeadlines(course?.nome, referenceYearForMock);
    }

    // Fetch university data using the API
    const universityData = await findUniversityViaApi(course.uni, course.comune);

    if (universityData && universityData.intakes && universityData.intakes.length > 0) {
        let relevantYearStartForParsing: number = currentYear;
        if (course.academicYear) {
            const yearMatch = course.academicYear.match(/^(\d{4})/);
            if (yearMatch && yearMatch[1]) {
                relevantYearStartForParsing = parseInt(yearMatch[1], 10);
            } else {
                console.warn(`[Util GetDeadlines] Course "${course.nome}" academicYear "${course.academicYear}" is unparsable. Using ${relevantYearStartForParsing} for deadline parsing.`);
            }
        } else {
            console.warn(`[Util GetDeadlines] Course "${course.nome}" (Uni: "${course.uni}") has no academicYear. Defaulting to ${relevantYearStartForParsing} for deadline parsing.`);
        }

        let processedIntakes = universityData.intakes
            .map((intake, index) => {
                const endDateStr = typeof intake.end_date === 'string' ? intake.end_date : "";
                const parsedEndDate = parseDeadlineDateString(endDateStr, relevantYearStartForParsing); // Provide default empty string if undefined
                const parsedStartDate = (typeof intake.start_date === 'string' && intake.start_date)
                    ? parseDeadlineDateString(intake.start_date, relevantYearStartForParsing)
                    : null;

                if (!parsedEndDate) {
                    console.log(`[Util GetDeadlines] Could not parse end_date "${intake.end_date}" for intake "${intake.name || `Intake ${index + 1}`}" of uni "${universityData.name}" with yearStart ${relevantYearStartForParsing}. Skipping.`);
                    return null;
                }

                return {
                    deadlineType: intake.name || `Intake ${index + 1}`,
                    date: parsedEndDate.toISOString(),
                    dateObj: parsedEndDate,
                    startDate: parsedStartDate ? parsedStartDate.toISOString() : null,
                    description: String(intake.notes || ''),
                    isRollingAdmission: (!intake.start_date && !intake.end_date && !(intake.name || "").toLowerCase().includes("deadline")),
                    relatedLink: universityData.application_link || undefined, // Use application_link consistently
                    _id: `${universityData._id}-intake-${index}-${(intake.name || 'general').replace(/\s+/g, '_').slice(0, 20)}`, // Use uni._id
                    source: 'real' as const
                };
            })
            .filter(d => d !== null) as Array<any & { dateObj: Date }>;

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let upcomingIntakes = processedIntakes.filter(d => d.dateObj >= today);

        if (upcomingIntakes.length > 0) {
            upcomingIntakes.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

            deadlines = upcomingIntakes.map((intake, idx) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { dateObj, ...rest } = intake;
                return { ...rest, isNearest: idx === 0, totalUpcomingIntakesCount: upcomingIntakes.length };
            });
        }

        console.log(`[Util GetDeadlines] Processed ${deadlines.length} upcoming real deadlines for course "${course.nome}" (Uni: ${course.uni}, Matched Uni: ${universityData.name}).`);
    }

    if (deadlines.length === 0) {
        console.log(`[Util GetDeadlines] No real upcoming deadlines found for course "${course.nome}" (Uni: "${course.uni}", Matched Uni: ${universityData ? universityData.name : 'None'}). Creating mock deadlines.`);
        return createMockDeadlines(course.nome, referenceYearForMock);
    }
    return deadlines;
}