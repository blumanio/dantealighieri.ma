// client/app/api/test-courses/route.js

import dbConnect from '@/lib/dbConnect'; // Assuming your dbConnect is in client/lib/
import Course from '@/lib/models/Course';   // Assuming your Course model is in client/lib/models/
import { NextResponse } from 'next/server';

export async function GET(request) {
  // You can add a specific log to confirm this test endpoint is hit
  console.log(`Next.js TEST API route handler called for /api/test-courses`);

  try {
    // Connect to the database
    await dbConnect();
    console.log("Database connected for GET /api/test-courses");

    // Get search parameters from the request URL
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const accesso = searchParams.get('accesso');
    const lingua = searchParams.get('lingua');
    const area = searchParams.get('area');

    let query = {};

    // Build the query object based on provided query parameters
    if (tipo) {
      console.log("Filtering by tipo:", tipo);
      query.tipo = tipo;
    }
    if (lingua) {
      console.log("Filtering by lingua:", lingua);
      query.lingua = lingua;
    }
    if (area) {
      console.log("Filtering by area:", area);
      query.area = area;
    }
    if (accesso) {
      console.log("Filtering by accesso:", accesso);
      query.accesso = accesso;
    }

    console.log("Executing Course.find with query for /api/test-courses:", query);

    // Fetch courses from the database using the Mongoose model
    const courses = await Course.find(query).lean();
    console.log(`Found ${courses.length} courses for /api/test-courses`);

    // Send the courses back as JSON
    return NextResponse.json(courses, { status: 200 });

  } catch (err) {
    console.error("Error fetching courses in Next.js API route /api/test-courses:", err);
    return NextResponse.json(
      { message: "Failed to fetch courses (test endpoint)", error: err.message },
      { status: 500 }
    );
  }
}

// If you plan to test POST, PUT, DELETE for courses, you can add those handlers here as well.
// export async function POST(request) { /* ... */ }