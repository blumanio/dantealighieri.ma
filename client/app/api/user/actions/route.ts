import { NextResponse } from 'next/server';
import { actions, ActionType } from '@/app/config/gamification';
import { getOrCreateUser } from '@/lib/actions/user.actions';

export async function POST(req: Request) {
    try {
        // This function now handles auth, user creation, AND streak updates automatically.
        const user = await getOrCreateUser();

        const body = await req.json();
        const { action } = body;

        if (!action || !Object.keys(actions).includes(action)) {
            // ... (error handling)
        }
        
        const actionType = action as ActionType;

        // --- This endpoint's ONLY job is to award XP ---
        user.xp += actions[actionType].xp;
        await user.save();

        return NextResponse.json({
            success: true,
            xpGained: actions[actionType].xp,
            newXpTotal: user.xp,
        }, { status: 200 });

    } catch (error: any) {
        // ... (error handling remains the same)
    }
}