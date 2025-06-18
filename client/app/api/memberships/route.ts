import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Membership from '@/lib/models/Membership';
import Community from '@/lib/models/Community';

// Define a type for the expected community objects in the request body
interface CommunityInput {
  id: string;
  name: string;
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await dbConnect();

    const body = await req.json();

    // Destructure the rich payload from the frontend
    const {
      countryOfOrigin,
      targetCities,
      targetUniversities
    }: {
      countryOfOrigin: CommunityInput;
      targetCities: CommunityInput[];
      targetUniversities: CommunityInput[];
    } = body;

    // 1. Consolidate all potential communities into a single list
    const communitiesToProcess = [
      { slug: countryOfOrigin.id, name: countryOfOrigin.name, type: 'Country' },
      ...targetCities.map(city => ({ slug: city.id, name: city.name, type: 'City' })),
      ...targetUniversities.map(uni => ({ slug: uni.id, name: uni.name, type: 'University' })),
    ].filter(c => c.slug && c.name); // Filter out any invalid entries

    if (communitiesToProcess.length === 0) {
      return NextResponse.json({ success: true, message: 'No communities to join.' });
    }

    // 2. "Find or Create" all communities in a single database operation (upsert)
    const communityBulkOps = communitiesToProcess.map(({ slug, name, type }) => ({
      updateOne: {
        filter: { slug },
        // $setOnInsert ensures that we only set these fields when a new document is created
        update: { $setOnInsert: { slug, name, type } },
        upsert: true,
      },
    }));

    await Community.bulkWrite(communityBulkOps);

    // 3. Retrieve the full documents for all relevant communities (now they are guaranteed to exist)
    const allCommunitySlugs = communitiesToProcess.map(c => c.slug);
    const allRelevantCommunities = await Community.find({ slug: { $in: allCommunitySlugs } });

    // 4. Create memberships idempotently (won't fail if membership already exists)
    const membershipBulkOps = allRelevantCommunities.map(community => ({
      updateOne: {
        filter: { userId: user.id, communityId: community._id },
        update: { $setOnInsert: { userId: user.id, communityId: community._id } },
        upsert: true,
      },
    }));

    if (membershipBulkOps.length > 0) {
      await Membership.bulkWrite(membershipBulkOps);
    }

    return NextResponse.json({ success: true, message: 'Successfully joined communities.' });
  } catch (error) {
    console.error('[MEMBERSHIPS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}