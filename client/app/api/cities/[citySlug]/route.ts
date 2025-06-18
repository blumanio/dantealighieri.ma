// app/api/cities/[citySlug]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import City from '@/lib/models/City';

export async function GET(
    request: Request,
    { params }: { params: { citySlug: string } } // params is already resolved, but explicit await helps satisfy linter
) {
    // FIX 1: Satisfy Next.js linter for params access
    const  citySlug  = (await params).citySlug; // Explicitly await params

    console.log(`🔍 GET /api/cities/${citySlug} called`); // Use the destructured citySlug directly

    try {
        if (!citySlug) {
            console.log('❌ Bad Request - City slug is missing');
            return new NextResponse('City slug is required', { status: 400 });
        }

        await dbConnect();
        console.log('✅ Database connected');

        // FIX 2: Ensure your MongoDB documents have the 'slug' field populated correctly.
        // If your documents use 'id' instead of 'slug' for unique identification,
        // you might need to query by 'id' here OR ensure 'slug' is always populated and unique.
        // Based on your schema, 'slug' is required and unique, so the data in your DB needs to match.
        const city = await City.findOne({ slug: citySlug }).lean() as (typeof City.schema extends { obj: infer T } ? T & { _id: any, createdAt?: Date, updatedAt?: Date } : any);

        if (!city) {
            console.log(`❌ City with slug ${citySlug} not found.`);
            // When returning 404 from an API route, it's good practice to send a JSON response
            return NextResponse.json({ success: false, message: 'City not found' }, { status: 404 });
        }

        console.log(`📦 Found city: ${city.cityName}`);

        const createdAtString = city.createdAt ? city.createdAt.toISOString() : new Date().toISOString();
        const updatedAtString = city.updatedAt ? city.updatedAt.toISOString() : new Date().toISOString();

        const cityResponse = {
            ...city,
            _id: city._id.toString(),
            createdAt: createdAtString,
            updatedAt: updatedAtString,
            metrics: Array.isArray(city.metrics) ? city.metrics.map((metric: any) => ({
                ...metric,
                // Assuming metric.icon from DB is a string like "Home"
                icon: typeof metric.icon === 'function' && metric.icon.name ? metric.icon.name : metric.icon,
            })) : [], // Defensive: ensure metrics is an array
            nomadListStyleTags: Array.isArray(city.nomadListStyleTags) ? city.nomadListStyleTags : []
        };

        return NextResponse.json({ success: true, data: cityResponse });

    } catch (error) {
        console.error(`💥 [API/CITIES/${citySlug}/GET] Error fetching city:`, error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}