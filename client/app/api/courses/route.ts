// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Course from '@/lib/models/Course';

export async function GET(request: NextRequest) {
    const requestUrl = request.url; 
    console.log(`[API/COURSES] GET request received for ${requestUrl}`);
    
    try {
        await dbConnect(); 

        const { searchParams } = new URL(requestUrl);
        const tipo = searchParams.get('tipo');
        const accesso = searchParams.get('accesso');
        const lingua = searchParams.get('lingua');
        const area = searchParams.get('area');
        const uniSlugParam = searchParams.get('uniSlug'); // EXPECTING uniSlug
        const uni = searchParams.get('uni'); // EXPECTING uniSlug


        let query: any = {};

        if (tipo) query.tipo = tipo;
        if (lingua) query.lingua = lingua;
        if (area) query.area = area;
        if (accesso) query.accesso = accesso;
        if (uni) query.uni = uni;

        
        if (uniSlugParam) {
            // Query directly against the uniSlug field.
            // Slugs should be stored consistently (e.g., lowercase).
            query.uniSlug = uniSlugParam.toLowerCase(); 
            console.log(`[API/COURSES] Filtering by university slug: "${uniSlugParam}"`);
        } else {
            console.log(`[API/COURSES] No uniSlug provided, fetching all courses (or based on other filters).`);
        }

        console.log("[API/COURSES] Executing Course.find with query:", JSON.stringify(query));

        const courses = await Course.find(query).lean();
        console.log(`[API/COURSES] Found ${courses.length} courses for query.`);

        return NextResponse.json(courses, { status: 200 });

    } catch (err: any) {
        console.error(`[API/COURSES] Error fetching courses for URL ${requestUrl}:`, err);
        return NextResponse.json(
            { message: "Failed to fetch courses", error: err.message },
            { status: 500 }
        );
    }
}