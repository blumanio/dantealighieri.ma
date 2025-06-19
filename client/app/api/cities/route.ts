// app/api/cities/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import City from '@/lib/models/City';

export async function GET(request: Request) {
    console.log('🔍 GET /api/cities called');
    try {
        await dbConnect();
        console.log('✅ Database connected');

        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get('search') || '';
        const limit = parseInt(searchParams.get('limit') || '100', 10);

        let query: any = {};
        if (searchTerm) {
            query = {
                $or: [
                    { cityName: { $regex: searchTerm, $options: 'i' } },
                    { 'universityNames': { $regex: searchTerm, $options: 'i' } },
                    { 'nomadListStyleTags.label': { $regex: searchTerm, $options: 'i' } },
                ]
            };
        }

        const cities = await City.find(query).limit(limit).lean();

        console.log(`📦 Found ${cities.length} cities.`);

        // --- FIX START: Move processing INSIDE the map loop ---
        const citiesResponse = cities.map(city => {
            // Defensive check for createdAt and updatedAt
            const createdAtString = city.createdAt ? city.createdAt.toISOString() : new Date().toISOString();
            const updatedAtString = city.updatedAt ? city.updatedAt.toISOString() : new Date().toISOString();

            // Ensure metrics.icon is a string as stored in DB and _id is converted
            return {
                ...city,
                _id: (city._id as { toString: () => string }).toString(), // Convert ObjectId to string
                createdAt: createdAtString,
                updatedAt: updatedAtString,
                metrics: city.metrics.map((metric: any) => ({
                    ...metric,
                    // If icon is a function (unlikely but defensive), convert to string name.
                    // Otherwise, just use the value as is (assuming it's a string from DB).
                    icon: typeof metric.icon === 'function' && metric.icon.name ? metric.icon.name : metric.icon,
                })),
                // Ensure nomadListStyleTags is always an array to prevent issues downstream
                nomadListStyleTags: Array.isArray(city.nomadListStyleTags) ? city.nomadListStyleTags : []
            };
        });
        // --- FIX END ---

        return NextResponse.json({ success: true, data: citiesResponse });

    } catch (error) {
        console.error('💥 [API/CITIES/GET] Error fetching cities:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}