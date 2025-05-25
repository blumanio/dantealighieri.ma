// client/lib/utils/deadlineUtils.ts
import mongoose from 'mongoose';
import type { ICourse } from '@/lib/models/Course'; // Adjust path as necessary
import { italianUniversities, parseDeadlineDateString } from '@/lib/data'; // Adjust path as necessary

// Define PopulatedCourse type based on ICourse and selected fields
// This type is used by both API routes when populating course details.
export type PopulatedCourse = Omit<ICourse, '_id' | 'createdAt' | 'updatedAt' | 'deadlines'> & {
    _id: mongoose.Types.ObjectId;
    uni?: string;
    comune?: string;
    academicYear?: string;
    nome?: string;
    tipo?: string;
    intake?: string;
    link?: string;
    area?: string;
    lingua?: string;
    trackedCount?: number; // Ensure this is part of the type if selected during population
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
            date: new Date(yearForMock, today.getUTCMonth() + 1, 15, 23, 59, 59).toISOString(), // Next month, 15th
            startDate: new Date(yearForMock, today.getUTCMonth(), 1, 0, 0, 0).toISOString(), // This month, 1st
            description: "This is a sample application deadline (mock data). Please verify on the official university page.",
            isRollingAdmission: false,
            relatedLink: "#mock-application",
            _id: `mock-app-${MOCK_DEADLINE_ID_COUNTER.count++}`,
            isNearest: true,
            totalUpcomingIntakesCount: 2, // Example count
            source: "mock"
        },
        {
            deadlineType: `Mock Scholarship: ${courseName || 'Course'}`,
            date: new Date(yearForMock, today.getUTCMonth() + 3, 1, 23, 59, 59).toISOString(), // In 3 months, 1st
            startDate: null,
            description: "Sample scholarship deadline (mock data). Check official sources.",
            isRollingAdmission: false,
            relatedLink: "#mock-scholarship",
            _id: `mock-schol-${MOCK_DEADLINE_ID_COUNTER.count++}`,
            isNearest: false,
            totalUpcomingIntakesCount: 2, // Example count
            source: "mock"
        }
    ];
}

/**
 * Finds a university in the local italianUniversities data.
 * Uses a multi-step matching strategy.
 */
export function findUniversityInLocalData(courseUniName?: string, courseComune?: string): typeof italianUniversities[0] | undefined {
    if (!courseUniName && !courseComune) {
        console.log("[Util Matcher] No university name or comune provided for matching.");
        return undefined;
    }

    const nameLower = courseUniName?.toLowerCase().trim();
    const comuneLower = courseComune?.toLowerCase().trim();
    // Consider making knownCities part of italianUniversities data or a separate shared constant
    const knownCities = ["milan", "milano", "rome", "roma", "bologna", "florence", "firenze", "turin", "torino", "naples", "napoli", "pisa", "padua", "padova", "genoa", "genova", "venice", "venezia", "trento", "trieste", "palermo", "bari", "macerata", "camerino", "l'aquila", "ancona", "ferrara", "parma", "siena", "bergamo"];

    console.log(`[Util Matcher] Attempting to match: DB Uni Name (course.uni) = "${nameLower}", DB Comune = "${comuneLower}"`);

    if (nameLower) {
        let found = italianUniversities.find(uni => uni.name.toLowerCase().trim() === nameLower);
        if (found) {
            console.log(`[Util Matcher] SUCCESS: Matched (exact) "${courseUniName}" with "${found.name}"`);
            return found;
        }
        found = italianUniversities.find(uni => uni.name.toLowerCase().trim().includes(nameLower));
        if (found) {
            console.log(`[Util Matcher] SUCCESS: Matched (DB name part of official) "${courseUniName}" in "${found.name}"`);
            return found;
        }
        found = italianUniversities.find(uni => nameLower.includes(uni.name.toLowerCase().trim()));
        if (found) {
            console.log(`[Util Matcher] SUCCESS: Matched (Official name part of DB name) "${found.name}" in "${courseUniName}"`);
            return found;
        }
    }

    const cityToSearchFor = comuneLower || (nameLower && knownCities.includes(nameLower) ? nameLower : undefined);
    
    if (cityToSearchFor && knownCities.includes(cityToSearchFor)) {
        console.log(`[Util Matcher] Trying city-based match with city: "${cityToSearchFor}"`);
        const cityMatches = italianUniversities.filter(uni => 
            uni.location.toLowerCase().includes(cityToSearchFor)
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
            console.log(`[Util Matcher] Ambiguous city match for "${cityToSearchFor}". Could not disambiguate using "${nameLower}". Returning first city match as fallback or undefined if stricter match needed.`);
            // return cityMatches[0]; // Optionally return the first match if ambiguity is acceptable for some cases
        }
    }

    console.log(`[Util Matcher] No definitive match found for course.uni: "${courseUniName}" and course.comune: "${courseComune}"`);
    return undefined;
}

/**
 * Retrieves or generates university deadlines for a given course.
 * Uses local university data and falls back to mock deadlines.
 */
export function getUniversityDeadlinesForCourse(course?: PopulatedCourse | null) {
    let deadlines: Array<{
        deadlineType: string; date: string | null; startDate: string | null;
        description: string; isRollingAdmission?: boolean; relatedLink?: string; _id: string;
        isNearest?: boolean; totalUpcomingIntakesCount?: number; source: 'real' | 'mock';
    }> = [];

    const currentYear = new Date().getFullYear();
    let referenceYearForMock = currentYear; // Default mock year to current year

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

    const universityData = findUniversityInLocalData(course.uni, course.comune);
    
    if (universityData && universityData.intakes && universityData.intakes.length > 0) {
        let relevantYearStartForParsing: number = currentYear; // Default parsing year
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
                const parsedEndDate = parseDeadlineDateString(intake.end_date, relevantYearStartForParsing);
                const parsedStartDate = parseDeadlineDateString(intake.start_date, relevantYearStartForParsing);
                
                if (!parsedEndDate) {
                    console.log(`[Util GetDeadlines] Could not parse end_date "${intake.end_date}" for intake "${intake.name || `Intake ${index+1}`}" of uni "${universityData.name}" with yearStart ${relevantYearStartForParsing}. Skipping.`);
                    return null;
                }

                return {
                    deadlineType: intake.name || `Intake ${index + 1}`,
                    date: parsedEndDate.toISOString(),
                    dateObj: parsedEndDate, 
                    startDate: parsedStartDate ? parsedStartDate.toISOString() : null,
                    description: String(intake.notes || ''), 
                    isRollingAdmission: (!intake.start_date && !intake.end_date && !(intake.name||"").toLowerCase().includes("deadline")),
                    relatedLink: universityData.application_link || undefined,
                    _id: `${universityData.id}-intake-${index}-${(intake.name || 'general').replace(/\s+/g, '_').slice(0,20)}`, // Ensure ID uniqueness
                    source: 'real' as const
                };
            })
            .filter(d => d !== null) as Array<any & { dateObj: Date }>; // Type assertion after filtering nulls

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Normalize today to start of day for comparison
        
        let upcomingIntakes = processedIntakes.filter(d => d.dateObj >= today);

        if (upcomingIntakes.length > 0) {
            upcomingIntakes.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
            
            deadlines = upcomingIntakes.map((intake, idx) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { dateObj, ...rest } = intake; // Exclude dateObj from final deadline object
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