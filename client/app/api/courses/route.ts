// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Adjust path if you placed dbConnect elsewhere
import Course from '@/lib/models/Course';   // Adjust path to your Course model

export async function GET(request: NextRequest) {
    const requestUrl = request.url; // For logging
    console.log(`[API/COURSES] GET request received for ${requestUrl}`);
    
    try {
        await dbConnect(); // Ensure DB is connected

        const { searchParams } = new URL(requestUrl);
        const tipo = searchParams.get('tipo');
        const accesso = searchParams.get('accesso');
        const lingua = searchParams.get('lingua');
        const area = searchParams.get('area');
        // const lang = searchParams.get('lang'); // If you need to filter by general request language

        let query: any = {};

        if (tipo) query.tipo = tipo;
        if (lingua) query.lingua = lingua;
        if (area) query.area = area;
        if (accesso) query.accesso = accesso;
        // if (lang) query.someLangFieldInDb = lang;

        console.log("[API/COURSES] Executing Course.find with query:", query);

        const courses = await Course.find(query).lean();
        console.log(`[API/COURSES] Found ${courses.length} courses`);

        return NextResponse.json(courses, { status: 200 });

    } catch (err: any) {
        console.error(`[API/COURSES] Error fetching courses for URL ${requestUrl}:`, err);
        return NextResponse.json(
            { message: "Failed to fetch courses", error: err.message },
            { status: 500 }
        );
    }
}