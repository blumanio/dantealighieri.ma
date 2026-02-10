// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import dbConnect from '@/lib/dbConnect';
// import Community from '@/lib/models/Community';
// import { COUNTRIES } from '@/constants/countries';
// import { CITIES } from '@/constants/cities';
// import { COURSES } from '@/constants/courses';
// import { UNIVERSITIES } from '@/constants/universities';

// // This route should ideally be protected or removed in a production environment
// export async function GET() {
//   try {
//     console.log('SEED_ROUTE: Connecting to database...');
//     await dbConnect();
//     console.log('SEED_ROUTE: Database connected.');

//     console.log('SEED_ROUTE: Clearing existing communities...');
//     await Community.deleteMany({});
//     console.log('SEED_ROUTE: Existing communities cleared.');

//     const communitiesToCreate: { name: string; slug: string; type: string }[] = [];

//     // Prepare country communities
//     COUNTRIES.forEach(country => communitiesToCreate.push({ name: country.name, slug: country.code, type: 'country' }));
//     // Prepare city communities
//     CITIES.forEach(city => communitiesToCreate.push({ name: city.name, slug: city.slug, type: 'city' }));
//     // Prepare course communities
//     COURSES.forEach(course => communitiesToCreate.push({ name: course.name, slug: course.slug, type: 'course' }));
//     // Prepare university communities
//     UNIVERSITIES.forEach(uni => communitiesToCreate.push({ name: uni.name, slug: uni.slug, type: 'university' }));

//     console.log(`SEED_ROUTE: Preparing to insert ${communitiesToCreate.length} communities...`);
    
//     if (communitiesToCreate.length > 0) {
//       await Community.insertMany(communitiesToCreate);
//     }

//     console.log('✅ SEED_ROUTE: Communities seeded successfully!');
//     return NextResponse.json({ success: true, message: 'Database seeded successfully!' });

//   } catch (error) {
//     console.error('Error seeding database via API route:', error);
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     return NextResponse.json({ success: false, message: 'Failed to seed database.', error: errorMessage }, { status: 500 });
//   } finally {
//     // Mongoose connection is managed by dbConnect, so we don't manually close it here.
//   }
// }
