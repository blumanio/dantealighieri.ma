import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Corrected imports to point to the TypeScript source files
import Community from '../lib/models/Community.ts';
import { COUNTRIES } from '../constants/countries.ts';
import { CITIES } from '../constants/cities.ts';
import { COURSES } from '../constants/courses.ts';
import { UNIVERSITIES } from '../constants/universities.ts';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in your .env file.");
  process.exit(1);
}

async function seedCommunities() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected successfully.');

    console.log('Clearing existing communities...');
    await Community.deleteMany({});
    console.log('Existing communities cleared.');

    const communitiesToCreate = [];

    // Prepare country communities
    COUNTRIES.forEach(country => communitiesToCreate.push({ name: country.name, slug: country.code, type: 'country' }));

    // Prepare city communities
    CITIES.forEach(city => communitiesToCreate.push({ name: city.name, slug: city.slug, type: 'city' }));

    // Prepare course communities
    COURSES.forEach(course => communitiesToCreate.push({ name: course.name, slug: course.slug, type: 'course' }));

    // Prepare university communities
    UNIVERSITIES.forEach(uni => communitiesToCreate.push({ name: uni.name, slug: uni.slug, type: 'university' }));

    console.log(`Preparing to insert ${communitiesToCreate.length} communities...`);
    
    // Using insertMany for bulk operation
    await Community.insertMany(communitiesToCreate);

    console.log('✅ Communities seeded successfully!');

  } catch (error) {
    console.error('Error seeding communities:', error);
  } finally {
    // Ensure the connection is closed
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

seedCommunities();
