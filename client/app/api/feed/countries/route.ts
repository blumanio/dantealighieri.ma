// API Endpoint to get unique countries for filtering (New)
// File: app/api/feed/countries/route.ts (This should be in its own file)
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Adjust path as per your project
import UniversityCommunityPost, { IUniversityCommunityPost } from '@/lib/models/UniversityCommunityPost'; // Adjust path

export async function GET_Countries(req: NextRequest) {
    try {
        await dbConnect();
        const countries = await UniversityCommunityPost.distinct('originalUserCountry');
        const validCountries = countries.filter(country => country && typeof country === 'string' && country.trim() !== '');

        return NextResponse.json({
            success: true,
            data: validCountries.sort(),
        });
    } catch (error: any) {
        console.error('API GET /api/feed/countries Error:', error);
        return NextResponse.json({ success: false, message: error.message || "Failed to fetch countries" }, { status: 500 });
    }
}
