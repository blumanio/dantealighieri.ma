// app/api/checklist/item/route.js

import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import UserProfileDetail from '@/lib/models/UserProfileDetail';

export async function PUT(req) {
    try {
        await dbConnect();
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { phaseId, itemId, subItemId, completed } = await req.json();

        let updateQuery;
        let arrayFilters;

        if (subItemId) {
            // Logic to update a nested sub-item
            updateQuery = { $set: { "checklist.$[phase].items.$[item].subItems.$[sub].completed": completed } };
            arrayFilters = [
                { "phase.id": phaseId },
                { "item.id": itemId },
                { "sub.id": subItemId }
            ];
        } else {
            // Logic to update a main item
            updateQuery = { $set: { "checklist.$[phase].items.$[item].completed": completed } };
            arrayFilters = [
                { "phase.id": phaseId },
                { "item.id": itemId }
            ];
        }

        const result = await UserProfileDetail.updateOne({ userId }, updateQuery, { arrayFilters });

        if (result.modifiedCount === 0) {
            // This might happen if the item was already in the desired state, which is not an error.
            // Or if the item wasn't found, which could be a client-side bug.
            console.warn(`Checklist update for user ${userId} resulted in 0 modifications.`);
        }

        return NextResponse.json({ success: true, message: "Checklist updated." });

    } catch (error) {
        console.error('[API PUT /checklist/item] Error:', error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}