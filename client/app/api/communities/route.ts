import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Community from '@/lib/models/Community'; // Adjust this path if your model is elsewhere

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const typeQuery = searchParams.get('type'); // Get the 'type' parameter
    const searchQuery = searchParams.get('search');

    const query: any = {};

    // **NEW**: Add the type to the query if it exists
    if (typeQuery) {
      query.type = typeQuery;
    }

    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: 'i' };
    }

    const communities = await Community.find(query)
      .select('_id name type')
      .sort({ name: 1 });

    return NextResponse.json(communities);
    
  } catch (error) {
    console.error('💥 [COMMUNITIES_GET] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}