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
        const areaParam = searchParams.get('area');
        const uniSlugParam = searchParams.get('uniSlug');
        const uni = searchParams.get('uni');

        let query: any = {};

        if (tipo) query.tipo = tipo;
        if (lingua) query.lingua = lingua;
        if (accesso) query.accesso = accesso;
        if (uni) query.uni = uni;

        // Handle single or multiple areas
        if (areaParam) {
            if (areaParam.includes(',')) {
                // Multiple areas: split by comma and use $in operator
                const areas = areaParam.split(',').map(area => area.trim());
                query.area = { $in: areas };
                console.log(`[API/COURSES] Filtering by multiple areas: [${areas.join(', ')}]`);
            } else {
                // Single area
                query.area = areaParam.trim();
                console.log(`[API/COURSES] Filtering by single area: "${areaParam}"`);
            }
        }
        
        if (uniSlugParam) {
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